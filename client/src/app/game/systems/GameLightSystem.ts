import type { QueriesObject, QueryResults, Scene3D } from '@play-co/odie';
import { createEntity, LIGHT_TYPE, LightEntity, LightShadowEntity } from '@play-co/odie';
import { System } from '../defs/types';
import { ShadowTag } from '../defs/tags';
import { PlayerEntityType } from '../entities/PlayerEntity';

const configDirectionalDefault = {
    light: {
        type: LIGHT_TYPE.DIRECTIONAL,
        color: 0xe8e3d9,
        intensity: 0.8,
    },
    transform: {
        rotation: { x: -1.7, y: -0.04, z: 0 },
    },
};
const configDirectional2Default = {
    light: {
        type: LIGHT_TYPE.DIRECTIONAL,
        color: 0xffffff,
        intensity: 1,
    },
    transform: {
        rotation: { x: -2.6, y: -0.0, z: 0 },
    },
};
const configPointLightDefault = {
    light: {
        type: LIGHT_TYPE.POINT,
        color: 0xd9ff9c,
        intensity: 1,
    },
    transform: {
        rotation: { x: -1.8, y: -0.04, z: 0 },
    },
};

export type GameLightSystemOptions = {
    isInspector?: boolean; // used for inspector mode
};

export class GameLightSystem implements System {
    public static readonly NAME = 'gameLightSystem';
    public static readonly Queries: QueriesObject = {
        default: {
            components: [ShadowTag],
            added: true,
            removed: true,
        },
    };

    public queries!: QueryResults;
    public scene!: Scene3D;

    // default lights, values manipulated dynamically
    private _directionalLight = createEntity(LightShadowEntity, {
        light: {
            type: LIGHT_TYPE.DIRECTIONAL,
            color: configDirectionalDefault.light.color,
            intensity: configDirectionalDefault.light.intensity,
        },
        shadow: {
            size: 2048 / 2,
            bias: 0.02,
            // TODO: should fix this! need for types.. which means they are not right!
            light: undefined as any,
        },
        transform: {
            rotation: {
                x: configDirectionalDefault.transform.rotation.x,
                y: configDirectionalDefault.transform.rotation.y,
                z: configDirectionalDefault.transform.rotation.z,
            },
        },
    });

    private _directionalLight2 = createEntity(LightEntity as any, {
        light: {
            type: LIGHT_TYPE.DIRECTIONAL,
            color: configDirectional2Default.light.color,
            intensity: configDirectional2Default.light.intensity,
        },
        transform: {
            rotation: {
                x: configDirectional2Default.transform.rotation.x,
                y: configDirectional2Default.transform.rotation.y,
                z: configDirectional2Default.transform.rotation.z,
            },
        },
    });

    private _pointLight = createEntity(LightEntity as any, {
        light: {
            type: LIGHT_TYPE.POINT,
            color: configPointLightDefault.light.color,
            intensity: configPointLightDefault.light.intensity,
        },
        transform: {
            rotation: {
                x: configPointLightDefault.transform.rotation.x,
                y: configPointLightDefault.transform.rotation.y,
                z: configPointLightDefault.transform.rotation.z,
            },
        },
    });

    public start() {
        this.scene.addToScene(this._directionalLight);
        this.scene.addToScene(this._directionalLight2);
        this.scene.addToScene(this._pointLight);
    }

    public addedToQuery(entity: PlayerEntityType): void {
        const { renderGroup } = this._directionalLight.c;
        renderGroup.add(entity);
    }

    public removedFromQuery(entity: PlayerEntityType): void {
        const { renderGroup } = this._directionalLight.c;
        renderGroup.toRender.remove(entity);
        renderGroup._renderNeedsUpdate = true;
    }
}
