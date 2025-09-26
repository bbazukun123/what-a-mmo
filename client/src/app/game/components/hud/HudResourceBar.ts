import { LayoutContainer } from '@pixi/layout/components';

type ResourceType = 'health' | 'mana' | 'monsterHealth';

const height = 15;
const colorMap: Record<ResourceType, number> = {
    monsterHealth: 0xff0000,
    health: 0x00ff00,
    mana: 0x0000ff,
};

export class HudResourceBar extends LayoutContainer {
    private fill: LayoutContainer;

    constructor(type: ResourceType) {
        super({
            layout: {
                width: '100%',
                height,
                backgroundColor: 0x000000,
            },
        });

        this.fill = this.addChild(
            new LayoutContainer({
                layout: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: colorMap[type],
                },
            }),
        );

        // Create border
        this.addChild(
            new LayoutContainer({
                layout: {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderColor: 0x000000,
                    borderWidth: 2,
                },
            }),
        );
    }

    public setRatio(ratio: number) {
        this.fill.layout = {
            width: `${ratio * 100}%`,
        };
    }
}
