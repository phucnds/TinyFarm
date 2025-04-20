import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { CharacterState, Worker } from '../Game/Worker';
import { CashManager } from './CashManager';
import { Signal } from '../Services/EventSystem/Signal';
import { WorkerSettings } from '../Data/GameSettings';

const { ccclass, property } = _decorator;

@ccclass('WorkerManager')
export class WorkerManager extends Component {
    @property(Prefab) private workerPrefab: Prefab;
    @property(Node) private parentNode: Node;
    @property(Node) private startPos: Node;

    private static instance: WorkerManager;

    public static get Instance(): WorkerManager {
        return this.instance;
    }
    protected onLoad(): void {
        WorkerManager.instance = this;
    }
    public workers: Worker[] = [];

    private hireCost = 500;
    private actionTime = 120;

    public WorkerChangeEvent: Signal<Worker> = new Signal<Worker>();


    private createWorker(): void {

        const worker = instantiate(this.workerPrefab).getComponent(Worker);
        this.workers.push(worker);
        worker.setActionTime(this.actionTime);
        worker.node.setParent(this.parentNode);
        worker.node.setPosition(this.startPos.getPosition());

        // worker.moveTo(this.startPos.getPosition(), () => {
        //     console.log('done');
        // });

        this.WorkerChangeEvent?.trigger(worker);
    }

    public hireWorker(): void {
        CashManager.Instance.useBalance(this.hireCost);
        this.createWorker();
    }

    public getHireCost(): number {
        return this.hireCost;
    }

    public getWorkerCount(): number {
        return this.workers.length;
    }

    public getWorkerWorkingCount(): number {
        return this.workers.filter(worker => worker.getCurrentState() !== CharacterState.IDLE).length;
    }

    public getWorkerIdleCount(): number {
        return this.workers.filter(worker => worker.getCurrentState() === CharacterState.IDLE).length;
    }

    public loadFrom(data: WorkerSettings): void {
        this.hireCost = data.hireCost;
        this.actionTime = data.actionTime;

        for (let i = 0; i < data.available; i++) {
            this.createWorker();
        }

    }
    public saveTo(data: WorkerSettings): void {
        data.available = this.workers.length;
    }
}


