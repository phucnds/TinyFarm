import { _decorator, Button, Color, Component, Label, Node } from 'cc';
import { ModalWindow } from '../../Services/ModalWindowSystem/ModalWindow';
import { Empty } from './InventoryModalWindow';
import { FarmTechManager } from '../../Manager/FarmTechManager';
import { CashManager } from '../../Manager/CashManager';
import { UIButton } from '../UIButton';
const { ccclass, property } = _decorator;

@ccclass('TechModalWindow')
export class TechModalWindow extends ModalWindow<Empty, Empty> {

    @property(Label) private lblLevel: Label;
    @property(Label) private lblbonus: Label;
    @property(Label) private lblCost: Label;
    @property(UIButton) private btnUpgrade: UIButton;

    private canUpgrade = false;

    protected setup(params?: Empty): void {

        this.updateVisual();

        this.btnUpgrade.InteractedEvent.on(() => {
            if (!this.canUpgrade) return;
            FarmTechManager.Instance.upgrade();
            CashManager.Instance.useBalance(FarmTechManager.Instance.upgradeCost());
            this.updateVisual();
        }, this);

    }

    private updateVisual(): void {
        this.lblLevel.string = `Level ${FarmTechManager.Instance.getCurrentLevel().toString() }%`; 
        this.lblbonus.string = `Increases yield by ${FarmTechManager.Instance.getPercentent()}%`;
        this.lblCost.string = FarmTechManager.Instance.upgradeCost().toString();

        this.canUpgrade = CashManager.Instance.hasEnoughBalance(FarmTechManager.Instance.upgradeCost());

        this.lblCost.color = this.canUpgrade ? Color.WHITE : Color.RED;
        this.btnUpgrade.node.getComponent(Button).interactable = this.canUpgrade;
    }

}


