import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { ItemType } from '../../Game/Enums';
import { loadItemSprite } from '../../Utils/LoadItemSprite';
const { ccclass, property } = _decorator;

@ccclass('InventoryItemUI')
export class InventoryItemUI extends Component {
    @property(Sprite) private icItem: Sprite;
    @property(Label) private lblQuantity: Label;


    public setupView(id: ItemType, quantity: number): void {

        loadItemSprite(id, (sprite) => {
            this.icItem.spriteFrame = sprite
        })

        this.lblQuantity.string = quantity.toString();
    }
}


