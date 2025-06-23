

export class GameMap {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement;
    private isLoaded: boolean = false;
    public offsetX: number = 0;
    public offsetY: number = 0;
    public screenWidth: number = 0
    public screenHeight: number = 0

    constructor(canvas: HTMLCanvasElement, viewPort: { width: number, height: number }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.image = new Image();
        this.screenWidth = viewPort.width
        this.screenHeight = viewPort.height
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
            this.offsetX,
            this.offsetY,
            this.screenWidth,
            this.screenHeight
        )
    }


}