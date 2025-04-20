import { ItemType } from "../assets/Scripts/Game/Enums";
import { InventoryItem } from "../assets/Scripts/Game/InventoryItem";

describe('InventoryItem', () => {
    it('Khởi tạo đúng với số lượng ban đầu', () => {
        const item = new InventoryItem(ItemType.Tomato, 10);
        expect(item.getItemTypeId()).toBe(ItemType.Tomato);
        expect(item.getQuantity()).toBe(10);
    });

    it('Khởi tạo với số lượng âm sẽ thành 0', () => {
        const item = new InventoryItem(ItemType.Blueberry, -5);
        expect(item.getQuantity()).toBe(0);
    });

    it('addQuantity thêm số lượng đúng', () => {
        const item = new InventoryItem(ItemType.Tomato, 5);
        item.addQuantity(3);
        expect(item.getQuantity()).toBe(8);
    });

    it('addQuantity không thêm số lượng âm hoặc 0', () => {
        const item = new InventoryItem(ItemType.Tomato, 5);
        item.addQuantity(0);
        expect(item.getQuantity()).toBe(5);
        item.addQuantity(-2);
        expect(item.getQuantity()).toBe(5);
    });

    it('removeQuantity bớt số lượng thành công', () => {
        const item = new InventoryItem(ItemType.Tomato, 10);
        const result = item.removeQuantity(4);
        expect(result).toBe(true);
        expect(item.getQuantity()).toBe(6);
    });

    it('removeQuantity thất bại nếu không đủ số lượng', () => {
        const item = new InventoryItem(ItemType.Tomato, 3);
        const result = item.removeQuantity(5);
        expect(result).toBe(false);
        expect(item.getQuantity()).toBe(3); // Số lượng không đổi
    });

    it('removeQuantity không bớt số lượng âm hoặc 0', () => {
        const item = new InventoryItem(ItemType.Tomato, 5);
        const result1 = item.removeQuantity(0);
        expect(result1).toBe(true); // Coi như thành công
        expect(item.getQuantity()).toBe(5);
        const result2 = item.removeQuantity(-2);
        expect(result2).toBe(true); // Coi như thành công
        expect(item.getQuantity()).toBe(5);
    });
});