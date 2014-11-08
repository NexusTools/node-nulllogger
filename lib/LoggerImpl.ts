@reference LoggerLevel

interface LoggerImpl {
    log(level:LoggerLevel, scopes:string[], messages:any[], out:stream.Writable);
}