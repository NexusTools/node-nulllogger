"use strict";
(function (LoggerLevel) {
    LoggerLevel[LoggerLevel["Gears"] = 0] = "Gears";
    LoggerLevel[LoggerLevel["Debugging"] = 1] = "Debugging";
    LoggerLevel[LoggerLevel["Debug"] = 1] = "Debug";
    LoggerLevel[LoggerLevel["Performance"] = 2] = "Performance";
    LoggerLevel[LoggerLevel["Perf"] = 2] = "Perf";
    LoggerLevel[LoggerLevel["Timer"] = 3] = "Timer";
    LoggerLevel[LoggerLevel["Information"] = 4] = "Information";
    LoggerLevel[LoggerLevel["Info"] = 4] = "Info";
    LoggerLevel[LoggerLevel["Warning"] = 5] = "Warning";
    LoggerLevel[LoggerLevel["Warn"] = 5] = "Warn";
    LoggerLevel[LoggerLevel["Error"] = 6] = "Error";
    LoggerLevel[LoggerLevel["Fatal"] = 7] = "Fatal";
    LoggerLevel[LoggerLevel["Silent"] = 8] = "Silent";
})(exports.LoggerLevel || (exports.LoggerLevel = {}));
var LoggerLevel = exports.LoggerLevel;
(function (Color) {
    Color[Color["Grey"] = 0] = "Grey";
    Color[Color["E"] = 0] = "E";
    Color[Color["Black"] = 0] = "Black";
    Color[Color["R"] = 1] = "R";
    Color[Color["Red"] = 1] = "Red";
    Color[Color["G"] = 2] = "G";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Y"] = 3] = "Y";
    Color[Color["Yellow"] = 3] = "Yellow";
    Color[Color["B"] = 4] = "B";
    Color[Color["Blue"] = 4] = "Blue";
    Color[Color["M"] = 5] = "M";
    Color[Color["Magenta"] = 5] = "Magenta";
    Color[Color["C"] = 6] = "C";
    Color[Color["Cyan"] = 6] = "Cyan";
    Color[Color["W"] = 7] = "W";
    Color[Color["White"] = 7] = "White";
})(exports.Color || (exports.Color = {}));
var Color = exports.Color;
//# sourceMappingURL=Def.js.map