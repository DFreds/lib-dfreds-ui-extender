import { MODULE_ID } from "./constants.ts";
import { createDirectory } from "./directories/create-directories.ts";
import { createHudButton } from "./hud-buttons/create-hud-button.ts";
import { createSceneControl } from "./scene-controls/create-scene-control.ts";
import { createSettingsButtons } from "./settings-buttons/create-settings-buttons.ts";

class UiExtenderImpl implements UiExtender {
    #sceneControls: SceneControlInput[];
    #hudButtons: HudButtonInput[];
    #directories: DirectoryInput[];
    #settingsButtons: SettingsButtonInput[];

    constructor() {
        this.#sceneControls = [];
        this.#hudButtons = [];
        this.#directories = [];
        this.#settingsButtons = [];
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
        (uiExtender as UiExtenderImpl).#createSettingsButtons();

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

    get _settingsButtons(): SettingsButtonInput[] {
        return this.#settingsButtons;
    }

    registerSceneControl(input: SceneControlInput): void {
        this.#register(this.#sceneControls, input);
    }

    #createSceneControls(): void {
        this.#sceneControls.forEach((sceneControl) => createSceneControl(sceneControl));
    }

    registerHudButton(input: HudButtonInput): void {
        this.#register(this.#hudButtons, input);

        if (!input.nativeDom) {
            foundry.utils.logCompatibilityWarning(
                `${MODULE_ID} | ${input.moduleId} registered a HUD button with jQuery callbacks. Set "nativeDom: true" to get native DOM elements instead. jQuery callbacks are deprecated since UI Extender 2.6.0 and will be removed in 3.0.0.`,
                { once: true },
            );
        }
    }

    #createHudButtons(): void {
        this.#hudButtons.forEach((hudButton) => createHudButton(hudButton));
    }

    registerDirectory(input: DirectoryInput): void {
        this.#register(this.#directories, input);
    }

    #createDirectories(): void {
        this.#directories.forEach((directory) => createDirectory(directory));
    }

    registerSettingsButton(input: SettingsButtonInput): void {
        this.#register(this.#settingsButtons, input);
    }

    #createSettingsButtons(): void {
        createSettingsButtons(this.#settingsButtons);
    }

    #register<T extends { moduleId: string }>(list: T[], input: T): void {
        if (!game.modules.get(input.moduleId)?.active) {
            throw new Error(`Invalid moduleId ${input.moduleId}`);
        }

        list.push(input);
    }
}

export { UiExtenderImpl };
