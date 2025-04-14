import { MODULE_ID } from "./constants.ts";
import { RegistrationConfig } from "./registration-config.ts";

class Settings {
    #REGISTRATION_CONFIG = "registrationConfig";

    register(): void {
        game.settings.registerMenu(MODULE_ID, this.#REGISTRATION_CONFIG, {
            name: "UiExtender.Settings.RegistrationConfig.Name",
            label: "UiExtender.Settings.RegistrationConfig.Name",
            hint: "UiExtender.Settings.RegistrationConfig.Hint",
            icon: "fa-solid fa-gears",
            // @ts-expect-error Not sure why
            type: RegistrationConfig,
            restricted: true,
        });
    }
}

export { Settings };
