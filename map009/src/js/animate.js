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
        let canvasAnimPath = document.getElementById("canvasAnimRedPath");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObject;
        if (flag == true) {
            if (pathObject.mask2.currOriginX > 431) {
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
                if (pathObject.mask1.height > 635) {

                    contextAnimPath.rect(
                        pathObject.mask2.currOriginX,
                        pathObject.mask2.currOriginY,
                        pathObject.mask2.width,
                        pathObject.mask2.height);
                }

                contextAnimPath.clip();
                contextAnimPath.drawImage(
                    pathObject.source,
                    pathObject.originX,
                    pathObject.originY,
                    pathObject.width,
                    pathObject.height
                );
                if (pathObject.mask1.height < 635) {
                    // pathObject.mask1.currOriginX += pathObject.mask1.shiftX;
                    pathObject.mask1.height += pathObject.mask1.shiftX;
                } else {

                    contextAnimPath.drawImage(pathObject.mask2.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                    if (pathObject.mask2.currOriginX > 431) {
                        pathObject.mask2.currOriginX -= pathObject.mask2.shiftX;
                        pathObject.mask2.width += pathObject.mask2.shiftX;
                    }
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
            pathObject.mask1.height = 1;
            pathObject.mask2.currOriginX = pathObject.mask2.originX;
            pathObject.mask2.currOriginY = pathObject.mask2.originY;

            pathObject.playing = false;
            clearTimeout(pathObject.timeout);
        }
    },
    drawHousePromise(flag) {
        this.canvasAnimHorse = document.getElementById("myCanvasAnimHorse");
        let contextAnimHorse = this.canvasAnimHorse.getContext("2d");
        if (flag) {
            this.canvasAnimHorse.style.visibility = "visible";

            this.drawHorsesTimeout2 = setInterval(() => {
                this.canvasClear(this.canvasAnimHorse);
                this.drawHorse(
                    this.horseObject1,
                    contextAnimHorse,
                    this.horseObject1.source
                );
            }, 70);
        } else {
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
        }
    },
    drawHorse(object, contextS, imageHorse) {
        return new Promise((resolve, rej) => {

            contextS.save();
            var position = new Array();
            var scale;
            if (object.currFrame < object.totalFrame - 1) {
                object.currFrame++;
            } else {
                object.currFrame = 0;
            }

            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                630,
                5,
                object.width * 0.35,
                object.height * 0.35);
            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                560,
                115,
                object.width * 0.35,
                object.height * 0.35);
            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                630,
                200,
                object.width * 0.35,
                object.height * 0.35);
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