'use strict';
const { ipcRenderer } = require('electron');


window.onload = function () {
	ipcRenderer.on('background-start', (event,payload) => {

    console.log("background-start",payload);

		ipcRenderer.send('background-response', {
			result: "result",
      originalPayload : payload
		});
	});
};
