import {
  Entity3D,
  lerp,
  QueriesObject,
  QueryResults,
  View3DComponent,
} from "@play-co/odie";
import { app } from "../../utils/app";
import { PlayerEntityTag } from "../defs/tags";
import { worldSizeRatio } from "../defs/world";
import { PlayerEntityType } from "../entities/PlayerEntity";
import { GameScene } from "../GameScene";
import { CameraControllerSystem } from "./CameraControllerSystem";
import { System } from "../defs/types";

export class PlayersSystem implements System<void, GameScene> {
  public static readonly NAME = "playerSystem";
  public static readonly Queries: QueriesObject = {
    default: {
      components: [PlayerEntityTag, View3DComponent],
      added: true,
      removed: true,
    },
  };

  public queries!: QueryResults;
  public scene!: GameScene;

  public addedToQuery(entity: PlayerEntityType) {
    const self = app().spacetimeDB.self;
    if (self?.toHexString() === entity.name) {
      const user = app().players.getUser(self);
      if (user) {
        entity.position.x = user.position.x * worldSizeRatio;
        entity.position.z = user.position.y * worldSizeRatio;
      }
      this.scene.getSystem(CameraControllerSystem).setTarget(entity, true);
    }
  }

  public removedFromQuery(entity: PlayerEntityType) {
    if (app().spacetimeDB.self?.toHexString() === entity.name) {
      this.scene.getSystem(CameraControllerSystem).removeTarget();
    }
  }

  public update() {
    for (const entity of this.queries.default!.entities as Entity3D[]) {
      const user = app().players.getUserById(entity.name);

      if (!user) {
        this.scene.removeFromScene(entity);
        continue;
      }

      if (!user.online) {
        entity.c.view3d!.renderable = false;
        continue;
      }

      entity.c.view3d!.renderable = true;
      entity.position.x = lerp(entity.position.x, user.position.x * worldSizeRatio, 0.1);
      entity.position.z = lerp(entity.position.z, user.position.y * worldSizeRatio, 0.1);
    }
  }
}
