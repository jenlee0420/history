const animate = {
  sharpCity(obj, bool) {
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
        return;
      }
      obj.show = show
      show = !show;
      times -= 1;
    }, 260)
  },
  stopCityAni(canvasStatic){
    clearInterval(canvasStatic.timeout);
    canvasStatic.style.visibility = "visible";
    canvasStatic.ani = false;
  },
  showCityAni(canvasStatic, bool) {
    return new Promise((resolve, rej) => {
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
        resolve('end')
        return;
      }
      canvasStatic.style.visibility = show ? "visible" : "hidden";
      show = !show;
      times -= 1;
    }, 260);
    canvasStatic.ani = true;
  })
  },
  drawRedPath(flag) {
    let canvasAnimPath = document.getElementById("canvasroute");
    let contextAnimPath = canvasAnimPath.getContext("2d");
    let pathObject = this.pathObject;
    if (flag == true) {
      if (pathObject.mask1.currOriginY < pathObject.mask1.endPoint) {
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

        contextAnimPath.clip();
        contextAnimPath.drawImage(
          pathObject.source,
          pathObject.originX,
          pathObject.originY,
          pathObject.width,
          pathObject.height
        );
        if (pathObject.mask1.currOriginY < pathObject.mask1.endPoint) {
          pathObject.mask1.currOriginY += pathObject.mask1.shiftX;
        } else {

        }
        contextAnimPath.restore();
        canvasAnimPath.style.visibility = "visible";
        pathObject.timeout = setTimeout(() => {
          this.drawRedPath(flag);
        }, 30);
      } else {
        this.control.refugee2 = flag
      }
    } else {
      canvasAnimPath.style.visibility = "hidden";
      pathObject.mask1.currOriginX = pathObject.mask1.originX;
      pathObject.mask1.currOriginY = pathObject.mask1.originY;

      pathObject.playing = false;
      clearTimeout(pathObject.timeout);
    }
  },
  drawRedPath2(flag) {
    let canvasAnimPath = document.getElementById("canvasroute2");
    let contextAnimPath = canvasAnimPath.getContext("2d");
    let pathObject = this.pathObject2;
    if (flag == true) {
      if (pathObject.mask1.currOriginY < pathObject.mask1.endPoint) {
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

        contextAnimPath.clip();
        contextAnimPath.drawImage(
          pathObject.source,
          pathObject.originX,
          pathObject.originY,
          pathObject.width,
          pathObject.height
        );
        if (pathObject.mask1.currOriginY < pathObject.mask1.endPoint) {
          pathObject.mask1.currOriginY += pathObject.mask1.shiftX;
        } else {

        }
        contextAnimPath.restore();
        canvasAnimPath.style.visibility = "visible";
        pathObject.timeout = setTimeout(() => {
          this.drawRedPath2(flag);
        }, 30);
      } else {
        this.drawHousePromise(flag)
      }
    } else {
      canvasAnimPath.style.visibility = "hidden";
      pathObject.mask1.currOriginX = pathObject.mask1.originX;
      pathObject.mask1.currOriginY = pathObject.mask1.originY;

      pathObject.playing = false;
      clearTimeout(pathObject.timeout);
    }
  },
  drawHousePromise(flag) {
    let canvasAnimHorse = document.getElementById("canvaszhangqian");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject1,
          contextAnimHorse,
          this.horseObject1.source,
          true,
          0.45
        )
      }, 250);
    } else {
      clearInterval(this.drawHorsesTimeout);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject1)
    }
  },
  drawCity(flag) {
    let canvasAnimHorse = document.getElementById("canvastemple");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout2);
    if (flag) {
      // console.log(flag,'.....')
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout2 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject2,
          contextAnimHorse,
          this.horseObject2.source,
          false
        )
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout2);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject2)
    }
  },
  drawCity2(flag) {
    let canvasAnimHorse = document.getElementById("canvastemple2");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout3);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout3 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject3,
          contextAnimHorse,
          this.horseObject3.source,
          false
        )
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout3);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject3)
    }
  },
  drawStatue(flag) {    
    this.canvasAnimHorse = document.getElementById("canvasStatue");
    let contextAnimHorse = this.canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout4);
    if (flag) {
     
      this.canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout4 = setInterval(() => {
        this.canvasClear(this.canvasAnimHorse);
        this.drawHorse(
          this.horseObject4,
          contextAnimHorse,
          this.horseObject4.source,
          false
        ).then((res)=>{
          this.timer1[6] = setTimeout(() => {
            this.drawStatuePath2(true)
          }, 15000)
          clearInterval(this.drawHorsesTimeout4);
        })
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout4);
      this.canvasClear(this.canvasAnimHorse);
      this.canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject4)
    }
  },
    drawStatue2(flag) {
    let canvasAnimHorse = document.getElementById("canvasStatue2");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout5);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout5 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject5,
          contextAnimHorse,
          this.horseObject5.source,
          false
        ).then((res)=>{         
          clearInterval(this.drawHorsesTimeout5);
        })
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout5);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject5)
    }
  },
  drawStatue3(flag) {
    let canvasAnimHorse = document.getElementById("canvasStatue3");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout6);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout6 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject6,
          contextAnimHorse,
          this.horseObject6.source,
          false
        ).then((res)=>{         
          clearInterval(this.drawHorsesTimeout6);
        })
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout6);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject6)
    }
  },
  drawStatue4(flag) {
    let canvasAnimHorse = document.getElementById("canvasStatue4");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout7);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout7 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject7,
          contextAnimHorse,
          this.horseObject7.source,
          false
        ).then((res)=>{         
          clearInterval(this.drawHorsesTimeout7);
        })
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout7);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject7)
    }
  },
  drawStatue5(flag) {
    let canvasAnimHorse = document.getElementById("canvasStatue5");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout8);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout8 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject8,
          contextAnimHorse,
          this.horseObject8.source,
          false
        ).then((res)=>{         
          clearInterval(this.drawHorsesTimeout8);
        })
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout8);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject8)
    }
  },
  drawStatuePath2(flag){
    this.drawStatue3(flag)
    this.drawStatue4(flag)
    this.drawStatue5(flag)

  },
  drawHousePromise2(flag, canvasId, x, y) {
    let canvasAnimHorse = document.getElementById(canvasId);
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout1);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout1 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse2(
          this.horseObject9,
          contextAnimHorse,
          this.horseObject9.source,
          x, y
        )
      }, 250);
    } else {
      clearInterval(this.drawHorsesTimeout1);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
    }
  },
  drawHousePromise3(flag, canvasId, x, y) {
    let canvasAnimHorse = document.getElementById(canvasId);
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout9);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout9 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse2(
          this.horseObject9,
          contextAnimHorse,
          this.horseObject9.source,
          x, y
        )
      }, 250);
    } else {
      clearInterval(this.drawHorsesTimeout9);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
    }
  },

  drawHorse(object, contextS, imageHorse, isStop,scale) {
    var Sscale = scale?scale:0.5
    return new Promise((resolve, rej) => {
      // 
      if(object.source.src.indexOf('buddhastatue')>-1 && this.list[6].show == true && object.position.currPoint == 2 && !this.btn2Play){
        console.log(object.source.src)
        this.btn2Play = true
      }

      contextS.save();
      // if (object.point==-1) {
      //     contextS.scale(-1, 1);
      // }
      var position = new Array();
      var scale;
      if (object.currFrame < object.totalFrame - 1) {
        object.currFrame++;
      } else {
        object.currFrame = 0;
      }
      if (
        object.position.scales.length > 0 &&
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
      if (object.position.currPoint + 1 < object.position.totalPoint) {
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
      } else if(isStop) { 
        scale =1
        position[0] = object.position.points[object.position.totalPoint - 1][0]
        position[1] = object.position.points[object.position.totalPoint - 1][1]
      }else{
        // console.log('end')
        resolve('end')
      }
      contextS.drawImage(
        imageHorse,
        object.currFrame * object.width,
        0,
        object.width,
        object.height,
        position[0],
        position[1],
        object.width * scale *Sscale,
        object.height * scale *Sscale);

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
  },
  drawHorse2(object, contextS, imageHorse, x, y) {
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
          x,
          y,
          object.width * 0.45,
          object.height * 0.45);
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