import { Plugin } from '@play-co/astro';
import { Message, DbConnection, EventContext } from '../../module_bindings';
import { Signal } from 'typed-signals';
import { app } from '../utils/app';

export class MessagesPlugin extends Plugin {
    private messages: Message[] = [];
    public readonly signals = {
        onMessageAdded: new Signal<(message: Message) => void>(),
        onMessageRemoved: new Signal<(message: Message) => void>(),
    };

    public getMessages(): Message[] {
        return this.messages;
    }

    public getMessage(index: number): Message | undefined {
        return this.messages[index];
    }

    /**
     * Astro plugin lifecycle: initialize and subscribe to SpacetimeDB events
     */
    public init() {
        app().spacetimeDB.signals.onConnected.connect((connection: DbConnection) => {
            connection.db.message.onInsert(this.onMessageAdd.bind(this));
            connection.db.message.onDelete(this.onMessageRemove.bind(this));
        });
    }

    /**
     * Handler for message insert event
     */
    private onMessageAdd(_ctx: EventContext, message: Message) {
        this.messages.push(message);
        this.signals.onMessageAdded.emit(message);
    }

    /**
     * Handler for message delete event
     */
    private onMessageRemove(_ctx: EventContext, message: Message) {
        this.messages = this.messages.filter(
            (m) => m.text !== message.text && m.sent !== message.sent && m.sender !== message.sender,
        );
        this.signals.onMessageRemoved.emit(message);
    }
}
