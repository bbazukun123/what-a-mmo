import { Plugin } from "@play-co/astro";
import { runLaunchSequence } from "../sequences/LaunchSequence";
import { app } from "../utils/app";

export class ControllerPlugin extends Plugin {
  public async init(): Promise<void> {
    app().spacetimeDB.signals.onConnected.connect(() => {
      runLaunchSequence();
    });
  }
}
