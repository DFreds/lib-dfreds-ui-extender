import { SceneControl } from "@client/applications/ui/scene-controls.mjs";

interface Ordered {
    name: string;
    order?: number;
}

function insertOrdered(record: Record<string, Ordered>, item: Ordered): void {
    const order = item.order ?? Object.keys(record).length + 1; // Foundry starts at 1

    if (item.order !== undefined) {
        Object.values(record).forEach((existing) => {
            const existingOrder = existing.order as number;

            if (existingOrder >= order) {
                existing.order = existingOrder + 1;
            }
        });
    }

    record[item.name] = { ...item, order };
}

function controlOrder(controls: Record<string, SceneControl>, input: SceneControlInput): number | undefined {
    const { before, after, control } = input;

    if (before !== undefined && controls[before]) return controls[before].order;
    if (after !== undefined && controls[after]) return controls[after].order + 1;
    return control.order;
}

function createSceneControl(input: SceneControlInput): void {
    Hooks.on("getSceneControlButtons", (controls: Record<string, SceneControl>) => {
        const { predicate, gmOnly, control } = input;

        if (predicate && predicate(controls) === false) return;
        if (gmOnly && !game.user.isGM) return;

        if (controls[control.name]) {
            throw new Error(`Scene control ${control.name} already exists`);
        }

        const tools = Object.fromEntries(
            control.tools.map((tool, index) => [tool.name, { ...tool, order: tool.order ?? index + 1 }]),
        );

        const builtControl = { ...control, order: controlOrder(controls, input), tools };

        insertOrdered(controls as unknown as Record<string, Ordered>, builtControl);
    });
}

function createSceneControlTool(input: SceneControlToolInput): void {
    Hooks.on("getSceneControlButtons", (controls: Record<string, SceneControl>) => {
        const { name, predicate, tool } = input;

        if (predicate && predicate(controls) === false) return;

        const targetControl = controls[name];

        if (!targetControl) {
            throw new Error(`Cannot find target control ${name}`);
        }

        insertOrdered(targetControl.tools as unknown as Record<string, Ordered>, { ...tool });
    });
}

export { createSceneControl, createSceneControlTool };
