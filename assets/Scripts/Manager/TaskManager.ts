import { _decorator, Component, Node } from 'cc';
import { Task, TaskSystem } from '../Game/TaskSystem';
import { delay } from '../Utils/AsyncUtils';
import { WorkerManager } from './WorkerManager';
import { Worker } from '../Game/Worker';
import { WorkerTaskAI } from '../Game/WorkerTaskAI';
import { InventoryManager } from './InventoryManager';
import { ItemType } from '../Game/Enums';
const { ccclass, property } = _decorator;

@ccclass('TaskManager')
export class TaskManager extends Component {

    private static instance: TaskManager;

    public static get Instance(): TaskManager {
        return this.instance;
    }

    protected onLoad(): void {
        TaskManager.instance = this;
    }

    private taskSystem: TaskSystem;

    private waitingTimer = 0;
    private waitingTimerMax = 0.2;


    protected start(): void {
        this.taskSystem = new TaskSystem();

        WorkerManager.Instance.WorkerChangeEvent.on(this.addWorkerTask, this)
    }

    protected update(dt: number): void {

        this.waitingTimer -= dt;
        if (this.waitingTimer <= 0) {
            this.waitingTimer = this.waitingTimerMax;
            this.taskSystem.dequeueTasks();
        }
    }

    private addWorkerTask(worker: Worker): void {
        worker.node.getComponent(WorkerTaskAI).setup(this.taskSystem);
    }

    public addTask(task: Task): void {
        this.taskSystem.addTask(task);
    }

    public enqueueTask(task: Task): void {
        const crops = InventoryManager.Instance.Inventory.hasItem(ItemType.TomatoSeed, 1);
        this.taskSystem.enqueueTaskFunc(() => {
            if (crops) {
                return task;
            }

            return null;
        })
    }

    public get TaskSystem() {
        return this.taskSystem;
    }
}


