import { _decorator, Component, director, Node } from 'cc';
import { UIButton } from './UIButton';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {
    @property(UIButton) private btnPlay: UIButton

    start() {
        this.btnPlay.InteractedEvent.on(() => {
            director.loadScene('Game');
        }, this);
    }

    update(deltaTime: number) {

    }
}


