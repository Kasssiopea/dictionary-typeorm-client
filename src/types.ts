
type Primitive = string | number | boolean | null | undefined | Date;
export interface ObjWithDictMeta {
    // new(...args: any[]): ObjWithDictMeta;
    [key: string]: any;
    _dicts?: { [key: string]: string };
}

export interface KeyValue {
    key: string;
    value: string;
}

export declare type KeyValueMulti = KeyValue[];
export declare type KeyValuePairOrNull = KeyValue | KeyValueMulti | null;

export type ObjectWithDict<T extends ObjWithDictMeta> = {
    [K in keyof T]: K extends keyof T['_dicts']
        ? KeyValuePairOrNull
        : K extends '_dicts'
            ? T[K]
            : T[K] extends Array<infer I>
                ? I extends ObjWithDictMeta // Добавлено ограничение типа для I
                    ? ObjectWithDict<I>[]
                    : never
                : T[K] extends Primitive ?
                  T[K] : T[K] extends object
                    ? ObjectWithDict<T[K]>
                    : never;
};

export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
