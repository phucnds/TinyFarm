import { CashManager } from "../Manager/CashManager";
import { Signal } from "../Services/EventSystem/Signal";
import { Crop } from "./Crop";
import { PlotState, ItemType, getConfigBySeed } from "./Enums";
import { Inventory } from "./Inventory";

export class FarmPlot {

    private currentState: PlotState;
    private plantedItem: Crop | null;
    private decayTimerMinutes: number;
    private currentPrice: number;

    constructor(price: number) {
        this.currentState = PlotState.Locked;
        this.plantedItem = null;
        this.decayTimerMinutes = 0;
        this.currentPrice = price;
    }

    public ChangeStateEvent: Signal<PlotState> = new Signal<PlotState>();
    public HasFruitEvent: Signal = new Signal();
    public DecayEvent: Signal = new Signal();

    public buyPlot(): void {
        this.currentState = PlotState.Empty;
        this.ChangeStateEvent?.trigger(this.currentState);
    }


    public plant(seedType: ItemType, inventory: Inventory): boolean {
        if (this.currentState !== PlotState.Empty) {
            return false;
        }

        const config = getConfigBySeed(seedType);
        if (!config) {
            return false;
        }

        if (!config.seedType) {
            return false;
        }


        if (!inventory.hasItem(config.seedType, 1)) {
            return false;
        }

        const removedSeed = inventory.removeItem(config.seedType, 1);
        if (!removedSeed) {

            return false;
        }

        try {
            this.plantedItem = new Crop(config);
            this.currentState = PlotState.Growing;
            this.decayTimerMinutes = 0;
            this.ChangeStateEvent?.trigger(this.currentState);

            return true;
        } catch (error) {
            this.plantedItem = null;
            this.currentState = PlotState.Empty;
            this.ChangeStateEvent?.trigger(this.currentState);
            return false;
        }
    }


    public update(deltaTimeMinutes: number): void {

        if (!this.plantedItem) {
            if (this.currentState !== PlotState.Empty && this.currentState !== PlotState.Decay) {
                this.currentState = PlotState.Empty;
            }
            return;
        }

        switch (this.currentState) {
            case PlotState.Growing:
                const ready = this.plantedItem.update(deltaTimeMinutes);
                if (ready) {
                    this.currentState = PlotState.HasFruit;
                }
                break;

            case PlotState.HasFruit:

                this.HasFruitEvent?.trigger();

                if (this.plantedItem.getCanHarvest()) {
                    this.currentState = PlotState.ReadyToHarvest;
                    this.ChangeStateEvent?.trigger(this.currentState);

                    const decayHours = this.plantedItem.getConfig().decayTimeAfterFinalHarvest;
                    this.decayTimerMinutes = decayHours;
                }
                else {
                    this.currentState = PlotState.Growing;
                    this.plantedItem.resetTime();
                }

                break;

            case PlotState.ReadyToHarvest:
                this.decayTimerMinutes -= deltaTimeMinutes;
                if (this.decayTimerMinutes <= 0) {
                    this.currentState = PlotState.Decay;
                    this.DecayEvent?.trigger();
                }
                break;

            case PlotState.Decay:
               
            case PlotState.Empty:
                break;

            default:
                break;
        }
    }

    public harvest(): number {
        if (this.currentState != PlotState.ReadyToHarvest) return -1;

        this.currentState = PlotState.Empty;
        this.ChangeStateEvent?.trigger(this.currentState);
        return this.plantedItem.harvest();
    }

    public clearPlot(): void {
        this.plantedItem = null;
        this.decayTimerMinutes = 0;
        this.currentState = PlotState.Empty;
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
}