export declare function VueComponent(element: string): any;
export declare function VueComponent(options: vuejs.ComponentOption): any;
export declare function VueComponent(element: string, options: vuejs.ComponentOption): any;
export declare class RegisteredComponents {
    private static constructors;
    static registerComponent(name: string, constructor: any): void;
    static getComponent(name: string): any;
}
