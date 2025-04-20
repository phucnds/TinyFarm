import { ItemType } from "./Enums";
import { InventoryItem } from "./InventoryItem";

export class Inventory {

    private items: Map<ItemType, InventoryItem>;

    constructor() {
        this.items = new Map<ItemType, InventoryItem>();
    }

    public addItem(itemTypeId: ItemType, quantity: number = 1): void {
        if (quantity <= 0) return;

        if (this.items.has(itemTypeId)) {
            const existingItem = this.items.get(itemTypeId)!;
            existingItem.addQuantity(quantity);
        } else {
            const newItem = new InventoryItem(itemTypeId, quantity);
            this.items.set(itemTypeId, newItem);
        }
    }


    public removeItem(itemTypeId: ItemType, quantity: number): boolean {
        if (quantity <= 0) return true;

        if (!this.items.has(itemTypeId)) return false;

        const item = this.items.get(itemTypeId)!;
        const success = item.removeQuantity(quantity);
        if(item.getQuantity() <= 0)
        {
            this.items.delete(item.getItemTypeId());
        }
        return success;
    }

    public getItemQuantity(itemTypeId: ItemType): number {
        if (this.items.has(itemTypeId)) {
            return this.items.get(itemTypeId)!.getQuantity();
        }
        return 0;
    }

    public hasItem(itemTypeId: ItemType, quantity: number = 1): boolean {
        return this.getItemQuantity(itemTypeId) >= quantity;
    }

    public getItem(itemTypeId: ItemType): InventoryItem | undefined {
        return this.items.get(itemTypeId);
    }

    public getAllItems(): InventoryItem[] {

        return Array.from(this.items.values());
    }

    public get Items() {
        return this.items;
    }
}