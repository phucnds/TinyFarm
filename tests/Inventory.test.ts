import { ItemType } from "../assets/Scripts/Game/Enums";
import { Inventory } from "../assets/Scripts/Game/Inventory";
import { InventoryItem } from "../assets/Scripts/Game/InventoryItem";

describe('Inventory', () => {
    let inventory: Inventory;

    beforeEach(() => {
        // Tạo mới inventory cho mỗi test case để đảm bảo độc lập
        inventory = new Inventory();
    });

    it('Khởi tạo inventory rỗng', () => {
        expect(inventory.getAllItems().length).toBe(0);
        expect(inventory.getItemQuantity(ItemType.Tomato)).toBe(0);
    });

    it('addItem thêm vật phẩm mới vào kho', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(10);
        expect(inventory.hasItem(ItemType.TomatoSeed)).toBe(true);
        expect(inventory.getAllItems().length).toBe(1);
        const item = inventory.getItem(ItemType.TomatoSeed);
        expect(item).toBeInstanceOf(InventoryItem);
        expect(item?.getQuantity()).toBe(10);
    });

    it('addItem tăng số lượng vật phẩm đã có', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        inventory.addItem(ItemType.TomatoSeed, 5);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(15);
        expect(inventory.getAllItems().length).toBe(1); // Vẫn chỉ có 1 loại item
    });

    it('addItem không thêm số lượng âm hoặc 0', () => {
        inventory.addItem(ItemType.TomatoSeed, 0);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(0);
        inventory.addItem(ItemType.TomatoSeed, -5);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(0);
        inventory.addItem(ItemType.TomatoSeed, 10);
        inventory.addItem(ItemType.TomatoSeed, 0);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(10);
    });

    it('removeItem bớt số lượng thành công', () => {
        inventory.addItem(ItemType.Blueberry, 20);
        const result = inventory.removeItem(ItemType.Blueberry, 8);
        expect(result).toBe(true);
        expect(inventory.getItemQuantity(ItemType.Blueberry)).toBe(12);
    });

    it('removeItem thất bại nếu vật phẩm không tồn tại', () => {
        const result = inventory.removeItem(ItemType.Milk, 5);
        expect(result).toBe(false);
    });

    it('removeItem thất bại nếu không đủ số lượng', () => {
        inventory.addItem(ItemType.Blueberry, 5);
        const result = inventory.removeItem(ItemType.Blueberry, 10);
        expect(result).toBe(false);
        expect(inventory.getItemQuantity(ItemType.Blueberry)).toBe(5); // Số lượng không đổi
    });

    it('removeItem không bớt số lượng âm hoặc 0', () => {
        inventory.addItem(ItemType.Blueberry, 10);
        const result1 = inventory.removeItem(ItemType.Blueberry, 0);
        expect(result1).toBe(true);
        expect(inventory.getItemQuantity(ItemType.Blueberry)).toBe(10);
        const result2 = inventory.removeItem(ItemType.Blueberry, -3);
        expect(result2).toBe(true);
        expect(inventory.getItemQuantity(ItemType.Blueberry)).toBe(10);
    });

    it('hasItem hoạt động đúng', () => {
        inventory.addItem(ItemType.Strawberry, 7);
        expect(inventory.hasItem(ItemType.Strawberry)).toBe(true);
        expect(inventory.hasItem(ItemType.Strawberry, 5)).toBe(true);
        expect(inventory.hasItem(ItemType.Strawberry, 7)).toBe(true);
        expect(inventory.hasItem(ItemType.Strawberry, 8)).toBe(false);
        expect(inventory.hasItem(ItemType.Tomato)).toBe(false); // Item không tồn tại
    });

    it('getItem trả về đúng InventoryItem hoặc undefined', () => {
        inventory.addItem(ItemType.Cow, 2);
        const cowItem = inventory.getItem(ItemType.Cow);
        expect(cowItem).toBeInstanceOf(InventoryItem);
        expect(cowItem?.getQuantity()).toBe(2);
        const nonExistentItem = inventory.getItem(ItemType.Milk);
        expect(nonExistentItem).toBeUndefined();
    });

    it('getAllItems trả về mảng các InventoryItem', () => {
        inventory.addItem(ItemType.Tomato, 5);
        inventory.addItem(ItemType.BlueberrySeed, 10);
        const allItems = inventory.getAllItems();
        expect(allItems.length).toBe(2);
        expect(allItems.some(item => item.getItemTypeId() === ItemType.Tomato && item.getQuantity() === 5)).toBe(true);
        expect(allItems.some(item => item.getItemTypeId() === ItemType.BlueberrySeed && item.getQuantity() === 10)).toBe(true);
    });
});