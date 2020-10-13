const animate = {
    sharpCity(obj, bool) {
        return new Promise((resolve, rej) => {
        if (!bool) {
            clearInterval(obj.timer);
            obj.show = false
            obj.ani = false
            return;
        }
        if (obj.ani == true) {
            return;
        }
        obj.ani = true
        let show = false;
        let times = 6;
        obj.timer = setInterval(() => {
            if (times == 0) {
                clearInterval(obj.timer);
                resolve('success')
                return;
            }
            obj.show = show
            show = !show;
            times -= 1;
        }, 260)
    })
    },
    showCityAni(canvasStatic, bool) {
        if (!bool) {
            clearInterval(canvasStatic.timeout);
            canvasStatic.style.visibility = "hidden";
            canvasStatic.ani = false;
            return;
        }
        if (canvasStatic.ani == true) {
            return;
        }
        let show = false;
        let times = 6;
        canvasStatic.timeout = setInterval(() => {
            if (times == 0) {
                clearInterval(canvasStatic.timeout);
                return;
            }
            canvasStatic.style.visibility = show ? "visible" : "hidden";
            show = !show;
            times -= 1;
        }, 260);
        canvasStatic.ani = true;
    },
    drawRedPath(flag) {
        let _this = this
        let canvasAnimPath = document.getElementById("myCanvasAnimborder");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObject;
        if (flag == true) {            
            // if (pathObject.mask1.currOriginX <= pathObject.mask1.endPoint) {
            pathObject.playing = true;
            this.canvasClear(canvasAnimPath);
            // return
            contextAnimPath.save();
            contextAnimPath.beginPath();
            contextAnimPath.strokeStyle = 'red';
            contextAnimPath.lineWidth = 3
            
            // 
            _this.d2_(contextAnimPath, pathObject.mask1);
            if (pathObject.mask1.ani < 100 - pathObject.mask1.speed) {
                pathObject.mask1.ani = (pathObject.mask1.ani + pathObject.mask1.speed) % 100;
            } else {
                _this.d2_(contextAnimPath, pathObject.mask2);
                if (pathObject.mask2.ani < 100 - pathObject.mask2.speed) {
                    pathObject.mask2.ani = (pathObject.mask2.ani + pathObject.mask2.speed) % 100;
                } else {
                    _this.d2_(contextAnimPath, pathObject.mask3);
                    if (pathObject.mask3.ani < 100 - pathObject.mask3.speed) {
                        pathObject.mask3.ani = (pathObject.mask3.ani + pathObject.mask3.speed) % 100;
                    } else {
                        _this.d2_(contextAnimPath, pathObject.mask4);
                        if (pathObject.mask4.ani < 100 - pathObject.mask4.speed) {
                            pathObject.mask4.ani = (pathObject.mask4.ani + pathObject.mask4.speed) % 100;
                        } else {
                            _this.d2_(contextAnimPath, pathObject.mask5);
                            if (pathObject.mask5.ani < 100 - pathObject.mask5.speed) {
                                pathObject.mask5.ani = (pathObject.mask5.ani + pathObject.mask5.speed) % 100;
                            } else {
                                _this.d2_(contextAnimPath, pathObject.mask6);
                                if (pathObject.mask6.ani < 100 - pathObject.mask6.speed) {
                                    pathObject.mask6.ani = (pathObject.mask6.ani + pathObject.mask6.speed) % 100;
                                } else {
                                    contextAnimPath.rect(pathObject.mask7.point1[0], pathObject.mask7.point1[1], pathObject.mask7.width, pathObject.mask7.height)
                                    if (pathObject.mask7.height <= pathObject.mask7.endpoint) {
                                        pathObject.mask7.height += pathObject.mask7.speed
                                    } else {
                                        _this.d2_(contextAnimPath, pathObject.mask8);
                                        if (pathObject.mask8.ani < 100 - pathObject.mask8.speed) {
                                            pathObject.mask8.ani = (pathObject.mask8.ani + pathObject.mask8.speed) % 100;
                                        } else {
                                            _this.d2_(contextAnimPath, pathObject.mask9);
                                            if (pathObject.mask9.ani < 100 - pathObject.mask9.speed) {
                                                pathObject.mask9.ani = (pathObject.mask9.ani + pathObject.mask9.speed) % 100;
                                            } else {
                                                _this.d2_(contextAnimPath, pathObject.mask10);
                                                if (pathObject.mask10.ani < 100 - pathObject.mask10.speed) {
                                                    pathObject.mask10.ani = (pathObject.mask10.ani + pathObject.mask10.speed) % 100;
                                                } else {
                                                    contextAnimPath.rect(pathObject.mask11.point1[0], pathObject.mask11.point1[1], pathObject.mask11.width, pathObject.mask11.height)
                                                    if (pathObject.mask11.point1[1] >= pathObject.mask11.endpoint[1]) {
                                                        pathObject.mask11.point1[1] -= pathObject.mask11.speed
                                                    } else {
                                                        _this.d2_(contextAnimPath, pathObject.mask12);
                                                        if (pathObject.mask12.ani < 100 - pathObject.mask12.speed) {
                                                            pathObject.mask12.ani = (pathObject.mask12.ani + pathObject.mask12.speed) % 100;
                                                        } else {
                                                            _this.d2_(contextAnimPath, pathObject.mask13);
                                                            if (pathObject.mask13.ani < 100 - pathObject.mask13.speed) {
                                                                pathObject.mask13.ani = (pathObject.mask13.ani + pathObject.mask13.speed) % 100;
                                                            } else {
                                                                contextAnimPath.rect(pathObject.mask14.point1[0], pathObject.mask14.point1[1], pathObject.mask14.width, pathObject.mask14.height)
                                                                if (pathObject.mask14.height <= pathObject.mask14.endpoint) {
                                                                    pathObject.mask14.height += pathObject.mask14.speed
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // 

            // contextAnimPath.stroke();
            contextAnimPath.clip();
            contextAnimPath.drawImage(
                pathObject.source,
                pathObject.originX,
                pathObject.originY,
                pathObject.width,
                pathObject.height
            );

            contextAnimPath.restore();
            canvasAnimPath.style.visibility = "visible";
            pathObject.timeout = setTimeout(() => {
                this.drawRedPath(flag);
            }, 30);
            // } else{

            // }
        } else {
            canvasAnimPath.style.visibility = "hidden";
            for (var i = 1; i < 15; i++) {
                let element = pathObject['mask' + i]
                element.ani = 0
                if (i == 7 || i == 14) {
                    element.height = 1
                }
                if (i == 11) {
                    element.point1[1] = element.pointOrg1[1]
                }
            }
            pathObject.playing = false;
            clearTimeout(pathObject.timeout);
        }
    },
    d2_(oGc, point) {
        let size = point.size ? point.size : 10
        for (var t = 0; t <= point.ani / 100; t += 0.02) {
            var x = this.quadraticBezier(point.point1[0], point.point2[0], point.point3[0], t);
            var y = this.quadraticBezier(point.point1[1], point.point2[1], point.point3[1], t);
            // oGc.lineTo(x, y);
            oGc.rect(x, y, size, size)
                // oGc.arc(x,y,2,0,Math.PI*2)
                // oGc.fill()
        }
    },
    d3_(oGc, start, end, percent, speed) {

        // var position = new Array();
        // position[0] =(start[0] * speed + end[0] * speed)/percent
        // position[1] =(start[0] * speed + end[0] * speed)/percent
        // oGc.rect(position[0], position[1], 4, 4)
        oGc.lineTo(end[0], end[1])
    },
    quadraticBezier(p0, p1, p2, t) {
        var k = 1 - t;
        return k * k * p0 + 2 * (1 - t) * t * p1 + t * t * p2; // 这个方程就是二次贝赛尔曲线方程 
    },
    drawHousePromise(flag) {
        this.canvasAnimHorse = document.getElementById("myCanvasAnimHorse");
        let contextAnimHorse = this.canvasAnimHorse.getContext("2d");
        clearInterval(this.drawHorsesTimeout2);
        if (flag) {
            this.canvasAnimHorse.style.visibility = "visible";
            this.drawHorsesTimeout2 = setInterval(() => {
                this.canvasClear(this.canvasAnimHorse);
                this.drawHorse(
                    this.horseObject1,
                    contextAnimHorse,
                    this.horseObject1.source
                ).then(() => {
                    this.drawHorse(
                        this.horseObject2,
                        contextAnimHorse,
                        this.horseObject2.source
                    ).then(() => {
                        this.license.pause()
                    })
                })
            }, 70);
        } else {
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject1)
            this.resetHorseObject(this.horseObject2)
        }
    },
    drawHousePromise2(flag) {
        let canvasAnimHorse = document.getElementById("myCanvasAnimHorse2");
        let contextAnimHorse = canvasAnimHorse.getContext("2d");
        clearInterval(this.drawHorsesTimeout);
        if (flag) {

            canvasAnimHorse.style.visibility = "visible";

            this.drawHorsesTimeout = setInterval(() => {
                this.canvasClear(canvasAnimHorse);
                this.drawHorse(
                    this.horseObject2,
                    contextAnimHorse,
                    this.horseObject2.source
                ).then(() => {
                    this.train1.pause();
                });
            }, 70);
        } else {
            clearInterval(this.drawHorsesTimeout);
            this.canvasClear(canvasAnimHorse);
            canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject2)
        }
    },
    drawHorse(object, contextS, imageHorse) {
        return new Promise((resolve, rej) => {
            if (object.position.currPoint + 1 < object.position.totalPoint) {
                contextS.save();
                if (object.point == -1) {
                    contextS.scale(-1, 1);
                }
                var position = new Array();
                var scale;
                if (object.currFrame < object.totalFrame - 1) {
                    object.currFrame++;
                } else {
                    object.currFrame = 0;
                }
                if (
                    object.position.scales[object.position.currPoint] !=
                    object.position.scales[object.position.currPoint + 1]
                ) {
                    if (
                        object.position.scales[object.position.currPoint] >
                        object.position.scales[object.position.currPoint + 1]
                    ) {
                        scale =
                            (object.position.scales[object.position.currPoint] *
                                (object.position.dur[object.position.currPoint] -
                                    object.position.currDur)) /
                            object.position.dur[object.position.currPoint];
                    } else {
                        scale =
                            (object.position.scales[object.position.currPoint + 1] *
                                object.position.currDur) /
                            object.position.dur[object.position.currPoint];
                    }
                    if (scale < 0) {
                        scale = 0;
                    }
                } else {
                    scale = 1;
                }
                position[0] =
                    (object.position.points[object.position.currPoint][0] *
                        (object.position.dur[object.position.currPoint] -
                            object.position.currDur) +
                        object.position.points[object.position.currPoint + 1][0] *
                        object.position.currDur) /
                    object.position.dur[object.position.currPoint];
                position[1] =
                    (object.position.points[object.position.currPoint][1] *
                        (object.position.dur[object.position.currPoint] -
                            object.position.currDur) +
                        object.position.points[object.position.currPoint + 1][1] *
                        object.position.currDur) /
                    object.position.dur[object.position.currPoint];

                contextS.drawImage(
                    imageHorse,
                    object.currFrame * object.width,
                    0,
                    object.width,
                    object.height,
                    position[0],
                    position[1],
                    object.width * scale * 0.43,
                    object.height * scale * 0.43);
                contextS.restore();
                // Anim Position control
                if (
                    object.position.currDur <=
                    object.position.dur[object.position.currPoint]
                ) {
                    object.position.currDur++;
                } else {
                    object.position.currDur = 1;
                    object.position.currPoint++;
                }
                // return "ok";
            } else {
                resolve("//");
                object.animating = false;
                object.animated = true;
            }
        });
    },

    createCanvas(canvasList, divTag) {
        let canvasObj = {},
            contextObj = {}

        for (var i = 0; i < canvasList.length; i++) {
            var canvasStatic = document.createElement("canvas");
            var contextStatic = canvasStatic.getContext("2d");
            // 
            canvasStatic.id = canvasList[i].name;
            canvasStatic.style.position = "absolute";
            canvasStatic.style.zIndex = canvasList[i].zindex
            // canvasStatic.style.visibility='hidden'
            canvasStatic.width = this.baseWidth;
            canvasStatic.height = this.baseHeight;
            // canvasList.obj = canvasStatic
            canvasObj[canvasList[i].name] = canvasStatic
            contextObj[canvasList[i].name] = contextStatic
            divTag.appendChild(canvasStatic);
            this.canvasClear(canvasStatic)
        }
        return [canvasObj, contextObj]
    },

}
export default animate;