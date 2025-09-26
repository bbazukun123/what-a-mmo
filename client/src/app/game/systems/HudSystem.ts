import { QueriesObject, QueryResults, Vector2, Vector3 } from '@play-co/odie';
import { Container } from 'pixi.js';
import { app } from '../../utils/app';
import { HudComponent } from '../components/hud/HudComponent';
import { System } from '../defs/types';
import { PlayerEntityType } from '../entities/PlayerEntity';
import { GameScene } from '../GameScene';

type HudSystemOptions = {
    stage: Container;
};

const inPos = new Vector3();
const outPos = new Vector2();

export class HudSystem implements System<HudSystemOptions, GameScene> {
    public static readonly NAME = 'hudSystem';
    public static readonly Queries: QueriesObject = {
        players: {
            components: [HudComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;
    private view = new Container();

    public init(opts: HudSystemOptions) {
        opts.stage.addChild(this.view);
    }

    public addedToQuery(entity: PlayerEntityType) {
        const { view } = entity.c.hud;
        this.view.addChild(view);
    }

    public removedFromQuery(entity: PlayerEntityType) {
        const { view } = entity.c.hud;
        this.view.removeChild(view);
    }

    public update() {
        this.queries.players!.forEach((entity: PlayerEntityType) => {
            const { player, hud } = entity.c;

            hud.nameLabel.setName(player.data.name ?? 'Creating...');
            hud.healthBar.visible = player.isSelf;
            hud.manaBar.visible = player.isSelf;

            // TODO: Handle resource bars
        });
    }

    public postrender() {
        this.queries.players!.forEach((entity: PlayerEntityType) => {
            this.mapOverlayViewToEntity(entity);
        });
    }

    private mapOverlayViewToEntity(entity: PlayerEntityType) {
        const view3d = this.scene.view3d;
        const { hud } = entity.c;
        const { view } = hud;
        if (view.visible) {
            const wt = entity.c.transform.worldTransform.elements;
            inPos.x = wt[12] ?? 0;
            inPos.y = wt[13] ?? 0;
            inPos.z = wt[14] ?? 0;
            view3d.cameraSystem.map2dFrom3d(outPos, inPos);
            view.x = outPos.x;
            view.y = app().resize.height - outPos.y;
        }
    }
}
