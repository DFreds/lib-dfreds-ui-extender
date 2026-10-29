function createTabConfig(input: { documentName?: string; tooltip?: string; icon?: string; gmOnly?: boolean }) {
    if (input.documentName) {
        return { documentName: input.documentName };
    }
    return { tooltip: input.tooltip, icon: input.icon, gmOnly: input.gmOnly };
}

function insertTab(entries: [string, any][], id: string, config: any, index: number) {
    const isValidIndex = Number.isInteger(index) && index >= 0;
    const at = isValidIndex ? index : entries.length;
    return Object.fromEntries(entries.toSpliced(at, 0, [id, config]));
}

function insertTabNextTo(
    tabs: Record<string, any>,
    id: string,
    config: any,
    targetId: string,
    placement: "before" | "after",
) {
    const entries = Object.entries(tabs).filter(([key]) => key !== id);
    if (targetId === id) return Object.fromEntries(entries);

    const targetIndex = entries.findIndex(([key]) => key === targetId);
    return insertTab(entries, id, config, placement === "before" ? targetIndex : targetIndex + 1);
}

function createDirectory(input: DirectoryInput): void {
    const { id, before, after, order, applicationClass } = input;
    const tabConfig = createTabConfig(input);
    const tabs = CONFIG.ui.sidebar.TABS;

    if (before !== undefined && before in tabs) {
        CONFIG.ui.sidebar.TABS = insertTabNextTo(tabs, id, tabConfig, before, "before");
    } else if (after !== undefined && after in tabs) {
        CONFIG.ui.sidebar.TABS = insertTabNextTo(tabs, id, tabConfig, after, "after");
    } else if (order !== undefined) {
        CONFIG.ui.sidebar.TABS = insertTab(Object.entries(tabs), id, tabConfig, order);
    } else {
        CONFIG.ui.sidebar.TABS[id] = tabConfig;
    }

    // @ts-expect-error Type mismatch with Foundry's types
    CONFIG.ui[id] = applicationClass;
}

export { createDirectory };
