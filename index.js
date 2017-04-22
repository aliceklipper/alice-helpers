const { spawn }        = require('child_process');
const { readFileSync } = require('fs');
const cp               = require('ncp').ncp;
const rimraf           = require('rimraf');
const glob             = require('glob');

module.exports = {
    dev     : () => !process.env.NODE_ENV || process.env.NODE_ENV.startsWith('dev'),
    prod    : () => process.env.NODE_ENV && process.env.NODE_ENV.startsWith('prod') || false,
    run     : async (command, args, silent) => {
        return await new Promise((resolve) => {
            const child = spawn(command, args);

            if (!silent) {
                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);
                process.stdin.pipe(child.stdin);
            }

            child.on('exit', () => {
                resolve(child.exitCode);
            });
        });
    },
    start   : text => console.log(`${text} started…`),
    finish  : text => console.log(`${text} finished.`),
    cp      : async (source, dest) => await new Promise((resolve, reject) => {
        cp(source, dest, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    }),
    rm      : path => new Promise((resolve, reject) => {
        rimraf(path, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    }),
    glob    : path => new Promise((resolve, reject) => {
        glob(path, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    }),
    version : () => {
        try {
            return JSON.parse(readFileSync('./version.json').toString());
        } catch (_) {
            return null;
        }
    },
};
