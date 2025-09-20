import { PlayerClass } from '../../../module_bindings';
import { createMeleeView, stepMeleeAnimation } from '../defs/classes/melee';
import { createRangerView, stepRangerAnimation } from '../defs/classes/ranger';
import { PlayerEntityType } from '../entities/PlayerEntity';

type CreatePlayerViewOptions = {
    playerClass: PlayerClass['tag'];
    color: number;
    size: number;
};

export function createPlayerView(opts: CreatePlayerViewOptions) {
    const { playerClass, color, size } = opts;
    switch (playerClass) {
        case 'Ranger':
            return createRangerView({ color, size });
        case 'Melee':
            return createMeleeView({ color, size });
    }
}

type StepPlayerAnimationOptions = {
    playerClass: PlayerClass['tag'];
    entity: PlayerEntityType;
    dt: number;
};

export function stepPlayerAnimation(opts: StepPlayerAnimationOptions) {
    const { playerClass, entity, dt } = opts;
    switch (playerClass) {
        case 'Ranger':
            return stepRangerAnimation(entity, dt);
        case 'Melee':
            return stepMeleeAnimation(entity, dt);
    }
}
