import { _decorator, Component, director, JsonAsset, Node } from 'cc';
import { UIButton } from './UIButton';
import { GameSettings } from '../Data/GameSettings';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {
    @property(UIButton) private btnPlay: UIButton
    @property(JsonAsset) private json: JsonAsset;

    start() {
        this.btnPlay.InteractedEvent.on(() => {
            director.loadScene('Game');
        }, this);

        const game: GameSettings = <GameSettings>this.json.json

       

    }

    update(deltaTime: number) {

    }
}


