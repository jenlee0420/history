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
    let canvasAnimPath = document.getElementById("canvasroute");
    let contextAnimPath = canvasAnimPath.getContext("2d");
    let pathObject = this.pathObject;
    
    if (flag == true) {
     
      if (pathObject.mask1.width < pathObject.mask1.endPoint) {
        console.log(pathObject.mask1.width)
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
        if (pathObject.mask1.currOriginX < pathObject.mask1.endPoint) {
          pathObject.mask1.width += pathObject.mask1.shiftX;
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
      pathObject.mask1.width=1
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
  drawHousePromise2(flag, canvasId, x, y) {
    let canvasAnimHorse = document.getElementById(canvasId);
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout1);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout1 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse2(
          this.horseObject1,
          contextAnimHorse,
          this.horseObject1.source,
          x, y
        )
      }, 250);
    } else {
      clearInterval(this.drawHorsesTimeout1);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
    }
  },

  drawHorse(object, contextS, imageHorse, imageHorse2) {

    return new Promise((resolve, rej) => {
      // 
      // if () {

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
      } else {
        scale =1
        position[0] = object.position.points[object.position.totalPoint - 1][0]
        position[1] = object.position.points[object.position.totalPoint - 1][1]
      }
      contextS.drawImage(
        imageHorse,
        object.currFrame * object.width,
        0,
        object.width,
        object.height,
        position[0],
        position[1],
        object.width * scale,
        object.height * scale);

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
    // console.log(x,y)
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
        object.width * .5,
        object.height* .5);
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
      console.log(e,this.imageObj[e],this.control[e])
      if ((this.control[e] == true) && this.imageObj[e]) {
        this.contextObj['canvasImages'].drawImage(this.imageObj[e], 0, 0, this.baseWidth, this.baseHeight);
      }
    });
  }

}
export default animate;