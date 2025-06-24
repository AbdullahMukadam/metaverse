
export class ForegroundObjects {
    public image: HTMLImageElement
    public isLoaded: boolean = false
    public screenWidth: number = 0
    public screenHeight: number = 0

    constructor(viewPort: { width: number, height: number }) {
        this.image = new Image()
        this.screenHeight = viewPort.height
        this.screenWidth = viewPort.width
    }

    async load(path: string) {
        return new Promise<void>((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true
                resolve()
            }
            this.image.onerror = () => {
                reject(new Error('Failed to load foreground image'));
            }
            this.image.src = path
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isLoaded) return

        ctx.drawImage(
            this.image,
            0,
            0,
            this.screenWidth,
            this.screenHeight
        )
    }
}