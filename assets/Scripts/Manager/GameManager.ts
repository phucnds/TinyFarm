import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static instance: GameManager;

    public static get Instance(): GameManager {
        return this.instance;
    }

    protected onLoad(): void {
        GameManager.instance = this;
    }
}


