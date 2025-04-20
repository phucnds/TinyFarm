import { _decorator, Component, Node } from 'cc';
import { Inventory } from '../Game/Inventory';
import { CropConfigs, ItemType, PlantableConfig, ShopItemConfigs } from '../Game/Enums';
import { Signal } from '../Services/EventSystem/Signal';
const { ccclass, property } = _decorator;

@ccclass('InventoryManager')
export class InventoryManager extends Component {

    private static instance: InventoryManager;

    public static get Instance(): InventoryManager {
        return this.instance;
    }

    protected onLoad(): void {
        InventoryManager.instance = this;
    }

    private inventory: Inventory;
    public ChangeInventoryEvent: Signal = new Signal();

    protected start(): void {
        this.setup();
    }

    private setup(): void {
        this.inventory = new Inventory();

        this.inventory.addItem(ItemType.TomatoSeed, 100);
        // this.inventory.addItem(ItemType.BlueberrySeed, 10);
        // this.inventory.addItem(ItemType.Cow, 2);
    }

    public get Inventory() {
        return this.inventory;
    }

    public getPlantableCrop(): { itemID: ItemType, name: string, crop: PlantableConfig }[] {
        const result: { itemID: ItemType, name: string, crop: PlantableConfig }[] = [];

        for (const key in CropConfigs) {
            const itemID = parseInt(key) as ItemType;
            const crop = CropConfigs[itemID];

            if (crop && crop.seedType !== undefined && this.inventory.Items.has(crop.seedType)) {
                result.push({
                    itemID: itemID,
                    name: crop.name,
                    crop: crop
                });
            }
        }

        return result;
    }

    public addItem(itemTypeId: ItemType, quantity: number = 1): void {
        this.inventory.addItem(itemTypeId, quantity);
        this.ChangeInventoryEvent?.trigger();
    }

    public removeItem(itemTypeId: ItemType, quantity: number): void {
        this.inventory.removeItem(itemTypeId, quantity);
        this.ChangeInventoryEvent?.trigger();
    }

    public getSellItem(): ShopItemConfigs[] {
        const result: ShopItemConfigs[] = []

        for (const key in CropConfigs) {
            const itemID = parseInt(key) as ItemType;
            const crop = CropConfigs[itemID];

            result.push({
                itemType: crop.producedItem,
                unit: 0,
                quanlity: this.inventory.getItemQuantity(crop.producedItem),
                price: crop.sellPrice
            });
        }

        return result;
    }
}

export interface PlantableCrop {
    itemID: ItemType;
    name: string;
    crop: PlantableConfig;
}


