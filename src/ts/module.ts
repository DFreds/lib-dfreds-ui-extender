// import ApplicationV2 from "types/foundry/client-esm/applications/api/application.js";
import "../styles/style.scss"; // Keep or else vite will not include this
import { HooksUiExtender } from "./hooks/index.ts";
import { mySampleModule } from "./sample.ts";
import { UiExtender } from "./ui-extender.ts";

interface ThisModule extends Module {
    uiExtender: UiExtender;
}

HooksUiExtender.listen();

mySampleModule(); // TODO remove this when releasing

export type { ThisModule };
