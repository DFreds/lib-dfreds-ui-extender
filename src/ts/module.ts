import "../styles/style.scss"; // Keep or else vite will not include this
import { MODULE_ID } from "./constants.ts";
import { mySampleModule } from "./sample.ts";

interface ThisModule extends Module {
    uiExtender: UiExtender;
}

interface SceneControlInput {
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
     * The tool data
     */
    tool: SceneControlTool;
}

interface HUDButtonInput {
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
     * @param data The data for the item with the HUD
     */
    onClick?: (event: JQuery.ClickEvent, data: any) => void;

    /**
     * The right-click handler
     *
     * @param event The context menu event
     * @param data The data for the item with the HUD
     */
    onRightClick?: (event: JQuery.ContextMenuEvent, data: any) => void;
}

export class UiExtender {
    static initialize(): void {
        const uiExtender = new UiExtender();
        (game.modules.get(MODULE_ID) as ThisModule).uiExtender = uiExtender;
        Hooks.callAll("uiExtender.init", uiExtender);
    }

    /**
     * Adds a new scene control
     *
     * @param input The input for the scene control
     */
    addSceneControl(input: SceneControlInput): void {
        Hooks.on("getSceneControlButtons", (controls: SceneControl[]) => {
            const { name, position, tool } = input;
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

    addHUDButton(input: HUDButtonInput): void {
        const type = input.hudType.capitalize();

        // @ts-expect-error Ignore this, it can't do dynamic hook names
        Hooks.on(`render${type}HUD`, (_hud: any, html: JQuery, data: any) => {
            // TODO take logic into new module, with
            const {
                tooltip,
                action,
                icon,
                location,
                predicate,
                onClick,
                onRightClick,
            } = input;

            if (!predicate || !predicate(data)) return;

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
                    onClick(event, data);
                });
            }

            if (onRightClick) {
                button.on("contextmenu", (event: JQuery.ContextMenuEvent) => {
                    onRightClick(event, data);
                });
            }

            html.find(location).append(button);
        });
    }
}

Hooks.once("init", () => {
    UiExtender.initialize();
});

mySampleModule();
