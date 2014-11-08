@reference LoggerLevel

declare stream:any;

interface LoggerImpl {
    log(level:LoggerLevel, scopes:string[], messages:any[], out:stream.Writable);
}