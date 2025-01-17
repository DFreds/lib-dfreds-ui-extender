import "../styles/style.scss"; // Keep or else vite will not include this
import { HooksUiExtender } from "./hooks/index.ts";
import { UiExtender } from "./ui-extender.ts";

interface ThisModule extends Module {
    uiExtender: UiExtender;
}

HooksUiExtender.listen();

export type { ThisModule };
