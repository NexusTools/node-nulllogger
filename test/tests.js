var assert = require('assert');
var child_process = require("child_process");
var path = require('path');
require("source-map-support").install();

process.env.VERBOSE = "Gears"; // All possible verbosity levels

var pkg;
var topDir = path.dirname(__dirname);
var supportDir = path.resolve(__dirname, "support");
var pkgfile = path.resolve(topDir, "package.json");
it('parse package.json', function () {
    pkg = require(pkgfile);
    if (!pkg)
        throw new Error("Failed to parse `package.json`");
    if (!("main" in pkg))
        throw new Error("`package.json` missing property `main`");
});
var logger;
it("require main", function () {
    logger = require(topDir);
});
describe('api', function () {
    it("scope colors", function () {
        for (var i = 0; i < 255; i++) {
            var color = i;
            logger.log(logger.Level.Information, [color + ":" + color], ["Test"]);

            color = "x" + i.toString(16);
            logger.log(logger.Level.Information, [color + ":" + color], ["Test"]);
        }
        for (var color in logger.Color) {
            if (isNaN(color)) {
                logger.log(logger.Level.Information, [color + ":" + color], ["Test"]);
            }
        }
    });

    it("static levels", function () {
        logger.gears("Test");
        logger.info("Test");
        logger.warn("Test", 44);
        logger.error("Test", {farm: 43});
        logger.debug(/.+/i);
        logger.perf(new String(373.5));
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
        logInstance.perf(new String(373.5));
        logInstance.error("");
    });
    it("extended scope", function () {
        logInstance = logInstance.extend("green:Extended");
        logInstance.info("Test");
        logInstance.info("Test", []);
        logInstance.info("Test", new Date());
        logInstance.warn("Test", 44);
        logInstance.error("Test", {farm: 43});
        logInstance.debug(/.+/i);
        logInstance.perf(new String(373.5));
        logInstance.error("");
    });
    it("timer", function () {
        logInstance.timer("Test", function (logInstance) {
            logInstance.info("Test");
            logInstance.info("Test", []);
            logInstance.info("Test", new Date());
            logInstance.warn("Test", 44);
            logInstance.error("Test", {farm: 43});
            logInstance.debug(/.+/i);
            logInstance.perf(new String(373.5));
            logInstance.error("");
        });
    });
});
