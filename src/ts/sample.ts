import { HandlebarsTemplatePart } from "@client/applications/api/_module.mjs";
import { MODULE_ID } from "./constants.ts";
import { ApplicationConfiguration } from "@client/applications/_module.mjs";
import { BasePlaceableHUD } from "@client/applications/hud/_module.mjs";

const { AbstractSidebarTab } = foundry.applications.sidebar;
const { HandlebarsApplicationMixin } = foundry.applications.api;

class SampleApplication extends HandlebarsApplicationMixin(AbstractSidebarTab) {
    static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
        window: {
            title: "Sample",
        },
    };

    static override PARTS: Record<string, HandlebarsTemplatePart> = {
        sample: {
            template: `modules/${MODULE_ID}/templates/sample.hbs`,
        },
    };

    static override tabName: string = "sample";
}

// Module usage
export function mySampleModule(): void {
    // @ts-expect-error Type mismatch
    Hooks.once("uiExtender.init", (uiExtender: UiExtender) => {
        uiExtender.registerDirectory({
            moduleId: MODULE_ID,
            id: "sample",
            tooltip: "Sample",
            icon: "fas fa-robot",
            order: 1,
            gmOnly: true,
            applicationClass: SampleApplication,
            predicate: () => {
                return true;
            },
        });

        ["tokens", "templates", "tiles", "drawings", "walls", "lighting", "sounds", "regions", "notes"].forEach((name, index) => {
            uiExtender.registerSceneControl({
                moduleId: MODULE_ID,
                name: name as "tokens" | "tiles" | "drawings" | "walls" | "lighting" | "sounds" | "regions" | "notes",
                tool: {
                    name: `testingButton${index}`,
                    title: `DFreds Test Button ${index}`,
                    icon: "fas fa-robot",
                    toggle: index === 0 ? true : false,
                    button: index === 1 ? true : false,
                    interaction: index === 2 ? true : false,
                    control: index === 3 ? true : false,
                    creation: name === "regions" ? true : false,
                    shapeData: name === "regions" ? {
                        type: "rectangle",
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    } : undefined,
                    order: index,
                    onChange: (event, active) => {
                        console.log("onChange", event, active);
                        ui.notifications.info(`You clicked me! Active: ${active}`);
                    },
                },
            });
        });

        uiExtender.registerHudButton({
            moduleId: MODULE_ID,
            hudType: "token",
            tooltip: "Show Art Button",
            icon: `<i class="fas fa-image"></i>`,
            location: "div.left",
            predicate: (_token: any) => {
                return true;
            },
            onClick: (
                _event: JQuery.ClickEvent,
                _button: JQuery,
                _token: any,
                _hud: BasePlaceableHUD,
            ) => {
                console.log("clicked");
            },
            onRightClick: (
                _event: JQuery.ContextMenuEvent,
                _button: JQuery,
                _token: any,
                _hud: BasePlaceableHUD,
            ) => {
                console.log("right clicked");
            },
        });

        uiExtender.registerHudButton({
            moduleId: MODULE_ID,
            hudType: "tile",
            tooltip: "Show Art Button",
            icon: `<i class="fas fa-image fa-fw"></i>`,
            location: "div.left",
            onClick: (
                _event: JQuery.ClickEvent,
                _button: JQuery,
                tile: any,
                _hud: BasePlaceableHUD,
            ) => {
                console.log("clicked", tile);
            },
            onRightClick: (
                _event: JQuery.ContextMenuEvent,
                _button: JQuery,
                tile: any,
                _hud: BasePlaceableHUD,
            ) => {
                console.log("right clicked", tile);
            },
        });

        uiExtender.registerHudButton({
            moduleId: MODULE_ID,
            hudType: "drawing",
            tooltip: "Say Hi",
            icon: `<i class="fas fa-robot fa-fw"></i>`,
            location: "div.right",
            onClick: (
                _event: JQuery.ClickEvent,
                _button: JQuery,
                drawing: any,
                _hud: BasePlaceableHUD,
            ) => {
                ui.notifications.info(
                    `Hello from drawing ${drawing.fillColor}`,
                );
            },
        });
    });
}
