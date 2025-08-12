import { Character } from "./Character";

interface boundaryArray {
    height: number;
    width: number;
    position: {
        x: number,
        y: number
    }
}

export class MusicPositionEnteredDetect {
    public MusicPositionEnteredArray: number[][] = []
    public tileHeight: number = 16
    public tileWidth: number = 16
    public boundaryArray: boundaryArray[] = []
    private scaleFactor: number = 3;
    public isUserEnteredZone: boolean = false
    public offsetX: number = 20;
    public offsetY: number = -200;


    constructor(MusicPositionEnteredArray: number[][]) {
        this.MusicPositionEnteredArray = MusicPositionEnteredArray
        this.createBoundaryArray()
    }

    createBoundaryArray() {
        this.MusicPositionEnteredArray.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile === 555) {

                    const baseX = j * this.tileWidth;
                    const baseY = i * this.tileHeight;

                    let finalX = baseX;
                    let finalY = baseY;

                    if (this.offsetX && this.offsetY) {
                        finalX += this.offsetX / this.scaleFactor;
                        finalY += this.offsetY / this.scaleFactor;
                    }

                    this.boundaryArray.push({
                        height: this.tileHeight * this.scaleFactor,
                        width: this.tileWidth * this.scaleFactor,
                        position: {
                            x: finalX * this.scaleFactor,
                            y: finalY * this.scaleFactor
                        }
                    })
                }
            })
        })
        this.getBoundaryArray()
    }

    getBoundaryArray() {
        if (this.boundaryArray.length > 0) {
            console.log(this.boundaryArray)
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        const text = 'Music Player';
        this.boundaryArray.forEach((arr) => {
            
            ctx.font = 'bold 14px Arial';
            const textWidth = ctx.measureText(text).width;
            const textHeight = 14;
            const padding = 6;
    
            
            const bgX = arr.position.x + arr.width / 2 - textWidth / 2 - padding;
            const bgY = arr.position.y + arr.height / 2 - textHeight / 2 - padding;
            const bgWidth = textWidth + padding * 2;
            const bgHeight = textHeight + padding * 2;
    
            
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 6);
            } else {
                // Fallback for older browsers
                const radius = 6;
                ctx.moveTo(bgX + radius, bgY);
                ctx.lineTo(bgX + bgWidth - radius, bgY);
                ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius);
                ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius);
                ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight);
                ctx.lineTo(bgX + radius, bgY + bgHeight);
                ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius);
                ctx.lineTo(bgX, bgY + radius);
                ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
            }
    
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fill();
    
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, arr.position.x + arr.width / 2, arr.position.y + arr.height / 2);
        });
    }

    detectMusicZone(character: Character): boolean {

        const charLeft = character.worldX;
        const charRight = character.worldX + character.width;
        const charTop = character.worldY;
        const charBottom = character.worldY + character.height;


        return this.boundaryArray.some(boundary => {
            const boundaryLeft = boundary.position.x;
            const boundaryRight = boundary.position.x + boundary.width;
            const boundaryTop = boundary.position.y;
            const boundaryBottom = boundary.position.y + boundary.height;


            return charLeft < boundaryRight &&
                charRight > boundaryLeft &&
                charTop < boundaryBottom &&
                charBottom > boundaryTop;
        });
    }
}