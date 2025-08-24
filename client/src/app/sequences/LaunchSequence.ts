import { waitFor } from "@play-co/commons";
import { app } from "../utils/app";
import { toCreation, toMain } from "../utils/navigation";

export async function runLaunchSequence() {
  await waitFor(250);

  if (!app().playerController.getName()) {
    await toCreation();
    return;
  }

  await toMain();
}
