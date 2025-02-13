import { SceneControlInput } from "./scene-control-input.ts";

function createSceneControl(input: SceneControlInput): void {
    Hooks.on("getSceneControlButtons", (controls: SceneControl[]) => {
        const { name, position, predicate, tool } = input;

        if (predicate && predicate(controls) === false) return;

        const targetControl = controls.find((control) => control.name === name);

        if (!targetControl) {
            throw new Error(`Cannot find target control ${name}`);
        }

        if (position && targetControl.tools.length > position) {
            targetControl.tools.splice(position, 0, tool);
        } else {
            targetControl.tools.push(tool);
        }
    });
}

export { createSceneControl };
