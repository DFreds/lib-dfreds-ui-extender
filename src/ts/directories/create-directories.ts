function createTabConfig(input: {
    documentName?: string;
    tooltip?: string;
    icon?: string;
}) {
    if (input.documentName) {
        return { documentName: input.documentName };
    }
    return { tooltip: input.tooltip, icon: input.icon };
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

function createDirectory(input: DirectoryInput): void {
    const { id, order, applicationClass } = input;
    const tabConfig = createTabConfig(input);

    if (order !== undefined) {
        CONFIG.ui.sidebar.TABS = insertTabAtOrder({
            tabs: CONFIG.ui.sidebar.TABS,
            newTabId: id,
            config: tabConfig,
            order,
        });
    } else {
        CONFIG.ui.sidebar.TABS[id] = tabConfig;
    }

    // @ts-expect-error Type mismatch with Foundry's types
    CONFIG.ui[id] = applicationClass;
}

export { createDirectory };
