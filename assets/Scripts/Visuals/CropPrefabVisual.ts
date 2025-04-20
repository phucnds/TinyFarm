import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CropPrefabVisual')
export class CropPrefabVisual extends Component {
    @property(Sprite) private arrSpr: Sprite[] = [];

    public grayScale(): void {
        this.arrSpr.forEach(spr => {
            spr.grayscale = true;
        })
    }
}


