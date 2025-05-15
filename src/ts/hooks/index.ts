import { Init } from "./init.ts";
import { RenderSidebar } from "./renderSidebar.ts";
import { Setup } from "./setup.ts";

interface Listener {
    listen(): void;
}

const HooksUiExtender = {
    listen(): void {
        const listeners: Listener[] = [Init, Setup, RenderSidebar];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksUiExtender };
export type { Listener };
