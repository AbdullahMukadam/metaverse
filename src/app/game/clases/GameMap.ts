

export class GameMap {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private image: HTMLImageElement;
    private isLoaded: boolean = false;
    public offsetX: number = 360;
    public offsetY: number = 410;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.image = new Image();
    }

    async load(ImagePath: string) {
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

    draw() {
        if (!this.isLoaded) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(
            this.image,
            -this.offsetX,
            -this.offsetY,
        )
    }

    centerOn(x: number, y: number) {
        // Calculate new offsets to center the view on (x,y)
        this.offsetX = x - this.canvas.width / 2;
        this.offsetY = y - this.canvas.height / 2;

        // Boundary checks to prevent showing outside the map
        this.offsetX = Math.max(0, Math.min(this.offsetX, this.image.width - this.canvas.width));
        this.offsetY = Math.max(0, Math.min(this.offsetY, this.image.height - this.canvas.height));
    }
}