function createSettingsButtons(inputs: SettingsButtonInput[]): void {
    if (inputs.length === 0) return;

    Hooks.on("renderSettings", (_app: unknown, element: HTMLElement) => {
        const visible = inputs.filter((input) => !input.gmOnly || game.user.isGM);

        if (visible.length === 0) return;

        const section = buildSection(visible);
        const documentation = element.querySelector("section.documentation");

        if (documentation) {
            documentation.before(section);
        } else {
            element.append(section);
        }
    });
}

function buildSection(inputs: SettingsButtonInput[]): HTMLElement {
    const section = document.createElement("section");
    section.classList.add("module-settings", "flexcol");

    const header = document.createElement("h4");
    header.classList.add("divider");
    header.innerText = game.i18n.localize("UiExtender.ModuleSettings.Header");
    section.append(header);

    inputs
        .map((input) => ({ input, label: game.i18n.localize(input.name) }))
        .sort((a, b) => a.label.localeCompare(b.label))
        .forEach(({ input, label }) => {
            section.append(buildButton(input, label));
        });

    return section;
}

function buildButton(input: SettingsButtonInput, label: string): HTMLButtonElement {
    const button = document.createElement("button");

    button.type = "button";

    // Matches the markup Foundry uses for its own settings sidebar buttons
    const icon = document.createElement("i");
    icon.className = input.icon;
    icon.toggleAttribute("inert", true);
    button.append(icon, ` ${label}`);

    button.addEventListener("click", () => {
        new input.applicationClass().render({ force: true });
    });

    return button;
}

export { createSettingsButtons };
