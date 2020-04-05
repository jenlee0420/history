const animate = {
    sharpCity(obj,bool){
      if (!bool) {
          clearInterval(obj.timer);
          obj.show = false
          obj.ani = false
          return;
      }
      if (obj.ani == true) {
          return;
      }
      obj.ani= true
      let show = false;
      let times = 6;
      obj.timer = setInterval(() => {
          if (times == 0) {
              clearInterval(obj.timer);
              return;
          }
          obj.show = show
          show = !show;
          times -= 1;
      },260)
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
        clearInterval(this.drawHorsesTimeout2);
        if (flag) {

            this.canvasAnimHorse.style.visibility = "visible";

            this.drawHorsesTimeout2 = setInterval(() => {
                this.canvasClear(this.canvasAnimHorse);
                this.drawHorse(
                    this.horseObject1,
                    contextAnimHorse,
                    this.horseObject1.source
                ).then(()=>{
                  this.train.pause();
                });
            }, 70);
        } else {
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject1)
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
                ).then(()=>{
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