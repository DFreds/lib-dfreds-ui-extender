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
    hudType: "token" | "tile" | "drawing";
    tooltip: string;
    action?: string;
    icon: string;
    location: "div.left" | "div.right";
    onClick?: (event: JQuery.ClickEvent, token: any) => void;
    onRightClick?: (event: JQuery.ContextMenuEvent, token: any) => void;
}

export class UiExtender {
    static initialize(): void {
        const uiExtender = new UiExtender();
        (game.modules.get(MODULE_ID) as ThisModule).uiExtender = uiExtender;
        Hooks.callAll("uiExtender.init", uiExtender);
    }

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
            const { tooltip, action, icon, location, onClick, onRightClick } =
                input;

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

    addHeaderButton(): void {
        // TODO happens on render${DocumentType}Config
        // TODO see renderActiveEffectConfig.ts
    }

    addChatButton(): void {
        // TODO happens on renderChatLog
        // TODO see chat-pins/module.ts
    }
}

Hooks.once("init", () => {
    UiExtender.initialize();
});

mySampleModule();
