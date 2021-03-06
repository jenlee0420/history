const SCALE_NUM = 0.5
const SCALE_LIMIT = 800
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
  
  drawHousePromise(flag, canvasId) {    
    let canvasAnimHorse = this.canvasObj[canvasId]
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      canvasAnimHorse.timeout = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject2,
          contextAnimHorse,
          this.horseObject2.source
        )
      }, 150);
    } else {
      clearInterval(canvasAnimHorse.timeout);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject2)
    }
  },
  drawHousePromise2(flag, canvasId, x, y) {    
    let canvasAnimHorse = this.canvasObj[canvasId]
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawTimeout.time11);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawTimeout.time11 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse2(
          this.horseObject1,
          contextAnimHorse,
          this.horseObject1.source,
          x, y
        )
      }, 350);
    } else {
      clearInterval(this.drawTimeout.time11);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
    }
  },
  drawHousePromise2_a(flag, canvasId, x, y) {    
    let canvasAnimHorse = this.canvasObj[canvasId]
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    if (flag) {
      clearInterval(this.drawTimeout.time12);
      canvasAnimHorse.style.visibility = "visible";
      this.drawTimeout.time12 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse2(
          this.horseObject3,
          contextAnimHorse,
          this.horseObject3.source,
          x, y
        )
      }, 350);
    } else {
      clearInterval(this.drawTimeout.time12);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
    }
  },
  drawHousePromise2_b(flag, canvasId, x, y) {    
    let canvasAnimHorse = this.canvasObj[canvasId]
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    if (flag) {
      clearInterval(this.drawTimeout.time13);
      canvasAnimHorse.style.visibility = "visible";
      this.drawTimeout.time13 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse2(
          this.horseObject4,
          contextAnimHorse,
          this.horseObject4.source,
          x, y
        )
      }, 300);
    } else {
      clearInterval(this.drawTimeout.time13);
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
        // scale =1
        // position[0] = object.position.points[object.position.totalPoint - 1][0]
        // position[1] = object.position.points[object.position.totalPoint - 1][1]
      }
      contextS.drawImage(
        imageHorse,
        object.currFrame * object.width,
        0,
        object.width,
        object.height,
        position[0],
        position[1],
        object.width * scale *0.5,
        object.height * scale*0.5);

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
          object.width * 0.5,
          object.height * 0.5);
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
      
      if(canvasList[i].org && document.body.clientWidth<SCALE_LIMIT){
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
      if ((this.control[e] == true) && this.imageObj[e]) {
        this.contextObj['canvasImages'].drawImage(this.imageObj[e], 0, 0, this.baseWidth, this.baseHeight);
      }
    });
  }

}
export default animate;