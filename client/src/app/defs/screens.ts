import { FadeTransition, ScreensConfigOptions } from "@play-co/astro";
import { MainScreen } from "../screens/MainScreen";
import { CreationScreen } from "../screens/CreationScreen";

/**
 * Config for the layers and screens to be added on the `ScreensPlugin`.
 *
 * Note: Popups can hide the overlay with { options: { `showUnderlay: true` } }
 */
export const screens = {
  main: {
    // Screen group options can be passed here to customize the layer.
    options: {
      //   loaderScreenClass: BaseballLoader,
      defaultTransitionClass: FadeTransition,
      defaultTransitionOptions: { duration: 0.25 },
    },
    screens: {
      creation: CreationScreen,
      main: MainScreen,
    },
  },
} as const satisfies ScreensConfigOptions;

type ScreensType = typeof screens;

export type ScreenGroupId = keyof ScreensType;
export type ScreenId<T extends ScreenGroupId | undefined = undefined> =
  T extends ScreenGroupId
    ? keyof ScreensType[T]["screens"]
    : {
        [K in ScreenGroupId]: keyof ScreensType[K]["screens"];
      }[ScreenGroupId];

export const screenGroupIds = Object.keys(screens) as ScreenGroupId[];
export const screenGroupMap = Object.entries(screens).reduce(
  (acc, [groupId, group]) => {
    acc[groupId as ScreenGroupId] = Object.keys(group.screens);
    return acc;
  },
  {} as Record<ScreenGroupId, string[]>,
);

export function getScreenGroupIdByScreenId(
  screenId: string,
): ScreenGroupId | undefined {
  for (const [groupId, screenIds] of Object.entries(screenGroupMap)) {
    if (screenIds.includes(screenId)) {
      return groupId as ScreenGroupId;
    }
  }
  return undefined;
}

// go through all the screen ids and make sure they're unique, throw an error for any duplicates
const screenIdSet = new Set<string>();
for (const groupId of screenGroupIds) {
  for (const screenId of screenGroupMap[groupId]) {
    if (screenIdSet.has(screenId)) {
      throw new Error(
        `Duplicate screen id found: "${screenId}"! Screens must have unique ids.`,
      );
    }
    screenIdSet.add(screenId);
  }
}
