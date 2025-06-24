import { Character } from "./Character";

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


    constructor(collisionArray: number[][]) {
        this.collisionArray = collisionArray
        this.createBoundaryArray()
    }

    createBoundaryArray() {
        this.collisionArray.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile === 1025) {
                    this.boundaryArray.push({
                        height: this.tileHeight * this.scaleFactor,
                        width: this.tileWidth * this.scaleFactor,
                        position: {
                            x: j * this.tileWidth * this.scaleFactor,
                            y: i * this.tileHeight * this.scaleFactor
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
        ctx.fillStyle = "rgba(255,0,0,0.0)"
        this.boundaryArray.forEach((arr) => {
            ctx.fillRect(arr.position.x, arr.position.y, arr.width, arr.height)
        })

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
}