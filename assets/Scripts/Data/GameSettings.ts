import { CropConfigs, CropData, FarmPlotSaveData, ItemData, ItemType, PlantableConfig } from "../Game/Enums";
import { FarmPlot } from "../Game/FarmPlot";
import { InventoryItem } from "../Game/InventoryItem";

export interface ISavable<T> {
    loadFrom(data: T): void;
    saveTo(data: T): void;
}

export class GameSettings {
    public cash: CashSettings = new CashSettings();
    public farm: FarmPlotSettings = new FarmPlotSettings();
    public tech: FarmTechSettings = new FarmTechSettings();
    public inventory: InventorySettings = new InventorySettings();
    public worker: WorkerSettings = new WorkerSettings();
}

export class GameData {
    public cash: CashSettings = new CashSettings();
    public farm: FarmPlotSettings = new FarmPlotSettings();
    public tech: FarmTechSettings = new FarmTechSettings();
    public inventory: InventorySettings = new InventorySettings();
    public worker: WorkerSettings = new WorkerSettings();
}

export class CashSettings {
    public goldCoins: number = 0;
}

export class FarmPlotSettings {
    public available = 8;
    public startingFarmPlots = 3;
    public unlockCost = 500;
    public farmPlots: FarmPlotSaveData[] = []
}

export class FarmTechSettings {
    public level: number = 1;
    public productionMultiplier: number = 0.1;
    public upgradeCost = 500;
}

export class InventorySettings {
    public inventory: ItemData[];
    public cropConfigs: CropData;
}

export class WorkerSettings {
    public available: number = 1;
    public hireCost: number = 500;
    public actionTime: number = 120;
    public workers: Worker[] = []
}