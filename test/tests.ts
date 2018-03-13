/// <reference types="mocha" />

process.env.VERBOSE = "Gears"; // All possible verbosity levels

require("source-map-support").install();
import assert = require("assert");
import path = require('path');

import { LoggerLevel, Color } from "../types";
import logger = require("../index");

var colors = ["e", "grey", "black", "r", "red", "g", "green", "y", "yellow", "b", "blue", "m", "magenta", "c", "cyan", "w", "white"];

it("scope colors", function () {
    for (var i = 0; i < 255; i++) {
        let color: any = i;
        logger.log(LoggerLevel.Information, [color + ":" + color], ["Test"]);

        color = "x" + i.toString(16);
        logger.log(LoggerLevel.Information, [color + ":" + color], ["Test"]);
    }
    colors.forEach(function(color) {
        logger.log(LoggerLevel.Information, [color + ":" + color], ["Test"]);
    });
});
it("static levels", function () {
    logger.gears("Test");
    logger.info("Test");
    logger.information("Test");
    logger.warn("Test", 44);
    logger.warning(new Date);
    logger.error("Test", { farm: 43 });
    logger.debug(/.+/i);
    logger.debugging(Symbol.iterator);
    logger.perf(new String(373.5));
    logger.performance(require.extensions);
    logger.error("");

});
var logInstance = new logger("Mocha");
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
    logInstance.timer("blue:Test", function (logInstance) {
        logInstance.info("Test");
        logInstance.information("Test", []);
        logInstance.info("Test", new Date());
        logInstance.warning("Test", 44);
        logInstance.error("Test", {farm: 43});
        logInstance.debug(/.+/i);
        logInstance.perf(new String(373.5));
        logInstance.error("");
    });
    logInstance.timerAsync("red:Async", function(logInstance, cb) {
        logInstance.info("Test");
        logInstance.information("Test", []);
        logInstance.info("Test", new Date());
        logInstance.warning("Test", 44);
        logInstance.error("Test", {farm: 43});
        logInstance.debug(/.+/i);
        logInstance.perf(new String(373.5));
        logInstance.error("");
        cb();
    });
});
it("scopes", function() {
    logInstance.info(logInstance);
    logInstance.updateScopeName("red:Updated");
    logInstance.info(logInstance);
    assert.equal(logInstance.scopeName(), "red:Updated");
    logInstance.info("Test");
    logInstance.updateScopeName("red:Soup", 0);
    assert.equal(logInstance.scopeName(0), "red:Soup");
    logInstance.info("Test");
    logInstance.extend("invalid:Invalid").info("Test");
})
it("levels", function() {
    for(var i=0; i<=8; i++) {
        logger.setMinLevel(i)
        var log = new logger("Mocha");
        log.info("Test", i);
        log.warn(i);
        log.error(i);
    }
});
it("impl", function() {
    logInstance.info(logger.impl());
    logger.setMinLevel(LoggerLevel.Gears);
    logInstance = new logger("x00:Mocha", "No Color");
    logInstance.info("Test", {});
});
it("group", function() {
    logInstance.group("cyan:Test", (logger) => {
        logger.info("Test");
    });
});
it("env", function() {
    var env = logger.env();
    assert.equal(env.PROCESS_SEND_LOGGER, logger.impl());
    logInstance.extend("env", env);
});
it("process.send", function() {
    var sawProcessSend = false;
    process.send = function(dat) {
        sawProcessSend = true;
        assert.equal(dat.cmd, "log");
        logInstance.info(dat.data);
    }
    process.env.PROCESS_SEND_LOGGER = path.resolve(__dirname, "testimpl.js");
    var log = new logger("x00:Mocha", "cyan:ProcessSend");
    log.info("Test", new Date);
    if(!sawProcessSend)
        throw new Error("process.send was never called");
    sawProcessSend = false;
    process.env.PROCESS_SEND_LOGGER = path.resolve(__dirname, "../lib/impl/99-cli-color-logger.js");
    log = new logger("x00:Mocha", "cyan:ProcessSend");
    log.info("Test", new Date);
    if(!sawProcessSend)
        throw new Error("process.send was never called");
});
