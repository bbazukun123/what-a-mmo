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
    private submitButton!: FancyButton;

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
                this.submitButton.enabled = text.length > 0;
            },
            onFocusChange: (focus) => {
                this.placeholder.visible = !focus && !this.textInput.value;
            },
            onSubmit: this.onSubmit.bind(this),
        });

        this.submitButton = row.addChild(
            new FancyButton({
                defaultView: new Sprite({
                    texture: Texture.WHITE,
                    tint: 0x00ff00,
                    width: 200,
                    height: 100,
                }),
                text: new Text({
                    text: 'Submit',
                    style: {
                        fontSize: 35,
                        fontWeight: 'bold',
                    },
                }),
            }),
        );
        this.submitButton.layout = {
            width: 200,
            height: 100,
        };
        this.submitButton.onPress.connect(this.onSubmit.bind(this));
    }

    private createClassSelectionRow() {
        const row = new LayoutContainer({
            parent: this.content,
            layout: {
                width: '100%',
                marginTop: 75,
                justifyContent: 'center',
            },
        });

        const playerClasses = Object.values(PlayerClass)
            .map(({ tag }: any) => tag)
            .filter((v) => v !== undefined)
            .forEach((playerClass) => {
                // Create a card for each class
                row.addChild(new CreationClassCard({ playerClass }));
            });
    }

    private onSubmit() {
        const text = this.textInput.value;

        // Skip empty name
        if (text.trim() === '') return;

        // Handle setting the player name
        app().playerController.setName(text);

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
