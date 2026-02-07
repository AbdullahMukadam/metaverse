export class GameMap {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement;
    public isLoaded: boolean = false;
    public offsetX: number = 0;
    public offsetY: number = 0;
    public screenWidth: number = 0
    public screenHeight: number = 0
    public scale: number = 3; // 3x zoom (requested update)

    constructor(canvas: HTMLCanvasElement, viewPort: { width: number, height: number }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.image = new Image();
        this.screenWidth = viewPort.width
        this.screenHeight = viewPort.height
    }

    async load(ImagePath: string) {
        this.image = new Image();
        return new Promise<void>((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true;
                resolve()
            }
            this.image.onerror = () => {
                reject(new Error('Failed to load map image'));
            }
            this.image.src = ImagePath
        })
    }

    draw(playerX: number = 0, playerY: number = 0) {
        if (!this.isLoaded) return;

        // Calculate camera position to center player on screen
        const cameraX = playerX - (this.screenWidth / 2) / this.scale;
        const cameraY = playerY - (this.screenHeight / 2) / this.scale;

        // Store camera offset for other objects to use
        this.offsetX = cameraX;
        this.offsetY = cameraY;

        // Draw the map at origin (canvas is already translated)
        this.ctx.drawImage(this.image, 0, 0);
    }


}