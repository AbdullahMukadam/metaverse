import { Character } from "./Character";

interface boundaryArray {
    height: number;
    width: number;
    position: {
        x: number,
        y: number
    }
}

export class roomLeaveDetect {
    public roomLeaveDetectArray: number[][] = []
    public tileHeight: number = 16
    public tileWidth: number = 16
    public boundaryArray: boundaryArray[] = []
    private scaleFactor: number = 3;
    public isUserEnteredZone: boolean = false
    public offsetX: number = 20;
    public offsetY: number = -200;


    constructor(roomLeaveDetectArray: number[][]) {
        this.roomLeaveDetectArray = roomLeaveDetectArray
        this.createBoundaryArray()
    }

    createBoundaryArray() {
        this.roomLeaveDetectArray.forEach((row, i) => {
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
        ctx.fillStyle = "rgba(255,0,0,0.8)"
        this.boundaryArray.forEach((arr) => {
            ctx.fillRect(arr.position.x, arr.position.y, arr.width, arr.height)
        })

    }

    switchbetweenScenes(frameId: number) {
        this.isUserEnteredZone = true
        cancelAnimationFrame(frameId)
    }

    detectRoomLeaveZone(character: Character): boolean {

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