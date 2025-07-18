import { RoomMap } from "./RoomMap";

export class RoomForeground {
    public image: HTMLImageElement;
    public isLoaded: boolean = false;
    public offsetX: number = 20;
    public offsetY: number = -200;
    public roomMap: RoomMap;
    public scaleFactor: number = 3; 

    constructor(viewPort: { width: number, height: number }, roomMap: RoomMap) {
        this.image = new Image();
        this.roomMap = roomMap; 
    }

    async load(path: string) {
        this.image = new Image();
        return new Promise<void>((resolve, reject) => {
            this.image.onload = () => {
                this.isLoaded = true;
                resolve();
            };
            this.image.onerror = () => {
                reject(new Error('Failed to load room foreground image'));
            };
            this.image.src = path;
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isLoaded || !this.roomMap) return;

        ctx.save();
        
        
        ctx.scale(this.scaleFactor, this.scaleFactor);
        
        
        const drawX = this.roomMap.offsetX / this.scaleFactor;
        const drawY = this.roomMap.offsetY / this.scaleFactor;

        ctx.drawImage(
            this.image,
            drawX,
            drawY,
            this.image.width / this.scaleFactor,
            this.image.height / this.scaleFactor
        );

        ctx.restore();

        
    }

   
}