import { UiExtender } from "../ui-extender.ts";
import { Listener } from "./index.ts";

const Setup: Listener = {
    listen(): void {
        Hooks.once("setup", () => {
            UiExtender.setup();
        });
    },
};

export { Setup };
