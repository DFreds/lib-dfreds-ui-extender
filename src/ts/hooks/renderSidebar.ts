import { UiExtenderImpl } from "../ui-extender.ts";
import { Listener } from "./index.ts";

const RenderSidebar: Listener = {
    listen(): void {
        Hooks.once("renderSidebar", () => {
            const hiddenDirectories = (window.uiExtender as UiExtenderImpl)._directories.filter(
                (directory) => directory.predicate && !directory.predicate(),
            );

            for (const directory of hiddenDirectories) {
                document
                    .querySelectorAll(`nav menu button[data-tab="${directory.id}"]`)
                    .forEach((button) => button.closest("li")?.remove());
            }
        });
    },
};

export { RenderSidebar };
