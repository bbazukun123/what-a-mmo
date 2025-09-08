import { createEntity, Entity3D, PhongMaterial, SphereGeometry, type Component } from '@play-co/odie';
import { getRandomColor } from '../../utils/misc';
import { worldSizeRatio } from '../defs/world';

const playerSize = 100;

export class PlayerViewComponent implements Component {
    public static readonly NAME = 'playerView';
    public view!: Entity3D;

    public init() {
        //
    }

    // TODO: Pass-in only the view def.
    public createView(id: string) {
        const color = getRandomColor(id);
        const radius = playerSize * 0.5 * worldSizeRatio;

        this.view = createEntity(Entity3D, {
            view3d: {
                geometry: new SphereGeometry(radius),
                material: new PhongMaterial({
                    color,
                    receiveShadows: false,
                }),
            },
            transform: {
                position: {
                    x: 0,
                    y: radius,
                    z: 0,
                },
            },
        } as unknown as any);

        this.view.c.view3d!.state.blend = true;

        return this.view;
    }
}
