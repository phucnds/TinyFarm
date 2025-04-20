import { _decorator, Button, Color, Component, Label, Node } from 'cc';
import { ModalWindow } from '../../Services/ModalWindowSystem/ModalWindow';
import { Empty } from './InventoryModalWindow';
import { UIButton } from '../UIButton';
import { WorkerManager } from '../../Manager/WorkerManager';
import { CashManager } from '../../Manager/CashManager';
const { ccclass, property } = _decorator;

@ccclass('HireWorkerModalWindow')
export class HireWorkerModalWindow extends ModalWindow<Empty, Empty> {

    @property(Label) private lblAvailable: Label;
    @property(Label) private lblWorking: Label;
    @property(Label) private lblIdle: Label;

    @property(Label) private lblCost: Label;

    @property(UIButton) private btnHire: UIButton;

    private canHire = false;

    protected setup(params?: Empty): void {

        this.btnHire.InteractedEvent.on(this.hire, this);
        this.lblCost.string = WorkerManager.Instance.getHireCost().toString();

        this.updateVisual();

    }

    private hire(): void {
        if (!this.canHire) return;
        WorkerManager.Instance.hireWorker();
        this.updateVisual();
    }

    private updateVisual(): void {

        this.canHire = CashManager.Instance.hasEnoughBalance(WorkerManager.Instance.getHireCost());

        this.btnHire.node.getComponent(Button).interactable = this.canHire;
        this.lblCost.color = this.canHire ? Color.WHITE : Color.RED;
        this.lblAvailable.string = `Worker  available :  ${WorkerManager.Instance.getWorkerCount().toString()}`; 
        this.lblWorking.string = `Working :  ${WorkerManager.Instance.getWorkerWorkingCount().toString()}`; 
        this.lblIdle.string = `Idle :  ${WorkerManager.Instance.getWorkerIdleCount().toString()}`; 
    }

}


