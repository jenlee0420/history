// Variable Declare
var dpr = window.devicePixelRatio || 1
var docEl = document.documentElement

var _scale = 1;
var _controlArray = [0, 0, 0, 0, 0, 0, 0, 0];
var imageMap, imageMapDetail, imagedongdu, imageRiver2, imageRiver3, imageRiver4, imageRiver5, imagerice;
var imageCapital, imageGate, imageMainCity, imageRiver, imageControlCity, imageHorse, drawHorsesTimeout, drawHorsesTimeout2;
var drawRiverTimeout;
var horseObject1, horseObject2, horseObject3, horseObject4, horseObject5
var redTimer, greedTimer, timerGroup = [],
    horsetimerGroup = [],
    horsetimerGroup2 = [],
    soundindex = ''
var redNumber = 1,
    greedNumber = 1
var isMute = false
var baseWidth = 1488, //fix
    baseHeight = 1365
var canvasW = 1488,
    canvasH = 1365 //fix
var docWidth = 0,
    docHeight = 0,
    boxscale = 1
var bodyHeight ,
    bodytWidth 

$(document).ready(function () {
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", setRemUnit, false);
    // docEl.style.fontSize = (137) + 'px'
    setRemUnit()
    bodyHeight = document.body.clientHeight
        bodytWidth = document.body.clientWidth
        console.log(bodytWidth,bodyHeight)
})
function bodyScroll(event) {
    event.preventDefault();
}



function setRemUnit() {
    // if (window.orientation === 0 || window.orientation === 180) {
    //     //竖屏
    //     bodyHeight = $(window).outerHeight()
    //     bodytWidth = $(window).innerWidth()
    //     console.log('竖屏', bodytWidth)

    // } else if (window.orientation === 90 || window.orientation === -90) {
    //     //横屏
        
    //     bodyHeight = $(window).outerHeight()
    //     bodytWidth = $(window).innerWidth()
    //     console.log('横屏', bodytWidth)
    // }
    var selffun = function () {
        bodyHeight = document.body.clientHeight
        bodytWidth = document.body.clientWidth
        if (bodytWidth > bodyHeight) {
            boxscale = bodyHeight / 1536
        } else {
            boxscale = bodytWidth / 2048
        }

        var u_agent = navigator.userAgent
        console.log(u_agent,bodyHeight,bodytWidth)

        if ((/Firefox/.test(u_agent) || (u_agent.indexOf('Trident') > -1 && u_agent.indexOf('rv:11') > -1))) {
            $("#main_container").css({
                '-moz-transform': 'scale(' + boxscale + ')',
                '-ms-transform': 'scale(' + boxscale + ')',
                '-moz-transform-origin': 'top left',
                '-ms-transform-origin': 'top left',
            })
        } else {

            $("#main_container").css({
                // 'transform': 'scale('+scale+')',
                // '-webkit-transform': 'scale('+scale+')',
                'zoom': boxscale
            })
        }
    }
    if ("onorientationchange" in window){
        setTimeout(() => {
            selffun()
        }, 100);
    }else{
        selffun()
    }
    
}


var divTag = document.createElement('div');
var canvasBackground = document.createElement('canvas');
var canvasTop = document.createElement('canvas');
var canvasStatic1 = document.createElement('canvas');
var canvasStatic2 = document.createElement('canvas');
var canvasStatic3 = document.createElement('canvas');
var canvasStatic4 = document.createElement('canvas');
var canvasStatic5 = document.createElement('canvas');
var canvasStatic6 = document.createElement('canvas');
var canvasAnimRedPath = document.createElement('canvas');
var canvasAnimGreenPath = document.createElement('canvas');
var canvasAnimBluePath = document.createElement('canvas');
var canvasAnimHorse = document.createElement('canvas');
var canvasAnimHorse2 = document.createElement('canvas');

var contextBackground = canvasBackground.getContext('2d');
var contextTop = canvasTop.getContext('2d');
var contextStatic1 = canvasStatic1.getContext('2d');
var contextStatic2 = canvasStatic2.getContext('2d');
var contextStatic3 = canvasStatic3.getContext('2d');
var contextStatic4 = canvasStatic4.getContext('2d');
var contextStatic5 = canvasStatic5.getContext('2d');
var contextStatic6 = canvasStatic6.getContext('2d');
var contextAnimRedPath = canvasAnimRedPath.getContext('2d');
var contextAnimGreenPath = canvasAnimGreenPath.getContext('2d');
var contextAnimBluePath = canvasAnimBluePath.getContext('2d');
var contextAnimHorse = canvasAnimHorse.getContext('2d');
var contextAnimHorse2 = canvasAnimHorse2.getContext('2d');

var canvasStatic8 = document.createElement('canvas');
var canvasStatic9 = document.createElement('canvas');
var contextStatic8 = canvasStatic8.getContext('2d');
var contextStatic9 = canvasStatic9.getContext('2d');

/* 音频 */
var m01 = document.createElement('audio')
var m02 = document.createElement('audio')
var m03 = document.createElement('audio')
var m04 = document.createElement('audio')
var m05 = document.createElement('audio')
var m06 = document.createElement('audio')
var m07 = document.createElement('audio')
var waveSound = document.createElement('audio')
var winSound = document.createElement('audio')
m01.src = 'img/vo/map003_01.mp3'
m02.src = 'img/vo/map003_02.mp3'
m03.src = 'img/vo/map003_04.mp3'
m04.src = 'img/vo/map003_05.mp3'
m05.src = 'img/vo/map003_06.mp3'
m06.src = 'img/vo/map003_07.mp3'
m07.src = 'img/vo/map003_07.mp3'
waveSound.src = 'img/vo/wave.mp3'
winSound.src = 'img/vo/win.mp3'
waveSound.loop = 'loop'
waveSound.volume = 0.4


// Variable init
divTag.appendChild(canvasBackground);
divTag.appendChild(canvasTop);
divTag.appendChild(canvasStatic1);
divTag.appendChild(canvasStatic2);
divTag.appendChild(canvasStatic3);
divTag.appendChild(canvasStatic4);
divTag.appendChild(canvasStatic5);
divTag.appendChild(canvasStatic6);
divTag.appendChild(canvasStatic8);
divTag.appendChild(canvasStatic9);
divTag.appendChild(canvasAnimRedPath);
divTag.appendChild(canvasAnimGreenPath);
divTag.appendChild(canvasAnimBluePath);
divTag.appendChild(canvasAnimHorse);
divTag.appendChild(canvasAnimHorse2);

divTag.id = "canvasInnerDiv";
canvasBackground.id = "myCanvasBackground";
canvasTop.id = "myCanvasTop";
canvasStatic1.id = "myCanvasStatic1";
canvasStatic2.id = "myCanvasStatic2";
canvasStatic3.id = "myCanvasStatic3";
canvasStatic4.id = "myCanvasStatic4";
canvasStatic5.id = "myCanvasStatic5";
canvasStatic6.id = "myCanvasStatic6";
canvasStatic8.id = "myCanvasStatic8";
canvasStatic9.id = "myCanvasStatic9";
canvasAnimRedPath.id = "myCanvasAnimRedPath";
canvasAnimGreenPath.id = "myCanvasAnimGreenPath";
canvasAnimBluePath.id = "myCanvasAnimBluePath";
canvasAnimHorse.id = "myCanvasAnimHorse";
canvasAnimHorse2.id = "myCanvasAnimHorse2";

canvasBackground.style.position = "absolute";
canvasTop.style.position = "absolute";
canvasStatic1.style.position = "absolute";
canvasStatic2.style.position = "absolute";
canvasStatic3.style.position = "absolute";
canvasStatic4.style.position = "absolute";
canvasStatic5.style.position = "absolute";
canvasStatic6.style.position = canvasStatic8.style.position = canvasStatic9.style.position = "absolute";
canvasAnimRedPath.style.position = "absolute";
canvasAnimGreenPath.style.position = "absolute";
canvasAnimBluePath.style.position = "absolute";
canvasAnimHorse.style.position = canvasAnimHorse2.style.position = "absolute";

canvasBackground.style.zIndex = "0";
canvasTop.style.zIndex = "2";
canvasStatic1.style.zIndex = "3";
canvasStatic2.style.zIndex = "3";
canvasStatic3.style.zIndex = "3";
canvasStatic4.style.zIndex = "2";
canvasStatic5.style.zIndex = "2";
canvasStatic6.style.zIndex = canvasStatic8.style.zIndex = canvasStatic9.style.zIndex = "2";
canvasAnimRedPath.style.zIndex = "6";
canvasAnimGreenPath.style.zIndex = "6";
canvasAnimBluePath.style.zIndex = "2";
canvasAnimHorse.style.zIndex = canvasAnimHorse2.style.zIndex = "6";

canvasBackground.width = 0;
canvasBackground.height = 0;
canvasAnimRedPath.width = baseWidth;
canvasAnimRedPath.height = baseHeight;
canvasAnimGreenPath.width = baseWidth;
canvasAnimGreenPath.height = baseHeight;
canvasAnimBluePath.width = baseWidth;
canvasAnimBluePath.height = baseHeight;
canvasAnimHorse.width = canvasAnimHorse2.width = baseWidth;
canvasAnimHorse.height = canvasAnimHorse2.height = baseHeight;

imageMap = new Image();
imageMapDetail = new Image();
imageCapital = new Image();
imageGate = new Image();
imagedongdu = new Image();
imageMainCity = new Image();
imageRiver = new Image();
imageRiver2 = new Image();
imageRiver3 = new Image();
imageRiver4 = new Image();
imageRiver5 = new Image();
imageControlCity = new Image();
imageHorse = new Image();
imagerice = new Image();

imageMap.src = "img/map.png";
imageMapDetail.src = "img/mapDetail.png";
imageCapital.src = "img/capital.png";
imageGate.src = "img/gate.png";
imagedongdu.src = "img/dongdu.png";
imagerice.src = "img/rices.png";
imageMainCity.src = "img/main_city.png";
imageRiver.src = "img/river01.png";
imageRiver2.src = "img/river02.png";
imageRiver3.src = "img/river03.png";
imageRiver4.src = "img/river04.png";
imageRiver5.src = "img/river05.png";
imageHorse.src = "img/ship.png";

imageCapital.onload = function() {
    canvasStatic1.width = baseWidth;
    canvasStatic1.height = baseHeight;
    contextStatic1.drawImage(imageCapital, 0, 0, baseWidth, baseHeight);
}
imagedongdu.onload = function() {
    canvasStatic2.width = baseWidth;
    canvasStatic2.height = baseHeight;
    contextStatic2.drawImage(imagedongdu, 0, 0, baseWidth, baseHeight);
}
imageMainCity.onload = function() {
    canvasStatic3.width = baseWidth;
    canvasStatic3.height = baseHeight;
    contextStatic3.drawImage(imageMainCity, 0, 0, baseWidth, baseHeight);
}
imageGate.onload = function() {
    canvasStatic4.width = baseWidth;
    canvasStatic4.height = baseHeight;
    contextStatic4.drawImage(imageGate, 0, 0, baseWidth, baseHeight);
}
imageRiver.onload = function() {
    canvasStatic5.width = baseWidth;
    canvasStatic5.height = baseHeight;
    // contextStatic5.drawImage(imageRiver, 0, 0, 1200, 1200);
}
imageRiver4.onload = function() {
    canvasStatic8.width = baseWidth;
    canvasStatic8.height = baseHeight;
    // contextStatic8.drawImage(imageRiver4, 0, 0, 1200, 1200);
}
imageRiver5.onload = function() {
    canvasStatic9.width = baseWidth;
    canvasStatic9.height = baseHeight;
    // contextStatic9.drawImage(imageRiver5, 0, 0, 1200, 1200);
}
imagerice.onload = function() {
    canvasStatic6.width = baseWidth;
    canvasStatic6.height = baseHeight;
    contextStatic6.drawImage(imagerice, 0, 0, baseWidth, baseHeight);
}
imageHorse.onload = function() {

    var translate = [
        [1180, 1120],
        [1120, 968]
        // [-1040, 830],

    ];
    // let position = translate[0]
    // contextAnimHorse.drawImage(imageHorse, position[0], position[1], 820 * 0.25, 360 * 0.25);
    // canvasAnimHorse.style.visibility = 'visible'
    // console.log(canvasAnimHorse.style.visibility)
    var scale = [1, 1];
    var dur = [10, 7];
    var sharpPoint = [0, 1]
    horseObject1 = initHorseObject(translate, scale, dur, sharpPoint);
    translate = [
        [1120, 978],
        [1023, 838]
    ];
    scale = [1, 1];
    dur = [7, 7];
    sharpPoint = [0, 1]
    horseObject2 = initHorseObject(translate, scale, dur, sharpPoint);
    translate = [
        [1023, 838],
        [825, 807],
        [566, 753]
    ];
    scale = [1, 1, 1];
    dur = [8, 8, 8];
    sharpPoint = [0, 0, 1]
    horseObject3 = initHorseObject(translate, scale, dur, sharpPoint);
    translate = [
        [566, 753],
        [688, 612],
        [887, 375],
        [830, 165]
    ];
    scale = [1, 1, 1, 0];
    dur = [8, 10, 10, 18];
    sharpPoint = [0, 0, 0, 1]
    horseObject4 = initHorseObject(translate, scale, dur, sharpPoint);

    translate = [
        [490, 717],
        [378, 767],
        [223, 870],
    ];
    scale = [1, 1, 0];
    dur = [7, 10, 7];
    sharpPoint = [0, 0, 1]
    horseObject5 = initHorseObject(translate, scale, dur, sharpPoint);
    horseObject5.id = 5
}




/*
imageMapDetail.onload = function() {
	createMap(_controlArray, _scale);
}
*/
function muteMe(elem) {
    m01.pause()
    m02.pause()
    m03.pause()
    m04.pause()
    m05.pause()
    m06.pause()
    waveSound.pause()
    winSound.pause()
}

function setSound(control, action) {
    if (control == 0 && action != soundindex) {
        return
    }
    //停止所有声音
    muteMe()
        // console.log(control,action)
    soundindex = action
    if (control == '0' || isMute == true) return
    switch (action) {
        case '0':
            m01.currentTime = 0
            m01.play()
                // showCityAni(canvasStatic1, true)

            break;
        case '1':
            m02.currentTime = 0
            m02.play()

            break;
        case '2':
            // showCityAni(canvasStatic3, true)
            break;
        case '3':
            m03.currentTime = 0
            m03.play()
                // showCityAni(canvasStatic4, true)
            break;
        case '4':
            m04.currentTime = 0
            m04.play()
                // showCityAni(canvasStatic4, true)
            break;
        case '5':
            m05.currentTime = waveSound.currentTime = 0
            m05.play()
            waveSound.play()

            break;
        case '6':
            m06.currentTime = waveSound.currentTime = 0
            m06.play()
            waveSound.play()

            break;
        case '7':
            winSound.currentTime = 0
            winSound.play()
                // showCityAni(canvasStatic6, true)
            break;
        default:
            break;
    }
}

function showCityAni(canvasStatic, bool) {
    if (!bool) {
        clearInterval(canvasStatic.timeout)
        canvasStatic.style.visibility = "hidden";
        canvasStatic.ani = false
        return
    }
    if (canvasStatic.ani == true) {
        return
    }

    let show = false
    let times = 4
    canvasStatic.timeout = setInterval(() => {
        if (times == 0) {
            clearInterval(canvasStatic.timeout)
            return;
        }
        canvasStatic.style.visibility = show ? 'visible' : 'hidden';
        show = !show
        times -= 1
    }, 260);
    canvasStatic.ani = true
}
// Main Function
function createMap(controlArray, scale) {
    var sameChecking = true;
    _scale = scale;

    for (var i = 0; i < controlArray.length; i++) {
        if (_controlArray[i] != controlArray[i]) {
            sameChecking = false;
            break;
        }
    }

    var tmp = canvasW * _scale; //fix
    var tmpH = canvasH * _scale
    divTag.style.width = tmp + "px";
    divTag.style.height = tmpH + "px";

    var boundary, boundaryH;
    if (_scale <= 2) {
        boundary = baseWidth;
        boundaryH = baseHeight
    } else {
        boundary = baseWidth * 1.2;
        boundaryH = baseHeight * 1.2
    }

    if (canvasBackground.width != boundary) {
        canvasBackground.width = boundary;
        canvasBackground.height = boundaryH;
        sameChecking = false;
    }

    if (!sameChecking) {
        contextBackground.save();
        contextBackground.setTransform(1, 0, 0, 1, 0, 0);
        contextBackground.clearRect(0, 0, canvasBackground.width, canvasBackground.height);
        contextBackground.restore();
        contextBackground.drawImage(imageMap, 0, 0, boundary, boundaryH);
    }
    var scale = _scale / (boundary / canvasW);;
    setScale(canvasBackground, scale);


    if (!sameChecking) {
        var horse1 = false,
            horse2 = false,
            horse3 = false;
        if (controlArray[0] == 1) {
            canvasStatic1.style.visibility = "visible";
            showCityAni(canvasStatic1, true)
        } else {
            showCityAni(canvasStatic1, false)
        }
        if (controlArray[1] == 1) {
            canvasStatic2.style.visibility = "visible";
            showCityAni(canvasStatic2, true)
        } else {
            showCityAni(canvasStatic2, false)
        }
        if (controlArray[2] == 1) {
            canvasStatic3.style.visibility = "visible";
            showCityAni(canvasStatic3, true)
        } else {
            showCityAni(canvasStatic3, false)
        }
        if (controlArray[3] == 1) {
            canvasStatic4.style.visibility = "visible";
            showCityAni(canvasStatic4, true)
        } else {
            showCityAni(canvasStatic4, false)
        }
        if (controlArray[4] == 1) {
            drawRiverPath(true);
        } else {
            drawRiverTimeout = ''
            drawRiverPath(false);
        }
        if (controlArray[5] == 1) {
            // drawRedPath(true);
            // horse1 = true;
            ship1(true)

        } else {
            ship1(false)
        }
        if (controlArray[6] == 1) {
            ship2(true)
        } else {
            ship2(false)
        }
        if (controlArray[7] == 1) {
            canvasStatic6.style.visibility = "visible";
            showCityAni(canvasStatic6, true)
        } else {
            showCityAni(canvasStatic6, false)
        }
    }

    var scale = _scale / (boundary / canvasW); //fix
    setScale(canvasStatic1, scale);
    setScale(canvasStatic2, scale);
    setScale(canvasStatic3, scale);
    setScale(canvasStatic4, scale);
    setScale(canvasStatic5, scale);
    setScale(canvasStatic6, scale);
    setScale(canvasStatic8, scale);
    setScale(canvasStatic9, scale);
    setScale(canvasAnimRedPath, scale);
    setScale(canvasAnimGreenPath, scale);
    setScale(canvasAnimBluePath, scale);
    setScale(canvasAnimHorse, scale);
    setScale(canvasAnimHorse2, scale);
    /*
    canvasStatic1.style.zoom = _scale / (boundary / 600);
    canvasStatic2.style.zoom = _scale / (boundary / 600);
    canvasStatic3.style.zoom = _scale / (boundary / 600);
    canvasStatic4.style.zoom = _scale / (boundary / 600);
    canvasStatic5.style.zoom = _scale / (boundary / 600);
    canvasAnimRedPath.style.zoom = _scale / (boundary / 600);
    canvasAnimGreenPath.style.zoom = _scale / (boundary / 600);
    canvasAnimBluePath.style.zoom = _scale / (boundary / 600);
    */
    if (canvasTop.width != boundary) {
        canvasTop.width = boundary;
        canvasTop.height = boundaryH;
        sameChecking = false;
    }
    if (!sameChecking) {
        contextTop.save();
        contextTop.setTransform(1, 0, 0, 1, 0, 0);
        contextTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
        contextTop.restore();
        contextTop.drawImage(imageMapDetail, 0, 0, boundary, boundaryH);
    }
    setScale(canvasTop, scale);
    //	canvasTop.style.zoom = _scale / (boundary / 600);

    for (var i = 0; i < controlArray.length; i++) {
        _controlArray[i] = controlArray[i];
    }

    return $(divTag);
}

function ship1(flag) {
    var img = new Image()
    let h = 50,
        y = 1200,
        xx = 1154,
        ww = 220
    var addRadial = function() {
        contextAnimRedPath.save(); //保存当前绘图状态
        contextAnimRedPath.beginPath(); //开始创建路径
        if (xx <= 600) {
            y -= 15
            h += 15
        } else if (y <= 820) {
            xx -= 15
            ww += 15
            y = 785
        } else if (y <= 1200) {
            y -= 15
            h += 15
        }
        contextAnimRedPath.rect(xx, y, ww, h)
        contextAnimRedPath.closePath(); //关闭路径
        contextAnimRedPath.clip();
        contextAnimRedPath.drawImage(img, 0, 0, baseWidth, baseHeight);
        contextAnimRedPath.rect(0, 0, baseWidth, baseHeight)
        contextAnimRedPath.restore();

        if (h < 1170) {
            redTimer = setTimeout(() => {
                addRadial()
            }, 50);
        } else {
            clearTimeout(redTimer)
        }
    }
    if (flag == true) {
        img.src = 'img/route1/xianlu1a0090.png'
        img.onload = function() {
                canvasAnimRedPath.style.visibility = "visible";
                // console.log('anistart')
                if (!canvasAnimRedPath.playing) {
                    addRadial()
                    drawHousePromise()
                    canvasAnimRedPath.playing = true
                }
                // redTimer = setInterval(() => {
                //     addRadial()
                //     if (h >= 1000) {
                //         clearInterval(redTimer)
                //     }
                //     y -= 10
                //     h += 10
                // }, 50);

            }
            // drawHousePromise()

        // drawHorsesTimeout = setTimeout(function () { ship1(flag); }, 1 / 30 * 1000);
    } else {
        showCityAni(canvasAnimHorse, false)
        canvasAnimRedPath.playing = false
        clearTimeout(redTimer)
        canvasAnimRedPath.style.visibility = "hidden";
        canvasClear(canvasAnimRedPath);
        for (var i = 0; i < horsetimerGroup.length; i++) {
            clearTimeout(horsetimerGroup[i])
        }
        clearTimeout(canvasAnimHorse.timeout)
        canvasAnimHorse.style.visibility = "hidden";
        canvasClear(canvasAnimHorse);
        clearInterval(drawHorsesTimeout)
        resetHorseObject(horseObject1);
        resetHorseObject(horseObject2);
        resetHorseObject(horseObject3);
        resetHorseObject(horseObject4);
    }
}

function ship2(flag) {
    var img = new Image()
    let w = 10,
        x = 620
    var addRadial2 = function() {
        contextAnimGreenPath.save(); //保存当前绘图状态
        contextAnimGreenPath.beginPath(); //开始创建路径
        contextAnimGreenPath.rect(x, 650, w, 250)
        contextAnimGreenPath.closePath(); //关闭路径
        contextAnimGreenPath.clip();
        contextAnimGreenPath.drawImage(img, 0, 0, baseWidth, baseHeight);
        contextAnimGreenPath.restore();
        x -= 10
        w += 10
        if (x > 90) {
            greedTimer = setTimeout(() => {
                addRadial2()
            }, 50);
        } else {
            clearTimeout(greedTimer)
        }
    }
    if (flag == true) {
        img.src = 'img/route2/xianlu2b0050.png'
        img.onload = function() {
                canvasAnimGreenPath.style.visibility = "visible";
                if (!canvasAnimGreenPath.playing) {
                    addRadial2()
                    drawHorse2()
                    canvasAnimGreenPath.playing = true
                }
                // greedTimer = setInterval(() => {
                //     addRadial2(x,w)
                //     if (x <= 0) {
                //         clearInterval(greedTimer)
                //     }
                //     x -= 10
                //     w += 10
                // }, 50);

            }
            // drawHorse2()
    } else {
        // console.log('clear')
        showCityAni(canvasAnimHorse2, false)
        canvasAnimGreenPath.playing = false
        clearTimeout(greedTimer)
        canvasAnimGreenPath.style.visibility = "hidden";
        canvasClear(canvasAnimGreenPath);
        for (var i = 0; i < horsetimerGroup2.length; i++) {
            clearTimeout(horsetimerGroup2[i])
        }
        clearTimeout(canvasAnimHorse2.timeout)
        canvasAnimHorse2.style.visibility = "hidden";
        resetHorseObject(horseObject5);
        canvasClear(canvasAnimHorse2);
    }
}

function drawRiverPath(flag) {

    var sharp = function(x, y, w, h, River) {
        let show = false
        let times = 4
        contextStatic5.timeout = setInterval(() => {
            if (times == 0) {
                clearInterval(contextStatic5.timeout)
                return;
            }
            if (show) {
                contextStatic5.drawImage(River, 0, 0, baseWidth, baseHeight);
            } else {
                contextStatic5.clearRect(x, y, w, h);
                // contextStatic5.fillRect(x, y, w, h)
            }
            show = !show
            times -= 1
        }, 300);
    }
    var sharp2 = function(canvasStatic) {
        let show = false
        let times = 4
        canvasStatic.timeout = setInterval(() => {
            if (times == 0) {
                clearInterval(canvasStatic.timeout)
                return;
            }
            canvasStatic.style.visibility = show ? 'visible' : 'hidden';
            show = !show
            times -= 1
        }, 300);
    }
    if (flag == true) {
        if (drawRiverTimeout == 'end') {
            return
        }

        canvasClear(canvasStatic5);
        canvasStatic5.style.visibility = "visible";
        drawRiverTimeout = 'end'
            /*timerGroup[0] = setTimeout(() => {
                sharp(0, 0, 1200, 1200, imageRiver)
            }, 4500);
            timerGroup[1] = setTimeout(() => {
                sharp(984, 845, 176, 200, imageRiver2)
            }, 6200);
            timerGroup[2] = setTimeout(() => {
                sharp(908, 743, 134, 116, imageRiver3)
            }, 8000);
            timerGroup[3] = setTimeout(() => {
                sharp2(canvasStatic8)
            }, 9500);
            timerGroup[4] = setTimeout(() => {
                sharp2(canvasStatic9)
            }, 11000);*/
        timerGroup[0] = setTimeout(() => {
            canvasStatic5.style.visibility = "visible";
            contextStatic5.drawImage(imageRiver, 0, 0, baseWidth, baseHeight);
        }, 5000);
        timerGroup[1] = setTimeout(() => {
            contextStatic5.drawImage(imageRiver2, 0, 0, baseWidth, baseHeight);
        }, 7000);
        timerGroup[2] = setTimeout(() => {
            contextStatic5.drawImage(imageRiver3, 0, 0, baseWidth, baseHeight);
        }, 9000);
        timerGroup[3] = setTimeout(() => {
            contextStatic5.drawImage(imageRiver4, 0, 0, baseWidth, baseHeight);
        }, 10000);
        timerGroup[4] = setTimeout(() => {
            contextStatic5.drawImage(imageRiver5, 0, 0, baseWidth, baseHeight);
        }, 12000);
    } else {
        console.log('clear')
        drawRiverTimeout = ''
        for (var i = 0; i < timerGroup.length; i++) {
            clearTimeout(timerGroup[i])
        }
        canvasClear(canvasStatic5);
        /*clearInterval(canvasStatic5.timeout)
        clearInterval(canvasStatic8.timeout)
        clearInterval(canvasStatic9.timeout)
        canvasStatic5.style.visibility = "hidden";
        canvasStatic8.style.visibility = "hidden";
        canvasStatic9.style.visibility = "hidden";*/


    }
}

function drawRedPath(flag) {
    if (flag == true) {
        if (redPathObject.anim4.mask1.currOriginX > redPathObject.anim4.path1.endPointX) {
            //		if (true) {
            canvasClear(canvasAnimRedPath);
            var x1, x2, y1, y2;
            if (redPathObject.anim1.mask1.currOriginY + redPathObject.anim1.mask1.height < redPathObject.anim1.path1.endPointY) {
                redPathObject.anim1.mask1.currOriginY += redPathObject.anim1.mask1.shiftY;
            } else {
                if (redPathObject.anim2.mask1.currOriginX > redPathObject.anim2.path2.endPointX) {
                    redPathObject.anim2.mask1.currOriginX += redPathObject.anim2.mask1.shiftX;
                    redPathObject.anim2.mask1.width += redPathObject.anim2.mask1.enlargeWidth;
                } else {
                    if (redPathObject.anim3.mask1.currOriginX > redPathObject.anim3.path1.endPointX) {
                        redPathObject.anim3.mask1.currOriginX += redPathObject.anim3.mask1.shiftX;
                    } else {
                        if (redPathObject.anim4.mask1.currOriginX > redPathObject.anim4.path1.endPointX) {
                            redPathObject.anim4.mask1.currOriginX += redPathObject.anim4.mask1.shiftX;
                        }
                    }
                }
            }

            contextAnimRedPath.save();
            contextAnimRedPath.beginPath();
            contextAnimRedPath.rect(redPathObject.anim1.mask1.currOriginX, redPathObject.anim1.mask1.currOriginY, redPathObject.anim1.mask1.width, redPathObject.anim1.mask1.height);
            if (redPathObject.anim1.mask1.currOriginY + redPathObject.anim1.mask1.height >= redPathObject.anim1.path1.endPointY) {
                contextAnimRedPath.rect(redPathObject.anim2.mask1.currOriginX, redPathObject.anim2.mask1.currOriginY, redPathObject.anim2.mask1.width, redPathObject.anim2.mask1.height);
            }
            if (redPathObject.anim2.mask1.currOriginX <= redPathObject.anim2.path2.endPointX) {
                contextAnimRedPath.rect(redPathObject.anim3.mask1.currOriginX, redPathObject.anim3.mask1.currOriginY, redPathObject.anim3.mask1.width, redPathObject.anim3.mask1.height);
            }
            if (redPathObject.anim3.mask1.currOriginX <= redPathObject.anim3.path1.endPointX) {
                contextAnimRedPath.rect(redPathObject.anim4.mask1.currOriginX, redPathObject.anim4.mask1.currOriginY, redPathObject.anim4.mask1.width, redPathObject.anim4.mask1.height);
            }
            contextAnimRedPath.clip();

            contextAnimRedPath.beginPath();
            contextAnimRedPath.moveTo(redPathObject.anim1.path1.startPointX, redPathObject.anim1.path1.startPointY);
            contextAnimRedPath.quadraticCurveTo(redPathObject.anim1.path1.controlPointX, redPathObject.anim1.path1.controlPointY, redPathObject.anim1.path1.endPointX, redPathObject.anim1.path1.endPointY);
            contextAnimRedPath.lineWidth = 3;
            contextAnimRedPath.strokeStyle = "#ff0000";
            contextAnimRedPath.stroke();

            x1 = redPathObject.anim1.arrow1.point[1][0];
            x2 = redPathObject.anim1.arrow1.point[0][0];
            y1 = redPathObject.anim1.arrow1.point[1][1];
            y2 = redPathObject.anim1.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimRedPath, x2, y2, radians, 'red');

            contextAnimRedPath.beginPath();
            contextAnimRedPath.moveTo(redPathObject.anim2.path1.startPointX, redPathObject.anim2.path1.startPointY);
            contextAnimRedPath.quadraticCurveTo(redPathObject.anim2.path1.controlPointX, redPathObject.anim2.path1.controlPointY, redPathObject.anim2.path1.endPointX, redPathObject.anim2.path1.endPointY);
            contextAnimRedPath.lineWidth = 3;
            contextAnimRedPath.strokeStyle = "#ff0000";
            contextAnimRedPath.stroke();

            x1 = redPathObject.anim2.arrow1.point[1][0];
            x2 = redPathObject.anim2.arrow1.point[0][0];
            y1 = redPathObject.anim2.arrow1.point[1][1];
            y2 = redPathObject.anim2.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimRedPath, x2, y2, radians, 'red');

            contextAnimRedPath.beginPath();
            contextAnimRedPath.moveTo(redPathObject.anim2.path2.startPointX, redPathObject.anim2.path2.startPointY);
            contextAnimRedPath.quadraticCurveTo(redPathObject.anim2.path2.controlPointX, redPathObject.anim2.path2.controlPointY, redPathObject.anim2.path2.endPointX, redPathObject.anim2.path2.endPointY);
            contextAnimRedPath.lineWidth = 3;
            contextAnimRedPath.strokeStyle = "#ff0000";
            contextAnimRedPath.stroke();

            x1 = redPathObject.anim2.arrow2.point[1][0];
            x2 = redPathObject.anim2.arrow2.point[0][0];
            y1 = redPathObject.anim2.arrow2.point[1][1];
            y2 = redPathObject.anim2.arrow2.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimRedPath, x2, y2, radians, 'red');

            contextAnimRedPath.beginPath();
            contextAnimRedPath.moveTo(redPathObject.anim3.path1.startPointX, redPathObject.anim3.path1.startPointY);
            contextAnimRedPath.quadraticCurveTo(redPathObject.anim3.path1.controlPointX, redPathObject.anim3.path1.controlPointY, redPathObject.anim3.path1.endPointX, redPathObject.anim3.path1.endPointY);
            contextAnimRedPath.lineWidth = 3;
            contextAnimRedPath.strokeStyle = "#ff0000";
            contextAnimRedPath.stroke();

            x1 = redPathObject.anim3.arrow1.point[1][0];
            x2 = redPathObject.anim3.arrow1.point[0][0];
            y1 = redPathObject.anim3.arrow1.point[1][1];
            y2 = redPathObject.anim3.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimRedPath, x2, y2, radians, 'red');

            contextAnimRedPath.beginPath();
            contextAnimRedPath.moveTo(redPathObject.anim4.path1.startPointX, redPathObject.anim4.path1.startPointY);
            contextAnimRedPath.quadraticCurveTo(redPathObject.anim4.path1.controlPointX, redPathObject.anim4.path1.controlPointY, redPathObject.anim4.path1.endPointX, redPathObject.anim4.path1.endPointY);
            contextAnimRedPath.lineWidth = 3;
            contextAnimRedPath.strokeStyle = "#ff0000";
            contextAnimRedPath.stroke();

            x1 = redPathObject.anim4.arrow1.point[1][0];
            x2 = redPathObject.anim4.arrow1.point[0][0];
            y1 = redPathObject.anim4.arrow1.point[1][1];
            y2 = redPathObject.anim4.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimRedPath, x2, y2, radians, 'red');

            contextAnimRedPath.restore();
            canvasAnimRedPath.style.visibility = "visible";
            redPathObject.timeout = setTimeout(function() {
                drawRedPath(flag);
            }, 40);
        }
    } else {
        canvasAnimRedPath.style.visibility = "hidden";
        redPathObject.anim1.mask1.currOriginX = redPathObject.anim1.mask1.originX;
        redPathObject.anim1.mask1.currOriginY = redPathObject.anim1.mask1.originY;
        redPathObject.anim2.mask1.currOriginX = redPathObject.anim2.mask1.originX;
        redPathObject.anim2.mask1.width = 0;
        redPathObject.anim3.mask1.currOriginX = redPathObject.anim3.mask1.originX;
        redPathObject.anim4.mask1.currOriginX = redPathObject.anim3.mask1.originX;
        clearTimeout(redPathObject.timeout);
    }
}

function drawGreenPath(flag) {
    if (flag == true) {
        if (greenPathObject.anim2.mask1.currOriginY + greenPathObject.anim2.mask1.height < greenPathObject.anim2.path1.endPointY) {
            canvasClear(canvasAnimGreenPath);

            var x1, x2, y1, y2;
            if (greenPathObject.anim1.mask1.currOriginY > greenPathObject.anim1.path1.endPointY - 10) {
                greenPathObject.anim1.mask1.currOriginY += greenPathObject.anim1.mask1.shiftY;
            } else if (greenPathObject.anim2.mask1.currOriginY + greenPathObject.anim2.mask1.height < greenPathObject.anim2.path1.endPointY) {
                greenPathObject.anim2.mask1.currOriginY += greenPathObject.anim2.mask1.shiftY;
            }

            contextAnimGreenPath.save();
            contextAnimGreenPath.beginPath();
            contextAnimGreenPath.rect(greenPathObject.anim1.mask1.currOriginX, greenPathObject.anim1.mask1.currOriginY, greenPathObject.anim1.mask1.width, greenPathObject.anim1.mask1.height);
            if (greenPathObject.anim1.mask1.currOriginY <= greenPathObject.anim1.path1.endPointY - 10) {
                contextAnimGreenPath.rect(greenPathObject.anim2.mask1.currOriginX, greenPathObject.anim2.mask1.currOriginY, greenPathObject.anim2.mask1.width, greenPathObject.anim2.mask1.height);
            }
            contextAnimGreenPath.clip();

            contextAnimGreenPath.beginPath();
            contextAnimGreenPath.moveTo(greenPathObject.anim1.path1.startPointX, greenPathObject.anim1.path1.startPointY);
            contextAnimGreenPath.quadraticCurveTo(greenPathObject.anim1.path1.controlPointX, greenPathObject.anim1.path1.controlPointY, greenPathObject.anim1.path1.endPointX, greenPathObject.anim1.path1.endPointY);
            contextAnimGreenPath.lineWidth = 3;
            contextAnimGreenPath.strokeStyle = "green";
            contextAnimGreenPath.stroke();

            x1 = greenPathObject.anim1.arrow1.point[1][0];
            x2 = greenPathObject.anim1.arrow1.point[0][0];
            y1 = greenPathObject.anim1.arrow1.point[1][1];
            y2 = greenPathObject.anim1.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimGreenPath, x2, y2, radians, 'green');

            contextAnimGreenPath.beginPath();
            contextAnimGreenPath.moveTo(greenPathObject.anim2.path1.startPointX, greenPathObject.anim2.path1.startPointY);
            contextAnimGreenPath.quadraticCurveTo(greenPathObject.anim2.path1.controlPointX, greenPathObject.anim2.path1.controlPointY, greenPathObject.anim2.path1.endPointX, greenPathObject.anim2.path1.endPointY);
            contextAnimGreenPath.lineWidth = 3;
            contextAnimGreenPath.strokeStyle = "green";
            contextAnimGreenPath.stroke();

            x1 = greenPathObject.anim2.arrow1.point[1][0];
            x2 = greenPathObject.anim2.arrow1.point[0][0];
            y1 = greenPathObject.anim2.arrow1.point[1][1];
            y2 = greenPathObject.anim2.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimGreenPath, x2, y2, radians, 'green');

            contextAnimGreenPath.restore();
            canvasAnimGreenPath.style.visibility = "visible";

            greenPathObject.timeout = setTimeout(function() {
                drawGreenPath(flag);
            }, 40);
        }
    } else {
        canvasAnimGreenPath.style.visibility = "hidden";
        greenPathObject.anim1.mask1.currOriginX = greenPathObject.anim1.mask1.originX;
        greenPathObject.anim1.mask1.currOriginY = greenPathObject.anim1.mask1.originY;
        greenPathObject.anim2.mask1.currOriginY = greenPathObject.anim2.mask1.originY;
        clearTimeout(greenPathObject.timeout);
    }
}

function drawBluePath(flag) {
    if (flag == true) {
        if (bluePathObject.anim1.mask1.currOriginY > bluePathObject.anim1.path1.endPointY - 5) {
            canvasClear(canvasAnimBluePath);

            bluePathObject.anim1.mask1.currOriginY += bluePathObject.anim1.mask1.shiftY;

            contextAnimBluePath.save();
            contextAnimBluePath.beginPath();
            contextAnimBluePath.rect(bluePathObject.anim1.mask1.currOriginX, bluePathObject.anim1.mask1.currOriginY, bluePathObject.anim1.mask1.width, bluePathObject.anim1.mask1.height);
            contextAnimBluePath.clip();

            contextAnimBluePath.beginPath();
            contextAnimBluePath.moveTo(bluePathObject.anim1.path1.startPointX, bluePathObject.anim1.path1.startPointY);
            contextAnimBluePath.quadraticCurveTo(bluePathObject.anim1.path1.controlPointX, bluePathObject.anim1.path1.controlPointY, bluePathObject.anim1.path1.endPointX, bluePathObject.anim1.path1.endPointY);
            contextAnimBluePath.lineWidth = 3;
            contextAnimBluePath.strokeStyle = "#0000ff";
            contextAnimBluePath.stroke();

            x1 = bluePathObject.anim1.arrow1.point[1][0];
            x2 = bluePathObject.anim1.arrow1.point[0][0];
            y1 = bluePathObject.anim1.arrow1.point[1][1];
            y2 = bluePathObject.anim1.arrow1.point[0][1];

            var radians = Math.atan((y1 - y2) / (x1 - x2));
            radians += ((x2 > x1) ? 90 : -90) * Math.PI / 180;
            drawArrow(contextAnimBluePath, x2, y2, radians, '#0000ff');

            contextAnimBluePath.restore();
            canvasAnimBluePath.style.visibility = "visible";

            bluePathObject.timeout = setTimeout(function() {
                drawBluePath(flag);
            }, 40);
        }
    } else {
        canvasAnimBluePath.style.visibility = "hidden";
        bluePathObject.anim1.mask1.currOriginX = bluePathObject.anim1.mask1.originX;
        bluePathObject.anim1.mask1.currOriginY = bluePathObject.anim1.mask1.originY;
        clearTimeout(bluePathObject.timeout);
    }
}

function resetHorseObject(object) {
    object.currFrame = 0;
    object.position.currPoint = 0;
    object.position.currDur = 1;
    object.animating = false;
    object.animated = false;
}




function canvasClear(canvas) {
    var context = canvas.getContext('2d');
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function setScale(canvas, scale) {
    canvas.style.zoom = scale;
    if ($.browser.mozilla && !(/Trident\/7\./).test(navigator.userAgent)) {
        canvas.style.MozTransformOrigin = "0 0";
        canvas.style.MozTransform = "scale(" + scale + ", " + scale + ")";
    }
}

function drawArrow(ctx, x, y, radians, color) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(radians);
    ctx.moveTo(0, 0);
    ctx.lineTo(6, 20);
    ctx.lineTo(-6, 20);
    ctx.moveTo(6, 20);
    ctx.quadraticCurveTo(0, 15, -6, 20);
    ctx.closePath();
    ctx.restore();
    ctx.fillStyle = color;
    ctx.fill();
}

function initHorseObject(translate, scale, dur, sharpPoint) {
    var object = {
        'source': imageHorse,
        'totalFrame': 2,
        'currFrame': 0,
        'width': 820,
        'height': 360,
        'point': sharpPoint,
        'position': {
            'points': translate,
            'scales': scale,
            'currPoint': 0,
            'totalPoint': translate.length,
            'dur': dur,
            'currDur': 1
        },
        'division': 1,
        'animating': false,
        'animated': false,
        'timeout': null
    };
    return object;
}

function drawHorse2() {
    console.log(horseObject5.animated)
    if (horseObject5.animated == true) {
        return
    }
    canvasAnimHorse2.style.visibility = 'visible'
    contextAnimHorse2.drawImage(imageHorse, horseObject5.position.points[0][0], horseObject5.position.points[0][1], horseObject5.width * 0.25, horseObject5.height * 0.25);
    showCityAni(canvasAnimHorse2, true)
    horsetimerGroup2[0] = setTimeout(() => {
        drawHorsesTimeout2 = setInterval(() => {
            canvasClear(canvasAnimHorse2);
            var endfun = function() {
                horsetimerGroup2[1] = setTimeout(() => {
                    canvasClear(canvasAnimHorse2);
                    waveSound.pause()
                }, 1000)
            }
            drawHorse(horseObject5, false, endfun, contextAnimHorse2)
        }, 60);
    }, 2000)


}

function drawHousePromise() {
    // console.log(horseObject4.animated,'4444')
    if (horseObject4.animated == true) {
        return
    }
    canvasAnimHorse.style.visibility = 'visible'
    contextAnimHorse.drawImage(imageHorse, horseObject1.position.points[0][0], horseObject1.position.points[0][1], horseObject1.width * 0.25, horseObject1.height * 0.25);
    showCityAni(canvasAnimHorse, true)
    horsetimerGroup[0] = setTimeout(() => {
        drawHorsesTimeout = setInterval(() => {
            canvasClear(canvasAnimHorse);
            drawHorse(horseObject1, false, canvasAnimHorse, contextAnimHorse)
        }, 60);
    }, 1200)

    horsetimerGroup[1] = setTimeout(() => {
        console.log('path2')
        drawHorsesTimeout = setInterval(() => {
            canvasClear(canvasAnimHorse);
            drawHorse(horseObject2, false, canvasAnimHorse, contextAnimHorse)
        }, 60)
    }, 2100);
    horsetimerGroup[2] = setTimeout(() => {
        drawHorsesTimeout = setInterval(() => {
            canvasClear(canvasAnimHorse);
            drawHorse(horseObject3, false, canvasAnimHorse, contextAnimHorse)
        }, 60)
    }, 3000);
    horsetimerGroup[3] = setTimeout(() => {
        drawHorsesTimeout = setInterval(() => {
            canvasClear(canvasAnimHorse);
            var endfun = function() {
                horsetimerGroup[2] = setTimeout(() => {
                    canvasClear(canvasAnimHorse);
                    waveSound.pause()
                }, 1000)
            }
            drawHorse(horseObject4, false, endfun, contextAnimHorse)
        }, 60)
    }, 4300);
}

function drawHorse(object, isInvert, endfun, contextS) {

    // return new Promise((resolve, reject) => {

    if (object.position.currPoint + 1 < object.position.totalPoint) {
        // console.log(object.position.currPoint, object.position.totalPoint)
        contextS.save();
        // contextAnimHorse.position(canvasAnimHorse.width, 0);
        if (isInvert) {
            contextS.scale(-1, 1);
        }

        var position = new Array();
        var scale;

        if (object.position.scales[object.position.currPoint] != object.position.scales[object.position.currPoint + 1]) {
            if (object.position.scales[object.position.currPoint] > object.position.scales[object.position.currPoint + 1]) {
                scale = object.position.scales[object.position.currPoint] * (object.position.dur[object.position.currPoint] - object.position.currDur) / object.position.dur[object.position.currPoint];
            } else {
                scale = object.position.scales[object.position.currPoint + 1] * (object.position.currDur) / object.position.dur[object.position.currPoint];
            }
            if (scale < 0) {
                scale = 0;
            }
        } else {
            scale = 1;
        }
        position[0] = (object.position.points[object.position.currPoint][0] * (object.position.dur[object.position.currPoint] - object.position.currDur) + object.position.points[object.position.currPoint + 1][0] * object.position.currDur) / object.position.dur[object.position.currPoint];
        position[1] = (object.position.points[object.position.currPoint][1] * (object.position.dur[object.position.currPoint] - object.position.currDur) + object.position.points[object.position.currPoint + 1][1] * object.position.currDur) / object.position.dur[object.position.currPoint];
        contextS.drawImage(imageHorse, position[0], position[1], object.width * scale * 0.25, object.height * scale * 0.25);
        contextS.restore();
        // Anim Position control
        if (object.position.currDur <= object.position.dur[object.position.currPoint]) {
            object.position.currDur++;
        } else {
            object.position.currDur = 1;
            object.position.currPoint++;
        }
        if (object.point[object.position.currPoint] > 0) {
            // if(object.point[object.position.currPoint] == 1){
            //     showCityAni(canvasS, true)
            // }
            object.animating = false;
            object.animated = true;

            if (object.id == 5) {
                clearInterval(drawHorsesTimeout2)
            } else {
                clearInterval(drawHorsesTimeout)
            }
            if (typeof endfun == 'function') {
                endfun()
            }
            // resolve()
            // return "ok";
        }

    } else {
        // position[0] = (object.position.points[object.position.totalPoint][0] * (object.position.dur[object.position.totalPoint] - object.position.currDur) + object.position.points[object.position.totalPoint + 1][0] * object.position.currDur) / object.position.dur[object.position.totalPoint];
        // position[1] = (object.position.points[object.position.totalPoint][1] * (object.position.dur[object.position.totalPoint] - object.position.currDur) + object.position.points[object.position.totalPoint + 1][1] * object.position.currDur) / object.position.dur[object.position.totalPoint];

        object.animating = false;
        object.animated = true;
        console.log('end', object.position.currPoint, object.position.totalPoint)
            // contextAnimHorse.save();
            // contextAnimHorse.drawImage(imageHorse, position[0], position[1], object.width * scale * 0.25, object.height * scale * 0.25);
            // contextAnimHorse.restore();

        if (object.id == 5) {
            clearInterval(drawHorsesTimeout2)
        } else {
            clearInterval(drawHorsesTimeout)
        }

        // showCityAni(canvasAnimHorse, true)
    }
    // })
};