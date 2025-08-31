import type { Entity, Query, System as OdieSystem, Scene } from '@play-co/odie';
import { PlayerEntityType } from '../entities/PlayerEntity';

type ComponentOf<E extends Entity | undefined> = E extends Entity<infer C, infer P> ? C[number] | P[number] : never;

export interface System<
    D = any,
    S extends Scene = Scene,
    E extends Entity | undefined = PlayerEntityType,
    C extends ComponentOf<E> = ComponentOf<E>,
> extends Omit<OdieSystem<D, S>, 'addedToQuery' | 'removedFromQuery' | 'modifiedQuery'> {
    addedToQuery?: (entity: E, query?: Query) => void;
    removedFromQuery?: (entity: E, query?: Query) => void;
    modifiedQuery?: (
        entity: E,
        changedComponent?: InstanceType<C>,
        data?: any,
        query?: Query,
        componentClass?: C,
    ) => void;
}
