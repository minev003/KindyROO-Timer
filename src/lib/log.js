// Role manager logging system
//

'use strict';

// Usage
//
// const Log = require(./log.js);
//
// const log = new Log('module name');
//
// log.info('msg');
// log.info(msg, msg, msg);
// log.warn(msg);
// log.err(msg);
// log.debug(msg);
// log.verb(2).info()

// Core Node modules
const fs = require('fs');
const path = require('path');


const COLOR = {
    info: '\x1b[97m',   // white    "\x1b" == "\e"
    i: '\x1b[97m',      // white

    error: '\x1b[31m',  // red
    e: '\x1b[31m',      // red

    warn: '\x1b[33m',   // yellow
    w: '\x1b[33m',      // yellow

    debug: '\x1b[37m',  // light gray
    d: '\x1b[37m'       // light gray
};


// logger default configuration
let VERBOSITY = 1;
let TIME_STAMP_ON = false;
let SHORT_LOG = false;
let COLOR_ON = true;   // auto

// static privates
let log_in_ram = true;
let ram_buff = [];
let output_stream;


// private stream writer
function write(modName, msgType, verb, msgArr) {
    if (log_in_ram) {
        ram_buff.push(arguments);
        return;
    }

    if (verb > VERBOSITY) {
        return;
    }

    if (output_stream === process.stderr) {
        output_stream.write(rendStdStream(modName, msgType, msgArr));
    } else {
        output_stream.write(rendFileStream(modName, msgType, msgArr));
    }
}

/**
 * Renders in format: "[time][type][module] msg"
 * with optional [time] and coloring.
 *
 * @param {string} modName
 * @param {string} msgType
 * @param {Array} msgArr
 * @return {string}
 */
function rendStdStream(modName, msgType, msgArr) {
    const row_buff = [];

    // first put the color codes
    if (COLOR_ON) {
        row_buff.push(COLOR[msgType]);
    }

    if (TIME_STAMP_ON) {
        row_buff.push('[', datetime(), ']');
    }

    // [time][type][module] msg
    row_buff.push('[', msgType, '][', modName, ']');

    for (let i = 0; i < msgArr.length; ++i) {
        row_buff.push(' ');
        const ref = msgArr[i];
        if (typeof ref === 'object') {
            row_buff.push(JSON.stringify(ref));
        } else {
            row_buff.push(ref);
        }
    }

    if (COLOR_ON) {
        row_buff.push('\x1b[0m');    // restore the color
    }

    row_buff.push('\n');
    return row_buff.join('');
}


/**
 * Rends in format: "time|type|module| msg"
 * with always on "time" and always off coloring.
 *
 * @param {string} modName
 * @param {string} msgType
 * @param {Array} msgArr
 * @return {string}
 */
function rendFileStream(modName, msgType, msgArr) {
    const row_buff = [];

    row_buff.push(datetime(), '|', msgType, '|', modName, '|');

    for (let i = 0; i < msgArr.length; ++i) {
        row_buff.push(' ');
        const ref = msgArr[i];
        if (typeof ref === 'object') {
            row_buff.push(JSON.stringify(ref));
        } else {
            row_buff.push(ref);
        }
    }

    row_buff.push('\n');
    return row_buff.join('');
}


/**
 * @return {String} Current date time rendered ->> 16.03.2016-11:22:54
 */
function datetime() {
    const buff = [];
    const d = new Date();

    buff.push(d.getDate(), '.', d.getMonth(), '.', d.getFullYear(), '-',
        d.toLocaleTimeString());

    return buff.join('');
}


/**
 * Logger constructor. Constructs logger for module name module_name.
 * @param module_name {String}
 * @constructor
 */
function Log(module_name) {
    if (module_name === undefined || typeof module_name !== 'string') {
        this.moduleName = __filename;
    } else {
        this.moduleName = module_name;
    }
}


// static members
/**
 * Sets default Verbose level
 * @param v {Number}
 */
Log.setVerboseLevel = function (v) {
    if (typeof v !== 'number') {
        throw new Error('Log verbosity level must be a number.');
    }
    VERBOSITY = v;
};


/**
 * Defines where the log should be printed
 * @param {String} logPath '' --> terminal or path/to/file
 */
Log.setLogPath = function (logPath) {

    if (typeof logPath !== 'string') {
        throw new Error('Log path option must be a string.');
    }

    if (logPath === '') {
        output_stream = process.stderr;
        return;
    }

    let fd;
    const abs_log_file = path.resolve(logPath);
    try {
        fd = fs.openSync(abs_log_file, 'a');
    } catch (e) {
        fd = 0;
    }

    if (fd > 0) {
        output_stream = fs.createWriteStream('', {fd:fd})
    } else {
        throw new Error('Unable to open:' + abs_log_file + ' as log file.');
    }
};


/**
 * Enables / Disables the color output
 * @param enable {Boolean}
 */
Log.enableColor = function (enable) {
    if (enable === null) {
        return; // stay auto
    }

    if (typeof enable !== 'boolean') {
        throw new Error('Log coloring option must be a boolean.');
    }
    COLOR_ON = enable;
};

/**
 * Enables / Disables the short format log.
 * @param enable {Boolean}
 */
Log.enableShort = function (enable) {
    if (typeof enable !== 'boolean') {
        throw new Error('Log short option must be a boolean.');
    }
    SHORT_LOG = enable;
};

/**
 * Enables / Disables timestamps.
 * @param enable {Boolean}
 */
Log.enableTimestamp = function (enable) {
    if (typeof enable !== 'boolean') {
        throw new Error('Log timestamp option must be a boolean.');
    }
    TIME_STAMP_ON = enable;
};


/**
 * Writes the ram-buffer into output streams.
 * Starts writing on output streams.
 */
Log.start = function () {
    log_in_ram = false;
    for (let i = 0; i < ram_buff.length; ++i) {
        write.apply(this, ram_buff[i]);
    }

    ram_buff = null;    // free the stored data.
};


/**
 * Changes the verbosity level for the next log.
 * @param v {Number} Verbosity level
 * @return {Log}
 */
Log.prototype.verb = function (v) {
    if (typeof v === 'number') {
        this.vlevel = v;
    }

    return this;
};


/**
 * Writes an info type message into the log stream.
 * @param {...*} arguments - Произволен брой аргументи.
 */
Log.prototype.info = function () {

    const STR = SHORT_LOG ? 'i' : 'info';
    write(this.moduleName, STR, this.vlevel, arguments);

    this.vlevel = VERBOSITY;
};


/**
 * Writes a warning type message into the log stream.
 * @param {...*} arguments - Произволен брой аргументи.
 */
Log.prototype.warn = function () {
    const STR = SHORT_LOG ? 'w' : 'warn';
    write(this.moduleName, STR, this.vlevel, arguments);

    this.vlevel = VERBOSITY;
};


/**
 * Writes an error type message into the log stream.
 * @param {...*} arguments - Произволен брой аргументи.
 */
Log.prototype.err = function () {
    const STR = SHORT_LOG ? 'e' : 'error';
    write(this.moduleName, STR, this.vlevel, arguments);

    this.vlevel = VERBOSITY;
};


/**
 * Writes debug type message into the log stream.
 * @param {...*} arguments - Произволен брой аргументи.
 */
Log.prototype.debug = function () {
    const STR = SHORT_LOG ? 'd' : 'debug';
    write(this.moduleName, STR, this.vlevel, arguments);

    this.vlevel = VERBOSITY;
};


module.exports = Log;
