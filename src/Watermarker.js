/**
 * Does all the stuff with files and images.
 * TODO: unit tests
 */
class Watermarker {

    /**
     * TODO: add proper comment
     * @param {Object} param0 
     * @param {string[]} param0.captions 
     * @param {string[]} param0.mimeType
     * @param {string[]} param0.position
     * @param {string[]} param0.text
     */
    constructor({
        captions,
        text: {
            fontSize = 38,
            fontFamily = "'Open Sans'",
            maxTextWidth = 600,
            textAlign = 'center', // support 'center' and 'left' at the moment
            shadowColor = 'black',
            shadowBlur = 3,
            fillStyle = 'rgba(255, 255, 255, 0.65)'
        } = {},
        position: {
            rotationAngleInDegrees = 40,
            patternWidth = 400,
            patternHeight = 400,
            xOffset = 38 * 2,
            yOffset = 38 * 2,
        } = {},
        imageMimeType = 'image/jpeg',

    }) {
        this.CAPTIONS = captions;

        // Font.
        this.FONT_SIZE = fontSize;
        this.FONT = `${fontSize}px ${fontFamily}`;
        this.MAX_TEXT_WIDHT = maxTextWidth;
        this.TEXT_ALIGN = textAlign; // works ok only with 'center' and 'left'

        // Color, the last parameter is opacity.
        this.FILL_STYLE = fillStyle;

        // Shadow.
        this.SHADOW_COLOR = shadowColor;
        this.SHADOW_BLUR = shadowBlur; // pixels


        // Rotate angle in radians.
        this.ROTATION_ANGLE = rotationAngleInDegrees * Math.PI / 180; // degrees * Math.PI / 180

        // Unfortunately, CanvasPattern doesn't stretch (maybe coz of calling rotate()).
        // You gotta try and see what values look ok.
        this.PATTERN_WIDTH = patternWidth;
        this.PATTERN_HEIGHT = patternHeight;

        this.X_OFFSET = xOffset || 2 * fontSize;
        this.Y_OFFSET = yOffset || 2 * fontSize;

        // Describes image type that will be returned by canvas.
        this.IMAGE_MIME_TYPE = imageMimeType; // default is 'image/png'


        this.fileToBlob = this.fileToBlob.bind(this);
        this.fileToDataUrl = this.fileToDataUrl.bind(this);
        this.fileToImage = this.fileToImage.bind(this);
        this._drawNextText = this._drawNextText.bind(this);
        this._generatePattern = this._generatePattern.bind(this);
        this._loadContextConfig = this._loadContextConfig.bind(this);
        this.drawPatternOnImage = this.drawPatternOnImage.bind(this);
        

        this._generatePattern();
    }

    /************************************************************************
     * File processing.
    *************************************************************************/

    /**
     * Reads image from file, applies pattern, converts to data url.
     * @param {File} file
     * @returns {Promise<string>} 'data:type...' url, containing image.
     */
    async fileToDataUrl(file) {
        const image = await this.fileToImage(file);

        const canvasWithPattern = this.drawPatternOnImage(image);

        return canvasWithPattern.toDataURL(this.IMAGE_MIME_TYPE);
    }

    /**
     * Reads image from file, applies pattern, converts to data blob.
     * @param {File} file
     * @returns {Promise<Blob>}
     */
    async fileToBlob(file) {
        const image = await this.fileToImage(file);

        const canvasWithPattern = this.drawPatternOnImage(image);

        return await new Promise((resolve, reject) => canvasWithPattern.toBlob(resolve, this.IMAGE_MIME_TYPE));
    }

    /**
     * Reads image from file.
     * @param {File} file
     * @returns {Promise<HTMLImageElement>} image
     */
    async fileToImage(file) {
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
     * Applies pattern to image and returns the resulting canvas.
     * @param {HTMLImageElement} image 
     */
    drawPatternOnImage(image) {
        const canvas = document.createElement('canvas');

        // Set proper size.
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        // Draw image on the canvas.
        ctx.drawImage(image, 0, 0);

        // Use generated pattern to make a watermark.
        ctx.fillStyle = this._pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        log('drawn pattern on image');
        return canvas;
    }


    /*************************************************************************
     * Get the pattern.
    **************************************************************************/

    /**
     * Adds _pattern property to instance.
     */
    _generatePattern() {
        // Create pattern canvas.
        const patternCanvas = document.createElement('canvas');

        // TODO: Should someway calculate it.
        patternCanvas.width = this.PATTERN_WIDTH * this.CAPTIONS.length;
        patternCanvas.height = this.PATTERN_HEIGHT;

        const canvasContext = patternCanvas.getContext("2d");



        // DOESN'T WORK PROPERLY
        /* // Describes how much space caption requires
        const dimensions = getDesiredCanvasDimensions();

        patternCanvas.width = dimensions.width * CAPTIONS.length;
        patternCanvas.height = dimensions.height; */

        this._loadContextConfig(canvasContext);

        // Rotate all captions.
        this.CAPTIONS.forEach((CAPTION, shift) => { this._drawNextText(CAPTION, canvasContext, shift); });

        log('generated pattern');

        this._pattern = canvasContext.createPattern(patternCanvas, 'repeat');
    }


    /**
     * Applies properties passed through constructor to given canvas context.
     * @param {CanvasRenderingContext2D} canvasContext 
     */
    _loadContextConfig(canvasContext) {
        // Set parameters from config.
        canvasContext.font = this.FONT;
        canvasContext.textAlign = this.TEXT_ALIGN;
        canvasContext.fillStyle = this.FILL_STYLE;
        canvasContext.shadowBlur = this.SHADOW_BLUR;
        canvasContext.shadowColor = this.SHADOW_COLOR;

        log('loaded context config');
    }


    /**
     * @param {HTMLCanvasElement} canvasContext 
     * @param {number} shift
     * @param {Function} drawCallback
     */
    _drawNextText(CAPTION, canvasContext, shift, textAlign = this.TEXT_ALIGN, width = this.PATTERN_WIDTH) {
        const transformMatrix = canvasContext.getTransform();

        transformMatrix.e = this.X_OFFSET + (shift) * width;
        transformMatrix.f = this.Y_OFFSET;

        canvasContext.setTransform(transformMatrix);

        let x;
        let y;
        switch (textAlign) {
            case 'left':
                x = 0;
                y = 0;
                break;
            case 'center':
                x = width / 2;
                y = 0;
                break;
            default:
                throw new Error('"TEXT_ALIGN" should be either "left" or "center"!');
        }

        canvasContext.rotate(this.ROTATION_ANGLE);
        canvasContext.fillText(CAPTION, x, y, this.MAX_TEXT_WIDHT);
        canvasContext.rotate(-(this.ROTATION_ANGLE));

        log(`drawn ${shift} caption`)
    }

}

/*************************************************************************
 * Helpers.
**************************************************************************/

function log() {
    console.log('2CH-WATERMARK: ', ...arguments);
}
