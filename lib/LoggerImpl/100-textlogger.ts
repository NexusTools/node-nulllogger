@nodereq stream

@include BasicLoggerImpl
@include LoggerLevel

class TextLoggerImpl extends BasicLoggerImpl {
    log(level:LoggerLevel, scopes:string[], messages:any[], out:stream.Writable) {
        out.write("[");
        out.write(BasicLoggerImpl.elapsed());
        out.write("]");
        
        out.write(" [");
        out.write(LoggerLevel[level]);
        out.write("]");
        
        if(scopes)
            scopes.forEach(function(scope){
                out.write(" [");
                out.write(scope);
                out.write("]");
            });
        messages.forEach(function(message){
            out.write(" ");
            out.write(message);
        });
        out.write("\n\n");
    }
}

@main TextLoggerImpl