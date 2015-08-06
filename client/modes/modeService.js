// This service provides modal functionality (e.g. browse mode, edit mode)
// This file should be closed to modification but open to extension.
// To extend with an new mode, simply add a file in client/modes/.
// Use client/modes/edit as an example, and keep some form of click function.
"use strict";
var app = angular.module("swen");
app.service("modeService", function ModeService() {
  var currentMode = "", modes = [];
  this.setCurrentMode = function setCurrent(cm) { currentMode = cm; };
  this.getCurrentMode = function getCurrent() {
    return currentMode; };
  this.getModes = function getModes() { return modes; };
  this.addMode = function addMode(modeName, modeMethods, isDefault) {
    // modeName expects e.g. "Browse" or "Edit"; spec should catch mistakes.
    var lowercaseMode = modeName.toLowerCase().replace(/ /g, "_");
    this[lowercaseMode] = modeMethods;
    modes.push({codeValue: lowercaseMode, displayValue: modeName + " Mode"});
    _.sortBy(modes, "codeValue");
    if (isDefault) {
      if (! currentMode) {
        currentMode = lowercaseMode;
      }
      else throw new Error("The default mode cannot be both " + 
        currentMode + " and " + lowercaseMode);
    }
  };
});

