import { PlantableConfig, ItemType } from "./Enums";

export class Crop {
    // --- Properties ---
    private config: PlantableConfig;
    private currentYield: number;
    private timeToNextHarvest: number;
    private canHarvest: boolean;

    private producedItemCount: number;
    private decayTimerSeconds: number;

    constructor(config: PlantableConfig) {
        if (!config) {
            throw new Error("Config null.");
        }
        this.config = config;
        this.currentYield = 0;
        this.producedItemCount = 0;
        this.timeToNextHarvest = config.harvestInterval;
        this.canHarvest = false;
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
        if (this.currentYield >= this.config.maxYield)
            this.canHarvest = true;
    }

    public harvest(){
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

    public get ProducedItemCount() {
        return this.producedItemCount;
    }
}