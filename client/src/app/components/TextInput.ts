import { waitFor } from '@play-co/astro';
import { Container, Rectangle } from 'pixi.js';
import { app } from '../utils/app';

export type InputHandler = (text: string) => void;
export type FocusHandler = (focus: boolean) => void;

export type TextInputOptions = {
    target: Container;
    value?: string;
    limit: number;
    size: number;
    focus?: boolean;
    align?: 'left' | 'center' | 'right';
    padding?: number;
    onUpdate: InputHandler;
    onSubmit?: InputHandler;
    onFocusChange?: FocusHandler;
};

/**
 * Creates text input dom over the given target pixi object. this is a bit of
 * a hack since no native canvas/webgl approach exists.
 */
export class TextInput {
    private readonly target: Container;
    private readonly limit: number;
    private readonly size: number;
    private readonly focus: boolean;
    private readonly align: 'left' | 'center' | 'right';
    private readonly padding: number;
    private readonly onUpdate: InputHandler;
    private readonly onSubmit?: InputHandler;
    private readonly onFocusChange?: FocusHandler;
    private input?: HTMLInputElement;
    private readonly resizeListener = () => this.onResized();
    private _value: string;
    private _isFocused = false;

    public get value(): string {
        return this.input?.value || '';
    }

    public set value(value: string) {
        if (!this.input) {
            return;
        }

        this.input.value = value;
    }

    public get isFocused(): boolean {
        return this._isFocused;
    }

    constructor(options: TextInputOptions) {
        this.target = options.target;
        this._value = options.value ?? '';
        this.limit = options.limit;
        this.size = options.size;
        this.focus = !!options.focus;
        this.align = options.align ?? 'left';
        this.padding = options.padding ?? 0;
        this.onUpdate = options.onUpdate;
        this.onSubmit = options.onSubmit;
        this.onFocusChange = options.onFocusChange;
    }

    public start() {
        this.spawnInput();
        this.updateInput();
    }

    public stop() {
        this.despawnInput();
    }

    private updateInput() {
        if (!this.input) return;
        const style = this.input.style;
        const bounds = this.getTargetBounds();
        style.left = toCssPixelValue(bounds.x);
        style.top = toCssPixelValue(bounds.y);
        style.width = toCssPixelValue(bounds.width);
        style.height = toCssPixelValue(bounds.height);
    }

    private onInput() {
        if (!this.input) return;
        this.onUpdate(this.input.value);
    }

    private async onResized() {
        await waitFor(100);
        this.updateInput();
    }

    private spawnInput() {
        // create text input element
        const input = (this.input = document.createElement('input'));
        input.type = 'text';
        input.value = this._value;
        input.autofocus = this.focus;
        input.maxLength = this.limit;
        const style = input.style;

        // get screen to canvas coordinates ratio
        const ratio = window.innerHeight / app().stagePlugin.renderer.screen.height;

        // set style
        style.position = 'absolute';
        style.zIndex = '99';
        style.fontSize = `${this.size * ratio}px`;
        style.color = '#000';
        style.backgroundColor = 'rgba(0,0,0,0)';
        style.borderWidth = '0px';
        style.outline = 'none';
        style.textAlign = this.align;

        // register events
        input.addEventListener('input', () => this.onInput());
        input.addEventListener('focus', () => {
            this._isFocused = true;
            this.onFocusChange?.(true);
        });
        input.addEventListener('blur', () => {
            this._isFocused = false;
            this.onFocusChange?.(false);
        });
        app().keyboard.bindKeyDown('Enter', () => {
            if (this.isFocused) {
                this.onSubmit?.(this.value);
            }
        });
        window.addEventListener('resize', this.resizeListener);

        // add to dom root
        document.body.appendChild(input);
    }

    private despawnInput() {
        if (!this.input) return;
        window.removeEventListener('resize', this.resizeListener);
        document.body.removeChild(this.input);
        this.input = undefined;
    }

    private getTargetBounds(): Rectangle {
        // get screen to canvas coordinates ratio
        const ratio = window.innerHeight / app().stagePlugin.renderer.screen.height;

        // get target bounds
        const bounds = this.target.getBounds();

        // calculate possible empty side spaces
        const emptyWidth = window.innerWidth - app().stagePlugin.renderer.screen.width * ratio;

        // return bounds adjusted by coordinate ratio
        return new Rectangle(
            bounds.x * ratio + emptyWidth / 2 + this.padding,
            bounds.y * ratio + this.padding,
            bounds.width * ratio - this.padding * 2,
            bounds.height * ratio - this.padding * 2,
        );
    }
}

function toCssPixelValue(value: number): string {
    return `${Math.round(value).toString()}px`;
}
