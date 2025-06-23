export class InputHandler {
    public keys: { [key: string]: boolean };

    constructor() {
        this.keys = {};
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    private handleKeyDown(e: KeyboardEvent) {
        this.keys[e.key] = true;
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.keys[e.key] = false;
    }
}