import { PlantableConfig, ItemType, CropSaveData, getPlantableConfig } from "./Enums";

export class Crop {
    private currentYield = 0;
    private producedItemCount = 0;
    private timeToNextHarvest: number;

    constructor(private config: PlantableConfig) {
        if (!config) throw new Error("Config null.");
        this.timeToNextHarvest = config.harvestInterval;
    }

    public update(deltaTimeMinutes: number): boolean {
        this.timeToNextHarvest -= deltaTimeMinutes;
        if (this.timeToNextHarvest < 0) {
            this.timeToNextHarvest = 0;
            this.produce();
            return true;
        }
        return false;
    }

    private produce(): void {
        this.currentYield++;
        this.producedItemCount++;
    }

    public harvest(): number {
        const amount = this.producedItemCount;
        this.producedItemCount = 0;
        return amount;
    }

    public resetTime(): void {
        this.timeToNextHarvest = this.config.harvestInterval;
    }

    public getConfig(): PlantableConfig {
        return this.config;
    }

    public getCurrentYield(): number {
        return this.currentYield;
    }

    public getTimeToNextHarvest(): number {
        return this.timeToNextHarvest;
    }

    public getCanHarvest(): boolean {
        return this.currentYield >= this.config.maxYield;
    }

    public get ProducedItemCount(): number {
        return this.producedItemCount;
    }

    public saveData(): CropSaveData {
        return {
            itemType: this.config.itemType,
            currentYield: this.currentYield,
            producedItemCount: this.producedItemCount,
            timeToNextHarvest: this.timeToNextHarvest,
            lastTimeSince: Date.now()
        }
    }

    public loadData(data: CropSaveData) {
        this.config = getPlantableConfig(data.itemType);
        this.currentYield = data.currentYield;
        this.producedItemCount = data.producedItemCount;
        this.timeToNextHarvest = data.timeToNextHarvest;

        const now = Date.now();
        console.log(now - data.lastTimeSince);
    }
}