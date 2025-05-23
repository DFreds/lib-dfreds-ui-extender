import { ApplicationConfiguration } from "types/foundry/client-esm/applications/_types.js";
import { MODULE_ID } from "./constants.ts";
import { UiExtender } from "./ui-extender.ts";
import { HandlebarsTemplatePart } from "types/foundry/client-esm/applications/api/handlebars-application.ts";

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
            applicationClass: SampleApplication,
            predicate: () => {
                return true;
            },
        });

        uiExtender.registerSceneControl({
            moduleId: MODULE_ID,
            name: "tokens",
            tool: {
                name: "testingButton",
                title: "DFreds Test Button",
                icon: "fas fa-robot",
                button: true,
                order: 2,
                onChange: (event, active) => {
                    console.log("onChange", event, active);
                    ui.notifications.info(`You clicked me! Active: ${active}`);
                },
            },
        });

        uiExtender.registerHudButton({
            moduleId: MODULE_ID,
            hudType: "token",
            tooltip: "Show Art Button",
            icon: `<i class="fas fa-image fa-fw"></i>`,
            location: "div.left",
            predicate: (_token: any) => {
                return true;
            },
            onClick: (
                _event: JQuery.ClickEvent,
                _button: JQuery,
                _token: any,
            ) => {
                console.log("clicked");
            },
            onRightClick: (
                _event: JQuery.ContextMenuEvent,
                _button: JQuery,
                _token: any,
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
            ) => {
                console.log("clicked", tile);
            },
            onRightClick: (
                _event: JQuery.ContextMenuEvent,
                _button: JQuery,
                tile: any,
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
            ) => {
                ui.notifications.info(
                    `Hello from drawing ${drawing.fillColor}`,
                );
            },
        });
    });
}
