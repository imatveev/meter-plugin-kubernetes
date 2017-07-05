'use strict';

const http = require('http');

const util = {
    getByPath(path, result) {
        if (!path.length) {
            return result;
        }
        let intermediate = result[path[0]];
        if (Array.isArray(intermediate)) {
            intermediate = intermediate[intermediate.length-1];
        }
        if (intermediate === undefined) {
            return;
        }
        return util.getByPath(path.slice(1), intermediate);
    },
    fetch(url) {
        return new Promise((resolve, reject) => {
            try {
            http.get(url, res => {
                const { statusCode } = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                                    `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                                    `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    res.resume();
                    return reject(error);
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        let parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on('error', (e) => {
                reject(`Got error: ${e.message}`);
            });
            } catch (error) {
                reject(error);
            }
        });
    }
};

module.exports = util;
