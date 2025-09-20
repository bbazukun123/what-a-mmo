import { LayoutContainer } from '@pixi/layout/components';
import { Text } from 'pixi.js';
import { PlayerClass } from '../../module_bindings';

type CreationClassCardOptions = {
    playerClass: PlayerClass;
    onSelect: () => void;
};

export class CreationClassCard extends LayoutContainer {
    public readonly playerClass: PlayerClass;
    private nameLabel: Text;

    constructor(opts: CreationClassCardOptions) {
        const { playerClass } = opts;
        super({
            cursor: 'pointer',
            interactive: true,
            layout: {
                flexGrow: 1,
                height: 500,
                marginInline: 15,
                backgroundColor: 0xffffff,
            },
        });

        this.playerClass = playerClass;

        this.nameLabel = this.addChild(
            new Text({
                text: playerClass,
                style: {
                    fontSize: 36,
                    fontWeight: 'bold',
                    fill: 0xffffff,
                },
            }),
        );
        this.nameLabel.layout = {
            position: 'absolute',
            left: 20,
            bottom: 20,
            alignSelf: 'center',
        };

        this.onclick = () => {
            opts.onSelect();
        };
    }

    public setSelected(selected: boolean) {
        this.background.tint = selected ? 0x00ffff : 0x0000ff;
        this.interactive = !selected;
    }
}
