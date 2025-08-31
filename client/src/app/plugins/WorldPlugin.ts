import { Plugin } from "@play-co/astro";
import { app } from "../utils/app";

export class WorldPlugin extends Plugin {
  public get worldSize() {
    const size = app().spacetimeDB.db?.config.id.find(0)?.worldSize;
    return size !== undefined ? Number(size) : 0;
  }
}
