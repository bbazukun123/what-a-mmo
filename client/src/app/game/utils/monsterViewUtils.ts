import { createSampleMonsterView, stepSampleMonsterAnimation } from '../defs/monsters/sampleMonster';
import { MonsterEntityType } from '../entities/MonsterEntity';

type CreateMonsterViewOptions = {
    size: number;
};

export function createMonsterView(opts: CreateMonsterViewOptions) {
    const { size } = opts;
    return createSampleMonsterView({ size });
}

type StepMonsterAnimationOptions = {
    entity: MonsterEntityType;
    dt: number;
};

export function stepMonsterAnimation(opts: StepMonsterAnimationOptions) {
    const { entity, dt } = opts;
    return stepSampleMonsterAnimation(entity, dt);
}
