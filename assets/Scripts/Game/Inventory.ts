import { ItemData, ItemType } from "./Enums";
import { InventoryItem } from "./InventoryItem";

export class Inventory {

    private items: InventoryItem[] = [];

    private findItem(itemTypeId: ItemType): InventoryItem | undefined {
        return this.items.find(item => item.getItemTypeId() === itemTypeId);
    }

    public addItem(itemTypeId: ItemType, quantity: number = 1): void {
        if (quantity <= 0) return;

        const existingItem = this.findItem(itemTypeId);
        if (existingItem) {
            existingItem.addQuantity(quantity);
        } else {
            const newItem = new InventoryItem(itemTypeId, quantity);
            this.items.push(newItem);
        }
    }

    public removeItem(itemTypeId: ItemType, quantity: number): boolean {
        if (quantity <= 0) return true;

        const item = this.findItem(itemTypeId);
        if (!item) return false;

        const success = item.removeQuantity(quantity);
        if (item.getQuantity() <= 0) {
            this.items = this.items.filter(i => i.getItemTypeId() !== itemTypeId);
        }
        return success;
    }

    public getItemQuantity(itemTypeId: ItemType): number {
        const item = this.findItem(itemTypeId);
        return item ? item.getQuantity() : 0;
    }

    public hasItem(itemTypeId: ItemType, quantity: number = 1): boolean {
        return this.getItemQuantity(itemTypeId) >= quantity;
    }

    public getItem(itemTypeId: ItemType): InventoryItem | undefined {
        return this.findItem(itemTypeId);
    }

    public getAllItems(): InventoryItem[] {
        return this.items;
    }

    public get Items(): InventoryItem[] {
        return this.items;
    }

    public setItemss(value: InventoryItem[])
    {
        this.items = value;
    }

    public setItems(value: ItemData[]) {

        this.items = [];
        value.forEach(item => {
            this.items.push(new InventoryItem(item.itemTypeId, item.quantity));
        })
    }

    public getItemDatas(): ItemData[] {
        const arr: ItemData[] = [];
        this.items.forEach(item => {
            const itemNumber: number = item.getItemTypeId();
            arr.push({ itemTypeId: itemNumber, quantity: item.getQuantity() });
        })
        return arr;
    }
}