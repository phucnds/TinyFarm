import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { CharacterState, Worker } from '../Game/Worker';
import { CashManager } from './CashManager';
import { UserData } from '../Data/UserData';
import { Signal } from '../Services/EventSystem/Signal';

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

    private limitWorker = 0;
    private hireCost = 500;

    public WorkerChangeEvent: Signal<Worker> = new Signal<Worker>();

    protected start(): void {
        this.init();
    }

    private init(): void {

        const data = new UserData();
        this.limitWorker = data.startingWorkerCount;

        for (let i = 0; i < this.limitWorker; i++) {
            this.createWorker();
        }
    }

    private createWorker(): void {

        const worker = instantiate(this.workerPrefab).getComponent(Worker);
        this.workers.push(worker);
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


}


