import { _decorator, Component, Node } from 'cc';
import { Task, TaskSystem } from './TaskSystem';
import { Worker } from './Worker';
const { ccclass, property } = _decorator;

enum State {
    WaitingForNextTask,
    ExecutingTask,
}

@ccclass('WorkerTaskAI')
export class WorkerTaskAI extends Component {

    @property(Worker) private worker: Worker;

    private state: State;
    private taskSystem: TaskSystem;

    private waitingTimer = 0;
    private waitingTimerMax = 0.2;

    protected update(dt: number): void {
        switch (this.state) {
            case State.WaitingForNextTask:
                this.waitingTimer -= dt;
                if (this.waitingTimer <= 0) {
                    this.waitingTimer = this.waitingTimerMax;
                    this.requestNextTask();
                }
                break;

            case State.ExecutingTask:
                break;
        }
    }

    private requestNextTask(): void {
        // console.log('RequestNextTask');

        const task: Task = this.taskSystem.requestNextTask();

        if (task === null) {
            this.state = State.WaitingForNextTask;
        }
        else {
            this.state = State.ExecutingTask;
            this.executeTask(task);
        }

    }

    private executeTask(task: Task): void {
        this.worker.moveTo(task.targetPos, () => {
            this.worker.startAction(() => {
                task.harvest();
                this.state = State.WaitingForNextTask;
            })
        })
    }

    public setup(taskSys: TaskSystem): void {
        this.state = State.WaitingForNextTask;
        this.taskSystem = taskSys;
    }

}


