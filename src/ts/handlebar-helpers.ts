class HandlebarHelpers {
    register(): void {
        this.#registerIsGm();
        this.#registerStripHtml();
    }

    #registerIsGm() {
        Handlebars.registerHelper("isGm", () => {
            return game.user.isGM;
        });
    }

    #registerStripHtml() {
        Handlebars.registerHelper("stripHtml", (str: string) => {
            const regExp = /<[/\w]+>/g;
            return new Handlebars.SafeString(str.replace(regExp, ""));
        });
    }
}

export { HandlebarHelpers };
