import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { FarmPlotSettings } from '../Data/GameSettings';
import { FarmPlot } from '../Game/FarmPlot';
import { FarmPlotView } from '../Visuals/FarmPlotView';
import { delay } from '../Utils/AsyncUtils';
const { ccclass, property } = _decorator;

@ccclass('FarmPlotManager')
export class FarmPlotManager extends Component {

    @property(Prefab) private farmplot: Prefab;

    private farmPlots: FarmPlot[] = [];


    public async loadFrom(data: FarmPlotSettings): Promise<void> {

        let amount: number = data.available;
        const amountUnlock = data.startingFarmPlots;
        const price = data.unlockCost;

        const dataFarmPlotCount:number = data.farmPlots.length;

        if (dataFarmPlotCount > 0) amount = dataFarmPlotCount;

        this.farmPlots = [];

        for (let i = 0; i < amount; i++) {

            const unlock = i < amountUnlock;
            const farmPlot = new FarmPlot(price);

            this.farmPlots.push(farmPlot);

            const farmPlotUI = instantiate(this.farmplot).getComponent(FarmPlotView);
            farmPlotUI.setup(farmPlot);
            farmPlotUI.node.setParent(this.node);


            await delay(100);
            if (dataFarmPlotCount > 0)
            {
                
                farmPlot.loadData(data.farmPlots[i]);
            }
            else
            {
                if (!unlock) continue;
                farmPlot.buyPlot();
            }
            
        }
    }
    public saveTo(data: FarmPlotSettings): void {

        data.farmPlots = [];
        this.farmPlots.forEach(plot => {
            data.farmPlots.push(plot.saveData());
        })
        console.log(data.farmPlots);
    }
}

