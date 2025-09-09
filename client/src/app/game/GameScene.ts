import { OrbitalCameraSystem, Scene, Scene3D, ShadowSystem, SystemClass } from '@play-co/odie';
import { type Container, type Renderer } from 'pixi.js';
import { app } from '../utils/app';
import { System } from './defs/types';
import { CameraControllerSystem } from './systems/CameraControllerSystem';
import { EyesSystem } from './systems/EyesSystem';
import { GameLightSystem } from './systems/GameLightSystem';
import { HudSystem } from './systems/HudSystem';
import { PlayersSystem } from './systems/PlayersSystem';
import { PlayerViewSystem } from './systems/PlayerViewSystem';
import { SpawnSystem } from './systems/SpawnSystem';
import { WorldSystem } from './systems/WorldSystem';

export class GameScene extends Scene3D {
    public stage: Container;
    public renderer: Renderer;

    constructor(view: Container) {
        const renderer = app().stagePlugin.renderer;

        super({
            stage: view,
            renderer,
            clear: false,
        });

        this.stage = view;
        this.renderer = renderer;
    }

    public init(): void {
        this.addSystem(ShadowSystem, {
            useBatching: true,
        });
        this.addSystem(OrbitalCameraSystem);
        this.addSystem(CameraControllerSystem);
        this.addSystem(GameLightSystem);
        this.addSystem(WorldSystem);
        this.addSystem(SpawnSystem);
        this.addSystem(PlayersSystem);
        this.addSystem(PlayerViewSystem);
        this.addSystem(EyesSystem, { stage: this.stage });
        this.addSystem(HudSystem, { stage: this.stage });
    }

    public override addSystem<S extends System<any, any, any, any>>(
        Class: SystemClass<any, Scene, S>,
        data?: Parameters<Exclude<S['init'], undefined>>[0],
    ): S {
        return super.addSystem(Class, data);
    }

    public override getSystem<C extends SystemClass<any, Scene, System<any, any, any, any>>>(
        Class: C,
    ): InstanceType<C> {
        return super.getSystem(Class as any);
    }
}
