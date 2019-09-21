/// <reference types="mocha" />

require("source-map-support").install();
import assert = require("assert");
import path = require('path');

import { LoggerLevel } from "../types";
import logger_ = require("../lib/logger");

var colors = ["e", "grey", "black", "r", "red", "g", "green", "y", "yellow", "b", "blue", "m", "magenta", "c", "cyan", "w", "white"];

var triedExit = false;
const originalExit = process.exit;
(process as any).exit = function() {
  triedExit = true;
};

[
  ['all defaults', function() {}],
  ['manually set VERBOSE', function() {
    process.env.VERBOSE = "Gears";
  }],
  ['manually set LOGGER_NO_LINEDOWN', function() {
    process.env.LOGGER_NO_LINEDOWN = "1";
  }],
  ['manually set LOGGER_NO_TIMESTAMP', function() {
    process.env.LOGGER_NO_TIMESTAMP = "1";
  }]
].forEach(function(mode, i) {
  describe('Using ' + mode[0] + " mode", function() {
    var logger: typeof logger_;
    it("Configure mode and load logger", function() {
      delete require.cache[require.resolve("../lib/logger.js")];
      delete require.cache[require.resolve("../lib/baseimpl.js")];
      delete require.cache[require.resolve("../lib/impl/0-silent-logger.js")];
      delete require.cache[require.resolve("../lib/impl/1-cli-color-logger.js")];
      delete require.cache[require.resolve("../lib/impl/2-text-logger.js")];

      logger = require("../lib/logger");

      (mode as any)[1]();
    });
    if(i === 0) {
      it("Test all verbosity levels", function() {
        ["debug", "debugging", "perf", "timer", "timers", "info",
        "information", "warn", "warning", "err", "error", "fatal", "silent",
        0, 1, 2, 3, 4, 5, 6, 7, "0", "1", "2", "3", "4", "5", "6", "7", NaN, Infinity].forEach(function(level) {
          logger.setMinLevel(level);
          if(typeof level === "number" && isFinite(level))
            assert.equal(logger.minLevel(), level, "minLevel() = " + level);

          var log = new logger("level=" + level);
          log.gears("Gears");
          log.debug("Debug");
          log.timer("Timer", function() {});
          log.information("Information");
          log.info("Information");
          log.warning("Warning");
          log.warn("Warning");
          log.error("Error");
          log.fatal("Fatal");

          assert.equal(triedExit, true, "Tried to process.exit");
        })

      });
      it("Test unknown level", function() {
        logger.setMinLevel("Gears");
        logger.log(8, [], ["Test"]);
      });
    }
    ["0-silent", "1-cli-color", "2-text"].forEach(function(type) {
      describe('With ' + type + " backend", function() {
        it("load backend", function() {
          if(type == "0-silent")
            logger.setMinLevel("Silent");
          else
            logger.setMinLevel("Gears");
          var backend = require("../lib/impl/" + type + "-logger");
          logger.active = new backend;
        })
        it("scope colors", function(cb) {
          setTimeout(function() {
            for (var i = 0; i < 255; i++) {
              let color: any = i;
              logger.log(LoggerLevel.Information, [color + ":" + color], ["Test"]);

              color = "x" + i.toString(16);
              logger.log(LoggerLevel.Information, [color + ":" + color], ["Test"]);
            }
            colors.forEach(function(color) {
              logger.log(LoggerLevel.Information, [color + ":" + color], ["Test"]);
            });
            cb();
          }, 150);
        });
        it("message colors", function(cb) {
          setTimeout(function() {
            for (var i = 0; i < 255; i++) {
              let color: any = i;
              logger.log(LoggerLevel.Information, undefined, [logger.makeColored("Test as " + color, color)]);

              color = "x" + i.toString(16);
              logger.log(LoggerLevel.Information, undefined, [logger.makeColored("Test as " + color, color)]);
            }
            colors.forEach(function(color) {
              logger.log(LoggerLevel.Information, undefined, [logger.makeColored("Test as " + color, color)]);
            });
            cb();
          }, 150);
        });
        it("static levels", function(cb) {
          setTimeout(function() {
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
            cb();
          }, 150);

        });
        var logInstance: logger_;
        it("scope log", function(cb) {
          logInstance = new logger("Mocha");
          setTimeout(function() {
            logInstance.gears("Test");
            logInstance.info("Test");
            logInstance.info("Test", []);
            logInstance.info("Test", new Date());
            logInstance.warn("Test", 44);
            logInstance.error("Test", { farm: 43 });
            logInstance.debug(/.+/i);
            logInstance.performance(new String(373.5));
            logInstance.error("");
            cb();
          }, 150);
        });
        it("extended scope", function(cb) {
          setTimeout(function() {
            logInstance = logInstance.extend("green:Extended");
            logInstance.info("Test");
            logInstance.info("Test", []);
            logInstance.info("Test", new Date());
            logInstance.warn("Test", 44);
            logInstance.error("Test", { farm: 43 });
            logInstance.debugging(/.+/i);
            logInstance.perf(new String(373.5));
            logInstance.error("");
            cb();
          }, 150);
        });
        it("timer", function(_cb) {
          setTimeout(function() {
            logInstance.timer("Test", function(logInstance) {
              logInstance.info("Test");
              logInstance.information("Test", []);
              logInstance.info("Test", new Date());
              logInstance.warning("Test", 44);
              logInstance.error("Test", { farm: 43 });
              logInstance.debug(/.+/i);
              logInstance.perf(new String(373.5));
              logInstance.error("");
            });
            logInstance.timerAsync("Async", function(logInstance, cb) {
              logInstance.info("Test");
              logInstance.information("Test", []);
              logInstance.info("Test", new Date());
              logInstance.warning("Test", 44);
              logInstance.error("Test", { farm: 43 });
              logInstance.debug(/.+/i);
              logInstance.perf(new String(373.5));
              logInstance.error("");
              setTimeout(_cb, 50);
              setTimeout(cb);
            });
          }, 150);
        });
        it("scopes", function(cb) {
          setTimeout(function() {
            logInstance.info(logInstance);
            logInstance.updateScopeName("red:Updated");
            logInstance.info(logInstance);
            assert.equal(logInstance.scopeName(), "red:Updated");
            logInstance.info("Test");
            logInstance.updateScopeName("red:Soup", 0);
            assert.equal(logInstance.scopeName(0), "red:Soup");
            logInstance.info("Test");
            logInstance.extend("invalid:Invalid").info("Test");
            cb();
          }, 150);
        })
        it("levels", function(cb) {
          setTimeout(function() {
            for (var i = 0; i <= 8; i++) {
              logger.setMinLevel(i)
              var log = new logger("Mocha");
              log.info("Test", i);
              log.warn(i);
              log.error(i);
            }
            cb();
          }, 150);
        });
        it("impl", function(cb) {
          setTimeout(function() {
            logInstance.info(logger.impl());
            logger.setMinLevel(LoggerLevel.Gears);
            logInstance = new logger("x00:Mocha", "No Color");
            logInstance.info("Test", {});
            cb();
          }, 150);
        });
        it("group", function(cb) {
          setTimeout(function() {
            logInstance.group("cyan:Test", (logger) => {
              logger.info("Test");
            });
            logInstance.group("blue:Testy", (logger) => {
              logger.info("Testles");
            });
            cb();
          }, 150);
        });
      });
    })
  });
});
