function addImgContainer() {
    const dollchanFilesContainer = document.getElementById('de-file-area');

    if (!dollchanFilesContainer) {
        log('error: no dollchan file container #de-file-area');
        return;
    }

    const DIV_STYLE = `margin-top: 1px;
        width: 275px;
        min-width: 100%;
        max-width: 100%;
        white-space: nowrap;
        text-align: center;`;
    const FILE_CONTAINER_STYLE = `
        display: inline-block;
        vertical-align: top;
        margin: 1px;
        height: 90px;
        width: 90px;`;
    const IMG_CONTAINER_STYLE = `display: flex;
        justify-content: center;
        align-items: center;
        height: 90px;
        cursor: pointer;
        text-align: center;`;
    const IMG_STYLE = `max-width: 90px;
        max-height: 90px;
        box-sizing: border-box;`;


    const div = document.createElement('div');
    div.style = DIV_STYLE;
    div.id = '2ch-lahtabot-watermark';

    const imgs = ['0', '1', '2', '3'].map(id => {
        // Add container for container...
        const fileContainer = document.createElement('div');
        fileContainer.style = FILE_CONTAINER_STYLE;
        div.appendChild(fileContainer);

        // Add img container for aligning content
        const imgContainer = document.createElement('div');
        imgContainer.style = IMG_CONTAINER_STYLE;
        fileContainer.appendChild(imgContainer);

        // Add img element
        const img = document.createElement('img');
        img.style = IMG_STYLE;

        img.dataset.watermarkId = id;

        imgContainer.appendChild(img);

        return img;
    });

    const addAfter = (newNode, referenceNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

    addAfter(div, dollchanFilesContainer);

    return imgs;
}

// TODO: if using blobs, call revokeObjectURL
function changeImgSrc(imageId, newSrc) {
    getImg(imageId).src = newSrc;
}

function getImg(imageId) {
    const div = document.getElementById('2ch-lahtabot-watermark');
    return div.childNodes[imageId].firstChild.firstChild;
}