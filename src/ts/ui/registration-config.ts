import { ApplicationConfiguration, ApplicationRenderOptions, ApplicationTab } from "@client/applications/_module.mjs";
import { MODULE_ID } from "../constants.ts";
import { HandlebarsTemplatePart } from "@client/applications/api/_module.mjs";
import { UiExtenderImpl } from "../ui-extender.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface ModuleRegistrations {
    hudButtons: any[];
    sceneControls: any[];
    directories: any[];
    settingsButtons: any[];
}

interface ModuleTab extends Partial<ApplicationTab> {
    data: {
        registrations: ModuleRegistrations;
    };
    subtabs: Record<string, ApplicationTab>;
}

function emptyRegistrations(): ModuleRegistrations {
    return {
        hudButtons: [],
        sceneControls: [],
        directories: [],
        settingsButtons: [],
    };
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

    static _hudButtonPartial = `modules/${MODULE_ID}/templates/partials/hud-button.hbs`;

    static _sceneControlPartial = `modules/${MODULE_ID}/templates/partials/scene-control.hbs`;

    static _directoryPartial = `modules/${MODULE_ID}/templates/partials/directory.hbs`;

    static _settingsButtonPartial = `modules/${MODULE_ID}/templates/partials/settings-button.hbs`;

    static override PARTS: Record<string, HandlebarsTemplatePart> = {
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        config: {
            classes: ["scrollable"],
            template: `modules/${MODULE_ID}/templates/registration-config.hbs`,
            templates: [
                RegistrationConfig._hudButtonPartial,
                RegistrationConfig._sceneControlPartial,
                RegistrationConfig._directoryPartial,
                RegistrationConfig._settingsButtonPartial,
            ],
            scrollable: [".tab-content"],
        },
    };

    override tabGroups: Record<string, string> = {
        main: "base",
        ...(uiExtender as UiExtenderImpl)._hudButtons.reduce((acc: Record<string, string>, hudButton) => {
            acc[hudButton.moduleId] = "hud";
            return acc;
        }, {}),
        ...(uiExtender as UiExtenderImpl)._sceneControls.reduce((acc: Record<string, string>, sceneControl) => {
            acc[sceneControl.moduleId] = "sceneControls";
            return acc;
        }, {}),
        ...(uiExtender as UiExtenderImpl)._directories.reduce((acc: Record<string, string>, directory) => {
            acc[directory.moduleId] = "directories";
            return acc;
        }, {}),
        ...(uiExtender as UiExtenderImpl)._settingsButtons.reduce((acc: Record<string, string>, settingsButton) => {
            acc[settingsButton.moduleId] = "settingsButtons";
            return acc;
        }, {}),
    };

    #prepareTabs(): Record<string, Partial<ApplicationTab>> {
        const hudButtons = (uiExtender as UiExtenderImpl)._hudButtons;
        const sceneControls = (uiExtender as UiExtenderImpl)._sceneControls;
        const directories = (uiExtender as UiExtenderImpl)._directories;
        const settingsButtons = (uiExtender as UiExtenderImpl)._settingsButtons;

        // Create a map of module IDs to their registrations
        const moduleRegistrations = new Map<string, ModuleRegistrations>();

        const registrationsFor = (moduleId: string): ModuleRegistrations => {
            if (!moduleRegistrations.has(moduleId)) {
                moduleRegistrations.set(moduleId, emptyRegistrations());
            }
            return moduleRegistrations.get(moduleId)!;
        };

        for (const hudButton of hudButtons) {
            registrationsFor(hudButton.moduleId).hudButtons.push(hudButton);
        }

        for (const sceneControl of sceneControls) {
            registrationsFor(sceneControl.moduleId).sceneControls.push(sceneControl);
        }

        for (const directory of directories) {
            registrationsFor(directory.moduleId).directories.push(directory);
        }

        for (const settingsButton of settingsButtons) {
            registrationsFor(settingsButton.moduleId).settingsButtons.push(settingsButton);
        }

        const subtabData: Record<string, Partial<ApplicationTab>> = {
            hud: {
                id: "hud",
                label: "UiExtender.RegistrationConfig.Hud",
                icon: "fa-solid fa-grid-2",
            },
            sceneControls: {
                id: "sceneControls",
                label: "UiExtender.RegistrationConfig.SceneControls",
                icon: "fa-solid fa-dial-med",
            },
            directories: {
                id: "directories",
                label: "UiExtender.RegistrationConfig.Directories",
                icon: "fa-solid fa-folder-open",
            },
            settingsButtons: {
                id: "settingsButtons",
                label: "UiExtender.RegistrationConfig.SettingsButtons",
                icon: "fa-solid fa-sliders",
            },
        };

        // Create tabs for each module that has registrations
        const tabs: Record<string, ModuleTab> = {};
        for (const [moduleId, registrations] of moduleRegistrations) {
            const active = this.tabGroups.main === moduleId;
            tabs[moduleId] = {
                id: moduleId,
                group: "main",
                label: game.modules.get(moduleId)?.title ?? "",
                active,
                cssClass: active ? "active" : "",
                data: {
                    registrations,
                },
                subtabs: (
                    [
                        ["hud", registrations.hudButtons],
                        ["sceneControls", registrations.sceneControls],
                        ["directories", registrations.directories],
                        ["settingsButtons", registrations.settingsButtons],
                    ] as [string, any[]][]
                ).reduce((subtabs: any, [subtabId, items]) => {
                    const group = moduleId;
                    const active = this.tabGroups[group] === subtabId;
                    const cssClass = active ? "active" : "";
                    subtabs[subtabId] = {
                        ...subtabData[subtabId],
                        group,
                        active,
                        cssClass,
                        data: { items },
                    };
                    return subtabs;
                }, {}),
            };
        }

        return tabs;
    }

    protected override async _prepareContext(options: ApplicationRenderOptions): Promise<object> {
        const context = await super._prepareContext(options);

        return Object.assign(context, {
            tabs: this.#prepareTabs(),
            rootId: this.id,
            hudButtonPartial: RegistrationConfig._hudButtonPartial,
            sceneControlPartial: RegistrationConfig._sceneControlPartial,
            directoryPartial: RegistrationConfig._directoryPartial,
            settingsButtonPartial: RegistrationConfig._settingsButtonPartial,
        });
    }
}

export { RegistrationConfig };
