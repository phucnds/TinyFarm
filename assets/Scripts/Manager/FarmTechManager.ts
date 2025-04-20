import { _decorator, Component, Node } from 'cc';
import { FarmTechnology } from '../Game/FarmTechnology';
import { FarmTechSettings } from '../Data/GameSettings';
const { ccclass, property } = _decorator;

@ccclass('FarmTechManager')
export class FarmTechManager extends Component{

    private static instance: FarmTechManager;

    public static get Instance(): FarmTechManager {
        return this.instance;
    }

    protected onLoad(): void {
        FarmTechManager.instance = this;
    }

    private farmTech: FarmTechnology;

    public getCurrentLevel(): number {
        return this.farmTech.level;
    }

    public upgrade(): void {
        this.farmTech.upgrade();
    }

    public upgradeCost(): number {
        return this.farmTech.upgradeCost;
    }

    public getPercentent(): number {
        return this.farmTech.level * 10;
    }

    public getProductionMultiplier(): number {
        return this.farmTech.getProductionMultiplier();
    }

    public loadFrom(data: FarmTechSettings): void {
        this.farmTech = new FarmTechnology(data.level, data.upgradeCost, data.productionMultiplier);
    }

    public saveTo(data: FarmTechSettings): void {
        data.level = this.farmTech.level
        data.upgradeCost = this.farmTech.upgradeCost
        data.productionMultiplier = this.farmTech.multiply
    }
}


