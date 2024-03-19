import { Context } from 'telegraf';
import { SceneContextScene } from 'telegraf/typings/scenes';

export interface IContext extends Context {
    scene: SceneContextScene<Context>;
}
