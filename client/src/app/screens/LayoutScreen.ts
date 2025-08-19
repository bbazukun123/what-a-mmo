import { BaseScreen } from "@play-co/astro";

/**
 * Base layout screen that enables layout functionality for the screen view.
 */
export class LayoutScreen extends BaseScreen {
  public async init(): Promise<void> {
    // Add a layout to the screen view, centering the content by default.
    this.view.layout = {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      debug: true,
      debugHeat: false,
    };
  }

  public override resize(w: number, h: number): void {
    super.resize(w, h);

    // Update the layout dimensions of the screen view.
    this.view.layout = {
      width: this.width,
      height: this.height,
    };
  }
}
