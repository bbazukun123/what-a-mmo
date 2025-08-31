import { LayoutContainer } from '@pixi/layout/components';
import { app } from '../utils/app';
import { LayoutScreen } from './LayoutScreen';
import { Sprite, Text, Texture } from 'pixi.js';
import { TextInput } from '../components/TextInput';
import { FancyButton } from '@pixi/ui';
import { toMain } from '../utils/navigation';

export class CreationScreen extends LayoutScreen {
    private panel!: Sprite;
    private placeholder!: Text;
    private textInput!: TextInput;
    private submitButton!: FancyButton;

    public async init() {
        new LayoutContainer({
            parent: this.view,
            layout: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#1099bb',
            },
        });

        const content = new LayoutContainer({
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

        const text = content.addChild(
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

        const row = new LayoutContainer({
            parent: content,
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
