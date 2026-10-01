import { ApplicationConfiguration, ApplicationRenderOptions, ApplicationTab } from "@client/applications/_module.mjs";
import { MODULE_ID } from "../constants.ts";
import { HandlebarsTemplatePart } from "@client/applications/api/_module.mjs";
import { UiExtenderImpl } from "../ui-extender.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface Registration {
    moduleId: string;
}

interface ModuleTab extends Partial<ApplicationTab> {
    subtabs: Record<string, Partial<ApplicationTab> & { data: { items: Registration[] } }>;
}

const SUBTABS = [
    { id: "hud", label: "UiExtender.RegistrationConfig.Hud", icon: "fa-solid fa-grid-2" },
    { id: "sceneControls", label: "UiExtender.RegistrationConfig.SceneControls", icon: "fa-solid fa-dial-med" },
    { id: "directories", label: "UiExtender.RegistrationConfig.Directories", icon: "fa-solid fa-folder-open" },
    { id: "settingsButtons", label: "UiExtender.RegistrationConfig.SettingsButtons", icon: "fa-solid fa-sliders" },
];

function registrationsBySubtab(): Record<string, Registration[]> {
    const extender = uiExtender as UiExtenderImpl;
    return {
        hud: extender._hudButtons,
        sceneControls: extender._sceneControls,
        directories: extender._directories,
        settingsButtons: extender._settingsButtons,
    };
}

function initialSubtabs(): Record<string, string> {
    const registrations = registrationsBySubtab();
    const initial: Record<string, string> = {};
    for (const subtab of SUBTABS) {
        for (const registration of registrations[subtab.id]) {
            initial[registration.moduleId] = subtab.id;
        }
    }
    return initial;
}

/** Similar to prototype-overrides - could be similar to SettingsConfig */
class RegistrationConfig extends HandlebarsApplicationMixin(ApplicationV2) {
    static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
        id: "registration-config",
        tag: "form",
        window: {
            title: "UiExtender.RegistrationConfig.Title",
            contentClasses: ["standard-form"],
            icon: "fa-solid fa-gears",
            resizable: true,
            minimizable: true,
        },
        position: {
            width: 780,
            height: 680,
        },
    };

    static override PARTS: Record<string, HandlebarsTemplatePart> = {
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        config: {
            classes: ["scrollable"],
            template: `modules/${MODULE_ID}/templates/registration-config.hbs`,
            templates: [
                `modules/${MODULE_ID}/templates/partials/hud-button.hbs`,
                `modules/${MODULE_ID}/templates/partials/scene-control.hbs`,
                `modules/${MODULE_ID}/templates/partials/directory.hbs`,
                `modules/${MODULE_ID}/templates/partials/settings-button.hbs`,
            ],
            scrollable: [".tab-content"],
        },
    };

    override tabGroups: Record<string, string> = {
        main: "base",
        ...initialSubtabs(),
    };

    #prepareTabs(): Record<string, ModuleTab> {
        const registrations = registrationsBySubtab();
        const moduleIds = new Set(
            Object.values(registrations)
                .flat()
                .map((registration) => registration.moduleId),
        );

        const tabs: Record<string, ModuleTab> = {};
        for (const moduleId of moduleIds) {
            tabs[moduleId] = this.#prepareModuleTab(moduleId, registrations);
        }
        return tabs;
    }

    #prepareModuleTab(moduleId: string, registrations: Record<string, Registration[]>): ModuleTab {
        const subtabs: ModuleTab["subtabs"] = {};
        for (const subtab of SUBTABS) {
            const active = this.tabGroups[moduleId] === subtab.id;
            subtabs[subtab.id] = {
                ...subtab,
                group: moduleId,
                active,
                cssClass: active ? "active" : "",
                data: {
                    items: registrations[subtab.id].filter((registration) => registration.moduleId === moduleId),
                },
            };
        }

        const active = this.tabGroups.main === moduleId;
        return {
            id: moduleId,
            group: "main",
            label: game.modules.get(moduleId)?.title ?? "",
            active,
            cssClass: active ? "active" : "",
            subtabs,
        };
    }

    protected override async _prepareContext(options: ApplicationRenderOptions): Promise<object> {
        const context = await super._prepareContext(options);

        return Object.assign(context, {
            tabs: this.#prepareTabs(),
            rootId: this.id,
        });
    }
}

export { RegistrationConfig };
