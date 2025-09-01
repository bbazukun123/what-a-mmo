import { Container } from 'pixi.js';
import { GameScene } from '../game/GameScene';
import { LayoutScreen } from './LayoutScreen';

export class MainScreen extends LayoutScreen {
    private game!: GameScene;
    // private chatBar!: ChatBar;

    public async preload() {
        return {
            manifests: ['game'],
        };
    }

    public override async init(): Promise<void> {
        this.view.layout = {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1099bb',
        };

        const gameContainer = new Container({
            parent: this.view,
        });

        this.game = new GameScene(gameContainer);

        await this.game.init();
    }

    public async show(): Promise<void> {
        this.game.start();
    }

    public async shown(): Promise<void> {
        // this.chatBar.start();
    }

    public async hidden(): Promise<void> {
        // this.chatBar.stop();
    }

    public update(dt: number): void {
        //
    }
}
