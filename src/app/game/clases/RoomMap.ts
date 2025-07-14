
export class RoomMap {
    public image: HTMLImageElement;
    public isLoaded: boolean = false;
    public offsetX: number = 20;
    public offsetY: number = -200;
    public screenWidth: number = 0
    public screenHeight: number = 0;
    public canvas: HTMLCanvasElement

    constructor(viewPort: { width: number, height: number }, canvas: HTMLCanvasElement) {
        this.image = new Image()
        this.screenWidth = viewPort.width
        this.screenHeight = viewPort.height
        this.canvas = canvas
        
    }

    async load(ImageUrl: string) {
        this.image = new Image()
        return new Promise<void>((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true
                resolve()
            }
            this.image.onerror = () => {
                reject(new Error("An Error Occured in loading the Room Map"))
            }
            this.image.src = ImageUrl
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isLoaded) return;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.drawImage(
            this.image,
            this.offsetX,
            this.offsetY,
            this.image.width,
            this.image.height
        )
    }
}