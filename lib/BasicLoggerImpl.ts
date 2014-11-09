@nodereq underscore:_

@reference LoggerImpl
@include LoggerLevel

class BasicLoggerImpl implements LoggerImpl {
    private static _minlevel:LoggerLevel;
    private static _start = Date.now();
    
    public static isVerbose(level:LoggerLevel) {
        return level >= BasicLoggerImpl._minlevel;
    }
    
    public static elapsed() {
        var elapsed = Date.now() - BasicLoggerImpl._start;
        
        var tim = String(elapsed%1000);
        while(tim.length < 3)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/1000))%60 + "." + tim;
        while(tim.length < 6)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/60))%60 + ":" + tim;
        while(tim.length < 9)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/60))%60 + ":" + tim;
        while(tim.length < 12)
            tim = "0" + tim;
        tim = (elapsed = Math.floor(elapsed/24))%24 + " " + tim;
        while(tim.length < 15)
            tim = "0" + tim;
        
        return tim;
    }
    
    public static write(message:any, out:stream.Writable) {
        try {
            if(!_.isString(message))
                throw "Not a string";
            out.write("" + message);
        } catch(e) {
            var obj = _.isObject(message) && obj != "object";
            if(obj) {
                var type = message.constructor.name;
                if(obj = (type != "Object" && type != "Array")) {
                    out.write(type);
                    out.write("(");
                }
            }
            if(message instanceof RegExp)
                out.write(message.toString());
            else
                out.write(JSON.stringify(message));
            if(obj)
                out.write(")");
        }
    }
}

if(process.env.VERBOSE) {
    var verbose = parseFloat(process.env.VERBOSE);
    if(isFinite(verbose) && !isNaN(verbose))
        BasicLoggerImpl._minlevel = verbose;
    else {
        verbose = process.env.VERBOSE;
        verbose = verbose.substring(0, 1).toUpperCase() + verbose.substring(1).toLowerCase();
        if(!LoggerLevel[verbose])
            throw new Error(process.env.VERBOSE + " is not a valid logger verbosity setting.");
        
        BasicLoggerImpl._minlevel = LoggerLevel[verbose];
    }
} else if(process.env.NODE_ENV && process.env.NODE_ENV == "test") // Don't crowd testing output
    BasicLoggerImpl._minlevel = LoggerLevel.Silent;
else
    BasicLoggerImpl._minlevel = LoggerLevel.Perf;

@main BasicLoggerImpl