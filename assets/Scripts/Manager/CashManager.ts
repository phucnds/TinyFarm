import { _decorator, Component, Node } from 'cc';
import { Signal } from '../Services/EventSystem/Signal';
import { UserData } from '../Data/UserData';
import { delay } from '../Utils/AsyncUtils';

const { ccclass, property } = _decorator;

@ccclass('CashManager')
export class CashManager extends Component {

    private static instance: CashManager;

    public static get Instance(): CashManager {
        return this.instance;
    }

    protected onLoad(): void {
        CashManager.instance = this;
    }

    private balance: number = 0;

    public onChangeBalance: Signal<number> = new Signal<number>();

    protected start(): void {
        const userData = new UserData();
        this.balance = userData.goldCoins;

        this.lateUpdates();
    }

    private async lateUpdates(): Promise<void> {
        await delay(50);
        this.onChangeBalance?.trigger(this.balance);
    }

    public get Balance(): number {
        return this.balance;
    }



    public addBalance(value: number): void {
        this.balance += value;
        this.onChangeBalance?.trigger(this.balance);
    }

    public useBalance(value: number): void {
        this.addBalance(-value);
    }

    public hasEnoughBalance(value: number): boolean {
        return this.balance >= value;
    }


}


