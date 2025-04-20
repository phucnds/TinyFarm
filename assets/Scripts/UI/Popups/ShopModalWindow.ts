import { _decorator, Button, Color, Component, instantiate, Label, Node, Prefab, Sprite } from 'cc';
import { Empty } from './InventoryModalWindow';
import { ModalWindow } from '../../Services/ModalWindowSystem/ModalWindow';
import { Shop } from '../../Game/Shop';
import { ShopItemConfigs } from '../../Game/Enums';
import { ShopItemUI } from '../Components/ShopItemUI';
import { UIButton } from '../UIButton';
import { CashManager } from '../../Manager/CashManager';
import { InventoryManager } from '../../Manager/InventoryManager';
import { BuyPanel } from '../Components/BuyPanel';
import { SellPanel } from '../Components/SellPanel';
const { ccclass, property } = _decorator;

@ccclass('ShopModalWindow')
export class ShopModalWindow extends ModalWindow<Empty, Empty> {


    private arrNode: Node[] = []
    private arrBtn: Node[] = []

    @property(UIButton) private btnSellPanel: UIButton
    @property(UIButton) private btnBuyPanel: UIButton

    @property(BuyPanel) private buyPanel: BuyPanel;
    @property(SellPanel) private sellPanel: SellPanel;

    protected start(): void {
        this.arrNode.push(this.buyPanel.node);
        this.arrNode.push(this.sellPanel.node);

        this.arrBtn.push(this.btnBuyPanel.node);
        this.arrBtn.push(this.btnSellPanel.node);

        this.btnSellPanel.InteractedEvent.on(() => {
            this.showPanel(this.sellPanel.node);
            this.setGrayscale(this.btnBuyPanel.node);
            this.sellPanel.setup();
        }, this);
        this.btnBuyPanel.InteractedEvent.on(() => {
            this.showPanel(this.buyPanel.node);
            this.setGrayscale(this.btnSellPanel.node);
            this.buyPanel.setup();
        }, this);
    }

    protected setup(params?: Empty): void {
        this.showBuy();
    }


    private showPanel(panel: Node): void {
        this.arrNode.forEach(n => {
            n.active = panel === n;
        })
    }

    private setGrayscale(btn: Node): void {
        this.arrBtn.forEach(n => {
            n.getComponent(Sprite).grayscale = btn === n;
        })
    }

    private showBuy(): void {
        this.showPanel(this.buyPanel.node);
        this.setGrayscale(this.btnSellPanel.node);
        this.buyPanel.setup();
    }

    private showSell(): void {
        this.showPanel(this.sellPanel.node);
        this.setGrayscale(this.btnBuyPanel.node);
        this.sellPanel.setup();
    }

}

export class ShopModalWindowParams {
    public buyItems: ShopItemConfigs[]
}

