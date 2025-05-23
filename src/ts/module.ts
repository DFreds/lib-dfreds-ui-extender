import "../styles/style.scss"; // Keep or else vite will not include this
import { HooksUiExtender } from "./hooks/index.ts";
import { mySampleModule } from "./sample.ts";

HooksUiExtender.listen();

if (BUILD_MODE === "development") {
    mySampleModule();
}
