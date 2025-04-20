import { ItemType } from "./Enums";

export class InventoryItem {

    private itemTypeId: ItemType;  
    private quantity: number;      

    constructor(itemTypeId: ItemType, initialQuantity: number = 0) {
        this.itemTypeId = itemTypeId;
        this.quantity = Math.max(0, initialQuantity);
    }

    addQuantity(amount: number): void {
        if (amount > 0) {
            this.quantity += amount;
        } else {
        
        }
    }

    removeQuantity(amount: number): boolean {
        if (amount <= 0) {
            return true;
        }
        if (this.quantity >= amount) {
            this.quantity -= amount;
            return true; 
        } else {
            return false; 
        }
    }

   
    getItemTypeId(): ItemType {
        return this.itemTypeId;
    }

    getQuantity(): number {
        return this.quantity;
    }
}