interface HudButtonInput {
    /**
     * The ID of the module registering
     */
    moduleId: string;

    /**
     * The type of HUD to use
     */
    hudType: "token" | "tile" | "drawing";

    /**
     * The tooltip when hovering on the HUD button
     */
    tooltip: string;

    /**
     * The name of action when clicking the button
     */
    action?: string;

    /**
     * The HTML that will be used in the button
     */
    icon: string;

    /**
     * The location of the button
     */
    location: "div.left" | "div.right";

    /**
     * The predicate to determine if the button should be added
     *
     * @param data The data for the item with the HUD
     * @returns true if the button should be added, false otherwise
     */
    predicate?: (data: any) => boolean;

    /**
     * The click handler
     *
     * @param event The click event
     * @param button The button element
     * @param data The data for the item with the HUD
     */
    onClick?: (event: JQuery.ClickEvent, button: JQuery, data: any) => void;

    /**
     * The right-click handler
     *
     * @param event The context menu event
     * @param button The button element
     * @param data The data for the item with the HUD
     */
    onRightClick?: (
        event: JQuery.ContextMenuEvent,
        button: JQuery,
        data: any,
    ) => void;

    /**
     * The render complete handler
     *
     * @param hud The base placeable HUD instance
     * @param html The html for the HUD
     * @param data The data for the HUD
     */
    onRenderComplete?: (
        hud: BasePlaceableHUD<any>,
        html: JQuery,
        data: object,
    ) => void;
}

export type { HudButtonInput };
