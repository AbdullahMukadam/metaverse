import { Character } from "./Character";
import { RoomMap } from "./RoomMap";

interface boundaryArray {
    height: number;
    width: number;
    position: {
        x: number,
        y: number
    }
}

export class Collision {
    public collisionArray: number[][] = []
    public tileHeight: number = 12
    public tileWidth: number = 12
    public boundaryArray: boundaryArray[] = []
    private scaleFactor: number = 1.5;
    public tilevalue: number = 1025;
    private roomMap?: RoomMap;

    constructor(collisionArray: number[][], tileValue: number, roomMap?: RoomMap) {
        this.collisionArray = collisionArray
        this.tilevalue = tileValue
        this.roomMap = roomMap;

        // Create boundary array based on whether roomMap exists
        this.createBoundaryArray();
    }

    createBoundaryArray() {
        // Clear existing boundaries
        this.boundaryArray = [];
        this.scaleFactor = this.roomMap ? 3 : 1.5;
        this.tileHeight = this.roomMap ? 16 : 12;
        this.tileWidth = this.roomMap ? 16 : 12;

        this.collisionArray.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile === this.tilevalue) {
                    // Base position calculation
                    const baseX = j * this.tileWidth;
                    const baseY = i * this.tileHeight;

                    // const finalX = this.roomMap ? baseX + this.roomMap.offsetX : baseX;
                    // const finalY = this.roomMap ? baseY + this.roomMap.offsetY : baseY;
                    //console.log(finalX, finalY)

                    // Apply room map offset if available

                    let finalX = baseX;
                    let finalY = baseY;

                    if (this.roomMap) {
                        finalX += this.roomMap.offsetX / this.scaleFactor;
                        finalY += this.roomMap.offsetY / this.scaleFactor;
                    }

                    this.boundaryArray.push({
                        height: this.tileHeight * this.scaleFactor,
                        width: this.tileWidth * this.scaleFactor,
                        position: {
                            x: finalX * this.scaleFactor,
                            y: finalY * this.scaleFactor
                        }
                    });
                }
            });
        });

        this.getBoundaryArray();
    }

    getBoundaryArray() {
        console.log("boundary array for room", this.boundaryArray)
        if (this.boundaryArray.length > 0) {
            console.log("Boundary array:", this.boundaryArray);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.roomMap) {
            console.log("room collisions running")
        }
        ctx.fillStyle = "rgba(255,0,0,0)";
        this.boundaryArray.forEach((boundary) => {
            ctx.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height);
        });
    }

    detectCollision(character: Character): boolean {
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

    // Method to update boundaries if room map offset changes
    updateBoundariesForOffset() {
        this.createBoundaryArray();
    }
}