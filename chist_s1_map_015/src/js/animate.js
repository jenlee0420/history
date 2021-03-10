const SCALE_NUM = 0.5
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
      let canvasAnimPath = document.getElementById("myCanvasAnimRoad");
      let contextAnimPath = canvasAnimPath.getContext("2d");
      let pathObject = this.pathObject;
      if (flag == true) {
          if (pathObject.mask5.width < pathObject.mask5.endPoint) {
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
              if (pathObject.mask1.height >= pathObject.mask1.endPoint) {
                  contextAnimPath.rect(pathObject.mask2.currOriginX,pathObject.mask2.currOriginY,pathObject.mask2.width,pathObject.mask2.height);
                  if (pathObject.mask2.height >= pathObject.mask2.endPoint) {
                    contextAnimPath.rect(pathObject.mask3.currOriginX,pathObject.mask3.currOriginY,pathObject.mask3.width,pathObject.mask3.height);
                    if (pathObject.mask3.height >= pathObject.mask3.endPoint) {
                      contextAnimPath.rect(pathObject.mask4.currOriginX,pathObject.mask4.currOriginY,pathObject.mask4.width,pathObject.mask4.height);
                      if (pathObject.mask4.width >= pathObject.mask4.endPoint) {
                        contextAnimPath.rect(pathObject.mask5.currOriginX,pathObject.mask5.currOriginY,pathObject.mask5.width,pathObject.mask5.height);
                        
                    }
                  }
                }
              }

              contextAnimPath.clip();
              contextAnimPath.drawImage(
                  pathObject.source,
                  pathObject.originX,
                  pathObject.originY,
                  pathObject.width,
                  pathObject.height
              );
              if (pathObject.mask1.height < pathObject.mask1.endPoint) {
                  // pathObject.mask1.currOriginX += pathObject.mask1.shiftX;
                  pathObject.mask1.height += pathObject.mask1.shiftX;
              } else {
                  if (pathObject.mask2.currOriginY < pathObject.mask2.endPoint) {
                      pathObject.mask2.currOriginY += pathObject.mask2.shiftY;
                      pathObject.mask2.currOriginX -= pathObject.mask2.shiftX;
                  }else {
                    if (pathObject.mask3.height < pathObject.mask3.endPoint) {
                        // pathObject.mask2.currOriginX -= pathObject.mask2.shiftX;
                        pathObject.mask3.height += pathObject.mask3.shiftX;
                    }else {
                      if (pathObject.mask4.width < pathObject.mask4.endPoint) {
                          pathObject.mask4.currOriginX -= pathObject.mask4.shiftX;
                          pathObject.mask4.width += pathObject.mask4.shiftX;
                      }else {
                        if (pathObject.mask5.width < pathObject.mask5.endPoint) {
                            pathObject.mask5.currOriginX -= pathObject.mask5.shiftX;
                            pathObject.mask5.width += pathObject.mask5.shiftX;
                        }
                    }
                  }
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
          for (var i=1;i<6;i++) {
            let element= pathObject['mask'+i]
            element.currOriginX = element.originX;
            element.currOriginY = element.originY;
          }
          pathObject.mask1.height=1
          pathObject.mask3.height=1
          pathObject.mask4.width=1
          pathObject.mask5.width=1
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
                  this.drawHorse(
                    this.horseObject2,
                    contextAnimHorse,
                    this.horseObject2.source
                ).then(()=>{
                  this.drawHorse(
                    this.horseObject3,
                    contextAnimHorse,
                    this.horseObject3.source
                ).then(()=>{
                  this.drawHorse(
                    this.horseObject4,
                    contextAnimHorse,
                    this.horseObject4.source).then(()=>{
                      this.license.pause()
                    })
                })}
                )
                });
            }, 70);
        } else {
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject1)
            this.resetHorseObject(this.horseObject2)
            this.resetHorseObject(this.horseObject3)
            this.resetHorseObject(this.horseObject4)
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
          
          
          if(canvasList[i].org && document.body.clientWidth<600){
            canvasStatic.width = this.orgSetting.w;
            canvasStatic.height = this.orgSetting.h;
            canvasStatic.style.transform = `scale(${SCALE_NUM})`;
          }else{
            canvasStatic.width = this.baseWidth;
          canvasStatic.height = this.baseHeight;
          }
          // canvasList.obj = canvasStatic
          canvasObj[canvasList[i].name] = canvasStatic
          contextObj[canvasList[i].name] = contextStatic
          divTag.appendChild(canvasStatic);
        }
        return [canvasObj, contextObj]
      },
      imagesCanvas() {
        this.canvasClear(this.canvasObj['canvasImages']);
        this.canvasObj['canvasImages'].style.visibility = 'visible'
        Object.keys(this.control).forEach(e => {
          // console.log(e,this.imageObj[e])
          if ((this.control[e] == true) && this.imageObj[e]) {
            this.contextObj['canvasImages'].drawImage(this.imageObj[e], 0, 0, this.baseWidth, this.baseHeight);
          }
        });
      }

}
export default animate;