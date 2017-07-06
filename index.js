'use strict';

const params               = require('./param.json');
const metrics              = require('./metrics.json');
const os                   = require('os');
const postprocessors       = require('./postprocessors');
const { getByPath, fetch } = require('./util');

const pollInterval = params.pollInterval || 5000;
const baseURL      = params.hipsterUrl;
const source       = (params.sourcePrefix || os.hostname()).trim(); // get the metric source

if (!baseURL) {
    throw new ReferenceError('Kubernetes Hipster url is missing');
}

function poll() {
    return Promise.all(Object.keys(metrics)
    .map(metric => {
        let metricData = metrics[metric];
        return getInstanceUrls(metricData.endpoints.loopBy)
        .then(data => {
            data = flattenDeep(data);
            return Promise.all(data.map(value => {
                return fetch(`${baseURL}${value.url}${metricData.endpoints.final}`)
                .then(finalData => {
                    let result = getByPath(metricData.resultPath || [], finalData);
                    return { url: value.url, result, name: value.name };
                })
                .then(data => {
                    let postprocessors = metricData.postprocessors;
                    if (!postprocessors || !postprocessors.length) {
                        return data;
                    }
                    return sequentially(postprocessors, data, metricData);
                });
            }))
            .then(result => ({ metric, result, name: result.name }));
        });
    }))
    .then(data => data.reduce((result, current) => {
        result[current.metric] = current.result;
        return result;
    }, {}));
}

function sequentially(arr, data, metricData) {
    return arr.reduce((prev, next) => prev.then(() => {
        let toApply = postprocessors[next];
        return prev.then(() => toApply(data, metricData));
    }), Promise.resolve());
}

function flattenDeep(array) {
    if (!array.length) {
        return array;
    }
    if (!array.some(element => Array.isArray(element))) {
        return array;
    }
    let flatten = array.reduce((result, element) => {
        if (!Array.isArray(element)) {
            return [ ...result, element ];
        }
        return [ ...result, ...element ];
    }, []);
    return flattenDeep(flatten);
}

function getInstanceUrls(loopBy, result = { url: '' }) {
    if (!loopBy.length) {
        return Promise.resolve(result);
    }
    return fetch(`${baseURL}${result.url}${loopBy[0].endpoint}`)
    .then(data => {
        return Promise.all(data.map(a => {
            let updatedLoopBy = loopBy.slice(1);
            return getInstanceUrls(updatedLoopBy, { url: `${result.url}${loopBy[0].endpoint}/${a}`, name: a });
        }));
    });
}

function writeOutput(data) {
    for (let metric in data) {
        if(data.hasOwnProperty(metric)) {
            data[metric].forEach(issue => {
                console.log(`${metric} ${issue.result} ${source}.${metrics[metric].instanceType}.${issue.name}`);
            });
        }
    }
}

function execute() {
    return poll()
    .then(writeOutput)
    .then(() => setTimeout(execute, pollInterval))
    .catch(error => {
        console.log(error);
        //Retry execution after increased amount of time
        setTimeout(execute, pollInterval*10);
    });
}

execute();

process.on('unhandledRejection', error => {
    console.log('Unhandled rejection');
    console.log(error);
    //Retry execution after increased amount of time
    setTimeout(execute, pollInterval*10);
});
