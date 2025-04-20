import { _decorator, Button, Color, Component, Label, Node } from 'cc';
import { ModalWindow } from '../../Services/ModalWindowSystem/ModalWindow';
import { Empty } from './InventoryModalWindow';
import { UIButton } from '../UIButton';
import { FarmPlot } from '../../Game/FarmPlot';
import { CashManager } from '../../Manager/CashManager';
const { ccclass, property } = _decorator;

@ccclass('BuyPlotModalWindow')
export class BuyPlotModalWindow extends ModalWindow<BuyPlotModalWindowParams, Empty> {

    @property(UIButton) private btnOK: UIButton;
    @property(Label) private lblPrice: Label;

    protected setup(params?: BuyPlotModalWindowParams): void {
        this.lblPrice.string = params.farmPlot.getCurrentPrice() + '';
        this.lblPrice.color = params.canBuy ? Color.WHITE : Color.RED;
        this.btnOK.getComponent(Button).interactable = params.canBuy;

        this.btnOK.InteractedEvent.on(() => {
            if (!params.canBuy) return;

            params.farmPlot.buyPlot();
            CashManager.Instance.useBalance(params.farmPlot.getCurrentPrice());
            this.dismiss(true);

        }, this);

    }
}

export class BuyPlotModalWindowParams {
    farmPlot: FarmPlot
    canBuy: boolean
}