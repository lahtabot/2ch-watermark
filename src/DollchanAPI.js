// ==UserScript==

// ==/UserScript==

// ==UserScript==
// @name 2ch-watermark-for-dollchan-ext-tools
// @description applies watermark for images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       anon
// @grant        none
// @include http*://2ch.hk/*
// @include http*://2ch.pm/*
// @include http*://2ch.re/*
// @include http*://2ch.tf/*
// @include http*://2ch.wf/*
// @include http*://2ch.yt/*
// @include http*://2-ch.so/*
// ==/UserScript==

(function () {
    'use strict';

    /************************************************************************
     * CONFIG, TODO: make a gui
    ************************************************************************/

    const CAPTIONS = [
        "ТОЛЬКО ДЛЯ СЛАВЯН",
        "АБУ ПИДОР"
    ];

    // Font.
    const FONT_SIZE = 38;
    const FONT = `${38}px 'Oswald', 'Open Sans'`;
    const MAX_TEXT_WIDHT = 500;
    const TEXT_ALIGN = 'center'; // works ok only with 'center' and 'left'

    const X_OFFSET = 2 * FONT_SIZE;
    const Y_OFFSET = 2 * FONT_SIZE;

    // Color, the last parameter is opacity.
    const FILL_STYLE = "rgba(255, 255, 255, 0.65)";

    // Shadow.
    const SHADOW_COLOR = 'black';
    const SHADOW_BLUR = 3; // pixels

    // Rotate angle in radians.
    const ROTATION_ANGLE = 40 * Math.PI / 180; // degrees * Math.PI / 180

    // Unfortunately, CanvasPattern doesn't stretch (maybe coz of calling rotate()).
    // You gotta try and see what values look ok.
    const PATTERN_WIDTH = 400;
    const PATTERN_HEIGHT = 400;


    // Describes image type that will be returned by canvas.
    const IMAGE_MIME_TYPE = 'image/jpeg'; // default is 'image/png'


    /************************************************************************
     * Dollchan API
    ************************************************************************/

    function getDollchanAPI() {
        return new Promise((resolve, reject) => {
            const dw = document.defaultView;
            const onmessage = ({ data, ports }) => {
                if (ports && ports.length === 1 && data === 'de-answer-api-message') {
                    clearTimeout(to);
                    dw.removeEventListener('message', onmessage);
                    resolve(ports[0]);
                }
            };
            dw.addEventListener('message', onmessage);
            dw.postMessage('de-request-api-message', '*');
            const to = setTimeout(() => {
                dw.removeEventListener('message', onmessage);
                reject();
            }, 5e3);
        });
    }

    function runAPI() {
        getDollchanAPI().then(port => {
            port.onmessage = ({ data }) => {
                const result = data.data;

                switch (data.name) {

                    case 'registerapi':
                        for (let key in result) {
                            log(`API ${key} ${
                                result[key] ? 'зарегистрирован' : 'недоступен'}.`);
                        }
                        break;

                    case 'filechange':
                        log('DollchanAPI: filechange event');

                        onFileChange(result);

                        break;

                }
            };

            port.postMessage({ name: 'registerapi', data: ['newpost'] });
            port.postMessage({ name: 'registerapi', data: ['filechange'] });
        }).catch(() => log('Dollchan API не обнаружен!'));
    }

    setTimeout(runAPI, 0);





    /**
     * @param {File[]} files new files attached to the form
     */
    function onFileChange(files) {
        // todo: disable logging
        log('onfilechange: files :>> ', files);

        files.forEach(processFile);
    }




    /************************************************************************
     * File processing.
    *************************************************************************/

    /**
     * Reads image from file.
     * @param {File} file
     * @returns {Promise<HTMLImageElement>} image
     */
    async function fileToImage(file) {
        if (!file) {
            log('readFile(file): no file!');
            return;
        }

        // TODO: process webm/mp4?
        if (!file.type.startsWith('image/')) {
            log('readFile(file): not an image, ingoring! ' + file.type);
        }

        const fileReader = new FileReader();

        // Resolves with the image.
        return new Promise((resolve, rej) => {

            // When file is load.
            fileReader.onload = function (readerEvent) {
                const image = new Image();

                image.onload = function (e) {
                    resolve(image);
                };

                image.src = readerEvent.target.result;
            };

            fileReader.readAsDataURL(file);

        });
    }


    /*************************************************************************
     * Drawing.
    **************************************************************************/

    /**
     * Applies pattern to image and return the resulting canvas.
     * @param {HTMLImageElement} image 
     * @param {CanvasPattern} pattern 
     */
    function drawPatternOnImage(image, pattern) {
        const canvas = document.createElement('canvas');
        // Set proper size.
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        // Draw image on the canvas.
        ctx.drawImage(image, 0, 0);

        // Use generated pattern to make a watermark.
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }

    /*************************************************************************
    **************************************************************************/

    }

    /*************************************************************************
     * Helpers
    **************************************************************************/


    function log() {
        console.log('2CH-WATERMARK: ', ...arguments);
    }



})();