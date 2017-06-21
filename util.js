'use strict';

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
    }
};

module.exports = util;
