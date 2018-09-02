/*
 * Generic typescript support for CSS Modules
 */
declare module "*.module.css" {
    interface CssClassNames {
        [className: string]: string;
    }
    const classNames: CssClassNames;
    export = classNames;
}

declare module "*.module.less" {
    interface CssClassNames {
        [className: string]: string;
    }
    const classNames: CssClassNames;
    export = classNames;
}
