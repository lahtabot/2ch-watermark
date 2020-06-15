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

    // Color, the last parameter is opacity.
    const FILL_STYLE = "rgba(250, 250, 250,0.11)";

    // Shadow.
    const SHADOW_COLOR = 'grey';
    const SHADOW_BLUR = 3; // pixels

    // Rotate angle in radians.
    const ROTATION_ANGLE = 45 * Math.PI / 180; // degrees * Math.PI / 180

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
     * File processing
    *************************************************************************/

    /**
     * Reads images. Calls onImageLoad() when image is loaded;
     * @param {File} file 
     */
    function processFile(file) {
        if (!file) {
            log('readFile(file): no file!');
            return;
        }

        if (!file.type.startsWith('image/')) { // TODO: process webm/mp4?
            log('readFile(file): not an image, ingoring! ' + file.type);
        }
        
        const fileReader = new FileReader();

        fileReader.onload = function (readerEvent) {
            const image = new Image();

            image.onload = onImageLoad;
            image.src = readerEvent.target.result;
        };

        fileReader.readAsDataURL(file);
    }

    /*************************************************************************
     * Helpers
    **************************************************************************/

    
    function log() {
        console.log('2CH-WATERMARK: ', ...arguments);
    }



})();