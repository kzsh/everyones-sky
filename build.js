"use strict";

const compiler = require("./js13k-compiler/src/compiler");

const JS_FILES = require("./config/js");
const CONSTANTS = require("./config/constants");
const MANGLE_SETTINGS = require("./config/mangle");

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

compiler.run(tasks => {
  function buildCSS(uglify) {
    const sequence = [
      tasks.label("Building CSS"),
      tasks.loadFiles([__dirname + "/src/style.css"]),
      tasks.concat()
    ];

    if (uglify) {
      sequence.push(tasks.uglifyCSS());
    }

    return tasks.sequence(sequence);
  }

  function buildHTML(uglify) {
    const sequence = [
      tasks.label("Building HTML"),
      tasks.loadFiles([__dirname + "/src/index.html"]),
      tasks.concat()
    ];

    if (uglify) {
      sequence.push(tasks.uglifyHTML());
    }

    return tasks.sequence(sequence);
  }

  function buildMain() {
    return tasks.sequence([
      tasks.block("Building main files"),
      tasks.parallel({
        css: buildCSS(true),
        html: buildHTML(true)
      }),
      tasks.combine(),
      tasks.output(__dirname + "/build/index.html")
      // tasks.label("Building ZIP")
      // tasks.zip('index.html'),
      // tasks.output(__dirname + '/build/game.zip'),
      // tasks.checkSize(__dirname + '/build/game.zip'),
      // tasks.advzip(__dirname + '/build/game.zip'),
      // tasks.checkSize(__dirname + '/build/game.zip'),
    ]);
  }

  function main() {
    return tasks.sequence([buildMain()]);
  }

  return main();
});
