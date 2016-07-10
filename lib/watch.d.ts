export declare function Watch(name: string): any;
export declare function Watch(name: string, options: WatchOption): any;
export interface WatchOption {
    handler?: (val: any, oldVal: any) => void;
    deep?: boolean;
    immidiate?: boolean;
}
