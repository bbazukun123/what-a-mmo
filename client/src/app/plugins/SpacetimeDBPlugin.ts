import { Identity } from '@clockworklabs/spacetimedb-sdk';
import { Plugin } from '@play-co/astro';
import { Signal } from 'typed-signals';
import { DbConnection, ErrorContext } from '../../module_bindings';

export class SpacetimeDBPlugin extends Plugin {
    private identity: Identity | null = null;
    private connection: DbConnection | null = null;
    private connected = false;
    public readonly signals = {
        onConnected: new Signal<(connection: DbConnection) => void>(),
    };

    public get isReady() {
        return this.connection && this.connected && this.identity;
    }

    public get db() {
        return this.connection?.db;
    }

    public get reducers() {
        return this.connection?.reducers;
    }

    public get self() {
        return this.identity;
    }

    public async init(): Promise<void> {
        this.connect();
    }

    private connect() {
        this.connection = DbConnection.builder()
            .withUri('ws://localhost:3000')
            .withModuleName('what-a-mmo')
            .withToken(localStorage.getItem('auth_token') || '')
            .onConnect(this.onConnect.bind(this))
            .onDisconnect(this.onDisconnect.bind(this))
            .onConnectError(this.onConnectError.bind(this))
            .build();
    }

    private subscribeToQueries(connection: DbConnection, queries: string[]) {
        connection
            ?.subscriptionBuilder()
            .onApplied(() => {
                console.log('SDK client cache initialized.');
            })
            .subscribe(queries);
    }

    private onConnect(conn: DbConnection, identity: Identity, token: string) {
        this.identity = identity;
        this.connected = true;
        localStorage.setItem('auth_token', token);
        console.log('Connected to SpacetimeDB with identity:', identity.toHexString());
        conn.reducers.onSendMessage((_, text) => {
            console.log('Message sent:', text);
        });

        this.subscribeToQueries(conn, [
            'SELECT * FROM config',
            'SELECT * FROM message',
            'SELECT * FROM user',
            'SELECT * FROM monster',
        ]);

        this.signals.onConnected.emit(conn);
    }

    private onDisconnect() {
        console.log('Disconnected from SpacetimeDB');
        this.connected = false;
    }

    private onConnectError(_ctx: ErrorContext, err: Error) {
        console.log('Error connecting to SpacetimeDB:', err);
    }
}
