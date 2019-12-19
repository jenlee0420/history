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
      if (this.horseObject1.animated == true) {
        return;
      }
      this.canvasAnimHorse.style.visibility = "visible";

      // contextAnimHorse.drawImage(this.horseObject1.source, this.horseObject1.position.points[0][0], this.horseObject1.position.points[0][1], this.horseObject1.width * 0.55, this.horseObject1.height * 0.55);
      // this.showCityAni(canvasAnimHorse, true)
      // this.horsetimerGroup = setTimeout(() => {
      this.drawHorsesTimeout2 = setInterval(() => {
        this.canvasClear(this.canvasAnimHorse);
        this.drawHorse(
          this.horseObject1,
          contextAnimHorse,
          this.horseObject1.source
        );
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
    }
  },
  drawHorse(object, contextS, imageHorse) {
    return new Promise((resolve, rej) => {
      if (object.position.currPoint + 1 < object.position.totalPoint) {
        contextS.save();
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
  insterCanvas(img, contextStatic, bool) {
    img.onload = () => {
      this.contextObj[contextStatic].drawImage(controlCity,0,0,this.baseWidth,this.baseHeight);
      this.contextObj[contextStatic].style.visibility = bool ? "visible" : "hidden";
    };
  }
  // createImg(src, contextStatic) {
  //     var controlCity = new Image();
  //     controlCity.src = require(`../static/img/${src}.png`);
  //     controlCity.onload = () => {
  //         contextStatic.drawImage(
  //             controlCity,
  //             0,
  //             0,
  //             this.baseWidth,
  //             this.baseHeight
  //         );
  //         // canvasStatic2.style.visibility = "hidden";
  //     };
  // }
}
export default animate;