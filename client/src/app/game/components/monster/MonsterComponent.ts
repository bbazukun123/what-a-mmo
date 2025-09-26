import { Entity3D, type Component } from '@play-co/odie';
import { Monster } from '../../../../module_bindings';

export type MonsterOptions = {
    data: Monster;
};

export class MonsterComponent implements Component<MonsterOptions> {
    public static readonly NAME = 'monster';
    public view!: Entity3D;
    private options!: MonsterOptions;

    public get data(): Monster {
        return this.options.data;
    }

    public get monsterId() {
        return this.data.monsterId;
    }

    public init(data: MonsterOptions) {
        this.options = data;
    }
}
