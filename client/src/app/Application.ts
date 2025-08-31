import {
  Application as AstroApplication,
  BusyPlugin,
  KeyboardPlugin,
  ResizePlugin,
  ResourcePlugin,
  ScreensPlugin,
  SetupPlugin,
  StagePlugin,
  VisibilityPlugin,
} from "@play-co/astro";
import { appConfig } from "./defs/app";
import { screens } from "./defs/screens";
import { setApp } from "./utils/app";
import { SpacetimeDBPlugin } from "./plugins/SpacetimeDBPlugin";
import { PlayersPlugin } from "./plugins/PlayersPlugin";
import { MessagesPlugin } from "./plugins/MessagesPlugin";
import { MonstersPlugin } from "./plugins/MonstersPlugin";
import { PlayerControllerPlugin } from "./plugins/PlayerControllerPlugin";
import { GameControllerPlugin } from "./plugins/GameControllerPlugin";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dynamically created file, so is not always present in the repo
import manifest from '../manifest.json';
import { WorldPlugin } from "./plugins/WorldPlugin";
export class Application extends AstroApplication {
  public resources!: ResourcePlugin;
  public stagePlugin!: StagePlugin;
  public resize!: ResizePlugin;
  public screens!: ScreensPlugin<typeof screens>;
  public busy!: BusyPlugin;
  public spacetimeDB!: SpacetimeDBPlugin;
  public world!: WorldPlugin;
  public players!: PlayersPlugin;
  public messages!: MessagesPlugin;
  public monsters!: MonstersPlugin;
  public playerController!: PlayerControllerPlugin;
  public gameController!: GameControllerPlugin;
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
    this.resources = this.add(ResourcePlugin, {
      name: 'resources',
      manifest,
      basePath: 'assets',
    });

    // Preload initial assets.
    this.add(SetupPlugin, { name: 'setup' });
  
    // Set up Pixi stage and append it to the DOM.
    this.stagePlugin = this.add(StagePlugin, { name: 'stage' });

    // Set up browser resize handler.
    this.resize = this.add(ResizePlugin, { name: 'resize' });

    // Set up browser visibility handler.
    this.add(VisibilityPlugin);

    // Set up a blocker screen with a busy spinner that can be shown and hidden on demand.
    this.busy = this.add(BusyPlugin, { name: 'busy' });

    this._initScreens();

    // Set up SpacetimeDB plugin.
    this.spacetimeDB = this.add(SpacetimeDBPlugin);

    // Set up players, messages, monsters, player controller, and game controller plugins.
    this.world = this.add(WorldPlugin);
    this.players = this.add(PlayersPlugin);
    this.messages = this.add(MessagesPlugin);
    this.monsters = this.add(MonstersPlugin);
    this.playerController = this.add(PlayerControllerPlugin);
    this.gameController = this.add(GameControllerPlugin);

    // Set up keyboard input handling.
    this.keyboard = this.add(KeyboardPlugin);
  }

  private _initScreens(): void {
    // Add screens, navigation and transitions.
    this.screens = this.add(ScreensPlugin<typeof screens>, { config: screens });
  }
}
