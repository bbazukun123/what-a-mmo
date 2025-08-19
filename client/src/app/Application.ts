import {
  Application as AstroApplication,
  BusyPlugin,
  KeyboardPlugin,
  ResizePlugin,
  ScreensPlugin,
  StagePlugin,
  VisibilityPlugin,
} from "@play-co/astro";
import { appConfig } from "./defs/app";
import { screens } from "./defs/screens";
import { setApp } from "./utils/app";
import { ControllerPlugin } from "./plugins/ControllerPlugin";
import { SpacetimeDBPlugin } from "./plugins/SpacetimeDBPlugin";
import { ContentPlugin } from "./plugins/ContentPlugin";
import { PlayerPlugin } from "./plugins/PlayerPlugin";

export class Application extends AstroApplication {
  public stagePlugin!: StagePlugin;
  public resize!: ResizePlugin;
  public screens!: ScreensPlugin<typeof screens>;
  public busy!: BusyPlugin;
  public spacetimeDB!: SpacetimeDBPlugin;
  public content!: ContentPlugin;
  public player!: PlayerPlugin;
  public controller!: ControllerPlugin;
  public keyboard!: KeyboardPlugin;

  constructor() {
    super(appConfig);
    setApp(this);
  }

  public async run(): Promise<void> {
    // Initialize plugins and services
    this.initPlugins();

    /**
     * Initialize application.
     * This trigger the runners on all plugins and services in the order they were added.
     */
    await this.init();
  }

  private initPlugins(): void {
    // Set up Pixi stage and append it to the DOM.
    this.stagePlugin = this.add(StagePlugin, { name: "stage" });

    // Set up browser resize handler.
    this.resize = this.add(ResizePlugin, { name: "resize" });

    // Set up browser visibility handler.
    this.add(VisibilityPlugin);

    // Set up a blocker screen with a busy spinner that can be shown and hidden on demand.
    this.busy = this.add(BusyPlugin, { name: "busy" });

    this._initScreens();

    // Set up SpacetimeDB plugin.
    this.spacetimeDB = this.add(SpacetimeDBPlugin);

    // Set up content plugin.
    this.content = this.add(ContentPlugin);

    // Set up player plugin.
    this.player = this.add(PlayerPlugin);

    // Set up game controller.
    this.controller = this.add(ControllerPlugin);

    // Set up keyboard input handling.
    this.keyboard = this.add(KeyboardPlugin);
  }

  private _initScreens(): void {
    // Add screens, navigation and transitions.
    this.screens = this.add(ScreensPlugin<typeof screens>, { config: screens });
  }
}
