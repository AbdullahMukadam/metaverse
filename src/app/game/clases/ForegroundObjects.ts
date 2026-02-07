

export class ForegroundObjects {
    public image: HTMLImageElement
    public isLoaded: boolean = false
    public screenWidth: number = 0
    public screenHeight: number = 0
    public scale: number = 3; // 3x zoom
    

    constructor(viewPort: { width: number, height: number }) {
        this.image = new Image()
        this.screenHeight = viewPort.height
        this.screenWidth = viewPort.width
    }

    async load(path: string) {
        this.image = new Image();
        return new Promise<void>((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true;
                resolve();
            }
            this.image.onerror = () => {
                reject(new Error('Failed to load foreground image'));
            }
            this.image.src = path;
        })
    }

    draw(ctx: CanvasRenderingContext2D, cameraX: number = 0, cameraY: number = 0) {
        if (!this.isLoaded) return

        // Draw foreground at origin (canvas is already translated)
        ctx.drawImage(this.image, 0, 0);
    }
}