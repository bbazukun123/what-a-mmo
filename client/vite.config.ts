import { defineConfig, Plugin, type ResolvedConfig } from "vite";
import { execSync } from "child_process";
import { AssetPack, type AssetPackConfig  } from '@assetpack/core';
import { pixiPipes } from "@assetpack/core/pixi";

function assetpackPlugin(): Plugin {
    const apConfig: AssetPackConfig = {
        entry: './assets',
        pipes: [
            pixiPipes({
              manifest: {
                output: './src/manifest.json',
              },
            }),
        ],
    };
    let mode: ResolvedConfig['command'];
    let ap: AssetPack | undefined;

    return {
        name: 'vite-plugin-assetpack',
        configResolved(resolvedConfig) {
            mode = resolvedConfig.command;
            if (!resolvedConfig.publicDir) return;
            if (apConfig.output) return;
            const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '');
            apConfig.output = `.${publicDir}/assets/`;
        },
        buildStart: async () => {
            if (mode === 'serve') {
                if (ap) return;
                ap = new AssetPack(apConfig);
                void ap.watch();
            } else {
                await new AssetPack(apConfig).run();
            }
        },
        buildEnd: async () => {
            if (ap) {
                await ap.stop();
                ap = undefined;
            }
        },
    };
}

function runSlOnBuildStart(): Plugin {
  return {
    name: "vite-plugin-sl",
    buildStart() {
      execSync("rm -rf ./node_modules/.vite/deps");

      try {
        execSync("npx sl libs/pixi", { stdio: "inherit" });

        // for mats local builds..
        // execSync('npx sl ../pixijs', { stdio: 'inherit' });
        // execSync('npx sl ../odie', { stdio: 'inherit' });
      } catch (error: any) {
        console.error(`Error executing command: ${error.message}`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [assetpackPlugin(), runSlOnBuildStart()],
  server: {
    port: 8080,
    open: true,
  },
});
