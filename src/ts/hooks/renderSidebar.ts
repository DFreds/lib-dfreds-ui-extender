import { Listener } from "./index.ts";

const RenderSidebar: Listener = {
    listen(): void {
        Hooks.once("renderSidebar", () => {
            // Delete directories that d that have a predicate that returns false

            const directories = window.uiExtender._directories;

            directories.forEach((directory) => {
                if (directory.predicate && !directory.predicate()) {
                    const button = $(
                        `nav menu button[data-tab="${directory.id}"]`,
                    ).closest("li");

                    if (button) {
                        button.remove();
                    }
                }
            });
        });
    },
};

export { RenderSidebar };
