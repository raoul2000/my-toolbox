"use strict";

let envColorMap = {
    "default_color" : "grey",
    'dev': "green",
    'qa': "blue",
    'prod': "red"
};

exports.getItemColor = function (item) {
    let result = envColorMap.default_color; 
    
    if (item.data.color) {
        result = item.data.color;
    } else {
        let colorMatch = item.path
            .map( pathPart => envColorMap[pathPart.toLowerCase()])
            .filter( match => match);

        if (colorMatch.length !== 0) {
            result = colorMatch[0];
        }
    }
    return result;
};
