const SCALE_NUM = 0.5
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
  
 
  drawHousePromise(flag) {
    let canvasAnimHorse = document.getElementById('canvashouse1');
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout1);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout1 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject1,
          contextAnimHorse,
          this.horseObject1.source,
          false,
        ).then(()=>{          
         
        })
      }, 150);      
    } else {
      clearInterval(this.drawHorsesTimeout1);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject1)
    }
  },
  
  drawHousePromise2(flag) {
    let canvasAnimHorse = document.getElementById('canvashouse2');
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout2);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout2 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject2,
          contextAnimHorse,
          this.horseObject2.source,
        )
      }, 140);
    } else {
      clearInterval(this.drawHorsesTimeout2);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject2)
    }
  },
  
  drawHorse(object, contextS, imageHorse, isStop,scale) {
    var Sscale = scale?scale:0.45
    return new Promise((resolve, rej) => {
      contextS.save();
      if(object.position.currPoint==9){
        this.shipSwicth=true
      }
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
          0,
          object.currFrame * object.height,
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
      
      
      if(canvasList[i].org && document.body.clientWidth<800){
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