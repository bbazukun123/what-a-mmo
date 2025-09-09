import { Vector3 } from '@play-co/commons';
import { Entity3D, type Component } from '@play-co/odie';
import { PlayerViewState } from '../../defs/player';

export class PlayerViewComponent implements Component {
    public static readonly NAME = 'playerView';
    public view!: Entity3D;
    public state: PlayerViewState = 'idle';
    public size = new Vector3(1, 1, 1);
    public basePosition = new Vector3();
    public tick = 0;

    public init() {}
}
