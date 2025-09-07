import { LayoutContainer } from '@pixi/layout/components';
import { type Component } from '@play-co/odie';
import { Container } from 'pixi.js';
import { HudNameLabel } from './hud/HudNameLabel';
import { HudResourceBar } from './hud/HudResourceBar';

export interface HudOptions {
    type: 'player';
}

const width = 160;

export class HudComponent implements Component<HudOptions> {
    public static readonly NAME = 'hud';
    public view = new Container();
    public healthBar!: HudResourceBar;
    public manaBar!: HudResourceBar;
    public nameLabel!: HudNameLabel;

    public init() {
        const container = this.view.addChild(
            new LayoutContainer({
                layout: {
                    width,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                x: -width / 2,
                y: 90,
            }),
        );

        this.healthBar = container.addChild(new HudResourceBar('health'));
        this.manaBar = container.addChild(new HudResourceBar('mana'));
        this.nameLabel = container.addChild(new HudNameLabel());
    }
}
