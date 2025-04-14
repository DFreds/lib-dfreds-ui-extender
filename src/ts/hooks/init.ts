import { HandlebarHelpers } from "../handlebar-helpers.ts";
import { UiExtender } from "../ui-extender.ts";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";

const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            new HandlebarHelpers().register();
            new Settings().register();
            UiExtender.init();
        });
    },
};

export { Init };
