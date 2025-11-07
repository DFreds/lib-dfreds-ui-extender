import { HandlebarHelpers } from "../ui/handlebar-helpers.ts";
import { UiExtenderImpl } from "../ui-extender.ts";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";

const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            new HandlebarHelpers().register();
            new Settings().register();
            UiExtenderImpl.init();
        });
    },
};

export { Init };
