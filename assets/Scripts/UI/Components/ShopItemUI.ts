import { _decorator, Component, Label, math, Node, Sprite } from 'cc';
import { UIButton } from '../UIButton';
import { Signal } from '../../Services/EventSystem/Signal';
import { ItemType, ShopItemConfigs } from '../../Game/Enums';
import { loadItemSprite } from '../../Utils/LoadItemSprite';
const { ccclass, property } = _decorator;

@ccclass('ShopItemUI')
export class ShopItemUI extends Component {

    @property(Sprite) private icItem: Sprite;
    @property(Label) private lblQuanlity: Label;
    @property(Label) private lblPrice: Label;

    @property(UIButton) private btnIncrease: UIButton;
    @property(UIButton) private btnDecrease: UIButton;

    @property(UIButton) private btnRight: UIButton;
    @property(UIButton) private btnLeft: UIButton;

    private quanlity: number = 0;
    private price: number = 0;
    private unit: number = 1;
    private itemID: ItemType;

    private maxQuanlity: number = 999;

    public ChangeQuanlityEvent: Signal = new Signal();

    protected start(): void {
        this.btnIncrease.InteractedEvent.on(this.increase, this);
        this.btnDecrease.InteractedEvent.on(this.decrease, this);
        this.btnRight.InteractedEvent.on(this.right, this);
        this.btnLeft.InteractedEvent.on(this.left, this);

        this.lblQuanlity.string = this.quanlity.toString();
    }

    public setup(config: ShopItemConfigs, isSell: boolean = false): void {

        loadItemSprite(config.itemType, (spr) => {
            this.icItem.spriteFrame = spr;
        });

        

        if(isSell)
        {
            this.maxQuanlity = config.quanlity;
        }
        else
        {
            this.unit = config.unit;
        }

        this.itemID = config.itemType;
        this.price = config.price;
        this.lblPrice.string = config.price.toString();
        this.lblQuanlity.string = this.quanlity.toString();
    }


    private increase(): void {

        this.quanlity += this.unit;
        this.quanlity = math.clamp(this.quanlity, 0, this.maxQuanlity);
        this.lblQuanlity.string = this.quanlity.toString();
        this.ChangeQuanlityEvent?.trigger();
    }

    private decrease(): void {
        this.quanlity -= this.unit;
        this.quanlity = math.clamp(this.quanlity, 0, this.maxQuanlity);
        this.lblQuanlity.string = this.quanlity.toString();
        this.ChangeQuanlityEvent?.trigger();
    }

    private left(): void {

        this.quanlity = 0;
        this.lblQuanlity.string = this.quanlity.toString();
        this.ChangeQuanlityEvent?.trigger();
    }

    private right(): void {
        this.quanlity = this.maxQuanlity;
        this.lblQuanlity.string = this.quanlity.toString();
        this.ChangeQuanlityEvent?.trigger();
    }

    public getTotal(): number {
        return this.quanlity * this.price;
    }

    public getQuanlity(): number {
        return this.quanlity;
    }

    public getItemID():ItemType{
        return this.itemID;
    }
}


