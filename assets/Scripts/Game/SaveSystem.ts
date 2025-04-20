import { _decorator, Component, Node, sys } from 'cc';
import { GameData } from '../Data/GameSettings';
const { ccclass, property } = _decorator;

@ccclass('SaveSystem')
export class SaveSystem extends Component {
    private userDataIdentifier = "user-ndp";
    public save(userData: GameData): void {
        sys.localStorage.setItem(this.userDataIdentifier, JSON.stringify(userData));
    }

    public load(): GameData {
        const data: string = sys.localStorage.getItem(this.userDataIdentifier);
        if (!data) return null;
        try {
            return <GameData>JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    public delete(): void {
        sys.localStorage.removeItem(this.userDataIdentifier);
    }
}


