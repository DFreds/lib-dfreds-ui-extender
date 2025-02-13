import { createHudButton } from "./hud-buttons/create-hud-button.ts";
import { HudButtonInput } from "./hud-buttons/hud-button-input.ts";
import { createSceneControl } from "./scene-controls/create-scene-control.ts";
import { SceneControlInput } from "./scene-controls/scene-control-input.ts";

class UiExtender {
    #sceneControls: SceneControlInput[];
    #hudButtons: HudButtonInput[];

    constructor() {
        this.#sceneControls = [];
        this.#hudButtons = [];
    }

    static init(): void {
        const uiExtender = new UiExtender();
        window.uiExtender = uiExtender;

        Hooks.callAll("uiExtender.init", uiExtender);
    }

    static setup(): void {
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
            createSceneControl(sceneControl),
        );
    }

    registerHudButton(input: HudButtonInput): void {
        if (this.#verifyModuleId(input.moduleId)) {
            this.#hudButtons.push(input);
        } else {
            throw new Error(`Invalid moduleId ${input.moduleId}`);
        }
    }

    createHudButtons(): void {
        this.#hudButtons.forEach((hudButton) => createHudButton(hudButton));
    }

    #verifyModuleId(id: string): boolean {
        const mod = game.modules.get(id);
        return !!mod;
    }

    // https://github.com/p4535992/dfreds-convenient-effects/commit/02785d5cacef116e44816ff14705c8638b6c67bc
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
