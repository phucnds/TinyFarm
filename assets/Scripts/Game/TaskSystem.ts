import { Vec3 } from "cc";

export class Task {
    targetPos: Vec3;
    harvest: () => void;
    canAction: boolean;
}

export class QueuedTask {
    private tryGetTaskFunc: () => Task | null;

    constructor(tryGetTaskFunc: () => Task | null) {
        this.tryGetTaskFunc = tryGetTaskFunc;
    }

    public tryDequeueTask(): Task | null {
        return this.tryGetTaskFunc();
    }
}

export class TaskSystem {
    private taskList: Task[] = [];
    private queuedTaskList: QueuedTask[] = [];

    public requestNextTask(): Task | null {
        if (this.taskList.length > 0) {
            const task = this.taskList[0];
            this.taskList.splice(0, 1);
            return task;
        } else {
            return null;
        }
    }

    public addTask(task: Task): void {
        this.taskList.push(task);
        // console.log(this.taskList.length);
    }

    public enqueueTask(queuedTask: QueuedTask): void {
        this.queuedTaskList.push(queuedTask);
    }

    public enqueueTaskFunc(tryGetTaskFunc: () => Task | null): void {
        const queuedTask = new QueuedTask(tryGetTaskFunc);
        this.queuedTaskList.push(queuedTask);
        // console.log(this.taskList.length);
    }

    public dequeueTasks(): void {
        for (let i = 0; i < this.queuedTaskList.length; i++) {
            const queuedTask = this.queuedTaskList[i];
            const task = queuedTask.tryDequeueTask();
            if (task !== null) {
                this.addTask(task);
                this.queuedTaskList.splice(i, 1);
                i--;
            } else {
            
            }
        }
    }
}