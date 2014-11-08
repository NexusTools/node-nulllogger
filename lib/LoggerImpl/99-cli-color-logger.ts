@nodereq cli-color:clc
@nodereq stream

@include LoggerLevel
@include BasicLoggerImpl


class CliColorLoggerImpl extends BasicLoggerImpl {
    log(level:LoggerLevel, scopes:string[], messages:any[], out:stream.Writable) {
        var elapsed = BasicLoggerImpl.elapsed();
        if(level >= LoggerLevel.Error)
            out.write(clc.red(elapsed));
        else if(level >= LoggerLevel.Warning)
            out.write(clc.yellow(elapsed));
        else
            out.write(clc.white(elapsed));
        
        if(scopes)
            scopes.forEach(function(scope){
                out.write(" ");
                out.write(clc.magenta(scope));
            });
        messages.forEach(function(message){
            out.write(" ");
            BasicLoggerImpl.write(message, out);
        });
        out.write("\n");
    }
}

@main CliColorLoggerImpl