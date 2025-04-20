import { ItemType } from "../assets/Scripts/Game/Enums";
import { Inventory } from "../assets/Scripts/Game/Inventory";
import { InventoryItem } from "../assets/Scripts/Game/InventoryItem";

describe('InventoryItem', () => {
    let item: InventoryItem;

    beforeEach(() => {
        item = new InventoryItem(ItemType.Tomato, 5);
    });

    it('should initialize correctly', () => {
        expect(item.getItemTypeId()).toBe(ItemType.Tomato);
        expect(item.getQuantity()).toBe(5);
        const item2 = new InventoryItem(ItemType.Blueberry, -5); // Test số lượng âm
        expect(item2.getQuantity()).toBe(0);
    });

    it('should add quantity correctly', () => {
        item.addQuantity(3);
        expect(item.getQuantity()).toBe(8);
        item.addQuantity(0);
        expect(item.getQuantity()).toBe(8);
        item.addQuantity(-2); // Không nên thay đổi khi thêm số âm/0
        expect(item.getQuantity()).toBe(8);
    });

    it('should remove quantity correctly', () => {
        expect(item.removeQuantity(3)).toBe(true);
        expect(item.getQuantity()).toBe(2);
        expect(item.removeQuantity(2)).toBe(true);
        expect(item.getQuantity()).toBe(0);
        expect(item.removeQuantity(1)).toBe(false); // Không đủ
        expect(item.getQuantity()).toBe(0);
        expect(item.removeQuantity(0)).toBe(true); // Xóa 0
        expect(item.getQuantity()).toBe(0);
        expect(item.removeQuantity(-2)).toBe(true); // Xóa số âm
        expect(item.getQuantity()).toBe(0);

    });
});

describe('Inventory', () => {
    let inventory: Inventory;

    beforeEach(() => {
        inventory = new Inventory();
    });

    it('should start empty', () => {
        expect(inventory.getAllItems()).toEqual([]);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(0);
    });

    it('should add new items', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(10);
        expect(inventory.getAllItems().length).toBe(1);
        inventory.addItem(ItemType.BlueberrySeed, 5);
        expect(inventory.getItemQuantity(ItemType.BlueberrySeed)).toBe(5);
        expect(inventory.getAllItems().length).toBe(2);
    });

    it('should add quantity to existing items', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        inventory.addItem(ItemType.TomatoSeed, 5);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(15);
        expect(inventory.getAllItems().length).toBe(1);
    });

    it('should not add non-positive quantities', () => {
        inventory.addItem(ItemType.TomatoSeed, 0);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(0);
        inventory.addItem(ItemType.TomatoSeed, -5);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(0);
    });

    it('should remove items correctly', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        inventory.addItem(ItemType.BlueberrySeed, 5);

        expect(inventory.removeItem(ItemType.TomatoSeed, 3)).toBe(true);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(7);

        expect(inventory.removeItem(ItemType.BlueberrySeed, 5)).toBe(true);
        expect(inventory.getItemQuantity(ItemType.BlueberrySeed)).toBe(0);
        expect(inventory.hasItem(ItemType.BlueberrySeed)).toBe(false); // Item bị xóa khỏi list
        expect(inventory.getAllItems().length).toBe(1); // Chỉ còn TomatoSeed

        expect(inventory.removeItem(ItemType.Cow, 1)).toBe(false); // Item không tồn tại
    });

    it('should handle removing more than available', () => {
        inventory.addItem(ItemType.TomatoSeed, 5);
        expect(inventory.removeItem(ItemType.TomatoSeed, 10)).toBe(false);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(5); // Số lượng không đổi
    });

    it('should handle removing non-positive quantities', () => {
        inventory.addItem(ItemType.TomatoSeed, 5);
        expect(inventory.removeItem(ItemType.TomatoSeed, 0)).toBe(true);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(5);
        expect(inventory.removeItem(ItemType.TomatoSeed, -2)).toBe(true);
        expect(inventory.getItemQuantity(ItemType.TomatoSeed)).toBe(5);
    });


    it('should check item existence and quantity', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        expect(inventory.hasItem(ItemType.TomatoSeed)).toBe(true);
        expect(inventory.hasItem(ItemType.TomatoSeed, 5)).toBe(true);
        expect(inventory.hasItem(ItemType.TomatoSeed, 10)).toBe(true);
        expect(inventory.hasItem(ItemType.TomatoSeed, 11)).toBe(false);
        expect(inventory.hasItem(ItemType.BlueberrySeed)).toBe(false);
    });

    it('should get specific item', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        const item = inventory.getItem(ItemType.TomatoSeed);
        expect(item).toBeInstanceOf(InventoryItem);
        expect(item?.getQuantity()).toBe(10);
        expect(inventory.getItem(ItemType.BlueberrySeed)).toBeUndefined();
    });

    it('should save and load item data', () => {
        inventory.addItem(ItemType.TomatoSeed, 10);
        inventory.addItem(ItemType.Milk, 3);
        const savedData = inventory.getItemDatas();
        expect(savedData).toEqual(expect.arrayContaining([
            { itemTypeId: ItemType.TomatoSeed, quantity: 10 },
            { itemTypeId: ItemType.Milk, quantity: 3 }
        ]));
        expect(savedData.length).toBe(2);

        const newInventory = new Inventory();
        newInventory.setItems(savedData);
        expect(newInventory.getItemQuantity(ItemType.TomatoSeed)).toBe(10);
        expect(newInventory.getItemQuantity(ItemType.Milk)).toBe(3);
        expect(newInventory.getAllItems().length).toBe(2);
    });
});