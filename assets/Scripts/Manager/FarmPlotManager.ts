import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { FarmPlotSettings } from '../Data/GameSettings';
import { FarmPlot } from '../Game/FarmPlot';
import { FarmPlotView } from '../Visuals/FarmPlotView';
import { delay } from '../Utils/AsyncUtils';
const { ccclass, property } = _decorator;

@ccclass('FarmPlotManager')
export class FarmPlotManager extends Component {
    @property(Prefab) private farmplot: Prefab;

    private farmPlotSetting: FarmPlotSettings;
    private farmPlots: FarmPlot[] = [];

    start() {
        this.init();
    }

    private async init(): Promise<void> {

        this.farmPlotSetting = new FarmPlotSettings();

        const amount = this.farmPlotSetting.amount;
        const amountUnlock = this.farmPlotSetting.startingFarmPlots;
        const price = this.farmPlotSetting.price;

        this.farmPlots = [];

        for (let i = 0; i < amount; i++) {

            const unlock = i < amountUnlock;
            const farmPlot = new FarmPlot(price);
            this.farmPlots.push(farmPlot);

            const farmPlotUI = instantiate(this.farmplot).getComponent(FarmPlotView);
            farmPlotUI.setup(farmPlot);
            farmPlotUI.node.setParent(this.node);

            await delay(100);
            if (!unlock) continue;
            farmPlot.buyPlot();

        }
    }
}

