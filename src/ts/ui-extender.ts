import { MODULE_ID } from "./constants.ts";
import { ThisModule } from "./module.ts";

class UiExtender {
    #sceneControls: SceneControlInput[];
    #hudButtons: HudButtonInput[];

    constructor() {
        this.#sceneControls = [];
        this.#hudButtons = [];
    }

    static init(): void {
        const uiExtender = new UiExtender();

        (game.modules.get(MODULE_ID) as ThisModule).uiExtender = uiExtender;
        window.uiExtender = uiExtender;

        Hooks.callAll("uiExtender.init", uiExtender);
    }

    static setup(): void {
        const uiExtender = (game.modules.get(MODULE_ID) as ThisModule)
            .uiExtender;

        uiExtender.createSceneControls();
        uiExtender.createHudButtons();

        Hooks.callAll("uiExtender.setup", uiExtender);
    }

    registerSceneControl(input: SceneControlInput): void {
        if (this.#verifyModuleId(input.moduleId)) {
            this.#sceneControls.push(input);
        } else {
            throw new Error(`Invalid moduleId ${input.moduleId}`);
        }
    }

    createSceneControls(): void {
        this.#sceneControls.forEach((sceneControl) =>
            this.#createSceneControl(sceneControl),
        );
    }

    #createSceneControl(input: SceneControlInput): void {
        Hooks.on("getSceneControlButtons", (controls: SceneControl[]) => {
            const { name, position, predicate, tool } = input;

            if (predicate && predicate(controls) === false) return;

            const targetControl = controls.find(
                (control) => control.name === name,
            );

            if (!targetControl) {
                throw new Error(`Cannot find target control ${name}`);
            }

            if (position && targetControl.tools.length > position) {
                targetControl.tools.splice(position, 0, tool);
            } else {
                targetControl.tools.push(tool);
            }
        });
    }

    registerHudButton(input: HudButtonInput): void {
        if (this.#verifyModuleId(input.moduleId)) {
            this.#hudButtons.push(input);
        } else {
            throw new Error(`Invalid moduleId ${input.moduleId}`);
        }
    }

    createHudButtons(): void {
        this.#hudButtons.forEach((hudButton) =>
            this.#createHudButton(hudButton),
        );
    }

    #createHudButton(input: HudButtonInput): void {
        const type = input.hudType.capitalize();

        Hooks.on(
            `render${type}HUD`,
            // @ts-expect-error Ignore this, it can't do dynamic hook names
            (hud: BasePlaceableHUD, html: JQuery, data: object) => {
                const {
                    tooltip,
                    action,
                    icon,
                    location,
                    predicate,
                    onClick,
                    onRightClick,
                    onRenderComplete,
                } = input;

                if (predicate && predicate(data) === false) return;

                const button = $(document.createElement("div"));

                button.addClass("control-icon");
                button.html(icon);

                button.attr(
                    "data-action",
                    action ?? tooltip.toLowerCase().slugify(),
                );
                button.attr("data-tooltip", tooltip);

                if (onClick) {
                    button.on("click", (event: JQuery.ClickEvent) => {
                        onClick(event, button, data);
                    });
                }

                if (onRightClick) {
                    button.on(
                        "contextmenu",
                        (event: JQuery.ContextMenuEvent) => {
                            onRightClick(event, button, data);
                        },
                    );
                }

                html.find(location).append(button);

                if (onRenderComplete) {
                    onRenderComplete(hud, html, data);
                }
            },
        );
    }

    #verifyModuleId(id: string): boolean {
        const mod = game.modules.get(id);
        return !!mod;
    }

    // https://github.com/p4535992/dfreds-convenient-effects/commit/02785d5cacef116e44816ff14705c8638b6c67bc
}

interface SceneControlInput {
    /**
     * The ID of the module registering
     */
    moduleId: string;

    /**
     * The name of the token layer
     */
    name:
        | "token"
        | "measure"
        | "tiles"
        | "drawings"
        | "walls"
        | "lighting"
        | "sounds"
        | "regions"
        | "notes";

    /**
     * The position to put the button. If no number is given, it will append it to the end
     */
    position?: number;

    /**
     * The predicate to determine if the control should be visible
     *
     * @param data The data for the controls
     * @returns true if the control should be added, false otherwise
     */
    predicate?: (data: any) => boolean;

    /**
     * The tool data
     */
    tool: SceneControlTool;
}

interface HudButtonInput {
    /**
     * The ID of the module registering
     */
    moduleId: string;

    /**
     * The type of HUD to use
     */
    hudType: "token" | "tile" | "drawing";

    /**
     * The tooltip when hovering on the HUD button
     */
    tooltip: string;

    /**
     * The name of action when clicking the button
     */
    action?: string;

    /**
     * The HTML that will be used in the button
     */
    icon: string;

    /**
     * The location of the button
     */
    location: "div.left" | "div.right";

    /**
     * The predicate to determine if the button should be added
     *
     * @param data The data for the item with the HUD
     * @returns true if the button should be added, false otherwise
     */
    predicate?: (data: any) => boolean;

    /**
     * The click handler
     *
     * @param event The click event
     * @param button The div containing the button
     * @param data The data for the item with the HUD
     */
    onClick?: (
        event: JQuery.ClickEvent,
        button: JQuery<HTMLDivElement>,
        data: any,
    ) => void;

    /**
     * The right-click handler
     *
     * @param event The context menu event
     * @param button The div containing the button
     * @param data The data for the item with the HUD
     */
    onRightClick?: (
        event: JQuery.ContextMenuEvent,
        button: JQuery<HTMLDivElement>,
        data: any,
    ) => void;

    /**
     * The render complete handler
     *
     * @param hud The base placeable HUD instance
     * @param html The html for the HUD
     * @param data The data for the HUD
     */
    onRenderComplete?: (
        hud: BasePlaceableHUD<any>,
        html: JQuery,
        data: object,
    ) => void;
}

// interface SidebarInput {
// sidebar: Application | ApplicationV2 | SidebarTab;
// tabId: string;
// ariaLabel: string;
// tooltip: string;
// icon: string;
// onRender: () => void;
// }

export { UiExtender };
