import {
    CameraEntity,
    CameraSystem,
    createEntity,
    Entity3D,
    lerp,
    PROJECTION_TYPE,
    QueriesObject,
    QueryResults,
    System,
    Vector3,
    View3DComponent,
} from '@play-co/odie';
import { GameScene } from '../GameScene';
import { PlayerComponent } from '../components/PlayerComponent';

export class CameraControllerSystem implements System<void, GameScene> {
    public static readonly NAME = 'cameraControllerSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [PlayerComponent, View3DComponent],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: GameScene;

    private camera!: CameraEntity;
    private offset: Vector3 = new Vector3(0, 100, 120);
    private target: Entity3D | undefined;

    public start() {
        this.camera = createEntity(CameraEntity, {
            camera: {
                mode: PROJECTION_TYPE.ORTHOGRAPHIC,
                orthographicSize: 200,
                zoom: 0.04,
                lookAtTarget: new Vector3(),
            },
            transform: {
                scale: { x: 1, y: -1, z: 1 },
            },
        });
        this.scene.getSystem(CameraSystem).setCamera(this.camera);
    }

    public setTarget(entity: Entity3D, instant = false) {
        this.target = entity;

        if (instant) {
            this.camera.x = entity.x + this.offset.x;
            this.camera.y = entity.y + this.offset.y;
            this.camera.z = entity.z + this.offset.z;
        }
    }

    public removeTarget() {
        this.target = undefined;
    }

    public update() {
        if (!this.target) return;
        const { x, y, z } = this.target;

        this.camera.x = lerp(this.camera.x, x + this.offset.x, 0.5);
        this.camera.y = lerp(this.camera.y, y + this.offset.y, 0.5);
        this.camera.z = lerp(this.camera.z, z + this.offset.z, 0.5);
        this.camera.c.camera.lookAtTarget!.set(x, y, z);
    }
}
