import type { GotoData } from '@play-co/astro';
import { app } from './app';
import { getScreenGroupIdByScreenId, ScreenGroupId, screenGroupIds, ScreenId } from '../defs/screens';

/**
 * Show the player creation screen.
 */
export async function toCreation(): Promise<void> {
    const { screens } = app();
    await screens.main.show('creation');
}

/**
 * Show the core game screen.
 */
export async function toMain(): Promise<void> {
    const { screens } = app();
    await screens.main.show('main');
}

/**
 * Show an overlaying screen with a given its id and optional data.
 */
export async function showScreen(id: ScreenId, data?: GotoData): Promise<void> {
    const layer = getScreenGroupIdByScreenId(id);
    if (!layer) return;
    await app().screens.layers[layer].show(id as any, data);
}

/**
 * Hide any overlaying screen if it is currently shown, given its id.
 */
export async function hideScreen(id: ScreenId): Promise<void> {
    const layerId = getScreenGroupIdByScreenId(id);
    if (!layerId) return;
    const layer = app().screens.layers[layerId];
    if (layer.currentScreenId === id) await layer.hide();
}

/**
 * Hide any screen group layer if it is currently showing a screen.
 */
export async function hideLayer(layer: ScreenGroupId): Promise<void> {
    await app().screens.layers[layer].hide();
}

/**
 * Hide all the overlaying screens which excludes the main and the nav bar layers.
 * Omit the layers to be hidden by passing the layer ids to omit. (eg. ['main', 'navBar'])
 */
export async function hideAllScreens(toOmit: ScreenGroupId[] = ['main']): Promise<void> {
    screenGroupIds.forEach((layer) => {
        if (!toOmit.includes(layer)) {
            app().screens.layers[layer].hide();
        }
    });
}

export function isScreenVisible(id: ScreenId | ScreenId[]): boolean {
    id = Array.isArray(id) ? id : [id];

    const layers = app().screens.layers;
    let layer: ScreenGroupId | undefined;

    for (const screenId of id) {
        layer = getScreenGroupIdByScreenId(screenId);

        if (!layer) {
            continue;
        }

        if (layers[layer].currentScreenId === screenId) {
            return true;
        }
    }

    return false;
}
