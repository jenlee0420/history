function routeObject1(baseWidth, baseHeight) {
    var obj = {
        source: null,
        originX: 0,
        originY: 0,
        width: baseWidth,
        height: baseHeight,
        mask1: {
            originX: 100,
            originY: 964,
            width: 100,
            height: 172,
            currOriginX: 100,
            currOriginY: 964,
            shiftX: 0,
            shiftY: 3,
            endPoint: 812
        },
        mask2: {
            originX: 152,
            originY: 740,
            width: 1,
            height: 110,
            currOriginX: 152,
            currOriginY: 740,
            shiftX: 3,
            shiftY: 0,
            endPoint: 937
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
            originX: 256,
            originY: 782,
            width: 1,
            height: 254,
            currOriginX: 256,
            currOriginY: 782,
            shiftX: 3,
            shiftY: 0,
            endPoint: 371
        },
        mask2: {
            originX: 624,
            originY: 1014,
            width: 116,
            height: 226,
            currOriginX: 624,
            currOriginY: 1014,
            shiftX: 0,
            shiftY: 3,
            endPoint: 804
        },
        mask3: {
            originX: 560,
            originY: 752,
            width: 136,
            height: 82,
            currOriginX: 560,
            currOriginY: 752,
            shiftX: 3,
            shiftY: 0,
            endPoint: 696
        },
        mask4: {
            originX: 818,
            originY: 662,
            width: 110,
            height: 124,
            currOriginX: 818,
            currOriginY: 662,
            shiftX: 0,
            shiftY: 3,
            endPoint: 786
        },
        mask5: {
            originX: 566,
            originY: 872,
            width: 302,
            height: 88,
            currOriginX: 566,
            currOriginY: 872,
            shiftX: 3,
            shiftY: 0,
            endPoint: 852
        },
        mask6: {
            originX: 1144,
            originY: 762,
            width: 118,
            height: 214,
            currOriginX: 1144,
            currOriginY: 762,
            shiftX: 0,
            shiftY: 3,
            endPoint: 902
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
            originX: -133,
            originY: 782,
            width: 409,
            height: 339,
            currOriginX: -133,
            currOriginY: 782,
            shiftX: 8.1,
            shiftY: 6.3,
            endPoint: 458
        },
        mask2: {
            originX: 666,
            originY: 488,
            width: 134,
            height: 1,
            currOriginX: 666,
            currOriginY: 488,
            shiftX: 0,
            shiftY: 8,
            endPoint: 340
        },
        mask3:{
            point1: [811, 285],
            point2: [845, 525],
            point3: [700, 715],
            ani: 0,
            speed: 3,
            size:20
          },
          mask4:{
            originX: 455,
            originY: 434,
            width: 238,
            height: 332,
            currOriginX: 455,
            currOriginY: 434,
            shiftX: 5,
            shiftY: 0,
            endPoint: 696
          },
          mask5:{
            originX: 521,
            originY: 408,
            width: 413,
            height: 142,
            currOriginX: 521,
            currOriginY: 408,
            shiftX: 4,
            shiftY: 0,
            endPoint: 935
          },
          mask6:{
            originX: 1376,
            originY: 544,
            width: 462,
            height: 164,
            currOriginX: 1376,
            currOriginY: 544,
            shiftX: 4,
            shiftY: 0,
            endPoint: 934
          },
          mask7:{
            originX: 711,
            originY: 390,
            width: 237,
            height: 317,
            currOriginX: 711,
            currOriginY: 390,
            shiftX: 6,
            shiftY: 8,
            endPoint: 934
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