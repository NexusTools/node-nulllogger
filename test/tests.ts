require("source-map-support").install();
import assert = require('assert');
import child_process = require("child_process");
import path = require('path');

process.env.VERBOSE = "Gears"; // All possible verbosity levels

var logger;
it("require main", function () {
    logger = require(path.dirname(__dirname));
});
describe('api', function () {
    it("scope colors", function () {
        for (var i = 0; i < 255; i++) {
            let color: any = i;
            logger.log(logger.Level.Information, [color + ":" + color], ["Test"]);

            color = "x" + i.toString(16);
            logger.log(logger.Level.Information, [color + ":" + color], ["Test"]);
        }
        Object.keys(logger.Color).forEach(function(color) {
            logger.log(logger.Level.Information, [color + ":" + color], ["Test"]);
        });
    });

    it("static levels", function () {
        logger.gears("Test");
        logger.info("Test");
        logger.warn("Test", 44);
        logger.warning(new Date);
        logger.error("Test", { farm: 43 });
        logger.debug(/.+/i);
        logger.debugging(Symbol.iterator);
        logger.perf(new String(373.5));
        logger.performance(require.extensions);
        logger.error("");

    });
    var logInstance;
    it("scope instance", function () {
        logInstance = new logger("Mocha");
    });
    it("scope log", function () {
        logInstance.gears("Test");
        logInstance.info("Test");
        logInstance.info("Test", []);
        logInstance.info("Test", new Date());
        logInstance.warn("Test", 44);
        logInstance.error("Test", {farm: 43});
        logInstance.debug(/.+/i);
        logInstance.performance(new String(373.5));
        logInstance.error("");
    });
    it("extended scope", function () {
        logInstance = logInstance.extend("green:Extended");
        logInstance.info("Test");
        logInstance.info("Test", []);
        logInstance.info("Test", new Date());
        logInstance.warn("Test", 44);
        logInstance.error("Test", {farm: 43});
        logInstance.debugging(/.+/i);
        logInstance.perf(new String(373.5));
        logInstance.error("");
    });
    it("timer", function () {
        logInstance.timer("Test", function (logInstance) {
            logInstance.info("Test");
            logInstance.information("Test", []);
            logInstance.info("Test", new Date());
            logInstance.warning("Test", 44);
            logInstance.error("Test", {farm: 43});
            logInstance.debug(/.+/i);
            logInstance.perf(new String(373.5));
            logInstance.error("");
        });
    });
});
