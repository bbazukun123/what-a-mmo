import { QueriesObject, QueryResults, Time, Vector2, Vector3 } from '@play-co/odie';
import { Container } from 'pixi.js';
import { app } from '../../utils/app';
import { EyesComponent } from '../components/player/EyesComponent';
import { System } from '../defs/types';
import { PlayerEntityType } from '../entities/PlayerEntity';
import { GameScene } from '../GameScene';

type EyesSystemOptions = {
    stage: Container;
};

const inPos = new Vector3();
const outPos = new Vector2();

export class EyesSystem implements System<EyesSystemOptions, GameScene> {
    public static readonly NAME = 'eyesSystem';
    public static readonly Queries: QueriesObject = {
        players: {
            components: [EyesComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;
    private view = new Container();

    public init(opts: EyesSystemOptions) {
        opts.stage.addChild(this.view);
    }

    public addedToQuery(entity: PlayerEntityType) {
        const { view } = entity.c.eyes;
        this.view.addChild(view);
    }

    public removedFromQuery(entity: PlayerEntityType) {
        const { view } = entity.c.eyes;
        this.view.removeChild(view);
    }

    public update(time: Time) {
        this.queries.players!.forEach((entity: PlayerEntityType) => {
            const { eyes } = entity.c;
            eyes.eyes.setDirection(entity.rotation.y);
            eyes.eyes.update(time.deltaTime);
        });
    }

    public postrender() {
        this.queries.players!.forEach((entity: PlayerEntityType) => {
            this.mapOverlayViewToEntity(entity);
        });
    }

    private mapOverlayViewToEntity(entity: PlayerEntityType) {
        const view3d = this.scene.view3d;
        const { eyes } = entity.c;
        const { view } = eyes;
        if (view.visible) {
            const wt = entity.c.playerView.view.c.transform.worldTransform.elements;
            inPos.x = wt[12] ?? 0;
            inPos.y = wt[13] ?? 0;
            inPos.z = wt[14] ?? 0;
            view3d.cameraSystem.map2dFrom3d(outPos, inPos);
            view.x = outPos.x;
            view.y = app().resize.height - outPos.y;
        }
    }
}
