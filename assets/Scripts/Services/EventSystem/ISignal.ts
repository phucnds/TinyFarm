export interface ISignal<T = void> {
    on(handler: (data?: T) => void, thisArg: any): void;
    off(handler: (data?: T) => void): void;
}