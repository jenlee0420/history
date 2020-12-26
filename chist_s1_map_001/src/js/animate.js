const animate = {
    drawGreenPath_part2(flag) {
        let canvasAnimPath = document.getElementById('myCanvasAnimGreenPath3')
        let contextAnimPath = canvasAnimPath.getContext('2d');
        let pathObject = this.pathObject2
        if (flag == true) {
            if (pathObject.mask7.height < 350) {
                pathObject.playing = true
                this.canvasClear(canvasAnimPath);
                contextAnimPath.save();
                contextAnimPath.beginPath();

                contextAnimPath.rect(pathObject.mask3.currOriginX, pathObject.mask3.currOriginY, pathObject.mask3.width, pathObject.mask3.height);
                if (pathObject.mask3.currOriginX >= 153) {
                    contextAnimPath.rect(pathObject.mask4.currOriginX, pathObject.mask4.currOriginY, pathObject.mask4.width, pathObject.mask4.height);
                    if (pathObject.mask4.currOriginX >= 1060) {
                        contextAnimPath.rect(pathObject.mask5.currOriginX, pathObject.mask5.currOriginY, pathObject.mask5.width, pathObject.mask5.height);
                        if (pathObject.mask5.currOriginX <= 1070) {
                            contextAnimPath.rect(pathObject.mask7.currOriginX, pathObject.mask7.currOriginY, pathObject.mask7.width, pathObject.mask7.height);
                        }
                    }

                }
                contextAnimPath.clip();
                contextAnimPath.drawImage(pathObject.mask3.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                if (pathObject.mask3.width < 153) {
                    pathObject.mask3.width += pathObject.mask3.shiftX;
                } else {
                    contextAnimPath.drawImage(pathObject.mask4.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                    if (pathObject.mask4.height < 20) {
                        pathObject.mask4.height += 2;
                    } else if (pathObject.mask4.currOriginX <= 1060) {
                        pathObject.mask4.currOriginX += 2;
                        pathObject.mask4.height += 3;
                    } else if (pathObject.mask5.currOriginX > 1060) {
                        pathObject.mask5.currOriginX -= 6;
                        pathObject.mask4.height += 2;
                    } else {
                        contextAnimPath.drawImage(pathObject.mask7.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                        if (pathObject.mask5.currOriginX <= 1070) {
                            pathObject.mask7.height += pathObject.mask7.shiftX;
                        }
                    }
                }
                contextAnimPath.restore();
                canvasAnimPath.style.visibility = "visible";
                pathObject.timeout = setTimeout(() => {
                    this.drawGreenPath_part2(flag);
                }, 30);
            }
        } else {
            canvasAnimPath.style.visibility = "hidden";
            this.canvasClear(canvasAnimPath);
            // console.log(pathObject)
            pathObject.mask3.currOriginX = pathObject.mask3.originX;
            pathObject.mask3.currOriginY = pathObject.mask3.originY;
            pathObject.mask3.width = 1;
            pathObject.mask4.currOriginX = pathObject.mask4.originX;
            pathObject.mask4.currOriginY = pathObject.mask4.originY;
            pathObject.mask4.height = 1;
            pathObject.mask5.currOriginX = pathObject.mask5.originX;
            pathObject.mask5.currOriginY = pathObject.mask5.originY;
            pathObject.mask7.currOriginX = pathObject.mask7.originX;
            pathObject.mask7.currOriginY = pathObject.mask7.originY;
            pathObject.mask7.height = 1;
            pathObject.playing = false
            clearTimeout(pathObject.timeout);
        }
    },
    drawHousePromise_part2(flag) {
        let canvasAnimHorse = document.getElementById('contextAnimHorse2')
        let contextAnimHorse = canvasAnimHorse.getContext('2d');
        if (flag) {
            if (this.horseObject5.animated == true) {
                return
            }
            canvasAnimHorse.style.visibility = 'visible'

            // contextAnimHorse.drawImage(this.horseObject1.source, this.horseObject1.position.points[0][0], this.horseObject1.position.points[0][1], this.horseObject1.width * 0.55, this.horseObject1.height * 0.55);
            // this.showCityAni(canvasAnimHorse, true)
            // this.horsetimerGroup = setTimeout(() => {
            this.drawHorsesTimeout3 = setInterval(() => {
                this.canvasClear(canvasAnimHorse);
                if (this.horseObject3.animated == false) {
                    this.drawHorse(this.horseObject3, contextAnimHorse, this.horseObject3.source)
                } else {
                    if (this.horseObject4.animated == false) {
                        this.drawHorse(this.horseObject4, contextAnimHorse, this.horseObject4.source)
                    } else {
                        if (this.horseObject5.animated == false) {
                            this.drawHorse(this.horseObject5, contextAnimHorse, this.horseObject5.source)
                        } else {
                            this.license.pause()
                        }
                    }
                }

            }, 60);
            // }, 500)
        } else {
            canvasAnimHorse.style.visibility = "hidden";
            // for(var i= 0; i<this.drawHorsesTimeout2.length;i++){
            //     clearInterval(this.drawHorsesTimeout2[i])
            // }
            // clearTimeout(this.horsetimerGroup)
            clearInterval(this.drawHorsesTimeout3)
            this.canvasClear(canvasAnimHorse);
            this.resetHorseObject(this.horseObject3)
            this.resetHorseObject(this.horseObject4)
            this.resetHorseObject(this.horseObject5)
        }
    },
    createCanvas(canvasList, divTag) {
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
            this.canvasObj[canvasList[i].name] = canvasStatic
            this.contextObj[canvasList[i].name] = contextStatic
            divTag.appendChild(canvasStatic);
        }
    },
}
export default animate;