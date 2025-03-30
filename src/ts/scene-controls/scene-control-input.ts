interface SceneControlInput {
    /**
     * The ID of the module registering
     */
    moduleId: string;

    /**
     * The name of the control layer
     */
    name:
        | "tokens"
        | "templates"
        | "tiles"
        | "drawings"
        | "walls"
        | "lighting"
        | "sounds"
        | "regions"
        | "notes";

    /**
     * The predicate to determine if the control should be visible
     *
     * @param data The data for the controls
     * @returns true if the control should be added, false otherwise
     */
    predicate?: (data: any) => boolean;

    /**
     * The tool data
     */
    tool: SceneControlToolInput;
}

interface SceneControlToolInput {
    name: string;
    order?: number;
    title: string;
    icon: string;
    visible?: boolean;
    toggle?: boolean;
    active?: boolean;
    button?: boolean;
    onChange?: (event?: Event, active?: boolean) => void;
    toolclip?: ToolclipConfigurationInput;
}

interface ToolclipConfigurationInput {
    /** The filename of the toolclip video. */
    src: string;
    /** The heading string. */
    heading: string;
    /** The items in the toolclip body. */
    items: ToolclipConfigurationItemInput[];
}

interface ToolclipConfigurationItemInput {
    /** A plain paragraph of content for this item. */
    paragraph?: string;
    /** A heading for the item. */
    heading?: string;
    /** Content for the item. */
    content?: string;
    /** If the item is a single key reference, use this instead of content. */
    reference?: string;
}

export type {
    SceneControlInput,
    SceneControlToolInput,
    ToolclipConfigurationInput,
    ToolclipConfigurationItemInput,
};
