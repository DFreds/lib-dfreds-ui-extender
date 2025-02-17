class HandlebarHelpers {
    register(): void {
        this.#registerCompare();
        this.#registerIsGm();
        this.#registerStripHtml();
    }

    /* http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates */
    #registerCompare() {
        Handlebars.registerHelper(
            "compare",
            (
                leftValue: unknown,
                operator: string,
                rightValue: unknown,
                options: any,
            ) => {
                if (options === undefined) {
                    options = rightValue;
                    rightValue = operator;
                    operator = "===";
                }

                const operators: {
                    [key: string]: (l: any, r: any) => boolean;
                } = {
                    "==": function (l: any, r: any) {
                        // eslint-disable-next-line eqeqeq
                        return l == r;
                    },
                    "===": function (l: any, r: any) {
                        return l === r;
                    },
                    "!=": function (l: any, r: any) {
                        // eslint-disable-next-line eqeqeq
                        return l != r;
                    },
                    "!==": function (l: any, r: any) {
                        return l !== r;
                    },
                    "<": function (l: any, r: any) {
                        return l < r;
                    },
                    ">": function (l: any, r: any) {
                        return l > r;
                    },
                    "<=": function (l: any, r: any) {
                        return l <= r;
                    },
                    ">=": function (l: any, r: any) {
                        return l >= r;
                    },
                    typeof: function (l: any, r: any) {
                        // eslint-disable-next-line eqeqeq
                        return typeof l == r;
                    },
                };

                if (!operators[operator]) {
                    throw new Error(
                        "Handlebars Helper 'compare' doesn't know the operator " +
                            operator,
                    );
                }

                const result = operators[operator](leftValue, rightValue);

                if (result) {
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
        );
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
