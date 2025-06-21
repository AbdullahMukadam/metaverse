// app/game/classes/Character.ts
export class Character {
    private image: HTMLImageElement;
    private isLoaded: boolean = false;

    constructor(
        public x: number = -360,
        public y: number = -410,
        public width: number = 900,
        public height: number = 160,
        private spritePath: string = '/characters/female/walk_Down.png'
    ) {
        this.image = new Image();
    }

    async load() {
        return new Promise<void>((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true;
                resolve();
            };
            this.image.onerror = () => {
                reject(new Error('Failed to load character image'));
            };
            this.image.src = this.spritePath;
        });
    }

    draw(ctx: CanvasRenderingContext2D, viewport: { width: number, height: number }) {
        if (!this.isLoaded) return;

        // Draw character centered on screen (viewport coordinates)
        const screenX = viewport.width / 2 - this.width / 4;
        const screenY = viewport.height / 2 - this.height;

        ctx.drawImage(
            this.image,
            screenX,
            screenY,
            this.width,
            this.height
        );
    }
}