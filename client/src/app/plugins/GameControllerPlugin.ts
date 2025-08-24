import { Plugin } from "@play-co/astro";
import { runLaunchSequence } from "../sequences/LaunchSequence";
import { app } from "../utils/app";

export class GameControllerPlugin extends Plugin {
  public init(): void {
    app().spacetimeDB.signals.onConnected.connect(() => {
      runLaunchSequence();
    });
  }
}
