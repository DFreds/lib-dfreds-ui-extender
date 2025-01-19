import { UiExtender } from "../ui-extender.ts";
import { Listener } from "./index.ts";

const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            UiExtender.init();
        });
    },
};

export { Init };
