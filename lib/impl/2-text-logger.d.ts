/// <reference types="node" />
import { CleanedScope } from "../baseimpl";
import NullLogger = require("../logger");
declare const _default: {
    new (): {
        filename: string;
        buildScopeCache(loggerOrScopes: string | NullLogger | string[]): string;
        levelStr(level: number): string;
        timestamp: () => string;
        tag(level: import("../../types").LoggerLevel): string;
        inspect0(object: any): string;
        log(level: import("../../types").LoggerLevel, loggerOrScopes: string | NullLogger | string[], message: any[]): void;
    };
    MIN_LEVEL: import("../../types").LoggerLevel;
    OUT: NodeJS.WriteStream;
    ERR: NodeJS.WriteStream;
    parseScopes(scopes: string[], scopesIsCopy?: boolean): CleanedScope[];
    isVerbose(level: import("../../types").LoggerLevel): boolean;
    pad(val: number, amnt?: number): string;
    formatDate(date?: Date): string;
    setMinLevel(minLevel: string): void;
};
export = _default;
