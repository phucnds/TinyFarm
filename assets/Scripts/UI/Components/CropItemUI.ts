import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { ItemType } from '../../Game/Enums';
import { Signal } from '../../Services/EventSystem/Signal';
import { UIButton } from '../UIButton';
import { loadItemSprite } from '../../Utils/LoadItemSprite';
const { ccclass, property } = _decorator;

@ccclass('CropItemUI')
export class CropItemUI extends Component {

    @property(UIButton) private Button: UIButton;
    @property(Label) private lblName: Label;
    @property(Sprite) private icItem: Sprite;

    private chooseCropTypeEvent: Signal<ItemType> = new Signal<ItemType>()
    private cropType: ItemType;

    protected start(): void {
        this.Button.InteractedEvent.on(this.chooseCrop, this);
    }

    public setup(itemID: ItemType, seedID: ItemType, name: string) {

        this.lblName.string = name;
        this.cropType = seedID;

        loadItemSprite(itemID, (sprite) => {
            this.icItem.spriteFrame = sprite
        })
    }

    public get ChooseCropTypeEvent() {
        return this.chooseCropTypeEvent;
    }

    private chooseCrop(): void {
        this.chooseCropTypeEvent.trigger(this.cropType);
    }


}


