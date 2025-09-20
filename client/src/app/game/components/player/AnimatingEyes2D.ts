import { Container, Graphics } from 'pixi.js';

type AnimatingEyes2DOptions = {
    width: number;
    height: number;
    gap: number;
    color: number;
    blinkDuration: number;
    blinkInterval: number;
};

export class AnimatingEyes2D extends Container {
    private leftEye: Graphics;
    private rightEye: Graphics;
    private opts: AnimatingEyes2DOptions;
    private type: 'circle' | 'square' = 'circle';
    private direction = 0;
    private tick = 0;

    constructor(options: AnimatingEyes2DOptions) {
        super({ y: -10 });

        this.opts = options;
        const { width, height, color } = options;

        this.leftEye = this.addChild(new Graphics().ellipse(0, 0, width * 0.5, height * 0.5).fill(color));
        this.rightEye = this.addChild(new Graphics().ellipse(0, 0, width * 0.5, height * 0.5).fill(color));
    }

    public setType(value: 'circle' | 'square') {
        this.type = value;
        this.setDirection(this.direction);
    }

    public setDirection(value: number) {
        this.visible = true;
        this.direction = value;

        const { width, height } = this.opts;
        const isCircular = this.type === 'circle';
        let { gap } = this.opts;
        let offsetX = 0;
        let offsetYLeft = 0;
        let offsetYRight = 0;
        let visible = true;

        switch (value) {
            // Down
            case 0: {
                if (!isCircular) {
                    offsetYLeft = height * 1.2;
                    offsetYRight = height * 1.2;
                }
                break;
            }
            // Down-right
            case Math.PI / 4:
                gap *= 0.85;
                offsetX = width * (isCircular ? 1.5 : 3.5);
                offsetYRight = isCircular ? -height * 0.1 : height * 0.5;
                if (!isCircular) offsetYLeft = height * 1;
                break;
            // Right
            case Math.PI / 2:
                if (!isCircular) {
                    visible = false;
                    break;
                }
                gap *= 0.75;
                offsetX = width * 2.5;
                offsetYRight = -height * 0.15;
                break;
            // Down-left
            case -Math.PI / 4:
                gap *= 0.85;
                offsetX = -width * (isCircular ? 1.5 : 3.5);
                if (!isCircular) offsetYRight = height * 1;
                offsetYLeft = isCircular ? -height * 0.1 : height * 0.5;
                break;
            // Left
            case -Math.PI / 2:
                if (!isCircular) {
                    visible = false;
                    break;
                }
                gap *= 0.75;
                offsetX = -width * 2.5;
                offsetYLeft = -height * 0.15;
                break;
            // Rest
            default:
                visible = false;
                break;
        }

        this.leftEye.x = offsetX - gap * 0.5;
        this.leftEye.y = offsetYLeft;
        this.rightEye.x = offsetX + gap * 0.5;
        this.rightEye.y = offsetYRight;
        this.visible = visible;
    }

    public update(dt: number) {
        const sDt = dt * 0.001;
        const { height, blinkDuration, blinkInterval } = this.opts;
        const cycleDuration = blinkInterval + blinkDuration;

        this.tick += sDt;
        this.tick %= cycleDuration;

        const ratio = Math.min(this.tick / blinkDuration, 1);
        const scale = Math.cos(ratio * Math.PI * 2) * 0.5 + 0.5;

        this.leftEye.height = height * scale;
        this.rightEye.height = height * scale;
    }
}
