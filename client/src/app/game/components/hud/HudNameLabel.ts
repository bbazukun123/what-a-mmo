import { LayoutContainer } from '@pixi/layout/components';
import { Text } from 'pixi.js';

export class HudNameLabel extends LayoutContainer {
    private nameLabel: Text;

    constructor() {
        const nameLabel = new Text({
            text: '[NAME]',
            style: {
                fontSize: 27,
                fontWeight: 'bold',
                fill: '#ffffff',
                stroke: {
                    color: 0x000000,
                    width: 4,
                    join: 'round',
                },
            },
        });

        super({
            layout: {
                width: '100%',
                height: nameLabel.height + 10,
                justifyContent: 'center',
                alignItems: 'center',
            },
        });

        this.nameLabel = this.addChild(nameLabel);
        this.nameLabel.layout = {
            alignSelf: 'center',
        };
    }

    public setName(name: string) {
        this.nameLabel.text = name;
    }
}
