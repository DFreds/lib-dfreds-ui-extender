import { DEBUG } from "../constants.ts";
import { UiExtender } from "../ui-extender.ts";
import { Listener } from "./index.ts";

const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            CONFIG.debug.hooks = DEBUG;
            UiExtender.init();
        });
    },
};

export { Init };
