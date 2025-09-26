import { Vector3 } from '@play-co/commons';
import { Entity3D, type Component } from '@play-co/odie';
import { MonsterViewState } from '../../defs/monster';

export class MonsterViewComponent implements Component {
    public static readonly NAME = 'monsterView';
    public view!: Entity3D;
    public state: MonsterViewState = 'idle';
    public size = new Vector3(1, 1, 1);
    public basePosition = new Vector3();
    public tick = 0;

    public init() {}
}
