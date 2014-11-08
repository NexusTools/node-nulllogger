@nodereq underscore:_

@reference LoggerImpl

class BasicLoggerImpl implements LoggerImpl {
    private static _start = Date.now();
    
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
        if(_.isString(message))
            out.write(message);
        else {
            var obj = _.isObject(message) && obj != "object";
            if(obj) {
                var type = message.constructor.name;
                if(obj = (type != "Object" && type != "Array")) {
                    out.write(type);
                    out.write("(");
                }
            }
            out.write(JSON.stringify(message));
            if(obj)
                out.write(")");
        }
    }
    
}

@main BasicLoggerImpl