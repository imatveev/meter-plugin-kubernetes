'use strict';

const params               = require('./param.json');
const { getByPath, fetch } = require('./util');

const baseURL = params.hipsterUrl;

module.exports = {
    castCPUToPercentage(data, metricData) {
        return castToPercentage(data, metricData, `${baseURL}${data.url}/metrics/cpu/node_capacity`);
    },
    castMemoToPercentage(data, metricData) {
        return castToPercentage(data, metricData, `${baseURL}${data.url}/metrics/memory/node_capacity`);
    }
};

function castToPercentage(data, metricData, url) {
    return fetch(url)
    .then(result => {
        let localResult = getByPath(metricData.resultPath || [], result);
        return { url: data.url, result: (data.result/localResult).toFixed(3), name: data.name };
    });
}
