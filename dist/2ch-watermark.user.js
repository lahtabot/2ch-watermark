// ==/UserScript==

// ==UserScript==
// @name 2ch-watermark-for-dollchan-ext-tools
// @description applies watermark for images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       anon
// @grant GM_getValue
// @grant GM_setValue
// @include http*://2ch.hk/*
// @include http*://2ch.pm/*
// @include http*://2ch.re/*
// @include http*://2ch.tf/*
// @include http*://2ch.wf/*
// @include http*://2ch.yt/*
// @include http*://2-ch.so/*
// ==/UserScript==
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/userscript.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ImgContainer.js":
/*!*****************************!*\
  !*** ./src/ImgContainer.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { addAfter } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\r\n\r\n/************************************************************************\r\n * CONFIG, TODO: make a gui\r\n************************************************************************/\r\n\r\nconst DIV_STYLE = `\r\n    margin-top: 1px;\r\n    width: 275px;\r\n    min-width: 100%;\r\n    max-width: 100%;\r\n    white-space: nowrap;\r\n    text-align: center;`;\r\nconst FILE_CONTAINER_STYLE = `\r\n    display: inline-block;\r\n    vertical-align: top;\r\n    margin: 1px;\r\n    height: 90px;\r\n    width: 90px;`;\r\nconst IMG_CONTAINER_STYLE = `\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    height: 90px;\r\n    cursor: pointer;\r\n    text-align: center;`;\r\nconst IMG_STYLE = `\r\n    max-width: 90px;\r\n    max-height: 90px;\r\n    box-sizing: border-box;`;\r\n\r\n\r\n\r\n/**\r\n * Places the resulting images container\r\n * @param {number} imagesNumber how much image containers should be placed.\r\n * @returns {HTMLDivElement} div that contains imgs\r\n */\r\nmodule.exports.addImgContainer = function addImgContainer(imagesNumber) {\r\n    dropArea = getDropArea();\r\n\r\n\r\n    // div contains everything\r\n    const div = document.createElement('div');\r\n    div.style = DIV_STYLE;\r\n    div.id = '2ch-lahtabot-watermark';\r\n\r\n    // Add images\r\n    for (let i = 0; i < imagesNumber; i++) {\r\n        // Add container for container...\r\n        const fileContainer = document.createElement('div');\r\n        fileContainer.style = FILE_CONTAINER_STYLE;\r\n        div.appendChild(fileContainer);\r\n\r\n        // Add img container for aligning content\r\n        const imgContainer = document.createElement('div');\r\n        imgContainer.style = IMG_CONTAINER_STYLE;\r\n        fileContainer.appendChild(imgContainer);\r\n\r\n        // Add img element\r\n        const img = document.createElement('img');\r\n        img.style = IMG_STYLE;\r\n\r\n        //img.dataset.watermarkId = id;\r\n\r\n        imgContainer.appendChild(img);\r\n    }\r\n\r\n    addAfter(div, dropArea);\r\n\r\n    return div;\r\n};\r\n\r\n\r\nmodule.exports.addSettings = function addSettings(defaults) {\r\n    const dropArea = getDropArea();\r\n    const settings = document.createElement('div');\r\n\r\n    settings.style = DIV_STYLE;\r\n\r\n    // Color\r\n    const pickr = Pickr.create({\r\n        el: '.color-picker',\r\n        theme: 'monolith', // 'classic' or 'monolith', or 'nano',\r\n\r\n        swatches: [\r\n            'rgba(244, 67, 54, 1)',\r\n            'rgba(233, 30, 99, 0.95)',\r\n            'rgba(156, 39, 176, 0.9)',\r\n            'rgba(103, 58, 183, 0.85)',\r\n            'rgba(63, 81, 181, 0.8)',\r\n            'rgba(33, 150, 243, 0.75)',\r\n            'rgba(3, 169, 244, 0.7)',\r\n            'rgba(0, 188, 212, 0.7)',\r\n            'rgba(0, 150, 136, 0.75)',\r\n            'rgba(76, 175, 80, 0.8)',\r\n            'rgba(139, 195, 74, 0.85)',\r\n            'rgba(205, 220, 57, 0.9)',\r\n            'rgba(255, 235, 59, 0.95)',\r\n            'rgba(255, 193, 7, 1)'\r\n        ],\r\n        components: {\r\n            // Main components\r\n            preview: true,\r\n            opacity: true,\r\n            hue: true,\r\n            // Input / output Options\r\n            interaction: {\r\n                rgba: true,\r\n                input: true,\r\n                save: true\r\n            }\r\n        }\r\n    });\r\n\r\n    addAfter(settings, dropArea);\r\n};\r\n\r\n\r\nfunction postSettings(pickr) {\r\n    // get color in rgba format\r\n    const color = pickr.getColor().toRGBA().toString(4);\r\n\r\n\r\n}\r\n\r\n\r\n\r\n// TODO: if using blobs, call revokeObjectURL\r\nfunction changeImgSrc(imageId, newSrc) {\r\n    getImg(imageId).src = newSrc;\r\n}\r\n\r\nfunction getImg(imageId) {\r\n    const div = document.getElementById('2ch-lahtabot-watermark');\r\n    return div.childNodes[imageId].firstChild.firstChild;\r\n}\r\n\r\n/**\r\n * Returns form's drop area\r\n */\r\nfunction getDropArea() {\r\n    const dollchanDropArea = document.getElementById('de-file-area');\r\n    const vanillaDropArea = document.querySelector('.filer__drag-area');\r\n\r\n    const dropArea = dollchanDropArea || vanillaDropArea;\r\n\r\n    if (!dropArea) {\r\n        log('error: no file container (no #de-file-area or .filer__drag-area)');\r\n        return null;\r\n    }\r\n\r\n    return dropArea;\r\n}\n\n//# sourceURL=webpack:///./src/ImgContainer.js?");

/***/ }),

/***/ "./src/Watermarker.js":
/*!****************************!*\
  !*** ./src/Watermarker.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { log } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\r\n\r\n/**\r\n * Does all the stuff with files and images.\r\n * TODO: unit tests\r\n */\r\nclass Watermarker {\r\n\r\n    /**\r\n     * TODO: add proper comment\r\n     * @param {Object} param0 \r\n     * @param {string[]} param0.captions \r\n     * @param {string[]} param0.mimeType\r\n     * @param {string[]} param0.position\r\n     * @param {string[]} param0.text\r\n     */\r\n    constructor({\r\n        captions,\r\n        text: {\r\n            fontSize = 38,\r\n            fontFamily = \"'Open Sans'\",\r\n            maxTextWidth = 600,\r\n            textAlign = 'center', // support 'center' and 'left' at the moment\r\n            shadowColor = 'black',\r\n            shadowBlur = 3,\r\n            fillStyle = 'rgba(255, 255, 255, 0.65)'\r\n        } = {},\r\n        position: {\r\n            rotationAngleInDegrees = 40,\r\n            patternWidth = 400,\r\n            patternHeight = 400,\r\n            xOffset = 38 * 2,\r\n            yOffset = 38 * 2,\r\n        } = {},\r\n        imageMimeType = 'image/jpeg',\r\n\r\n    }) {\r\n        this.CAPTIONS = captions;\r\n\r\n        // Font.\r\n        fontFamily = fontFamily.startsWith(\"'\") ? fontFamily : `'${fontFamily}'`; // wrap with ''\r\n        this.FONT_SIZE = fontSize;\r\n        this.FONT = `${fontSize}px ${fontFamily}`;\r\n        this.MAX_TEXT_WIDHT = maxTextWidth;\r\n        this.TEXT_ALIGN = textAlign; // works ok only with 'center' and 'left'\r\n\r\n        // Color, the last parameter is opacity.\r\n        this.FILL_STYLE = fillStyle;\r\n\r\n        // Shadow.\r\n        this.SHADOW_COLOR = shadowColor;\r\n        this.SHADOW_BLUR = shadowBlur; // pixels\r\n\r\n\r\n        // Rotate angle in radians.\r\n        this.ROTATION_ANGLE = rotationAngleInDegrees * Math.PI / 180; // degrees * Math.PI / 180\r\n\r\n        // Unfortunately, CanvasPattern doesn't stretch (maybe coz of calling rotate()).\r\n        // You gotta try and see what values look ok.\r\n        this.PATTERN_WIDTH = patternWidth;\r\n        this.PATTERN_HEIGHT = patternHeight;\r\n\r\n        this.X_OFFSET = xOffset || 2 * fontSize;\r\n        this.Y_OFFSET = yOffset || 2 * fontSize;\r\n\r\n        // Describes image type that will be returned by canvas.\r\n        this.IMAGE_MIME_TYPE = imageMimeType; // default is 'image/png'\r\n\r\n\r\n        this.fileToBlob = this.fileToBlob.bind(this);\r\n        this.fileToDataUrl = this.fileToDataUrl.bind(this);\r\n        this.fileToImage = this.fileToImage.bind(this);\r\n        this._drawNextText = this._drawNextText.bind(this);\r\n        this._generatePattern = this._generatePattern.bind(this);\r\n        this._loadContextConfig = this._loadContextConfig.bind(this);\r\n        this.drawPatternOnImage = this.drawPatternOnImage.bind(this);\r\n\r\n\r\n        this._generatePattern();\r\n    }\r\n\r\n    /************************************************************************\r\n     * File processing.\r\n    *************************************************************************/\r\n\r\n    /**\r\n     * Reads image from file, applies pattern, converts to data url.\r\n     * @param {File} file\r\n     * @returns {Promise<string>} 'data:type...' url, containing image.\r\n     */\r\n    async fileToDataUrl(file) {\r\n        const image = await this.fileToImage(file);\r\n\r\n        const canvasWithPattern = this.drawPatternOnImage(image);\r\n\r\n        return canvasWithPattern.toDataURL(this.IMAGE_MIME_TYPE);\r\n    }\r\n\r\n    /**\r\n     * Reads image from file, applies pattern, converts to data blob.\r\n     * @param {File} file\r\n     * @returns {Promise<Blob>}\r\n     */\r\n    async fileToBlob(file) {\r\n        const image = await this.fileToImage(file);\r\n\r\n        const canvasWithPattern = this.drawPatternOnImage(image);\r\n\r\n        return await new Promise((resolve, reject) => canvasWithPattern.toBlob(resolve, this.IMAGE_MIME_TYPE));\r\n    }\r\n\r\n    /**\r\n     * Reads image from file.\r\n     * @param {File} file\r\n     * @returns {Promise<HTMLImageElement>} image\r\n     */\r\n    async fileToImage(file) {\r\n        if (!file) {\r\n            log('readFile(file): no file!');\r\n            return;\r\n        }\r\n\r\n        // TODO: process webm/mp4?\r\n        if (!file.type.startsWith('image/')) {\r\n            log('readFile(file): not an image, ingoring! ' + file.type);\r\n        }\r\n\r\n        const fileReader = new FileReader();\r\n\r\n        // Resolves with the image.\r\n        return new Promise((resolve, rej) => {\r\n\r\n            // When file is load.\r\n            fileReader.onload = function (readerEvent) {\r\n                const image = new Image();\r\n\r\n                image.onload = function (e) {\r\n                    resolve(image);\r\n                };\r\n\r\n                image.src = readerEvent.target.result;\r\n            };\r\n\r\n            fileReader.readAsDataURL(file);\r\n\r\n        });\r\n    }\r\n\r\n\r\n    /*************************************************************************\r\n     * Drawing.\r\n    **************************************************************************/\r\n\r\n    /**\r\n     * Applies pattern to image and returns the resulting canvas.\r\n     * @param {HTMLImageElement} image \r\n     */\r\n    drawPatternOnImage(image) {\r\n        const canvas = document.createElement('canvas');\r\n\r\n        // Set proper size.\r\n        canvas.width = image.width;\r\n        canvas.height = image.height;\r\n        const ctx = canvas.getContext(\"2d\");\r\n        // Draw image on the canvas.\r\n        ctx.drawImage(image, 0, 0);\r\n\r\n        // Use generated pattern to make a watermark.\r\n        ctx.fillStyle = this._pattern;\r\n        ctx.fillRect(0, 0, canvas.width, canvas.height);\r\n\r\n        log('drawn pattern on image');\r\n        return canvas;\r\n    }\r\n\r\n\r\n    /*************************************************************************\r\n     * Get the pattern.\r\n    **************************************************************************/\r\n\r\n    /**\r\n     * Adds _pattern property to instance.\r\n     */\r\n    _generatePattern() {\r\n        // Create pattern canvas.\r\n        const patternCanvas = document.createElement('canvas');\r\n\r\n        // TODO: Should someway calculate it.\r\n        patternCanvas.width = this.PATTERN_WIDTH * this.CAPTIONS.length;\r\n        patternCanvas.height = this.PATTERN_HEIGHT;\r\n\r\n        const canvasContext = patternCanvas.getContext(\"2d\");\r\n\r\n\r\n\r\n        // DOESN'T WORK PROPERLY\r\n        /* // Describes how much space caption requires\r\n        const dimensions = getDesiredCanvasDimensions();\r\n\r\n        patternCanvas.width = dimensions.width * CAPTIONS.length;\r\n        patternCanvas.height = dimensions.height; */\r\n\r\n        this._loadContextConfig(canvasContext);\r\n\r\n        // Rotate all captions.\r\n        this.CAPTIONS.forEach((CAPTION, shift) => { this._drawNextText(CAPTION, canvasContext, shift); });\r\n\r\n        log('generated pattern');\r\n\r\n        this._pattern = canvasContext.createPattern(patternCanvas, 'repeat');\r\n    }\r\n\r\n\r\n    /**\r\n     * Applies properties passed through constructor to given canvas context.\r\n     * @param {CanvasRenderingContext2D} canvasContext \r\n     */\r\n    _loadContextConfig(canvasContext) {\r\n        // Set parameters from config.\r\n        canvasContext.font = this.FONT;\r\n        canvasContext.textAlign = this.TEXT_ALIGN;\r\n        canvasContext.fillStyle = this.FILL_STYLE;\r\n        canvasContext.shadowBlur = this.SHADOW_BLUR;\r\n        canvasContext.shadowColor = this.SHADOW_COLOR;\r\n\r\n        log('loaded context config');\r\n    }\r\n\r\n\r\n    /**\r\n     * @param {HTMLCanvasElement} canvasContext \r\n     * @param {number} shift\r\n     * @param {Function} drawCallback\r\n     */\r\n    _drawNextText(CAPTION, canvasContext, shift, textAlign = this.TEXT_ALIGN, width = this.PATTERN_WIDTH) {\r\n        const transformMatrix = canvasContext.getTransform();\r\n\r\n        transformMatrix.e = this.X_OFFSET + (shift) * width;\r\n        transformMatrix.f = this.Y_OFFSET;\r\n\r\n        canvasContext.setTransform(transformMatrix);\r\n\r\n        let x;\r\n        let y;\r\n        switch (textAlign) {\r\n            case 'left':\r\n                x = 0;\r\n                y = 0;\r\n                break;\r\n            case 'center':\r\n                x = width / 2;\r\n                y = 0;\r\n                break;\r\n            default:\r\n                throw new Error('\"TEXT_ALIGN\" should be either \"left\" or \"center\"!');\r\n        }\r\n\r\n        canvasContext.rotate(this.ROTATION_ANGLE);\r\n        canvasContext.fillText(CAPTION, x, y, this.MAX_TEXT_WIDHT);\r\n        canvasContext.rotate(-(this.ROTATION_ANGLE));\r\n\r\n        log(`drawn ${shift} caption`)\r\n    }\r\n\r\n}\r\n\r\nmodule.exports = Watermarker;\n\n//# sourceURL=webpack:///./src/Watermarker.js?");

/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports.log = function log() {\r\n    console.log('2CH-WATERMARK: ', ...arguments);\r\n};\r\n\r\n/**\r\n * Appends newNode element after reference node.\r\n * @param {Node} newNode \r\n * @param {Node} referenceNode \r\n */\r\nmodule.exports.addAfter = function addAfter(newNode, referenceNode) {\r\n    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);\r\n};\n\n//# sourceURL=webpack:///./src/helpers.js?");

/***/ }),

/***/ "./src/settings.js":
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { log } = __webpack_require__(/*! ./helpers */ \"./src/helpers.js\");\r\n\r\n/**\r\n * @param {Promise<void>} settings \r\n */\r\nmodule.exports.save = async function (settings) {\r\n    try {\r\n        return GM_setValue(JSON.stringify('settings', settings));\r\n    } catch (err) {\r\n        log('settings save error: ', err);\r\n    }\r\n};\r\n\r\n/**\r\n * @returns {Promise<object>}\r\n */\r\nmodule.exports.load = async function () {\r\n    try {\r\n        const string = await GM_getValue('settings') || '';\r\n\r\n        return JSON.parse(string);\r\n    } catch (err) {\r\n        log('settings load error: ', err);\r\n\r\n        return {};\r\n    }\r\n};\n\n//# sourceURL=webpack:///./src/settings.js?");

/***/ }),

/***/ "./src/userscript.js":
/*!***************************!*\
  !*** ./src/userscript.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Watermarker = __webpack_require__(/*! ./Watermarker */ \"./src/Watermarker.js\");\r\nconst { addImgContainer, addSettings } = __webpack_require__(/*! ./ImgContainer */ \"./src/ImgContainer.js\");\r\nconst settings = __webpack_require__(/*! ./settings */ \"./src/settings.js\");\r\n\r\n(async function () {\r\n    const watermarkerConfig =  {captions: ['ТОЛЬКО ДЛЯ СЛАВЯН']}; // await settings.load();\r\n    const watermarker = new Watermarker(watermarkerConfig);\r\n\r\n    addImgContainer(4);\r\n    //addSettings({captions: ['ТОЛЬКО ДЛЯ СЛАВЯН']});\r\n})();\n\n//# sourceURL=webpack:///./src/userscript.js?");

/***/ })

/******/ });