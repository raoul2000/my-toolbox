"use strict";

exports.getItemColor = function (item) {
    let result = "grey"; // the default color
    if (item.data.color) {
        result = item.data.color;
    } else {
        let envColorMap = {
            'dev': "green",
            'qa': "blue",
            'prod': "red"
        };
        let colorMatch = item.path
            .filter(pathPart => envColorMap.hasOwnProperty(pathPart.toLowerCase()))
            .map(pathPart => envColorMap[pathPart]);

        if (colorMatch.length !== 0) {
            result = colorMatch[0];
        }
    }
    return result;
};
