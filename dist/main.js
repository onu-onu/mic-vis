/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Chart.ts":
/*!**********************!*\
  !*** ./src/Chart.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chart = void 0;\nclass Chart {\n    constructor() {\n        this.width = 200;\n        this.height = 600;\n        const cvs = document.querySelector('#cvs');\n        this.ctx = cvs.getContext('2d');\n        const dpr = window.devicePixelRatio;\n        cvs.width = this.width * dpr;\n        cvs.height = this.height * dpr;\n        this.ctx.scale(dpr, dpr);\n        cvs.style.width = this.width + 'px';\n        cvs.style.height = this.height + 'px';\n        cvs.style.display = 'block';\n        console.log(`DPR: ${dpr}`);\n        console.log(`canvas      : ${cvs.width} x ${cvs.height}`);\n        console.log(`canvas style: ${cvs.style.width} x ${cvs.style.height}`);\n    }\n    draw(dataArray, bufferLength) {\n        const freqList = this.normalization(dataArray, bufferLength);\n        const volume = this.getVolume(dataArray, bufferLength);\n        this.ctx.clearRect(0, 0, this.width, this.height);\n        this.drawSpectrum(freqList, volume);\n    }\n    normalization(dataArray, bufferLength) {\n        const freqList = [];\n        const d = 20;\n        for (let i = 0; i < dataArray.length; i += d) {\n            let tmp = 0;\n            for (let j = i; j < i + d; j++) {\n                tmp += dataArray[j];\n            }\n            freqList.push(tmp / d);\n        }\n        return freqList;\n    }\n    getVolume(dataArray, bufferLength) {\n        // すべての周波数成分の平均を計算\n        const sum = dataArray.reduce((acc, val) => acc + val, 0);\n        return sum / bufferLength / 255;\n    }\n    drawSpectrum(freqList, volume) {\n        let maxW = 280;\n        let h = 5;\n        let margin = { top: 0, right: 2, bottom: 2, left: 2 };\n        let stdVol = volume * freqList.length;\n        freqList.forEach((val, i) => {\n            if (i <= stdVol) {\n                this.ctx.fillStyle = '#ddd';\n            }\n            else {\n                this.ctx.fillStyle = '#444';\n            }\n            let w0 = val / 255 * maxW;\n            let h0 = h;\n            let x0 = h + margin.left;\n            let y0 = i * (h + margin.bottom);\n            this.ctx.beginPath();\n            this.ctx.roundRect(x0, y0, w0, h0, [1]);\n            this.ctx.roundRect(x0, y0, w0, h0, [1]);\n            this.ctx.fill();\n            let w1 = h;\n            let h1 = h;\n            let x1 = 0;\n            let y1 = y0;\n            this.ctx.beginPath();\n            this.ctx.roundRect(x1, y1, w1, h1, [1]);\n            this.ctx.fill();\n        });\n    }\n}\nexports.Chart = Chart;\n\n\n//# sourceURL=webpack://mic-vis/./src/Chart.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Chart_1 = __webpack_require__(/*! ./Chart */ \"./src/Chart.ts\");\nwindow.onload = () => {\n    function setMicNameHtml(stream) {\n        const audioTracks = stream.getAudioTracks();\n        if (audioTracks.length > 0) {\n            const audioTrackSettings = audioTracks[0].getSettings();\n            const activeMicrophoneId = audioTrackSettings.deviceId;\n            navigator.mediaDevices.enumerateDevices()\n                .then(function (devices) {\n                devices.forEach(function (device) {\n                    if (device.kind === 'audioinput' && device.deviceId === activeMicrophoneId) {\n                        const micNameElem = document.querySelector('#mic-name');\n                        micNameElem.textContent = device.label;\n                    }\n                });\n            })\n                .catch(function (err) {\n                console.error('デバイスの列挙中にエラーが発生しました:', err);\n            });\n        }\n    }\n    function checkMicConnection(dataArray, flag) {\n        let tmp = flag ? 1 : 0; // TRUEなら1, FALSEなら0\n        dataArray.forEach(val => tmp += val);\n        return tmp !== 0;\n    }\n    const reloadBtn = document.querySelector('#reload-btn');\n    reloadBtn.addEventListener('click', () => {\n        location.reload();\n    });\n    const connStateElem = document.querySelector('#conn-state');\n    const chart = new Chart_1.Chart();\n    const audioContext = new AudioContext();\n    navigator.mediaDevices.getUserMedia({ audio: true })\n        .then(function (stream) {\n        function draw() {\n            analyserNode.getByteFrequencyData(dataArray);\n            isMicConn = checkMicConnection(dataArray, isMicConn);\n            console.log(isMicConn);\n            connStateElem.style.backgroundColor = isMicConn ? '#00bf46' : '#c90000';\n            chart.draw(dataArray, bufferLength);\n            requestAnimationFrame(draw);\n        }\n        setMicNameHtml(stream);\n        // メディアストリームからオーディオソースノードを作成\n        const micInput = audioContext.createMediaStreamSource(stream);\n        // スペクトラム解析器ノードを作成\n        const analyserNode = audioContext.createAnalyser();\n        analyserNode.fftSize = 2048; // FFT サイズを指定\n        // 入力を解析器に接続\n        micInput.connect(analyserNode);\n        // 解析器からデータを取得するためのバッファを作成\n        const bufferLength = analyserNode.frequencyBinCount;\n        const dataArray = new Uint8Array(bufferLength);\n        let isMicConn = false;\n        draw();\n    })\n        .catch(function (err) {\n        console.error('エラーが発生しました: ' + err);\n    });\n};\n\n\n//# sourceURL=webpack://mic-vis/./src/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;