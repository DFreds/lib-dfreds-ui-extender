import { createDirectory } from "./directories/create-directories.ts";
import { createHudButton } from "./hud-buttons/create-hud-button.ts";
import { createSceneControl } from "./scene-controls/create-scene-control.ts";

class UiExtenderImpl implements UiExtender {
    #sceneControls: SceneControlInput[];
    #hudButtons: HudButtonInput[];
    #directories: DirectoryInput[];

    constructor() {
        this.#sceneControls = [];
        this.#hudButtons = [];
        this.#directories = [];
    }

    static init(): void {
        const uiExtender = new UiExtenderImpl();
        window.uiExtender = uiExtender as UiExtender;

        Hooks.callAll("uiExtender.init", window.uiExtender);
    }

    static setup(): void {
        (uiExtender as UiExtenderImpl).#createSceneControls();
        (uiExtender as UiExtenderImpl).#createHudButtons();
        (uiExtender as UiExtenderImpl).#createDirectories();

        Hooks.callAll("uiExtender.setup", uiExtender);
    }

    get _sceneControls(): SceneControlInput[] {
        return this.#sceneControls;
    }

    get _hudButtons(): HudButtonInput[] {
        return this.#hudButtons;
    }

    get _directories(): DirectoryInput[] {
        return this.#directories;
    }

    registerSceneControl(input: SceneControlInput): void {
        if (this.#verifyModuleId(input.moduleId)) {
            this.#sceneControls.push(input);
        } else {
            throw new Error(`Invalid moduleId ${input.moduleId}`);
        }
    }

    #createSceneControls(): void {
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

    #createHudButtons(): void {
        this.#hudButtons.forEach((hudButton) => createHudButton(hudButton));
    }

    registerDirectory(input: DirectoryInput): void {
        if (this.#verifyModuleId(input.moduleId)) {
            this.#directories.push(input);
        } else {
            throw new Error(`Invalid moduleId ${input.moduleId}`);
        }
    }

    #createDirectories(): void {
        this.#directories.forEach((directory) => createDirectory(directory));
    }

    #verifyModuleId(id: string): boolean {
        const mod = game.modules.get(id);
        return !!mod;
    }
}

export { UiExtenderImpl };
