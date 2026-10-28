import type { BasePlaceableHUD } from "@client/applications/hud/_module.mjs";

function createHudButton(input: HudButtonInput): void {
    const type = input.hudType.capitalize();

    Hooks.on(
        `render${type}HUD`,
        // @ts-expect-error Ignore this, it can't do dynamic hook names
        (hud: BasePlaceableHUD, html: HTMLElement, data: object) => {
            const { tooltip, action, icon, attributes, location, predicate } = input;

            if (predicate && predicate(data) === false) return;

            const button = generateButton({
                icon,
                action,
                tooltip,
                attributes,
            });

            html.querySelector(location)?.append(button);

            if (input.nativeDom) {
                addNativeHandlers(input, button, hud, html, data);
            } else {
                addJQueryHandlers(input, button, hud, html, data);
            }
        },
    );
}

function addNativeHandlers(
    { onClick, onRightClick, onRenderComplete }: HudButtonNativeInput,
    button: HTMLButtonElement,
    hud: BasePlaceableHUD,
    html: HTMLElement,
    data: object,
): void {
    if (onClick) {
        button.addEventListener("click", (event) => onClick(event, button, data, hud));
    }

    if (onRightClick) {
        button.addEventListener("contextmenu", (event) => onRightClick(event, button, data, hud));
    }

    if (onRenderComplete) {
        onRenderComplete(hud, html, data);
    }
}

function addJQueryHandlers(
    { onClick, onRightClick, onRenderComplete }: HudButtonJQueryInput,
    button: HTMLButtonElement,
    hud: BasePlaceableHUD,
    html: HTMLElement,
    data: object,
): void {
    const $button = $(button);

    if (onClick) {
        $button.on("click", (event: JQuery.ClickEvent) => onClick(event, $button, data, hud));
    }

    if (onRightClick) {
        $button.on("contextmenu", (event: JQuery.ContextMenuEvent) => onRightClick(event, $button, data, hud));
    }

    if (onRenderComplete) {
        onRenderComplete(hud, $(html), data);
    }
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
}): HTMLButtonElement {
    const button = document.createElement("button");

    button.type = "button";
    button.classList.add("control-icon");
    button.innerHTML = icon;

    button.dataset.action = action ?? tooltip.toLowerCase().slugify();
    button.dataset.tooltip = tooltip;

    for (const [name, value] of Object.entries(attributes ?? {})) {
        button.setAttribute(name, value);
    }

    return button;
}

export { createHudButton };
