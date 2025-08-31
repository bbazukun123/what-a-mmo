import type { CurrencyId } from '../../../replicant/game/currency/currency.defs';
import type { DropOptions } from '../../effects/ResourceDropsEffect';
import { getScreenComponent } from '../../lib/tools/appTools';
import type { Props as MessageToastComponentProps } from '../components/popups/banners/MessageToast.Component';
import type { Props as DialoguePopupComponentProps } from '../components/popups/dialogue/DialoguePopup.Component';
import type { MainScreenComponent } from '../components/screens/main/MainScreen.Component';
import type { ToolTipsOptions } from '../popups/ToolTipsPopup';

import { hideScreen, showScreen } from './navigation';

export async function dropResources(data: DropOptions) {
    return getScreenComponent<MainScreenComponent>('main')?.get('resources').drop(data);
}

/**
 * Show the generic message toast with the given content and vertical offset.
 */
export async function showMessageToast(data: MessageToastComponentProps) {
    return showScreen('messageToast', { data, force: true });
}

/**
 * Show the power change banner toast and auto-hide after a 1.5 second delay.
 */
export async function showPowerBanner(value: number) {
    return showScreen('powerBanner', { data: { value }, force: true });
}

/**
 * Show the interactive speech dialogue that auto-hides on completion.
 */
export async function showDialogue(data: DialoguePopupComponentProps) {
    return showScreen('defaultDialogue', { data, force: true });
}

/**
 * Hide the speech dialogue.
 */
export async function hideDialogue() {
    return hideScreen('defaultDialogue');
}

/**
 * Show the mini tool tips at the given options, with the provided content.
 */
export async function showToolTips(data: Partial<ToolTipsOptions>) {
    return showScreen('toolTips', { data, force: true });
}

/**
 * Hide the mini tool tips.
 */
export async function hideToolTips() {
    return hideScreen('toolTips');
}

/**
 * Show the screen-wipe level up VFX that auto-hides on completion.
 */
export async function showLevelUpVfx() {
    return showScreen('levelUp');
}

/**
 * Show the interactive choices that auto-hides on selection.
 */
export async function showChoices(choices: string[]) {
    return showScreen('cutSceneChoices', { data: { choices }, force: true });
}

/**
 * Hide the interactive choices.
 */
export async function hideChoices() {
    return hideScreen('cutSceneChoices');
}

export async function showInsufficientCurrency(currencyId: CurrencyId) {
    let id;

    switch (currencyId) {
        case 'gems':
            id = 'shop.insufficientGems';
            break;
        case 'lampTime':
            id = 'speedUp.noTickets';
            break;
        case 'energy':
            id = 'error.noEnergy.short';
            break;
        case 'gold':
            id = 'error.noGold.short';
            break;
        case 'skillTicket':
            id = 'error.noSkillTickets.short';
            break;
        default:
            id = '[TO BE UPDATED]';
            break;
    }

    return showMessageToast({ id, preset: 'powerDecrease' });
}
