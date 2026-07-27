function createTabConfig(input: { documentName?: string; tooltip?: string; icon?: string; gmOnly?: boolean }) {
    if (input.documentName) {
        return { documentName: input.documentName };
    }
    return { tooltip: input.tooltip, icon: input.icon, gmOnly: input.gmOnly };
}

function insertTabAtOrder({
    tabs,
    newTabId,
    config,
    order,
}: {
    tabs: Record<string, any>;
    newTabId: string;
    config: any;
    order: number;
}) {
    const newTabs: Record<string, any> = {};
    let inserted = false;

    Object.entries(tabs).forEach(([key, value], index) => {
        if (index === order && !inserted) {
            newTabs[newTabId] = config;
            inserted = true;
        }
        newTabs[key] = value;
    });

    if (!inserted) {
        newTabs[newTabId] = config;
    }

    return newTabs;
}

function insertTabAdjacentTo({
    tabs,
    newTabId,
    config,
    targetId,
    placement,
}: {
    tabs: Record<string, any>;
    newTabId: string;
    config: any;
    targetId: string;
    placement: "before" | "after";
}) {
    const newTabs: Record<string, any> = {};

    Object.entries(tabs).forEach(([key, value]) => {
        if (key === newTabId) return;

        if (key === targetId && placement === "before") {
            newTabs[newTabId] = config;
        }

        newTabs[key] = value;

        if (key === targetId && placement === "after") {
            newTabs[newTabId] = config;
        }
    });

    return newTabs;
}

function createDirectory(input: DirectoryInput): void {
    const { id, before, after, order, applicationClass } = input;
    const tabConfig = createTabConfig(input);
    const tabs = CONFIG.ui.sidebar.TABS as unknown as Record<string, any>;

    if (before !== undefined && before in tabs) {
        CONFIG.ui.sidebar.TABS = insertTabAdjacentTo({
            tabs,
            newTabId: id,
            config: tabConfig,
            targetId: before,
            placement: "before",
        });
    } else if (after !== undefined && after in tabs) {
        CONFIG.ui.sidebar.TABS = insertTabAdjacentTo({
            tabs,
            newTabId: id,
            config: tabConfig,
            targetId: after,
            placement: "after",
        });
    } else if (order !== undefined) {
        CONFIG.ui.sidebar.TABS = insertTabAtOrder({
            tabs: CONFIG.ui.sidebar.TABS,
            newTabId: id,
            config: tabConfig,
            order,
        });
    } else {
        // @ts-expect-error Type mismatch with Foundry's types
        CONFIG.ui.sidebar.TABS[id] = tabConfig;
    }

    // @ts-expect-error Type mismatch with Foundry's types
    CONFIG.ui[id] = applicationClass;
}

export { createDirectory };
