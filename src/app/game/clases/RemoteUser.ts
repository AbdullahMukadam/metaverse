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
    public isActive: boolean = true

    public newWidthforHouse?: number;
    public newHeightforHouse?: number;


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
        userName: string,
        newWidth?: number,
        newHeigth?: number
    ) {
        this.worldX = xPosition;
        this.worldY = yPosition;
        this.selectedCharacter = selectedCharacter;
        this.userId = userId;
        this.userName = userName
        this.newWidthforHouse = newWidth;
        this.newHeightforHouse = newHeigth

        this.sprites = {
            up: new Image(),
            down: new Image(),
            left: new Image(),
            right: new Image()
        };
        this.currentSprite = this.sprites.down;

        if (selectedCharacter === "Male") {
            if (newWidth && newHeigth) {
                this.width = newWidth
                this.height = newHeigth
            } else {
                this.width = 16; // Reduced from 23
                this.height = 20; // Reduced from 27
            }
            this.totalFrames = 4;
            this.animationSpeed = 20;
        } else {
            if (newWidth && newHeigth) {
                this.width = newWidth
                this.height = newHeigth
            } else {
                this.width = 28; // Reduced from 23
                this.height = 28; // Reduced from 27
            }
            this.totalFrames = 4;
            this.animationSpeed = 20;
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
                this.sprites.up.src = `${basePath}/femaleTopNew.png`;
                this.sprites.down.src = `${basePath}/femaleBottomnew.png`;
                this.sprites.left.src = `${basePath}/femaleLeftnew.png`;
                this.sprites.right.src = `${basePath}/femaleRightnew.png`;
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
            ctx.fillStyle = 'red';
            ctx.fillRect(
                this.worldX - this.width / 2,
                this.worldY - this.height / 2,
                this.width,
                this.height
            );
            return;
        }

        try {
            const frameWidth = this.currentSprite.width / this.totalFrames;
            const frameHeight = this.currentSprite.height;
            const displayName =
                this.userName.split(' ')[0] || this.userName;


            const FONT_SIZE = 8;
            const PADDING_X = 4;
            const PADDING_Y = 2;
            const RADIUS = 4;

            ctx.font = `bold ${FONT_SIZE}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const metrics = ctx.measureText(displayName);
            const textWidth = metrics.width;
            const textHeight =
                metrics.actualBoundingBoxAscent +
                metrics.actualBoundingBoxDescent;

            const bgWidth = textWidth + PADDING_X * 2;
            const bgHeight = textHeight + PADDING_Y * 2;

            const bgX = this.worldX - bgWidth / 2;
            const bgY =
                this.worldY -
                this.height / 2 -
                bgHeight -
                6; // spacing above character

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(bgX, bgY, bgWidth, bgHeight, RADIUS);
            } else {
                const r = RADIUS;
                ctx.moveTo(bgX + r, bgY);
                ctx.lineTo(bgX + bgWidth - r, bgY);
                ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + r);
                ctx.lineTo(bgX + bgWidth, bgY + bgHeight - r);
                ctx.quadraticCurveTo(
                    bgX + bgWidth,
                    bgY + bgHeight,
                    bgX + bgWidth - r,
                    bgY + bgHeight
                );
                ctx.lineTo(bgX + r, bgY + bgHeight);
                ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - r);
                ctx.lineTo(bgX, bgY + r);
                ctx.quadraticCurveTo(bgX, bgY, bgX + r, bgY);
            }

            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fill();

            // Text (perfect vertical centering)
            ctx.fillStyle = '#fff';
            ctx.fillText(
                displayName,
                this.worldX,
                bgY + bgHeight / 2
            );

            /* ================= SPRITE ================= */

            ctx.drawImage(
                this.currentSprite,
                this.currentFrame * frameWidth,
                0,
                frameWidth,
                frameHeight,
                this.worldX - this.width / 2,
                this.worldY - this.height / 2,
                this.width,
                this.height
            );

            /* ================= DEBUG HITBOX ================= */

            // ctx.strokeStyle = 'lime';
            // ctx.lineWidth = 2;
            // ctx.strokeRect(
            //     this.worldX - this.width / 2,
            //     this.worldY - this.height / 2,
            //     this.width,
            //     this.height
            // );
        } catch (error) {
            console.error('Error drawing character:', error);
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.worldX, this.worldY, this.width, this.height);
        }
    }
}