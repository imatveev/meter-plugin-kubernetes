'use strict';

const fetch         = require('node-fetch');
const plugin        = require('./plugin.json');
const { getByPath } = require('./util');

const baseURL = plugin.baseURL;

module.exports = {
    castToPercentage(data, metricData) {
        return fetch(`${baseURL}${data.url}/metrics/cpu/node_capacity`)
        .then(res => res.json())
        .then(result => {
            let localResult = getByPath(metricData.resultPath || [], result);
            return { url: data.url, result: (data.result*100/localResult).toFixed(1) };
        });
    }
};
