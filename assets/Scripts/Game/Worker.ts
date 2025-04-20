import { _decorator, CCFloat, Component, Node, v3, Vec3, Animation, UITransform } from 'cc';
const { ccclass, property } = _decorator;

export enum CharacterState {
    IDLE,
    MOVING,
    DOING
}

export const AnimName = {
    IDLE: 'idle',
    WALK: 'walk',
    DOING: 'doing'
}

@ccclass('Worker')
export class Worker extends Component {
    @property(CCFloat) moveSpeed: number = 200;
    @property(Animation) private anim: Animation;

    public currentState: CharacterState = CharacterState.IDLE;
    public parentNode: Node;

    private targetPosition: Vec3 = v3();
    private isMoving = false;
    private waitingTimer = 0;
    private waitingTimerMax = 5;
    private onComplete: () => void = null;

    onLoad() {
        this.setState(CharacterState.IDLE);
    }

    update(deltaTime: number) {
        switch (this.currentState) {
            case CharacterState.MOVING:
                this.updateMovement(deltaTime);
                break;
            case CharacterState.DOING:
                this.updateAction(deltaTime);
                break;
        }
    }

    private updateMovement(deltaTime: number) {
        if (!this.isMoving) return;

        const currentPos = this.node.position;
        const direction = v3();
        Vec3.subtract(direction, this.targetPosition, currentPos);

        const distance = direction.length();
        const stopThreshold = this.moveSpeed * deltaTime * 0.5;

        if (distance <= stopThreshold || distance < 1) {
            this.node.setPosition(this.targetPosition);
            this.isMoving = false;
            this.setState(CharacterState.IDLE);
            this.onComplete?.();
        } else {
            direction.normalize();
            const moveStep = direction.multiplyScalar(this.moveSpeed * deltaTime);
            this.node.setPosition(currentPos.add(moveStep));

            const scaleX = Math.abs(this.node.scale.x);
            this.node.setScale(direction.x > 0 ? scaleX : -scaleX, this.node.scale.y, this.node.scale.z);
        }
    }

    private updateAction(deltaTime: number) {
        this.waitingTimer -= deltaTime;
        if (this.waitingTimer <= 0) {
            this.onComplete?.();
            this.setState(CharacterState.IDLE);
        }
    }

    public moveTo(pos: Vec3, onComplete: () => void = null): void {
        const uiTransform = this.node.parent?.getComponent(UITransform);
        this.targetPosition = uiTransform.convertToNodeSpaceAR(v3(pos.x, pos.y, 0));

        this.isMoving = true;
        this.onComplete = onComplete;
        this.setState(CharacterState.MOVING);
    }

    public startAction(onComplete: () => void = null): void {
        this.isMoving = false;
        this.waitingTimer = this.waitingTimerMax;
        this.onComplete = onComplete;
        this.setState(CharacterState.DOING);
    }

    public setActionTime(value: number): void {
        this.waitingTimerMax = value;
    }

    private setState(newState: CharacterState) {
        if (this.currentState === newState) return;

        this.currentState = newState;

        switch (newState) {
            case CharacterState.IDLE:
                this.playAnimation(AnimName.IDLE);
                break;
            case CharacterState.MOVING:
                this.playAnimation(this.isMoving ? AnimName.WALK : AnimName.IDLE);
                break;
            case CharacterState.DOING:
                this.playAnimation(AnimName.DOING);
                break;
        }
    }

    private playAnimation(animName: string) {
        const animState = this.anim?.getState(animName);
        if (animState?.clip && !animState.isPlaying) {
            this.anim.play(animName);
        }
    }

    public getCurrentState(): CharacterState {
        return this.currentState;
    }
}