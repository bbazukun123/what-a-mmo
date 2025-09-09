import { LayoutContainer } from '@pixi/layout/components';
import { PlayerClass } from '../../module_bindings';

type CreationClassCardOptions = {
    playerClass: PlayerClass;
};

export class CreationClassCard extends LayoutContainer {
    constructor(opts: CreationClassCardOptions) {
        super({
            layout: {
                width: 200,
                height: 300,
                marginInline: 25,
                backgroundColor: 0x0000ff,
            },
        });
    }
}
