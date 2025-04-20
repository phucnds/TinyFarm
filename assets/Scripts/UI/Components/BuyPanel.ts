import { _decorator, Button, Color, Component, instantiate, Label, Node, Prefab } from 'cc';
import { UIButton } from '../UIButton';
import { getShopItemConfigs, ShopItemConfigs } from '../../Game/Enums';
import { ShopItemUI } from './ShopItemUI';
import { CashManager } from '../../Manager/CashManager';
import { InventoryManager } from '../../Manager/InventoryManager';
const { ccclass, property } = _decorator;

@ccclass('BuyPanel')
export class BuyPanel extends Component {
    @property(Node) private nodeParent: Node;
    @property(Prefab) private shopItemPrefab: Prefab;
    @property(Label) private lblTotal: Label;
    @property(UIButton) private btnBuy: UIButton;
    
    private arrItem: ShopItemUI[] = [];
    private canBuy = false;

    protected start(): void {
        this.btnBuy.InteractedEvent.on(this.buyItem, this);
    }

    public setup(): void {
        
        const config = getShopItemConfigs();

        this.nodeParent.removeAllChildren();
        this.arrItem = [];

        for (let i = 0; i < config.length; i++) {
            const element = config[i];
            const shopItem = instantiate(this.shopItemPrefab).getComponent(ShopItemUI);
            shopItem.setup(element);
            shopItem.node.setParent(this.nodeParent);

            shopItem.ChangeQuanlityEvent.on(this.onChangeQuanlity, this);
            this.arrItem.push(shopItem);
        }

        this.onChangeQuanlity();
    }

    private onChangeQuanlity(): void {

        let total = 0;
        this.arrItem.forEach(item => {
            total += item.getTotal();
        })

        this.lblTotal.string = '' + total;
        this.updateVisual(total);
    }

    private buyItem(): void {

        if (!this.canBuy) return;

        let total = 0;
        this.arrItem.forEach(item => {
            InventoryManager.Instance.addItem(item.getItemID(), item.getQuanlity());

            total += item.getTotal();
        });

        CashManager.Instance.useBalance(total);

        this.updateVisual(total);
    }

    private updateVisual(total: number): void {
        this.canBuy = CashManager.Instance.hasEnoughBalance(total);
        this.lblTotal.color = this.canBuy ? Color.WHITE : Color.RED;
        this.btnBuy.node.getComponent(Button).interactable = this.canBuy;
    }
}


