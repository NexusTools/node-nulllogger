@nodereq stream

@include BuiltInLoggerImpl
@include LoggerLevel

class TextLoggerImpl extends BuiltInLoggerImpl {
    log(level:LoggerLevel, scopes:string[], messages:any[], out:stream.Writable) {
        if(!BuiltInLoggerImpl.isVerbose(level))
            return;
        
        out.write("[");
        out.write(BuiltInLoggerImpl.elapsed());
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
            BuiltInLoggerImpl.write(message, out);
        });
        out.write("\n");
    }
}

@main TextLoggerImpl