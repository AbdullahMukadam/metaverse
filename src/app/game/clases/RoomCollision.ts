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

// Dedicated collision class for Room Map (1:1 coordinates, no zoom)
export class RoomCollision {
    public collisionArray: number[][] = []
    public tileHeight: number = 16  // Room tiles are 16px
    public tileWidth: number = 16
    public boundaryArray: boundaryArray[] = []
    public tilevalue: number = 555;  // Room uses tile value 555
    private scaleFactor: number = 3;
    private roomMap?: RoomMap;


    constructor(collisionArray: number[][], tileValue: number = 555, roomMap: RoomMap) {
        this.collisionArray = collisionArray
        this.tilevalue = tileValue
        this.roomMap = roomMap
        this.createBoundaryArray();
    }

    createBoundaryArray() {
        this.boundaryArray = [];

        // Room uses 16px tiles at 1:1 scale (no zoom)
        this.tileWidth = 16;
        this.tileHeight = 16;

        this.collisionArray.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile === this.tilevalue) {
                    // Position in pure world coordinates (no scaling needed)
                    const x = j * this.tileWidth;
                    const y = i * this.tileHeight;
                    let finalX = x;
                    let finalY = y;

                   if(this.roomMap){
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

        console.log(`RoomCollision: Created ${this.boundaryArray.length} boundaries`);
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw collision boundaries for debugging (bright red boxes with crosshairs)

        ctx.fillStyle = "rgba(255,0,0,0)";
        this.boundaryArray.forEach((boundary) => {
            ctx.fillRect(boundary.position.x, boundary.position.y, boundary.width, boundary.height);
        });
    }

    detectCollision(character: Character): boolean {
        // Character collision box (centered)
        const charLeft = character.worldX - character.width / 2;
        const charRight = character.worldX + character.width / 2;
        const charTop = character.worldY - character.height / 2;
        const charBottom = character.worldY + character.height / 2;

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
