import { UserMovementData } from "@/utils/Socket";

export class RemoteUser {
    public worldX: number;
    public worldY: number;
    public width: number;
    public height: number;
    public selectedCharacter: string;
    public userId: string;
    public isLoaded: boolean = false;
    public userName: string;


    private currentFrame: number = 0;
    private frameCount: number = 0;
    private animationSpeed: number;
    private totalFrames: number;
    public direction: 'up' | 'down' | 'left' | 'right' = 'down';
    public isMoving: boolean = false;
    public lastUpdate: number = 0;


    private sprites: Record<'up' | 'down' | 'left' | 'right', HTMLImageElement>;
    private currentSprite: HTMLImageElement;

    constructor(
        xPosition: number,
        yPosition: number,
        selectedCharacter: string,
        userId: string,
        userName: string
    ) {
        this.worldX = xPosition;
        this.worldY = yPosition;
        this.selectedCharacter = selectedCharacter;
        this.userId = userId;
        this.userName = userName

        this.sprites = {
            up: new Image(),
            down: new Image(),
            left: new Image(),
            right: new Image()
        };
        this.currentSprite = this.sprites.down;

        if (selectedCharacter === "Male") {
            this.width = 23;
            this.height = 27;
            this.totalFrames = 4;
            this.animationSpeed = 20;
        } else {
            this.width = 27;
            this.height = 32;
            this.totalFrames = 8;
            this.animationSpeed = 8;
        }
    }

    async load(): Promise<void> {
        const isMale = this.selectedCharacter === "Male";
        const basePath = `/characters/${isMale ? 'male' : 'female'}`;

        return new Promise<void>((resolve, reject) => {
            let loadedCount = 0;
            const totalSprites = 4;

            const checkLoaded = () => {
                loadedCount++;
                if (loadedCount === totalSprites) {
                    this.isLoaded = true;
                    resolve();
                }
            };

            if (isMale) {
                this.sprites.up.src = `${basePath}/playerUp.png`;
                this.sprites.down.src = `${basePath}/playerDown.png`;
                this.sprites.left.src = `${basePath}/playerLeft.png`;
                this.sprites.right.src = `${basePath}/playerRight.png`;
            } else {
                this.sprites.up.src = `${basePath}/femalePlayerUp1.png`;
                this.sprites.down.src = `${basePath}/femalePlayerDown1.png`;
                this.sprites.left.src = `${basePath}/femalePlayerLeft1.png`;
                this.sprites.right.src = `${basePath}/femalePlayerRight1.png`;
            }

            this.sprites.up.onload = checkLoaded;
            this.sprites.up.onerror = reject;

            this.sprites.down.onload = checkLoaded;
            this.sprites.down.onerror = reject;

            this.sprites.left.onload = checkLoaded;
            this.sprites.left.onerror = reject;

            this.sprites.right.onload = checkLoaded;
            this.sprites.right.onerror = reject;
        });
    }

    updateFromNetwork(data: UserMovementData) {
        this.worldX = data.positions.X;
        this.worldY = data.positions.Y;
        this.direction = data.direction;
        this.isMoving = data.isMoving;
        this.lastUpdate = Date.now();

        this.currentSprite = this.sprites[this.direction];

        if (this.isMoving) {
            this.updateAnimation();
        } else {
            this.currentFrame = 0;
            this.frameCount = 0;
        }
    }

    update() {
        if (this.isMoving) {
            this.updateAnimation();
        } else {
            this.currentFrame = 0;
            this.frameCount = 0;
        }
    }

    private updateAnimation() {
        this.frameCount++;
        if (this.frameCount % this.animationSpeed === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        }
    }

    updatePosition(x: number, y: number): void {
        this.worldX = x;
        this.worldY = y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isLoaded) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(this.worldX, this.worldY, this.width, this.height);
            return;
        }

        const frameWidth = this.currentSprite.width / this.totalFrames;
        const frameHeight = this.currentSprite.height;
        const displayName = this.userName.split(" ")[0] || this.userName

        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.fillText(displayName, this.worldX + this.width / 2, this.worldY - 5);

        ctx.drawImage(
            this.currentSprite,
            this.currentFrame * frameWidth,
            0,
            frameWidth,
            frameHeight,
            this.worldX,
            this.worldY,
            this.width,
            this.height
        );
    }
}