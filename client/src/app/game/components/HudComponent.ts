import { LayoutContainer } from '@pixi/layout/components';
import { type Component } from '@play-co/odie';
import { Container } from 'pixi.js';
import { HudNameLabel } from './hud/HudNameLabel';
import { HudResourceBar } from './hud/HudResourceBar';

export interface HudOptions {
    type: 'player';
    view: Container;
}

const width = 160;

export class HudComponent implements Component<HudOptions> {
    public static readonly NAME = 'hud';
    private container!: LayoutContainer;
    public healthBar!: HudResourceBar;
    public manaBar!: HudResourceBar;
    public nameLabel!: HudNameLabel;

    public init(opts: HudOptions) {
        const { view } = opts;
        this.container = view.addChild(
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

        this.healthBar = this.container.addChild(new HudResourceBar('health'));
        this.manaBar = this.container.addChild(new HudResourceBar('mana'));
        this.nameLabel = this.container.addChild(new HudNameLabel());
    }
}
