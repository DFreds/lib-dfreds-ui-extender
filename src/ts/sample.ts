import { UiExtender } from "./ui-extender.ts";

// Module usage
export function mySampleModule(): void {
    // @ts-expect-error Type mismatch
    Hooks.once("uiExtender.init", (uiExtender: UiExtender) => {
        uiExtender.registerSceneControl({
            name: "token",
            position: 2,
            tool: {
                name: "testing-button",
                title: "DFreds Test Button",
                icon: "fas fa-robot",
                button: true,
                visible: true,
                onClick: () => {
                    ui.notifications.info("You clicked me!");
                },
            },
        });

        // TODO entire module out of this
        uiExtender.registerHudButton({
            hudType: "token",
            tooltip: "Show Art Button",
            icon: `<i class="fas fa-image fa-fw"></i>`,
            location: "div.left",
            onClick: (_event: JQuery.ClickEvent, token: any) => {
                const actor = game.actors.get(token.actorId);
                const mystery = "icons/svg/mystery-man.svg";
                const synthActor = token.actorData;

                let actorImg = synthActor.img || actor?.img;
                let tokenImg = token.texture.src;

                const am = actorImg === mystery;
                const tm = tokenImg === mystery;

                if (!(am && tm)) {
                    actorImg = am ? tokenImg : actorImg;
                    tokenImg = tm ? actorImg : tokenImg;
                }

                const images = { actor: actorImg, token: tokenImg };
                const M = CONST.TOKEN_DISPLAY_MODES,
                    dn = token.displayName;

                let titles = null;
                if (dn === M.ALWAYS || dn === M.HOVER)
                    titles = {
                        actor: token.actorData.name || actor?.name,
                        token: token.name,
                    };

                titles = {
                    actor: "Actor Image",
                    token: "Token Image",
                };

                new ImagePopout(images.actor, {
                    title: titles.actor,
                    shareable: true,
                }).render(true);
            },
            onRightClick: (_event: JQuery.ContextMenuEvent, token: any) => {
                const actor = game.actors.get(token.actorId);
                const mystery = "icons/svg/mystery-man.svg";
                const synthActor = token.actorData;

                let actorImg = synthActor.img || actor?.img;
                let tokenImg = token.texture.src;

                const am = actorImg === mystery;
                const tm = tokenImg === mystery;

                if (!(am && tm)) {
                    actorImg = am ? tokenImg : actorImg;
                    tokenImg = tm ? actorImg : tokenImg;
                }

                const images = { actor: actorImg, token: tokenImg };
                const M = CONST.TOKEN_DISPLAY_MODES,
                    dn = token.displayName;

                let titles = null;
                if (dn === M.ALWAYS || dn === M.HOVER)
                    titles = {
                        actor: token.actorData.name || actor?.name,
                        token: token.name,
                    };

                titles = {
                    actor: game.i18n.localize("TKNHAB.ActorImg"),
                    token: game.i18n.localize("TKNHAB.TokenImg"),
                };

                new ImagePopout(images.token, {
                    title: titles.token,
                    shareable: true,
                }).render(true);
            },
        });

        uiExtender.registerHudButton({
            hudType: "tile",
            tooltip: "Show Art Button",
            icon: `<i class="fas fa-image fa-fw"></i>`,
            location: "div.left",
            onClick: (_event: JQuery.ClickEvent, tile: any) => {
                new ImagePopout(tile.texture, {
                    title: "Tile Image",
                    shareable: true,
                }).render(true);
            },
            onRightClick: (_event: JQuery.ContextMenuEvent, tile: any) => {
                new ImagePopout(tile.texture, {
                    title: "Tile Image",
                    shareable: true,
                }).render(true);
            },
        });

        uiExtender.registerHudButton({
            hudType: "drawing",
            tooltip: "Say Hi",
            icon: `<i class="fas fa-robot fa-fw"></i>`,
            location: "div.right",
            onClick: (_event: JQuery.ClickEvent, drawing: any) => {
                ui.notifications.info(
                    `Hello from drawing ${drawing.fillColor}`,
                );
            },
        });
    });
}
