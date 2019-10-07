// Variable Declare
var _scale = 1;
var _controlArray = [0, 0, 0, 0, 0, 0, 0, 0];
var imageMap, imageMapDetail;
var imageCapital, imageGate, imageMainCity, imageRiver, imageControlCity, imageHorse;
var drawRiverTimeout;
var redTimer, greedTimer, timerGroup = []
var redNumber = 1 ,greedNumber = 1
var isMute = false
var baseWidth = 2048

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

/* 音频 */
var m01 = document.createElement('audio')
var m02 = document.createElement('audio')
var m03 = document.createElement('audio')
var m04 = document.createElement('audio')
var m05 = document.createElement('audio')
var m06 = document.createElement('audio')
var m07 = document.createElement('audio')
m01.src = 'img/vo/map003_01.mp3'
m02.src = 'img/vo/map003_02.mp3'
m03.src = 'img/vo/map003_04.mp3'
m04.src = 'img/vo/map003_05.mp3'
m05.src = 'img/vo/map003_06.mp3'
m06.src = 'img/vo/map003_07.mp3'
m07.src = 'img/vo/map003_07.mp3'


// Variable init
divTag.appendChild(canvasBackground);
divTag.appendChild(canvasTop);
divTag.appendChild(canvasStatic1);
divTag.appendChild(canvasStatic2);
divTag.appendChild(canvasStatic3);
divTag.appendChild(canvasStatic4);
divTag.appendChild(canvasStatic5);
divTag.appendChild(canvasStatic6);
divTag.appendChild(canvasAnimRedPath);
divTag.appendChild(canvasAnimGreenPath);
divTag.appendChild(canvasAnimBluePath);
divTag.appendChild(canvasAnimHorse);

divTag.id = "canvasInnerDiv";
canvasBackground.id = "myCanvasBackground";
canvasTop.id = "myCanvasTop";
canvasStatic1.id = "myCanvasStatic1";
canvasStatic2.id = "myCanvasStatic2";
canvasStatic3.id = "myCanvasStatic3";
canvasStatic4.id = "myCanvasStatic4";
canvasStatic5.id = "myCanvasStatic5";
canvasStatic6.id = "myCanvasStatic6";
canvasAnimRedPath.id = "myCanvasAnimRedPath";
canvasAnimGreenPath.id = "myCanvasAnimGreenPath";
canvasAnimBluePath.id = "myCanvasAnimBluePath";
canvasAnimHorse.id = "myCanvasAnimHorse";

canvasBackground.style.position = "absolute";
canvasTop.style.position = "absolute";
canvasStatic1.style.position = "absolute";
canvasStatic2.style.position = "absolute";
canvasStatic3.style.position = "absolute";
canvasStatic4.style.position = "absolute";
canvasStatic5.style.position = "absolute";
canvasStatic6.style.position = "absolute";
canvasAnimRedPath.style.position = "absolute";
canvasAnimGreenPath.style.position = "absolute";
canvasAnimBluePath.style.position = "absolute";
canvasAnimHorse.style.position = "absolute";

canvasBackground.style.zIndex = "0";
canvasTop.style.zIndex = "2";
canvasStatic1.style.zIndex = "3";
canvasStatic2.style.zIndex = "3";
canvasStatic3.style.zIndex = "3";
canvasStatic4.style.zIndex = "2";
canvasStatic5.style.zIndex = "2";
canvasStatic6.style.zIndex = "2";
canvasAnimRedPath.style.zIndex = "6";
canvasAnimGreenPath.style.zIndex = "6";
canvasAnimBluePath.style.zIndex = "2";
canvasAnimHorse.style.zIndex = "6";

canvasBackground.width = 0;
canvasBackground.height = 0;
canvasAnimRedPath.width = 1200;
canvasAnimRedPath.height = 1200;
canvasAnimGreenPath.width = 1200;
canvasAnimGreenPath.height = 1200;
canvasAnimBluePath.width = 1200;
canvasAnimBluePath.height = 1200;
canvasAnimHorse.width = 1200;
canvasAnimHorse.height = 1200;

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

imageCapital.onload = function () {
	canvasStatic1.width = 1200;
	canvasStatic1.height = 1200;
	contextStatic1.drawImage(imageCapital, 0, 0, 1200, 1200);
}
imagedongdu.onload = function () {
	canvasStatic2.width = 1200;
	canvasStatic2.height = 1200;
	contextStatic2.drawImage(imagedongdu, 0, 0, 1200, 1200);
}
imageMainCity.onload = function () {
	canvasStatic3.width = 1200;
	canvasStatic3.height = 1200;
	contextStatic3.drawImage(imageMainCity, 0, 0, 1200, 1200);
}
imageGate.onload = function () {
	canvasStatic4.width = 1200;
	canvasStatic4.height = 1200;
	contextStatic4.drawImage(imageGate, 0, 0, 1200, 1200);
}
imageRiver.onload = function () {
	canvasStatic5.width = 1200;
	canvasStatic5.height = 1200;
	contextStatic5.drawImage(imageRiver, 0, 0, 1200, 1200);
}
imagerice.onload = function () {
	canvasStatic6.width = 1200;
	canvasStatic6.height = 1200;
	contextStatic6.drawImage(imagerice, 0, 0, 1200, 1200);
}
imageHorse.onload = function () {
	var translate = [
		[-1260, 1218],
		[-900, 250],
		[-920, 350],
		[-900, 450],
		[-880, 550],
		[-830, 600],
		[-730, 650],
		[-550, 770]
	];
	var scale = [0, 1, 1, 1, 1, 1, 1, 0];
	var dur = [7, 7, 7, 7, 7, 7, 7];
	horseObject1 = initHorseObject(translate, scale, dur);
	translate = [
		[-500, 730],
		[-660, 600],
		[-690, 500],
		[-600, 500],
		[-500, 600],
		[-280, 930]
	];
	scale = [0, 1, 1, 1, 1, 0];
	dur = [10, 10, 10, 10, 15];
	horseObject2 = initHorseObject(translate, scale, dur);
	translate = [
		[-445, 720],
		[-580, 560],
		[-580, 450],
		[-400, 540]
	];
	scale = [0, 1, 1, 0];
	dur = [8, 8, 8];
	horseObject3 = initHorseObject(translate, scale, dur);
	translate = [
		[725, 730],
		[700, 600],
		[750, 600],
		[780, 760]
	];
	scale = [0, 1, 1, 0];
	dur = [8, 8, 10];
	horseObject4 = initHorseObject(translate, scale, dur);
}

redPathObject = {
	'anim1': {
		'path1': {
			'startPointX': 1325,
			'startPointY': -1300,
			'endPointX': 725,
			'endPointY': 690,
			'controlPointX': 797,
			'controlPointY': 550
		},
		'mask1': {
			'originX': 710,
			'originY': 140,
			'width': 100,
			'height': 280,
			'currOriginX': 710,
			'currOriginY': 150,
			'shiftX': 0,
			'shiftY': 20
		},
		'arrow1': {
			'point': [
				[725, 700],
				[730, 680]
			]
		}
	},
	'anim2': {
		'path1': {
			'startPointX': 725,
			'startPointY': 730,
			'endPointX': 780,
			'endPointY': 760,
			'controlPointX': 730,
			'controlPointY': 770
		},
		'path2': {
			'startPointX': 715,
			'startPointY': 730,
			'endPointX': 640,
			'endPointY': 730,
			'controlPointX': 680,
			'controlPointY': 770
		},
		'mask1': {
			'originX': 720,
			'originY': 720,
			'width': 0,
			'height': 100,
			'currOriginX': 720,
			'currOriginY': 720,
			'shiftX': -20,
			'shiftY': 0,
			'enlargeWidth': 40,
			'enlargeHeight': 0
		},
		'arrow1': {
			'point': [
				[785, 760],
				[775, 761]
			]
		},
		'arrow2': {
			'point': [
				[640, 730],
				[645, 734]
			]
		}
	},
	'anim3': {
		'path1': {
			'startPointX': 630,
			'startPointY': 730,
			'endPointX': 560,
			'endPointY': 760,
			'controlPointX': 620,
			'controlPointY': 760
		},
		'mask1': {
			'originX': 630,
			'originY': 730,
			'width': 120,
			'height': 50,
			'currOriginX': 630,
			'currOriginY': 730,
			'shiftX': -20,
			'shiftY': 0
		},
		'arrow1': {
			'point': [
				[560, 760],
				[566, 760]
			]
		}

	},
	'anim4': {
		'path1': {
			'startPointX': 550,
			'startPointY': 760,
			'endPointX': 510,
			'endPointY': 775,
			'controlPointX': 535,
			'controlPointY': 775
		},
		'mask1': {
			'originX': 555,
			'originY': 760,
			'width': 120,
			'height': 50,
			'currOriginX': 555,
			'currOriginY': 760,
			'shiftX': -20,
			'shiftY': 0
		},
		'arrow1': {
			'point': [
				[510, 775],
				[515, 774]
			]
		}

	},
	'timeout': null
};

greenPathObject = {
	'anim1': {
		'path1': {
			'startPointX': 515,
			'startPointY': 765,
			'endPointX': 470,
			'endPointY': 740,
			'controlPointX': 530,
			'controlPointY': 720
		},
		'mask1': {
			'originX': 465,
			'originY': 770,
			'width': 100,
			'height': 100,
			'currOriginX': 465,
			'currOriginY': 770,
			'shiftX': 0,
			'shiftY': -5
		},
		'arrow1': {
			'point': [
				[470, 740],
				[475, 739]
			]
		}
	},
	'anim2': {
		'path1': {
			'startPointX': 430,
			'startPointY': 755,
			'endPointX': 280,
			'endPointY': 930,
			'controlPointX': 340,
			'controlPointY': 825
		},
		'mask1': {
			'originX': 265,
			'originY': 555,
			'width': 200,
			'height': 200,
			'currOriginX': 265,
			'currOriginY': 555,
			'shiftX': 0,
			'shiftY': 15
		},
		'arrow1': {
			'point': [
				[275, 935],
				[283, 925]
			]
		}
	},
	'timeout': null
};

bluePathObject = {
	'anim1': {
		'path1': {
			'startPointX': 445,
			'startPointY': 720,
			'endPointX': 390,
			'endPointY': 540,
			'controlPointX': 420,
			'controlPointY': 612
		},
		'mask1': {
			'originX': 380,
			'originY': 720,
			'width': 100,
			'height': 200,
			'currOriginX': 380,
			'currOriginY': 720,
			'shiftX': 0,
			'shiftY': -10
		},
		'arrow1': {
			'point': [
				[389, 539],
				[391, 544]
			]
		}
	},
	'timeout': null
};

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
}

function setSound(control, action) {
	//停止所有声音
	muteMe()
	console.log(control, action)
	if (control == '0' || isMute == true) return
	switch (action) {
		case '0':
			m01.currentTime = 0
			m01.play()
			break;
		case '1':
			m02.currentTime = 0
			m02.play()
			break;
		case '3':
			m03.currentTime = 0
			m03.play()
			break;
		case '4':
			m04.currentTime = 0
			m04.play()
			break;
		case '5':
			m05.currentTime = 0
			m05.play()
			break;
		case '6':
			m06.currentTime = 0
			m06.play()
			break;
		case '7':
			// m07.currentTime = 0
			// m07.play()
			break;
		default:
			break;
	}
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

	var tmp = baseWidth * _scale;  //fix
	divTag.style.width = tmp + "px";
	divTag.style.height = tmp + "px";

	var boundary;
	if (_scale <= 2) {
		boundary = 1200;
	} else {
		boundary = 1800;
	}

	if (canvasBackground.width != boundary) {
		canvasBackground.width = boundary;
		canvasBackground.height = boundary;
		sameChecking = false;
	}

	if (!sameChecking) {
		contextBackground.save();
		contextBackground.setTransform(1, 0, 0, 1, 0, 0);
		contextBackground.clearRect(0, 0, canvasBackground.width, canvasBackground.height);
		contextBackground.restore();
		contextBackground.drawImage(imageMap, 0, 0, boundary, boundary);
	}
	var scale = _scale / (boundary / baseWidth);
	setScale(canvasBackground, scale);
	//	canvasBackground.style.zoom = _scale / (boundary / 600);

	if (!sameChecking) {
		var horse1 = false,
			horse2 = false,
			horse3 = false;
		if (controlArray[0] == 1) {
			canvasStatic1.style.visibility = "visible";
		} else {
			canvasStatic1.style.visibility = "hidden";
		}
		if (controlArray[1] == 1) {
			canvasStatic2.style.visibility = "visible";
		} else {
			canvasStatic2.style.visibility = "hidden";
		}
		if (controlArray[2] == 1) {
			canvasStatic3.style.visibility = "visible";
		} else {
			canvasStatic3.style.visibility = "hidden";
		}
		if (controlArray[3] == 1) {
			canvasStatic4.style.visibility = "visible";
		} else {
			canvasStatic4.style.visibility = "hidden";
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
			redNumber = 1
			ship1(false)
		}
		if (controlArray[6] == 1) {
			ship2(true)
		} else {
			greedNumber = 1
			ship2(false)
		}
		if (controlArray[7] == 1) {
			canvasStatic6.style.visibility = "visible";
		} else {
			canvasStatic6.style.visibility = "hidden";
		}
	}

	var scale = _scale / (boundary / baseWidth); //fix
	setScale(canvasStatic1, scale);
	setScale(canvasStatic2, scale);
	setScale(canvasStatic3, scale);
	setScale(canvasStatic4, scale);
	setScale(canvasStatic5, scale);
	setScale(canvasStatic6, scale);
	setScale(canvasAnimRedPath, scale);
	setScale(canvasAnimGreenPath, scale);
	setScale(canvasAnimBluePath, scale);
	setScale(canvasAnimHorse, scale);
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
		canvasTop.height = boundary;
		sameChecking = false;
	}
	if (!sameChecking) {
		contextTop.save();
		contextTop.setTransform(1, 0, 0, 1, 0, 0);
		contextTop.clearRect(0, 0, canvasTop.width, canvasTop.height);
		contextTop.restore();
		contextTop.drawImage(imageMapDetail, 0, 0, boundary, boundary);
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
	if(redNumber >= 88) {return}
	if (flag == true) {
		redTimer = setInterval(() => {
			canvasAnimRedPath.style.visibility = "visible";
			if (redNumber < 10) {
				redNumber = '0' + String(redNumber)
			}
			img.src = 'img/route1/xianlu1a00' + redNumber + '.png'
			img.onload = function () {
				canvasClear(canvasAnimRedPath);
				contextAnimRedPath.drawImage(img, 0, 0, 1200, 1200);
			}
			redNumber++
			console.log(redNumber,'//')
			if (redNumber >= 88) {
				clearInterval(redTimer)
			}
		}, 100);
	} else {
		clearInterval(redTimer)
		canvasAnimRedPath.style.visibility = "hidden";
		canvasClear(canvasAnimRedPath);
	}
}
function ship2(flag) {
	var img = new Image()
	if(greedNumber >= 88) {return}
	if (flag == true) {
		greedTimer = setInterval(() => {
			canvasAnimGreenPath.style.visibility = "visible";
			if (greedNumber < 10) {
				greedNumber = '0' + String(greedNumber)
			}
			img.src = 'img/route2/xianlu2b00' + greedNumber + '.png'
			img.onload = function () {
				canvasClear(canvasAnimGreenPath);
				contextAnimGreenPath.drawImage(img, 0, 0, 1200, 1200);
			}
			greedNumber++
			if (greedNumber >= 51) {
				console.log('clear')
				clearInterval(greedTimer)
			}
		}, 150);
	} else {
		clearInterval(greedTimer)
		canvasAnimGreenPath.style.visibility = "hidden";
		canvasClear(canvasAnimGreenPath);
	}
}
function drawRiverPath(flag) {
	if(drawRiverTimeout == 'end'){return}
	if (flag == true) {
		timerGroup[0] = setTimeout(() => {
			canvasStatic5.style.visibility = "visible";
			contextStatic5.drawImage(imageRiver, 0, 0, 1200, 1200);
		}, 5000);
		timerGroup[1] = setTimeout(() => {
			contextStatic5.drawImage(imageRiver2, 0, 0, 1200, 1200);
		}, 7000);
		timerGroup[2] = setTimeout(() => {
			contextStatic5.drawImage(imageRiver3, 0, 0, 1200, 1200);
		}, 9000);
		timerGroup[3] = setTimeout(() => {
			contextStatic5.drawImage(imageRiver4, 0, 0, 1200, 1200);
		}, 10000);
		timerGroup[4] = setTimeout(() => {
			contextStatic5.drawImage(imageRiver5, 0, 0, 1200, 1200);
			drawRiverTimeout =  'end'
		}, 12000);
	} else {
		for (var i = 0; i < timerGroup.length; i++) {
			clearTimeout(timerGroup[i])
		}
		canvasStatic5.style.visibility = "hidden";
		canvasClear(canvasStatic5);

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
			redPathObject.timeout = setTimeout(function () {
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

			greenPathObject.timeout = setTimeout(function () {
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

			bluePathObject.timeout = setTimeout(function () {
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

function initHorseObject(translate, scale, dur) {
	var object = {
		'source': imageHorse,
		'totalFrame': 15,
		'currFrame': 0,
		'width': 170,
		'height': 219,
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