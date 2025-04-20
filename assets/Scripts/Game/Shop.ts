import { _decorator, Component, Node } from 'cc';
import { ItemType, ShopItemConfigs } from './Enums';
const { ccclass, property } = _decorator;

@ccclass('Shop')
export class Shop {
    public getPlantableCrop(): ShopItemConfigs[] {
        return null;
    }
}



