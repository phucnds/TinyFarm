import { _decorator, Component, Label, Node } from 'cc';
import { CashManager } from '../Manager/CashManager';
import { UIButton } from './UIButton';
import { ModalWindowManager } from '../Services/ModalWindowSystem/ModalWindowManager';
import { GameModalWindowTypes } from '../Data/GameModalWindowTypes';
import { Inventory } from '../Game/Inventory';
import { InventoryManager } from '../Manager/InventoryManager';
import { getShopItemConfigs, ItemType } from '../Game/Enums';
import { WorkerManager } from '../Manager/WorkerManager';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    @property(UIButton) private btnUpgrade: UIButton;
    @property(UIButton) private btnInventory: UIButton;
    @property(UIButton) private btnShop: UIButton;

    @property(Label) private lblGold: Label;
    @property(Label) private lblWorker: Label;

    @property(UIButton) private btnHire: UIButton;


    protected start(): void {

        CashManager.Instance.onChangeBalance.on(this.updateGoldLabel, this);
        WorkerManager.Instance.WorkerChangeEvent.on(this.updateWorkerCount, this);

        this.btnInventory.InteractedEvent.on(this.showInventory, this);
        this.btnShop.InteractedEvent.on(this.showShop, this);
        this.btnUpgrade.InteractedEvent.on(this.showUpgrade, this);

        this.btnHire.InteractedEvent.on(this.showHire, this);

    }

    private updateGoldLabel(value: number): void {
        this.lblGold.string = value.toString();
    }

    private updateWorkerCount(): void {
        this.lblWorker.string = WorkerManager.Instance.getWorkerCount().toString();
    }

    private showInventory(): void {
        ModalWindowManager.Instance.showModal(GameModalWindowTypes.Inventory, { inventory: InventoryManager.Instance.Inventory })
    }

    private showShop(): void {
        ModalWindowManager.Instance.showModal(GameModalWindowTypes.Shop, { shopItems: getShopItemConfigs() })
    }

    private showUpgrade(): void {
        ModalWindowManager.Instance.showModal(GameModalWindowTypes.Tech, {})
    }

    private showHire(): void {
        ModalWindowManager.Instance.showModal(GameModalWindowTypes.HireWorker, {})
    }
}


