import type { ErrorId } from '../../../replicant/game/errors/errors.def';
import { errorPropsMap } from '../../../replicant/game/errors/errors.def';
import type { EvolutionId } from '../../../replicant/game/evolution/evolution.defs';
import type { Gear, GearSlotId } from '../../../replicant/game/gear/gear.defs';
import type { Item } from '../../../replicant/game/item/item.defs';
import type { PalId } from '../../../replicant/game/pal/pal.defs';
import type { PromotionId } from '../../../replicant/game/promotion/promotion.defs';
import type { RetentionDialogue } from '../../../replicant/game/retention/retention.defs';
import type { SkillId } from '../../../replicant/game/skill/skill.defs';
import type { GameFeature } from '../../defs/features';
import { app } from '../../getApp';
import type { Props as SkillInfoPopupComponentProps } from '../components/popups/character/skills/SkillInfoPopup.Component';
import type { Props as SkillUpgradeCongratulationsPopupComponentProps } from '../components/popups/character/skills/SkillUpgradeCongratulationsPopup.Component';
import type { Props as GemsConsumptionPopupComponentProps } from '../components/popups/consumption/GemsConsumptionPopup.Component';
import type { Props as EquipmentLootPopupComponentProps } from '../components/popups/equipment/EquipmentLootPopup.Component';
import type { Props as ErrorPopupComponentProps } from '../components/popups/error/ErrorPopup.Component';
import type { Props as InfoPopupComponentProps } from '../components/popups/info/InfoPopup.Component';
import type { Props as GearSlotPopupComponentProps } from '../components/popups/inventory/GearSlotPopup.Component';
import type { Props as PalInfoPopupComponentProps } from '../components/popups/pals/PalInfoPopup.Component';
import type { Props as PalUpgradeCongratulationsPopupComponentProps } from '../components/popups/pals/PalUpgradeCongratulationsPopup.Component';
import type { Props as PromotionCongratulationsPopupComponentProps } from '../components/popups/promotion/PromotionCongratulationsPopup.Component';
import type { Props as CongratulationsPopupComponentProps } from '../components/popups/rewards/CongratulationsPopup.Component';
import type { Props as RewardsPopupComponentProps } from '../components/popups/rewards/RewardsPopup.Component';
import type { Props as GachaConfirmDrawPopupComponentProps } from '../components/popups/shop/GachaConfirmDrawPopup.Component';
import type { Props as GachaCongratulationsComponentProps } from '../components/popups/shop/GachaCongratulationsPopup.Component';
import type { GachaPriceOptions } from '../components/popups/shop/GachaShopPopup.Component';

import { isTopPopupShowing, showScreen } from './navigation';

/**
 * Show the generic info popup with the given content.
 */
export async function showInfoPopup(data: InfoPopupComponentProps, force = false) {
    return showScreen('info', { data, force });
}

/**
 * Show the generic error popup.
 */
export async function showError(data: ErrorPopupComponentProps) {
    return showScreen('error', { data });
}

/**
 * Show the error popup for a specific error id.
 */
export async function showErrorById(id: ErrorId) {
    const error = errorPropsMap[id];
    if (error) {
        await showError({
            title: id,
            message: id,
            severity: error.severity,
        });
    }
}

export async function showErrorByException(error: any) {
    // usually expect an Error exception but fallback to a default message
    const message = (error as Error).message ?? '?';

    // optionally resolve to TypedError where message is ErrorId
    const errorId = message as ErrorId;

    // if typed error supported, show by ErrorId
    if (errorPropsMap[errorId]) {
        await showErrorById(errorId);
        // else fallback to a general error and capture message literally
    } else {
        await showError({
            title: errorPropsMap.assert!.short,
            message: message ?? '?',
            severity: 'high',
        });
    }
}

export async function showRewardsPopup(data: RewardsPopupComponentProps) {
    return showScreen('rewards', { data });
}

export async function showCongratulationsPopup(rewards: Item[]) {
    return new Promise<void>((resolve) => {
        showScreen('congratulations', {
            data: {
                rewards,
                onClose: () => resolve(),
            } as CongratulationsPopupComponentProps,
        });
    });
}

export async function showPromotionCongratulationsPopup(id: PromotionId) {
    return new Promise<void>((resolve) => {
        showScreen('promotionCongratulations', {
            data: {
                id,
                onClose: () => resolve(),
            } as PromotionCongratulationsPopupComponentProps,
        });
    });
}

export async function showFeatureUnlockPopup(feature: GameFeature) {
    return showScreen('featureUnlock', { data: { feature } });
}

export async function showGearSlotInfo(def?: Gear) {
    return showScreen('gearSlot', { data: { def } as GearSlotPopupComponentProps, force: true });
}

export async function showEquipmentLootPopup(data: EquipmentLootPopupComponentProps) {
    return showScreen('equipmentLoot', { data });
}

export async function showDefeatPopup() {
    // don't show the defeat popup if the any tutorial is active, or if there is a top popup showing
    if (app().game.tutorial.isActive() || isTopPopupShowing()) return;
    return showScreen('defeat');
}

export async function showNotEnoughGoldPopup() {
    return showScreen('notEnoughGold');
}

export async function showCosmeticsPopup(slot: GearSlotId) {
    return showScreen('cosmetics', { data: { slot } });
}

export async function showSkillInfo(id: SkillId, isActionable = false) {
    return showScreen('skillInfo', { data: { id, isActionable } as SkillInfoPopupComponentProps, force: true });
}

export async function showSkillUpgradeCongratulations(props: SkillUpgradeCongratulationsPopupComponentProps) {
    return showScreen('skillUpgradeCongratulations', { data: props, force: true });
}

export async function showPalInfo(id: PalId, isActionable = false) {
    return showScreen('palInfo', { data: { id, isActionable } as PalInfoPopupComponentProps, force: true });
}

export async function showPalUpgradeCongratulations(props: PalUpgradeCongratulationsPopupComponentProps) {
    return showScreen('palUpgradeCongratulations', { data: props, force: true });
}

export async function showEvolutionInfo(id: EvolutionId) {
    return showScreen('evolutionInfo', { data: { id } });
}

export async function showEvolutionConfirmation(id: EvolutionId) {
    return showScreen('evolutionConfirmation', { data: { id } });
}

export async function showGachaConfirmDraw({ type, id }: GachaPriceOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        showScreen('gachaConfirmDraw', {
            data: {
                type,
                id,
                onClose: (confirmed: boolean) => resolve(confirmed),
            } as GachaConfirmDrawPopupComponentProps,
        });
    });
}

export async function showGachaCongratulations(props: GachaCongratulationsComponentProps) {
    return showScreen('gachaCongratulations', {
        data: props,
        force: true,
    });
}

export async function showGemsConsumptionConfirmation(
    props: Omit<GemsConsumptionPopupComponentProps, 'onClose'>,
): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        showScreen('gemsConsumption', {
            data: {
                ...props,
                onClose: (confirmed: boolean) => resolve(confirmed),
            } as GemsConsumptionPopupComponentProps,
        });
    });
}

export async function showRetentionDialoguePopup(props: RetentionDialogue): Promise<void> {
    return new Promise<void>((resolve) => {
        showScreen('retentionDialogue', {
            data: {
                props,
                onClose: () => resolve(),
            },
        });
    });
}
