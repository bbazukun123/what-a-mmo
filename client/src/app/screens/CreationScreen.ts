import { LayoutContainer } from '@pixi/layout/components';
import { FancyButton } from '@pixi/ui';
import { Sprite, Text, Texture } from 'pixi.js';
import { PlayerClass } from '../../module_bindings';
import { CreationClassCard } from '../components/CreationClassCard';
import { TextInput } from '../components/TextInput';
import { app } from '../utils/app';
import { toMain } from '../utils/navigation';
import { LayoutScreen } from './LayoutScreen';

export class CreationScreen extends LayoutScreen {
    private content!: LayoutContainer;
    private panel!: Sprite;
    private placeholder!: Text;
    private textInput!: TextInput;
    private startButton!: FancyButton;
    private classCards: CreationClassCard[] = [];
    private selectedClass!: PlayerClass;

    public override async init() {
        this.createBackground();

        // Add content container
        this.content = new LayoutContainer({
            parent: this.view,
            layout: {
                position: 'absolute',
                flexDirection: 'column',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                width: '100%',
            },
        });

        this.createTitle();
        this.createNameInputRow();
        this.createClassSelectionRow();

        this.startButton = this.content.addChild(
            new FancyButton({
                defaultView: new Sprite({
                    texture: Texture.WHITE,
                    tint: 0x00ff00,
                    width: 350,
                    height: 120,
                }),
                text: new Text({
                    text: 'START',
                    style: {
                        fontSize: 40,
                        fontWeight: 'bold',
                    },
                }),
            }),
        );
        this.startButton.layout = {
            marginTop: 100,
            width: 350,
            height: 120,
        };
        this.startButton.enabled = false;
        this.startButton.alpha = 0.5;
        this.startButton.onPress.connect(this.onStart.bind(this));
    }

    private createBackground() {
        new LayoutContainer({
            parent: this.view,
            layout: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#1099bb',
            },
        });
    }

    private createTitle() {
        const text = this.content.addChild(
            new Text({
                text: 'CHARACTER CREATION',
                style: {
                    align: 'center',
                    fontSize: 50,
                    fill: 0xffffff,
                    fontWeight: 'bold',
                },
            }),
        );

        text.layout = {
            height: 200,
        };
    }

    private createNameInputRow() {
        const row = new LayoutContainer({
            parent: this.content,
            layout: {
                width: '100%',
                height: 100,
                paddingInline: 50,
                alignSelf: 'center',
            },
        });

        this.panel = new Sprite({
            parent: row,
            texture: Texture.WHITE,
            tint: 0xdddddd,
            layout: {
                flexGrow: 1,
                height: '100%',
                marginRight: 25,
            },
        });

        this.placeholder = row.addChild(
            new Text({
                text: 'Enter your name here...',
                style: {
                    align: 'center',
                    fontSize: 35,
                    fill: 0xaaaaaa,
                },
            }),
        );
        this.placeholder.layout = {
            position: 'absolute',
            marginLeft: 25,
            height: '100%',
        };

        this.textInput = new TextInput({
            target: this.panel,
            limit: 100,
            size: 35,
            padding: 10,
            onUpdate: (text) => {
                this.startButton.enabled = text.length > 0;
                this.startButton.alpha = text.length > 0 ? 1 : 0.5;
            },
            onFocusChange: (focus) => {
                this.placeholder.visible = !focus && !this.textInput.value;
            },
            onSubmit: this.onStart.bind(this),
        });
    }

    private createClassSelectionRow() {
        const row = new LayoutContainer({
            parent: this.content,
            layout: {
                width: '100%',
                marginTop: 75,
                paddingInline: 30,
                justifyContent: 'center',
            },
        });

        this.classCards = Object.values(PlayerClass)
            .map(({ tag }: any) => tag)
            .filter((v) => v !== undefined)
            .map((playerClass, i) => {
                // Create a card for each class
                return row.addChild(
                    new CreationClassCard({
                        playerClass,
                        onSelect: this.handleCardSelect.bind(this, i),
                    }),
                );
            });

        this.handleCardSelect(0);
    }

    private handleCardSelect(index: number) {
        this.classCards.forEach((c, i) => {
            c.setSelected(i === index);
            if (i === index) this.selectedClass = c.playerClass;
        });
    }

    private onStart() {
        const text = this.textInput.value;

        // Skip empty name
        if (text.trim() === '') return;

        // Handle setting the player name
        app().playerController.setName(text);
        app().playerController.setClass(this.selectedClass);

        // Navigate to the main screen
        toMain();
    }

    public async shown() {
        this.textInput.start();
    }

    public async hide() {
        this.textInput.stop();
    }
}
