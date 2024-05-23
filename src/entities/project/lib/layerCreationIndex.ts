let index = 0;

export function getLayerCreationIndex() {
    index++;
    return index;
}

export function resetLayerCreationIndex() {
    index = 0;
}
