import {
  Assets,
  Container,
  RenderTexture,
  Sprite,
  Texture,
  Ticker,
} from "pixi.js";
import { Application } from "../Application";
import {
  getScreenGroupIdByScreenId,
  ScreenGroupId,
  screenGroupIds,
  ScreenId,
} from "../defs/screens";
import { CircularProgressBar } from "@pixi/ui";

let instance: Application | null = null;

export function app(): Application {
  return instance!;
}

export function setApp(app: Application) {
  instance = app;
}

export function timeNow() {
  return Date.now();
}

export function waitWithSpinner<T>(promise: Promise<T>): Promise<T> {
  return app().busy.waitWithSpinner(promise);
}

export function getScreenInstance<T = any>(id: ScreenId): T {
  const layer = getScreenGroupIdByScreenId(id);
  if (!layer) {
    throw new Error(`Screen not found: ${id}`);
  }
  return (app().screens.layers[layer] as any).get(id) as T;
}

export function getActiveScreens(): Record<ScreenGroupId, string | undefined> {
  return screenGroupIds.reduce(
    (acc, id) => {
      acc[id] = app().screens.layers[id].currentScreenId;
      return acc;
    },
    {} as Record<ScreenGroupId, string>,
  );
}

const size = 85;
const padding = 10;
const lineWidth = 15;
const spinnerTexture = RenderTexture.create({
  width: size + padding * 2,
  height: size + padding * 2,
});
const spinnerContainer = new Container();
const spinner = spinnerContainer.addChild(
  new CircularProgressBar({
    backgroundColor: 0x000000,
    backgroundAlpha: 0.1,
    lineWidth,
    fillColor: 0x000000,
    fillAlpha: 0.3,
    radius: size / 2 - lineWidth,
    cap: "round",
    value: 30,
  }),
);
spinner.position.set(spinnerTexture.width / 2, spinnerTexture.height / 2);
const stepSpinner = () => {
  spinner.rotation += 0.1;
  app().stagePlugin.renderer.render({
    target: spinnerTexture,
    container: spinnerContainer,
  });
};
let loadingCount = 0;

/**
 * Replace texture of a given sprite with a given asset alias.
 * If not already loaded, an animated spinner texture will be displayed in place until the asset is loaded.
 */
export async function loadAndReplaceTextureWithSpinner(
  sprite: Sprite,
  asset: string,
) {
  // If texture is already loaded, replace it immediately
  if (Assets.cache.has(asset)) {
    sprite.texture = Texture.from(asset);
    return;
  }

  // Hook up spinner stepper, if not already.
  if (loadingCount === 0) {
    Ticker.shared.add(stepSpinner);
  }

  ++loadingCount;
  sprite.texture = spinnerTexture;

  // Load the asset and replace the texture
  return Assets.load(asset)
    .then(async (texture) => {
      sprite.texture = texture;
    })
    .finally(() => {
      // Detach spinner stepper if no more loading is in progress.
      if (--loadingCount <= 0) {
        Ticker.shared.remove(stepSpinner);
      }
    });
}
