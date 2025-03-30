import {
    SceneControlInput,
    SceneControlToolInput,
} from "./scene-control-input.ts";

function createSceneControl(input: SceneControlInput): void {
    Hooks.on(
        "getSceneControlButtons",
        // @ts-expect-error Ignore this, this is the correct type
        (controls: Record<string, SceneControl>) => {
            const { name, predicate, tool } = input;

            if (predicate && predicate(controls) === false) return;

            const targetControl = controls[name];

            if (!targetControl) {
                throw new Error(`Cannot find target control ${name}`);
            }

            const targetControlTools = targetControl.tools as unknown as Record<
                string,
                SceneControlToolInput
            >;

            if (tool.order === undefined) {
                tool.order = Object.keys(targetControl.tools).length + 1; // Foundry starts at 1
            } else {
                // Shift existing tools' orders to make space for the new tool
                Object.values(targetControlTools).forEach((existingTool) => {
                    const toolOrder = tool.order as number;
                    const existingOrder = existingTool.order as number;

                    if (existingOrder >= toolOrder) {
                        existingTool.order = existingOrder + 1;
                    }
                });
            }

            targetControlTools[tool.name] = tool;
        },
    );
}

export { createSceneControl };
