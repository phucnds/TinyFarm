import { Signal } from "../Services/EventSystem/Signal";
import { Crop } from "./Crop";
import { PlotState, ItemType, getConfigBySeed, FarmPlotSaveData, getPlantableConfig } from "./Enums";
import { Inventory } from "./Inventory";

export class FarmPlot {

    private currentState: PlotState = PlotState.Locked;
    private plantedItem: Crop | null = null;
    private decayTimerMinutes = 0;
    private currentPrice: number;

    public ChangeStateEvent = new Signal<PlotState>();
    public HasFruitEvent = new Signal();

    constructor(price: number = 500) {
        this.currentPrice = price;
    }

    public buyPlot(): void {
        this.setState(PlotState.Empty);
    }

    public plant(seedType: ItemType, inventory: Inventory): boolean {
        if (this.currentState !== PlotState.Empty) return false;

        const config = getConfigBySeed(seedType);
        if (!config?.seedType || !inventory.hasItem(config.seedType, 1)) return false;

        if (!inventory.removeItem(config.seedType, 1)) return false;

        try {
            this.plantedItem = new Crop(config);
            this.setState(PlotState.Growing);
            this.decayTimerMinutes = 0;
            return true;
        } catch {
            this.plantedItem = null;
            this.setState(PlotState.Empty);
            return false;
        }
    }

    public update(deltaTimeMinutes: number): void {
        if (!this.plantedItem) {
            if (![PlotState.Locked, PlotState.Empty, PlotState.Decay].includes(this.currentState)) {
                this.setState(PlotState.Empty);
            }
            return;
        }

        switch (this.currentState) {
            case PlotState.Growing:
                if (this.plantedItem.update(deltaTimeMinutes)) {
                    this.setState(PlotState.HasFruit);
                }
                break;

            case PlotState.HasFruit:
                this.HasFruitEvent?.trigger();
                if (this.plantedItem.getCanHarvest()) {
                    this.setState(PlotState.ReadyToHarvest);
                    this.decayTimerMinutes = this.plantedItem.getConfig().decayTimeAfterFinalHarvest;
                } else {
                    this.setState(PlotState.Growing);
                    this.plantedItem.resetTime();
                }
                break;

            case PlotState.ReadyToHarvest:
                this.decayTimerMinutes -= deltaTimeMinutes;
                if (this.decayTimerMinutes <= 0) {
                    this.setState(PlotState.Decay);
                }
                break;
        }
    }

    public harvest(): number {
        if (this.currentState !== PlotState.ReadyToHarvest) return -1;
        this.setState(PlotState.Empty);
        return this.plantedItem?.harvest() ?? -1;
    }

    public clearPlot(): void {
        this.plantedItem = null;
        this.decayTimerMinutes = 0;
        this.setState(PlotState.Empty);
    }

    private setState(newState: PlotState): void {
        this.currentState = newState;
        this.ChangeStateEvent?.trigger(this.currentState);
    }

    public getCurrentState(): PlotState {
        return this.currentState;
    }

    public getPlantedItem(): Crop | null {
        return this.plantedItem;
    }

    public getDecayTimerMinutes(): number {
        return this.decayTimerMinutes;
    }

    public getCurrentPrice(): number {
        return this.currentPrice;
    }

    public saveData(): FarmPlotSaveData {
        return {
            currentState: this.currentState,
            decayTimerMinutes: this.decayTimerMinutes,
            plantedItem: this.plantedItem?.saveData() ?? null
        }
    }

    public loadData(data: FarmPlotSaveData) {

        if (data === undefined || data === null) return;

        this.decayTimerMinutes = data.decayTimerMinutes;
        if (data.plantedItem !== null) {
            const id = data.plantedItem.itemType;
            const config = getPlantableConfig(id);
            const crop = new Crop(config);
            crop.loadData(data.plantedItem);
            this.plantedItem = crop;
        }

        this.setState(data.currentState);
    }

}