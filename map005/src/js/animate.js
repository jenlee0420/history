const animate = {
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
        let canvasAnimPath = document.getElementById("myRedPath");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObject;
        if (flag == true) {
            if (pathObject.mask2.height < pathObject.mask2.endPoint) {
                pathObject.playing = true;
                this.canvasClear(canvasAnimPath);
                contextAnimPath.save();
                contextAnimPath.beginPath();
                contextAnimPath.rect(
                    pathObject.mask1.currOriginX,
                    pathObject.mask1.currOriginY,
                    pathObject.mask1.width,
                    pathObject.mask1.height
                );
                contextAnimPath.rect(
                    pathObject.mask2.currOriginX,
                    pathObject.mask2.currOriginY,
                    pathObject.mask2.width,
                    pathObject.mask2.height);
                contextAnimPath.rect(
                    pathObject.mask3.currOriginX,
                    pathObject.mask3.currOriginY,
                    pathObject.mask3.width,
                    pathObject.mask3.height);

                contextAnimPath.clip();
                contextAnimPath.drawImage(
                    pathObject.source,
                    pathObject.originX,
                    pathObject.originY,
                    pathObject.width,
                    pathObject.height
                );
                if (pathObject.mask1.width < pathObject.mask1.endPoint) {
                    // pathObject.mask1.currOriginX += pathObject.mask1.shiftX;
                    pathObject.mask1.currOriginX -= pathObject.mask1.shiftX;
                    pathObject.mask1.width += pathObject.mask1.shiftX;
                }
                if (pathObject.mask2.height < pathObject.mask2.endPoint) {
                    pathObject.mask2.currOriginY -= pathObject.mask2.shiftX;
                    pathObject.mask2.height += pathObject.mask2.shiftX;
                }
                if (pathObject.mask3.width < pathObject.mask3.endPoint) {
                    pathObject.mask3.width += pathObject.mask3.shiftX;
                }

                contextAnimPath.restore();
                canvasAnimPath.style.visibility = "visible";
                pathObject.timeout = setTimeout(() => {
                    this.drawRedPath(flag);
                }, 30);
            }
        } else {
            canvasAnimPath.style.visibility = "hidden";
            pathObject.mask1.currOriginX = pathObject.mask1.originX;
            pathObject.mask1.currOriginY = pathObject.mask1.originY;
            pathObject.mask1.width = 1
            pathObject.mask2.currOriginX = pathObject.mask2.originX;
            pathObject.mask2.currOriginY = pathObject.mask2.originY;
            pathObject.mask2.height =1
            pathObject.mask3.currOriginX = pathObject.mask3.originX;
            pathObject.mask3.currOriginY = pathObject.mask3.originY;
            pathObject.mask3.width = 1

            pathObject.playing = false;
            clearTimeout(pathObject.timeout);
        }
    },
    drawHousePromise(flag) {
        this.canvasAnimHorse = document.getElementById("myCanvasAnimHorse");
        let contextAnimHorse = this.canvasAnimHorse.getContext("2d");
        if (flag) {
            if (this.horseObject1.animated == true || this.horseObject2.animated == true|| this.horseObject3.animated == true) {
                return;
            }
            this.canvasAnimHorse.style.visibility = "visible";

            this.drawHorsesTimeout2 = setInterval(() => {
                this.canvasClear(this.canvasAnimHorse);
                this.drawHorse(
                    this.horseObject1,
                    contextAnimHorse,
                    this.horseObject1.source
                );
                this.drawHorse(
                    this.horseObject2,
                    contextAnimHorse,
                    this.horseObject2.source
                );
                this.drawHorse(
                    this.horseObject3,
                    contextAnimHorse,
                    this.horseObject3.source
                );
                if(this.horseObject1.animated == true && this.horseObject2.animated == true && this.horseObject3.animated==true){
                    this.license.pause();
                }
            }, 70);
            // }, 500)
        } else {
            // for(var i= 0; i<this.drawHorsesTimeout2.length;i++){
            //     clearInterval(this.drawHorsesTimeout2[i])
            // }
            // clearTimeout(this.horsetimerGroup)
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject1);
            this.resetHorseObject(this.horseObject2);
            this.resetHorseObject(this.horseObject3);
        }
    },
    drawHorse(object, contextS, imageHorse) {
        return new Promise((resolve, rej) => {
            if (object.position.currPoint + 1 < object.position.totalPoint) {
                contextS.save();
                if (object.point==-1) {
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
                    object.width * scale * 0.53,
                    object.height * scale * 0.53);
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
            // this.drawHorsesTimeout = setTimeout(() => {
            //   this.canvasClear(this.canvasAnimHorse);
            //   this.drawHorse(object, contextS, imageHorse)
            // }, 60);
        });

        // })
    },

    drwaCircle(canvasStatic2) {
        var contextStatic2 = canvasStatic2.getContext("2d");
        canvasStatic2.width = this.baseWidth;
        canvasStatic2.height = this.baseHeight;
        contextStatic2.lineWidth = 4;
        contextStatic2.strokeStyle = "#FF9900";
        // contextStatic2.save();
        contextStatic2.beginPath()
        contextStatic2.ellipse(1160, 125, 124, 68, 0, 0, Math.PI * 2);
        contextStatic2.stroke();
        contextStatic2.closePath()

        contextStatic2.beginPath()
        contextStatic2.ellipse(950, 305, 124, 68, 0, 0, Math.PI * 2);
        contextStatic2.stroke();
        contextStatic2.closePath()

        contextStatic2.beginPath()
        contextStatic2.ellipse(732, 493.1, 124, 68, 0, 0, Math.PI * 2);
        contextStatic2.stroke();
        contextStatic2.closePath()

        // contextStatic2.restore();

        canvasStatic2.style.visibility = 'hidden'
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
            canvasStatic.width = this.baseWidth;
            canvasStatic.height = this.baseHeight;
            // canvasList.obj = canvasStatic
            canvasObj[canvasList[i].name] = canvasStatic
            contextObj[canvasList[i].name] = contextStatic
            divTag.appendChild(canvasStatic);
        }
        return [canvasObj, contextObj]
    },

}
export default animate;