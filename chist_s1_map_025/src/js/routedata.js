function routeObject1(baseWidth, baseHeight) {
    var obj = {
        source: null,
        originX: 0,
        originY: 0,
        width: baseWidth,
        height: baseHeight,
        mask1: {
            originX: 670,
            originY: 747,
            width: 358,
            height: 299,
            currOriginX: 670,
            currOriginY: 747,
            shiftX: 0,
            shiftY: 3,
            endPoint: 457
        },
        timeout: null,
        playing: false
    }
    return obj
}

function routeObject2(baseWidth, baseHeight) {
    var obj = {
        source: null,
        originX: 0,
        originY: 0,
        width: baseWidth,
        height: baseHeight,
        mask1: {
            originX: 788,
            originY: 512,
            width: 285,
            height: 239,
            currOriginX: 788,
            currOriginY: 512,
            shiftX: 3,
            shiftY: 0,
            endPoint: 1048
        },
        
        timeout: null,
        playing: false
    }
    return obj
}
function routeObject3(baseWidth, baseHeight) {
    var obj = {
        source: null,
        originX: 0,
        originY: 0,
        width: baseWidth,
        height: baseHeight,
        mask1: {
            originX: 842,
            originY: 726,
            width: 285,
            height: 185,
            currOriginX: 842,
            currOriginY: 726,
            shiftX: 0,
            shiftY: 3,
            endPoint: 902
        },
        
        timeout: null,
        playing: false
    }
    return obj
}
function routeObject4(baseWidth, baseHeight) {
    var obj = {
        source: null,
        originX: 0,
        originY: 0,
        width: baseWidth,
        height: baseHeight,
        mask1: {
            originX: 598,
            originY: 169,
            width: 104,
            height: 268,
            currOriginX: 598,
            currOriginY: 169,
            shiftX: 0,
            shiftY: 8,
            endPoint: 429
        },
        mask2: {
            originX: 598,
            originY: 645,
            width: 536,
            height: 194,
            currOriginX: 598,
            currOriginY: 645,
            shiftX: 8,
            shiftY: 0,
            endPoint: 81
        },
        
        timeout: null,
        playing: false
    }
    return obj
}
export {
    routeObject1,routeObject2,routeObject3,routeObject4
}