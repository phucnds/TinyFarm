import { _decorator, Button, Color, Component, instantiate, Label, Node, Prefab, Sprite, Vec3 } from 'cc';
import { FarmPlot } from '../Game/FarmPlot';
import { ItemType, PlotState } from '../Game/Enums';
import { UIButton } from '../UI/UIButton';
import { CashManager } from '../Manager/CashManager';
import { ModalWindowManager } from '../Services/ModalWindowSystem/ModalWindowManager';
import { GameModalWindowTypes } from '../Data/GameModalWindowTypes';
import { InventoryManager } from '../Manager/InventoryManager';
import { loadItemSprite } from '../Utils/LoadItemSprite';
import { CropPrefabVisual } from './CropPrefabVisual';
import { TaskManager } from '../Manager/TaskManager';
import { Task } from '../Game/TaskSystem';
import { FarmTechManager } from '../Manager/FarmTechManager';
import { delay } from '../Utils/AsyncUtils';
const { ccclass, property } = _decorator;

@ccclass('FarmPlotView')
export class FarmPlotView extends Component {
    @property(Node) private workPos: Node;
    @property(Node) private lockedNode: Node;
    @property(Node) private emptyNode: Node;
    @property(Node) private growNode: Node;
    @property(Label) private lblPrice: Label;
    @property(UIButton) private btnBuy: UIButton;
    @property(UIButton) private btnAdd: UIButton;
    @property(Node) private field: Node;
    @property(Node) private stats: Node;
    @property(Label) private lblName: Label;
    @property(Label) private lblTime: Label;
    @property(Sprite) private bgTimer: Sprite;
    @property(Label) private lblAmount: Label;
    @property(UIButton) private btnHarvest: UIButton;
    @property(Sprite) private icProduct: Sprite;
    @property(UIButton) private btnClear: UIButton;
    @property(Prefab) private prefabsTomato: Prefab;
    @property(Prefab) private prefabsBlue: Prefab;
    @property(Prefab) private prefabsStraw: Prefab;
    @property(Prefab) private prefabsCow: Prefab;

    private typeToPrefab = new Map<ItemType, Prefab>();
    private farmPlot: FarmPlot;
    private cropPrefabVisual: CropPrefabVisual = null;
    private canHarvest = false;

    private arrNode: Node[] = []

    protected start(): void {
        this.btnBuy.InteractedEvent.on(this.buyFarmPlot, this);
        this.btnAdd.InteractedEvent.on(this.tryPlant, this);
        this.btnHarvest.InteractedEvent.on(this.harvest, this);
        this.btnClear.InteractedEvent.on(this.clear, this);
        this.mapPrefabs();
        this.addNodetoArr();

    }

    protected update(dt: number): void {
        if (!this.farmPlot) return;

        this.farmPlot.update(dt);
        const isReady = this.farmPlot.getCurrentState() === PlotState.ReadyToHarvest;
        const time = isReady ? this.farmPlot.getDecayTimerMinutes() : this.farmPlot.getPlantedItem().getTimeToNextHarvest();
        this.lblTime.string = this.formatTime(time);
    }

    setup(farmPlot: FarmPlot): void {
        this.farmPlot = farmPlot;
        this.farmPlot.ChangeStateEvent.on(this.farmPlot_onChangeState, this);
        this.farmPlot.HasFruitEvent.on(this.hasFruitEvent, this);
        this.lblPrice.string = farmPlot.getCurrentPrice().toString();
        this.btnHarvest.getComponent(Button).interactable = this.canHarvest;

        this.checkPos();
    }

    private mapPrefabs(): void {
        this.typeToPrefab.set(ItemType.Tomato, this.prefabsTomato);
        this.typeToPrefab.set(ItemType.Blueberry, this.prefabsBlue);
        this.typeToPrefab.set(ItemType.Strawberry, this.prefabsStraw);
        this.typeToPrefab.set(ItemType.Cow, this.prefabsCow);
    }

    private addNodetoArr(): void {
        this.arrNode.push(this.lockedNode);
        this.arrNode.push(this.emptyNode);
        this.arrNode.push(this.growNode);

        this.showNode(this.lockedNode);
    }

    private showNode(node: Node): void {
        this.arrNode.forEach(n => {
            n.active = node === n;
        })
    }

    private farmPlot_UnlockEvent(): void {
        this.lockedNode.active = false;
        this.emptyNode.active = true;
        this.addTaskPlant();
    }

    private farmPlot_onChangeState(state: PlotState): void {
        switch (state) {

            case PlotState.Locked:
                this.showNode(this.lockedNode);
                break;

            case PlotState.Empty:
                this.resetState();
                this.showNode(this.emptyNode);
                break;

            case PlotState.Growing:


                this.showNode(this.growNode);
                this.updateVisualPlant();
                break;

            case PlotState.ReadyToHarvest:
                this.canHarvestEvent();
                this.showNode(this.growNode);
                this.updateVisualPlant();
                break;

            case PlotState.HasFruit:
                this.showNode(this.growNode);
                this.updateVisualPlant();
                break;

            case PlotState.Decay:
                this.showNode(this.growNode);
                this.updateVisualPlant();
                this.decayEvent()
                break;

        }
    }

    private buyFarmPlot(): void {
        const canBuy = CashManager.Instance.hasEnoughBalance(this.farmPlot.getCurrentPrice());
        ModalWindowManager.Instance.showModal(GameModalWindowTypes.BuyPlot, { farmPlot: this.farmPlot, canBuy });
    }

    private async tryPlant(): Promise<void> {
        const crops = InventoryManager.Instance.getPlantableCrop();
        const itemType: ItemType = await ModalWindowManager.Instance.showModal(GameModalWindowTypes.ChooseCrop, { crops });
        if (itemType != null) this.plant(itemType);
    }

    private resetState(): void {
        this.farmPlot_UnlockEvent();
        this.btnAdd.node.active = true;
        this.field.removeAllChildren();
        this.cropPrefabVisual = null;
        this.setHarvestUI(false);
    }

    private updateVisualPlant() {
        if (this.cropPrefabVisual === null) {
            const prefab = this.getPrefab(this.farmPlot.getPlantedItem().getConfig().itemType);
            const crop = instantiate(prefab);
            crop.setParent(this.field);
            this.cropPrefabVisual = crop.getComponent(CropPrefabVisual);
        }

        this.lblName.string = this.farmPlot.getPlantedItem().getConfig().name;
        const idProduct = this.farmPlot.getPlantedItem().getConfig().producedItem;
        loadItemSprite(idProduct, (spr) => this.icProduct.spriteFrame = spr);
        const count: number = this.farmPlot.getPlantedItem().ProducedItemCount;
        this.btnHarvest.node.active = count > 0;
        this.lblAmount.string = count.toString();
    }

    private plant(id: ItemType): void {
        const inventory = InventoryManager.Instance.Inventory;
        if (!this.farmPlot.plant(id, inventory)) return;

        this.updateVisualPlant();
    }

    public getPrefab(itemID: ItemType): Prefab {
        if (!this.typeToPrefab.has(itemID)) throw new Error("Does not have item type asset " + itemID);
        return this.typeToPrefab.get(itemID);
    }

    private formatTime(seconds: number): string {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(hrs)} : ${pad(mins)} : ${pad(secs)}`;
    }

    private harvest(): void {
        const amount = this.farmPlot.harvest();
        if (amount < 0) return;

        const bonus = FarmTechManager.Instance.getProductionMultiplier() * amount;
        InventoryManager.Instance.Inventory.addItem(this.farmPlot.getPlantedItem().getConfig().producedItem, Math.floor(bonus));
        this.btnHarvest.node.active = false;
    }

    private clear(): void {
        this.farmPlot.clearPlot();
        this.btnClear.node.active = false;
    }

    private hasFruitEvent(): void {
        this.btnHarvest.node.active = true;
        this.icProduct.grayscale = false;
        this.lblAmount.string = this.farmPlot.getPlantedItem().ProducedItemCount.toString();
    }

    private canHarvestEvent(): void {
        this.setHarvestUI(true);
        this.addTaskHarvest();
    }

    private decayEvent(): void {
        this.setHarvestUI(false);
        this.btnClear.node.active = true;
        this.icProduct.grayscale = true;

        if (this.cropPrefabVisual) this.cropPrefabVisual.grayScale();

        const task = new Task();
        task.targetPos = this.workPos.getWorldPosition();
        task.harvest = () => this.clear();
        TaskManager.Instance.addTask(task);
    }

    private addTaskHarvest(): void {
        const state = this.farmPlot.getCurrentState() === PlotState.ReadyToHarvest;
        TaskManager.Instance.TaskSystem.enqueueTaskFunc(() => {
            if (state) {
                const task = new Task();
                task.targetPos = this.workPos.getWorldPosition();
                task.harvest = () => this.harvest();
                return task;
            }
            return null;
        });
    }

    private async checkPos(): Promise<void> {

        await delay(100);
        if (this.node.getPosition().x > 0) {
            const locPos = this.workPos.getPosition();
            this.workPos.setPosition(new Vec3(-locPos.x, locPos.y, locPos.z));
        }
    }

    private addTaskPlant(): void {
        const crops = InventoryManager.Instance.getPlantableCrop();
        TaskManager.Instance.TaskSystem.enqueueTaskFunc(() => {
            if (crops.length > 0) {
                const crop = crops[0].crop.seedType;
                const task = new Task();
                task.targetPos = this.workPos.getWorldPosition();
                task.harvest = () => this.plant(crop);
                return task;
            }
            return null;
        });
    }

    private setHarvestUI(active: boolean): void {
        this.canHarvest = active;
        const color = active ? Color.GREEN : Color.WHITE;
        this.btnHarvest.getComponent(Button).interactable = active;
        this.btnHarvest.getComponent(Sprite).color = color;
        this.bgTimer.color = active ? new Color(236, 87, 87, 255) : Color.WHITE;
    }
}
