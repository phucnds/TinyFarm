import { _decorator, Component, Game, game, JsonAsset, Node, sys } from 'cc';
import { SaveSystem } from '../Game/SaveSystem';
import { CashManager } from './CashManager';
import { GameData, GameSettings } from '../Data/GameSettings';
import { FarmPlotManager } from './FarmPlotManager';
import { FarmTechManager } from './FarmTechManager';
import { InventoryManager } from './InventoryManager';
import { WorkerManager } from './WorkerManager';
import { delay } from '../Utils/AsyncUtils';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset) private settingsAsset: JsonAsset;
    @property(CashManager) private cashManager: CashManager;
    @property(FarmPlotManager) private farmPlotManager: FarmPlotManager;
    @property(FarmTechManager) private farmTechManager: FarmTechManager;
    @property(InventoryManager) private inventoryManager: InventoryManager;
    @property(WorkerManager) private workerManager: WorkerManager;

    private static instance: GameManager;
    private saveSystem: SaveSystem;
    private gameData: GameData;
    private gameSetting: GameSettings;

    public static get Instance(): GameManager {
        return this.instance;
    }

    protected onLoad(): void {
        GameManager.instance = this;
        this.saveSystem = new SaveSystem();
        game.on(Game.EVENT_HIDE, this.saveGameState, this);
    }

    protected start(): void {
        this.loadSetting();
    }

    private saveGameState(): void {
        this.cashManager.saveTo(this.gameData.cash);
        this.farmTechManager.saveTo(this.gameData.tech);
        this.workerManager.saveTo(this.gameData.worker);
        this.inventoryManager.saveTo(this.gameData.inventory);
        this.farmPlotManager.saveTo(this.gameData.farm);

        this.saveSystem.save(this.gameData);
    }

    private loadSetting(): void {
        const data = this.saveSystem.load();
        this.gameData = data ?? <GameData>this.settingsAsset.json;
        console.log(this.gameData);
        this.setup();
    }

    public get GameSettings(): GameSettings {
        return this.gameSetting;
    }

    private async setup(): Promise<void> {
        await delay(200);
        this.cashManager.loadFrom(this.gameData.cash);
        this.farmTechManager.loadFrom(this.gameData.tech);
        this.workerManager.loadFrom(this.gameData.worker);
        this.inventoryManager.loadFrom(this.gameData.inventory);
        this.farmPlotManager.loadFrom(this.gameData.farm);
    }
}