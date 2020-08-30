/**
 * File to store globally used types not associated with a specific function/file
 * */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type anyArray = any[];
export type funcType<P extends anyArray, R> = (...args: P) => Promise<R>;
