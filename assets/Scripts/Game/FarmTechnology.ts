export class FarmTechnology {
    public level: number;
    public upgradeCost: number;
    public multiply: number;

    constructor(level: number, cost: number, multiply: number) {
        this.level = level;
        this.upgradeCost = cost;
        this.multiply = multiply;
    }

    getProductionMultiplier(): number {
        return 1 + this.level * this.multiply;
    }

    upgrade(): void {
        this.level++;
        // this.upgradeCost += 500;
    }
}