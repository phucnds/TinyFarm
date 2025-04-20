export class FarmTechnology {
    level: number;
    upgradeCost: number;

    constructor(level: number = 1) {
        this.level = level;
        this.upgradeCost = 500;
    }

    getProductionMultiplier(): number {
        return 1 + this.level * 0.1;
    }

    upgrade(): void {
        this.level++;
        // this.upgradeCost += 500;
    }
}