/// <reference types="node" />
import { CleanedScope } from "../baseimpl";
import { LoggerLevel } from "../../types";
import NullLogger = require("../logger");
declare const _default: {
    new (): {
        filename: string;
        inspect0(object: any): string;
        tag(level: LoggerLevel): any;
        buildScopeCache(loggerOrScopes: string | NullLogger | string[]): string;
        levelStr(level: number): string;
        timestamp: () => string;
        log(level: LoggerLevel, loggerOrScopes: string | NullLogger | string[], message: any[]): void;
    };
    MIN_LEVEL: LoggerLevel;
    OUT: NodeJS.WriteStream;
    ERR: NodeJS.WriteStream;
    parseScopes(scopes: string[], scopesIsCopy?: boolean): CleanedScope[];
    isVerbose(level: LoggerLevel): boolean;
    pad(val: number, amnt?: number): string;
    formatDate(date?: Date): string;
    setMinLevel(minLevel: string): void;
};
export = _default;
