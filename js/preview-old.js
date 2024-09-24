'use strict';

const builderSelector = '[data-lttrface-builder]';
const shapeSelector = '[data-lttrface-shape]';
const tiltSelector = '[data-lttrface-tilt]';
const weightSelector = '[data-lttrface-weight]';
const previewSelector = '[data-lttrface-preview]';

const previewFontUrlTemplate = './fonts-face/LTTRFACE-S{shape}T{tilt}W{weight}.woff2';

const fontFamilyTemplate = 'lttrface-preview-font-{shape}-{tilt}-{weight}';
const fontFaceTemplate = '@font-face { font-family: {fontFamily}; src: url({url}) format("woff2"); }';

const fontPreloadTemplate = '<link rel="preload" href="{url}" as="font" type="font/woff2" crossorigin>';

const cachedFontFamilies = [];
const cachedPreviewFontUrls = [];

let nextBuilderIndex = 0;

let styleElement = null;

function buildFontFamily(shapeValue, tiltValue, weightValue)
{
    return fontFamilyTemplate
        .replace('{shape}', formatValue(shapeValue))
        .replace('{tilt}', formatValue(tiltValue))
        .replace('{weight}', formatValue(weightValue));
}

function buildStyleElementIfNeeded()
{
    if (styleElement == null) {
        styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
    }
}

function buildFontFaceIfNeeded(shapeValue, tiltValue, weightValue)
{
    const fontFamily = buildFontFamily(shapeValue, tiltValue, weightValue);

    if (cachedFontFamilies.includes(fontFamily))
    {
        return '';
    }

    const previewFontUrl = previewFontUrlTemplate
        .replace('{shape}', formatValue(shapeValue))
        .replace('{tilt}', formatValue(tiltValue))
        .replace('{weight}', formatValue(weightValue));

    const fontFace = fontFaceTemplate
        .replace('{fontFamily}', fontFamily)
        .replace('{url}', previewFontUrl);

    cachedFontFamilies.push(fontFamily);
    cachedPreviewFontUrls.push(previewFontUrl);

    return fontFace;
}

function addToFontFaceStyles(currentStyle, shapeValue, tiltValue, weightValue)
{
    const fontFace = buildFontFaceIfNeeded(shapeValue, tiltValue, weightValue);

    if (fontFace) {
        return currentStyle + " " + fontFace;
    } else {
        return currentStyle;
    }
}

function addFontFaceIfMissing(shapeValue, tiltValue, weightValue)
{
    buildStyleElementIfNeeded();
    const oldStyle = styleElement.innerText;

    const newStyle = addToFontFaceStyles(oldStyle, shapeValue, tiltValue, weightValue);

    if (newStyle !== oldStyle) {
        styleElement.innerText = newStyle;
    }
}

function addMissingFontFaces(
    minShape, maxShape, stepShape,
    minTilt, maxTilt, stepTilt,
    minWeight, maxWeight, stepWeight)
{
    buildStyleElementIfNeeded();
    let style = styleElement.innerText;

    for (let shapeValue = minShape; shapeValue <= maxShape; shapeValue = shapeValue + stepShape) {
        for (let tiltValue = minTilt; tiltValue <= maxTilt; tiltValue = tiltValue + stepTilt) {
            for (let weightValue = minWeight; weightValue <= maxWeight; weightValue = weightValue + stepWeight) {
                style = addToFontFaceStyles(style, shapeValue, tiltValue, weightValue);
            }
        }
    }

    styleElement.innerText = style;
}

function formatValue(value)
{
    if (value < 0) {
        return '-' + String(value * -1).padStart(3, '0');
    } else {
        return String(value).padStart(3, '0');
    }
}

function updatePreview(builderIndex, shapeElement, tiltElement, weightElement, previewElement)
{
    const shapeValue = shapeElement.value;
    const tiltValue = tiltElement.value;
    const weightValue = weightElement.value;

    addFontFaceIfMissing(shapeValue, tiltValue, weightValue);

    const fontFamily = buildFontFamily(shapeValue, tiltValue, weightValue);

    previewElement.style.fontFamily = fontFamily;
}

function initializeBuilder(builderElement)
{
    const builderIndex = nextBuilderIndex;
    nextBuilderIndex++;

    buildStyleElementIfNeeded();
    const shapeElement = builderElement.querySelector(shapeSelector);
    const tiltElement = builderElement.querySelector(tiltSelector);
    const weightElement = builderElement.querySelector(weightSelector);
    const previewElement = builderElement.querySelector(previewSelector);

    addMissingFontFaces(
        Number(shapeElement.min), Number(shapeElement.max), Number(shapeElement.step),
        Number(tiltElement.min), Number(tiltElement.max), Number(tiltElement.step),
        Number(weightElement.min), Number(weightElement.max), Number(weightElement.step));

    shapeElement.addEventListener('input', () => updatePreview(builderIndex, shapeElement, tiltElement, weightElement, previewElement));
    tiltElement.addEventListener('input', () => updatePreview(builderIndex, shapeElement, tiltElement, weightElement, previewElement));
    weightElement.addEventListener('input', () => updatePreview(builderIndex, shapeElement, tiltElement, weightElement, previewElement));

    updatePreview(nextBuilderIndex, shapeElement, tiltElement, weightElement, previewElement);
}

function addFontPreloads()
{
    const fontPreloads = [];

    for (let previewFontUrl of cachedPreviewFontUrls) {
        const fontPreload = fontPreloadTemplate
            .replace('{url}', previewFontUrl);
        fontPreloads.push(fontPreload);
    }

    document.head.innerHTML = document.head.innerHTML + "\n" + fontPreloads.join("\n");
}

function initializeAll()
{
    const builderElements = document.querySelectorAll(builderSelector);
    for (let builderElement of builderElements) {
        initializeBuilder(builderElement);
    }

    addFontPreloads();
}

window.addEventListener('load', () => initializeAll());