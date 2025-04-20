import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ItemType } from '../../Game/Enums';
import { ModalWindow } from '../../Services/ModalWindowSystem/ModalWindow';
import { delay } from '../../Utils/AsyncUtils';
import { CropItemUI } from '../Components/CropItemUI';
import { PlantableCrop } from '../../Manager/InventoryManager';
const { ccclass, property } = _decorator;

@ccclass('ChooseCropModalWindow')
export class ChooseCropModalWindow extends ModalWindow<ChooseCropModalWindowParams, ItemType> {

    @property(Prefab) private cropItemUI: CropItemUI;
    @property(Node) private nodeParent: Node;

    protected async setup(params?: ChooseCropModalWindowParams): Promise<void> {
        this.nodeParent.removeAllChildren();
        await delay(250);
        for (let i = 0; i < params.crops.length; i++) {
            await delay(300);
            const item = instantiate(this.cropItemUI).getComponent(CropItemUI);
            item.node.setParent(this.nodeParent);
            item.setup(params.crops[i].itemID, params.crops[i].crop.seedType, params.crops[i].name);
            item.ChooseCropTypeEvent.on(this.chooseCrop, this);
        }
    }

    private chooseCrop(crop: ItemType): void {
        this.dismiss(crop);
    }

}


export class ChooseCropModalWindowParams {
    public crops: PlantableCrop[];
}