import { _decorator, Button, Component, instantiate, Label, Node, Prefab } from 'cc';
import { UIButton } from '../UIButton';
import { ShopItemUI } from './ShopItemUI';
import { InventoryManager } from '../../Manager/InventoryManager';
import { CashManager } from '../../Manager/CashManager';
const { ccclass, property } = _decorator;

@ccclass('SellPanel')
export class SellPanel extends Component {

    @property(Node) private nodeParent: Node;
    @property(Prefab) private shopItemPrefab: Prefab;
    @property(Label) private lblTotal: Label;
    @property(UIButton) private btnSell: UIButton;

    private arrItem: ShopItemUI[] = [];

    protected start(): void {
        this.btnSell.InteractedEvent.on(this.sellItem, this);
    }

    public setup(): void {

        const config = InventoryManager.Instance.getSellItem();

        this.nodeParent.removeAllChildren();
        this.arrItem = [];

        for (let i = 0; i < config.length; i++) {
            const element = config[i];
            const shopItem = instantiate(this.shopItemPrefab).getComponent(ShopItemUI);
            shopItem.setup(element, true);
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

        this.lblTotal.string = total.toString();
        this.btnSell.node.getComponent(Button).interactable = total > 0;
    }

    private sellItem(): void {

        if (this.lblTotal.string === '0') return;

            let total = 0;
        this.arrItem.forEach(item => {
            total += item.getTotal();
            InventoryManager.Instance.removeItem(item.getItemID(), item.getQuanlity());
        })

        CashManager.Instance.addBalance(total);

        this.setup();
    }


}


