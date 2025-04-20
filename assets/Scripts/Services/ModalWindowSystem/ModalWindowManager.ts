import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { ModalWindow } from './ModalWindow';
const { ccclass, property } = _decorator;

@ccclass("ModalWindowManager")
export class ModalWindowManager extends Component {

    private static instance: ModalWindowManager;

    public static get Instance(): ModalWindowManager {
        return this.instance;
    }

    protected onLoad(): void {
        ModalWindowManager.instance = this;
    }

    @property(Prefab) private availableWindows: Prefab[] = [];

    public async showModal<TParams, TResult>(name: string, params: TParams): Promise<TResult> {
        const windowPrefab: Prefab = this.availableWindows.find((w) => w.name === name);
        const windowNode: Node = instantiate(windowPrefab);
        windowNode.setParent(this.node);

        const modalWindow: ModalWindow<TParams, TResult> = <ModalWindow<TParams, TResult>>windowNode.getComponent(name);
        const result: TResult = await modalWindow.runAsync(params);
        windowNode.destroy();

        return result;
    }
}
