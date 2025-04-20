import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Inventory } from '../../Game/Inventory';
import { ModalWindow } from '../../Services/ModalWindowSystem/ModalWindow';
import { InventoryItemUI } from '../Components/InventoryItemUI';
const { ccclass, property } = _decorator;

@ccclass('InventoryModalWindow')
export class InventoryModalWindow extends ModalWindow<InventoryModalWindowParams, Empty> {

    @property(Prefab) private prefabItem: Prefab;
    @property(Node) private nodeParent: Node;

    protected setup(params?: InventoryModalWindowParams): void {

        this.nodeParent.removeAllChildren();
        const items = params.inventory.getAllItems();

        items.forEach(item => {
            const itemUI = instantiate(this.prefabItem).getComponent(InventoryItemUI);
            itemUI.setupView(item.getItemTypeId(), item.getQuantity())
            itemUI.node.setParent(this.nodeParent);
        })
    }
}

export class InventoryModalWindowParams {
    public inventory: Inventory
}

export class Empty { }