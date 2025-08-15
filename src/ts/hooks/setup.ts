import { UiExtender } from "../ui-extender.ts";
import { Listener } from "./index.ts";

const Setup: Listener = {
    listen(): void {
        Hooks.once("setup", () => {
            if (BUILD_MODE === "development") {
                CONFIG.debug.hooks = true;
            }

            UiExtender.setup();
        });
    },
};

export { Setup };
