import { type Component } from '@play-co/odie';
import { Container } from 'pixi.js';
import { AnimatingEyes2D } from './AnimatingEyes2D';

export class EyesComponent implements Component {
    public static readonly NAME = 'eyes';
    public view = new Container();
    public eyes!: AnimatingEyes2D;

    public init() {
        this.eyes = this.view.addChild(
            new AnimatingEyes2D({
                width: 15,
                height: 30,
                gap: 35,
                color: 0x222222,
                blinkDuration: 0.5,
                blinkInterval: 3,
            }),
        );
    }
}
