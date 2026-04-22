function createHudButton(input: HudButtonInput): void {
    const type = input.hudType.capitalize();

    Hooks.on(
        `render${type}HUD`,
        // @ts-expect-error Ignore this, it can't do dynamic hook names
        (hud: BasePlaceableHUD, html: HTMLElement, data: object) => {
            const {
                tooltip,
                action,
                icon,
                attributes,
                location,
                predicate,
                onClick,
                onRightClick,
                onRenderComplete,
            } = input;

            if (predicate && predicate(data) === false) return;

            const button = generateButton({
                icon,
                action,
                tooltip,
                attributes,
            });

            if (onClick) {
                button.on("click", (event: JQuery.ClickEvent) => {
                    onClick(event, button, data, hud);
                });
            }

            if (onRightClick) {
                button.on("contextmenu", (event: JQuery.ContextMenuEvent) => {
                    onRightClick(event, button, data, hud);
                });
            }

            const $html = $(html);
            $html.find(location).append(button);

            if (onRenderComplete) {
                onRenderComplete(hud, $html, data);
            }
        },
    );
}

function generateButton({
    icon,
    action,
    tooltip,
    attributes,
}: {
    icon: string;
    action?: string;
    tooltip: string;
    attributes?: Record<string, string>;
}): JQuery<HTMLButtonElement> {
    const button = $(document.createElement("button"));

    button.attr("type", "button");
    button.addClass("control-icon");
    button.html(icon);

    button.attr("data-action", action ?? tooltip.toLowerCase().slugify());
    button.attr("data-tooltip", tooltip);

    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
            button.attr(key, value);
        });
    }

    return button;
}

export { createHudButton };
