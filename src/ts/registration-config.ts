import {
    ApplicationConfiguration,
    ApplicationRenderOptions,
    ApplicationTab,
} from "types/foundry/client-esm/applications/_types.js";
import { HandlebarsTemplatePart } from "types/foundry/client-esm/applications/api/handlebars-application.ts";
import { MODULE_ID } from "./constants.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface ModuleTab extends Partial<ApplicationTab> {
    data: {
        registrations: { hudButtons: any[]; sceneControls: any[] };
    };
    subtabs: Record<string, ApplicationTab>;
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
            ],
            scrollable: [".tab-content"],
        },
    };

    override tabGroups: Record<string, string> = {
        main: "base",
        ...uiExtender._hudButtons.reduce(
            (acc: Record<string, string>, hudButton) => {
                acc[hudButton.moduleId] = "hud";
                return acc;
            },
            {},
        ),
        ...uiExtender._sceneControls.reduce(
            (acc: Record<string, string>, sceneControl) => {
                acc[sceneControl.moduleId] = "hud";
                return acc;
            },
            {},
        ),
    };

    #prepareTabs(): Record<string, Partial<ApplicationTab>> {
        const hudButtons = uiExtender._hudButtons;
        const sceneControls = uiExtender._sceneControls;

        // Create a map of module IDs to their registrations
        const moduleRegistrations = new Map<
            string,
            { hudButtons: any[]; sceneControls: any[] }
        >();

        // Process hudButtons
        for (const hudButton of hudButtons) {
            if (!moduleRegistrations.has(hudButton.moduleId)) {
                moduleRegistrations.set(hudButton.moduleId, {
                    hudButtons: [],
                    sceneControls: [],
                });
            }
            moduleRegistrations
                .get(hudButton.moduleId)!
                .hudButtons.push(hudButton);
        }

        // Process sceneControls
        for (const sceneControl of sceneControls) {
            if (!moduleRegistrations.has(sceneControl.moduleId)) {
                moduleRegistrations.set(sceneControl.moduleId, {
                    hudButtons: [],
                    sceneControls: [],
                });
            }
            moduleRegistrations
                .get(sceneControl.moduleId)!
                .sceneControls.push(sceneControl);
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
                subtabs: ["hud", "sceneControls"].reduce(
                    (subtabs: any, subtabId) => {
                        const group = moduleId;
                        const active = this.tabGroups[group] === subtabId;
                        const cssClass = active ? "active" : "";
                        subtabs[subtabId] = {
                            ...subtabData[subtabId],
                            group,
                            active,
                            cssClass,
                            data: {
                                items:
                                    subtabId === "hud"
                                        ? registrations.hudButtons
                                        : registrations.sceneControls,
                            },
                        };
                        return subtabs;
                    },
                    {},
                ),
            };
        }

        return tabs;
    }

    protected override async _prepareContext(
        options: ApplicationRenderOptions,
    ): Promise<object> {
        const context = await super._prepareContext(options);

        return Object.assign(context, {
            tabs: this.#prepareTabs(),
            rootId: this.id,
            hudButtonPartial: RegistrationConfig._hudButtonPartial,
            sceneControlPartial: RegistrationConfig._sceneControlPartial,
        });
    }
}

export { RegistrationConfig };
