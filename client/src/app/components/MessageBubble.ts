import { LayoutContainer } from '@pixi/layout/components';
import { Message } from '../../module_bindings';
import { Text } from 'pixi.js';

export class MessageBubble extends LayoutContainer {
    private message: Message;
    private messageLabel: Text;

    public isEqual(message: Message): boolean {
        return (
            this.message.sender === message.sender &&
            this.message.sent === message.sent &&
            this.message.text === message.text
        );
    }

    constructor(message: Message, isSelf: boolean) {
        super({
            zIndex: message.sent.toDate().getTime(),
            layout: {
                width: '100%',
                padding: 30,
                backgroundColor: isSelf ? '#0000ff' : '#999999',
                borderRadius: 30,
                marginBlock: 5,
            },
        });

        this.message = message;
        this.messageLabel = this.addChild(
            new Text({
                text: message.text ?? 'Empty message',
                style: {
                    fontSize: 30,
                    fill: 0xffffff,
                    wordWrap: true,
                    wordWrapWidth: 400,
                },
                layout: {
                    flexGrow: 1,
                },
            }),
        );
    }
}
