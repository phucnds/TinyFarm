import { _decorator, Component, Node } from 'cc';
import { FarmTechnology } from '../Game/FarmTechnology';
const { ccclass, property } = _decorator;

@ccclass('FarmTechManager')
export class FarmTechManager extends Component {
    private static instance: FarmTechManager;

    public static get Instance(): FarmTechManager {
        return this.instance;
    }

    protected onLoad(): void {
        FarmTechManager.instance = this;
    }

    private farmTech: FarmTechnology;

    protected start(): void {
        this.init();
    }

    private init(): void {
        this.farmTech = new FarmTechnology();
        this.farmTech.level = 1;
    }

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
}


