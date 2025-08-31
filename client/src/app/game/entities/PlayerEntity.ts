import type { EntityType } from "@play-co/odie";
import {
  createEntity,
  DefineEntity,
  Entity3D,
  PhongMaterial,
  SphereGeometry,
} from "@play-co/odie";
import { User } from "../../../module_bindings";
import { PlayerEntityTag, ShadowTag } from "../defs/tags";
import { worldSizeRatio } from "../defs/world";

interface PlayerEntityOptions {
  user: User;
  isSelf?: boolean;
}

export const PlayerEntity = DefineEntity(Entity3D, PlayerEntityTag, ShadowTag);

export type PlayerEntityType = EntityType<typeof PlayerEntity>;

const playerSize = 100;

export function createPlayerEntity(
  opts: PlayerEntityOptions,
): PlayerEntityType {
  const { user } = opts;

  const radius = playerSize * 0.5 * worldSizeRatio;
  const entity = createEntity(PlayerEntity, {
    view3d: {
      geometry: new SphereGeometry(radius),
      material: new PhongMaterial({
        color: 0xff0000,
        receiveShadows: false,
      }),
    },
    transform: {
      position: {
        x: 0,
        y: radius,
        z: 0,
      }
    }
  });

  entity.name = user.identity.toHexString();

  return entity;
}
