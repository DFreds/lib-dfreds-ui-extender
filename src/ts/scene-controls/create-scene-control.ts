import { SceneControl } from "@client/applications/ui/scene-controls.mjs";

function createSceneControl(input: SceneControlToolInput): void {
    Hooks.on("getSceneControlButtons", (controls: Record<string, SceneControl>) => {
        const { name, predicate, tool } = input;

        if (predicate && predicate(controls) === false) return;

        const targetControl = controls[name];

        if (!targetControl) {
            throw new Error(`Cannot find target control ${name}`);
        }

        const targetControlTools = targetControl.tools as unknown as Record<string, SceneControlToolData>;

        const builtTool = { ...tool, order: tool.order ?? Object.keys(targetControl.tools).length + 1 }; // Foundry starts at 1

        if (tool.order !== undefined) {
            // Shift existing tools' orders to make space for the new tool
            Object.values(targetControlTools).forEach((existingTool) => {
                const toolOrder = builtTool.order;
                const existingOrder = existingTool.order as number;

                if (existingOrder >= toolOrder) {
                    existingTool.order = existingOrder + 1;
                }
            });
        }

        targetControlTools[builtTool.name] = builtTool;
    });
}

export { createSceneControl };
