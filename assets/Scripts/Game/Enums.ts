import { Vec3 } from "cc";

export enum ItemType {

    TomatoSeed = 1,
    BlueberrySeed = 2,
    StrawberrySeed = 3,
    Cow = 4,

    Tomato = 101,
    Blueberry = 102,
    Strawberry = 103,
    Milk = 104,
}


export enum PlotState {
    Locked = 10,
    Empty = 0,
    Growing = 1,
    HasFruit = 2,
    ReadyToHarvest = 3,
    Decay = 4,
}

export interface PlantableConfig {
    itemType: ItemType;
    seedType?: ItemType;
    producedItem: ItemType;
    harvestInterval: number;
    maxYield: number;
    decayTimeAfterFinalHarvest: number;
    name: string;

    unit?: number;
    seedCost?: number;
    sellPrice?: number;
}

export const CropConfigs: { [key in ItemType]?: PlantableConfig } = {
    [ItemType.Tomato]: {
        itemType: ItemType.Tomato,
        seedType: ItemType.TomatoSeed,
        producedItem: ItemType.Tomato,
        harvestInterval: 3,//10 * 60,
        maxYield: 10,
        decayTimeAfterFinalHarvest: 1 * 60 * 60,
        name: "Tomato",

        unit: 1,
        seedCost: 30,
        sellPrice: 5,
    },
    [ItemType.Blueberry]: {
        itemType: ItemType.Blueberry,
        seedType: ItemType.BlueberrySeed,
        producedItem: ItemType.Blueberry,
        harvestInterval: 10,//15 * 60,
        maxYield: 40,
        decayTimeAfterFinalHarvest: 1 * 60 * 60,
        name: "Blueberry",
        unit: 1,
        seedCost: 50,
        sellPrice: 8,
    },
    [ItemType.Strawberry]: {
        itemType: ItemType.Strawberry,
        seedType: ItemType.StrawberrySeed,
        producedItem: ItemType.Strawberry,
        harvestInterval: 10,//5 * 60,
        maxYield: 20,
        decayTimeAfterFinalHarvest: 1 * 60 * 60,
        name: "Strawberry",
        unit: 10,
        seedCost: 40,
        sellPrice: 10,
    },

    [ItemType.Cow]: {
        itemType: ItemType.Cow,
        seedType: ItemType.Cow,
        producedItem: ItemType.Milk,
        harvestInterval: 30,//30 * 60,
        maxYield: 100,
        decayTimeAfterFinalHarvest: 1 * 60 * 60,
        name: "Cow",
        unit: 1,
        seedCost: 100,
        sellPrice: 15,
    }
};


export function getPlantableConfig(itemType: ItemType): PlantableConfig | null {
    const config = CropConfigs[itemType];
    if (!config) {
        return null;
    }

    if (config.itemType !== itemType) {

        for (const cfg of Object.values(CropConfigs)) {
            if (cfg?.itemType === itemType) return cfg;
        }
        return null;
    }
    return config;
}

export function getConfigBySeed(seedType: ItemType): PlantableConfig | null {
    for (const config of Object.values(CropConfigs)) {
        if (config?.seedType === seedType) {
            return config;
        }
    }
    return null;
}


export interface ShopItemConfigs {
    itemType: ItemType;
    unit: number;
    quanlity: number;
    price: number;
}



export function getShopItemConfigs(): ShopItemConfigs[] {
    return Object.values(CropConfigs)
        .filter(config => config)
        .map(config => ({
            itemType: config.seedType,
            unit: config.unit,
            quanlity: 0,
            price: config.seedCost
        }));
}

