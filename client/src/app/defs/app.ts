import { aspectResize } from "@play-co/astro";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - dynamically generated
// import manifest from "../../manifest.json";

const appResolution = {
  width: 1080,
  height: 1920,
} as const;

/**
 * Application Configuration
 *
 * - Plugin with name matched with a sub-configuration key will use it for the plugin initialization.
 * - Configuration is stored on the application so we can also store other custom configurations here for future references.
 */
export const appConfig = {
  // Plugin Configurations ----------
  //   resource: { manifest },
  //   setup: {
  //     // Individual assets to preload.
  //     assets: [],
  //     // Individual bundles to preload.
  //     manifests: ["fonts"],
  //     // Override preload manifest id.
  //     preloadId: "preload",
  //   },
  stage: {
    alwaysOnAccessibility: false,
    accessibilityDebug: false,
    /**
     * Pixi bug, setting alpha to 0 does not give a transparent background.
     *
     * The reason for a transparent background is to allow the game to be
     * rendered on top of the splash screen. Allowing you to control the
     * how the splash screen is dismissed.
     */
    backgroundAlpha: 0.00000001,
    clearBeforeRender: true,
    resolution: 1, // autoDetectResolution()
    antialias: false,
    useBackBuffer: true,
  },
  resize: {
    resizeFunction: aspectResize(
      appResolution.width,
      appResolution.height,
      true,
    ),
  },
  //   i18n: {
  //     entryDefaults: languageFontMap,
  //     defaultManifestID: "i18n",
  //     textStylePresets,
  //   },
  //   busy: {
  //     spinnerClass: BaseballSpinner,
  //   },

  // Custom Configurations ----------
  resolution: appResolution,
};
