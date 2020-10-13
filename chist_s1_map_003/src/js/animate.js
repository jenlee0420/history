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
  ship1(flag) {
    let canvasAnimRedPath = this.canvasObj['canvasAnimRedPath']
    let contextAnimRedPath = this.contextObj['canvasAnimRedPath']
    let canvasAnimHorse = this.canvasObj['canvasAnimHorse']
    var img = new Image();
    var h = 50,
      y = 1200,
      xx = 1154,
      ww = 220;
    var addRadial = () => {
      contextAnimRedPath.save(); //保存当前绘图状态
      contextAnimRedPath.beginPath(); //开始创建路径
      if (xx <= 600) {
        y -= 15;
        h += 15;
      } else if (y <= 820) {
        xx -= 15;
        ww += 15;
        y = 785;
      } else if (y <= 1200) {
        y -= 15;
        h += 15;
      }
      contextAnimRedPath.rect(xx, y, ww, h);
      contextAnimRedPath.closePath(); //关闭路径
      contextAnimRedPath.clip();
      contextAnimRedPath.drawImage(this.route1, 0, 0, this.baseWidth, this.baseHeight);
      contextAnimRedPath.rect(0, 0, this.baseWidth, this.baseHeight);
      contextAnimRedPath.restore();

      if (h < 1170) {
        this.redTimer = setTimeout(()=> {
          addRadial();
        }, 50);
      } else {
        clearTimeout(this.redTimer);
      }
    };
    if (flag == true) {
      // img.src = require("../../static/img/route1/xianlu1a0090.png")
      // img.onload = () => {
        canvasAnimRedPath.style.visibility = "visible";
        // console.log('anistart')
        if (!canvasAnimRedPath.playing) {
          addRadial();
          this.drawHousePromise();
          canvasAnimRedPath.playing = true;
        }
        // redTimer = setInterval(() => {
        //     addRadial()
        //     if (h >= 1000) {
        //         clearInterval(redTimer)
        //     }
        //     y -= 10
        //     h += 10
        // }, 50);
      // };
      // drawHousePromise()

      // drawHorsesTimeout = setTimeout(function () { ship1(flag); }, 1 / 30 * 1000);
    } else {
      this.showCityAni(canvasAnimHorse, false);
      canvasAnimRedPath.playing = false;
      clearTimeout(this.redTimer);
      canvasAnimRedPath.style.visibility = "hidden";
      this.canvasClear(canvasAnimRedPath);
      for (var i = 0; i < this.horsetimerGroup.length; i++) {
        clearTimeout(this.horsetimerGroup[i]);
      }
      clearTimeout(canvasAnimHorse.timeout);
      canvasAnimHorse.style.visibility = "hidden";
      this.canvasClear(canvasAnimHorse);
      clearInterval(this.drawHorsesTimeout);
      this.resetHorseObject(this.horseObject1);
      this.resetHorseObject(this.horseObject2);
      this.resetHorseObject(this.horseObject3);
      this.resetHorseObject(this.horseObject4);
      this.animatePlay = false
    }
  },
  ship2(flag) {
    let canvasAnimGreenPath = this.canvasObj['canvasAnimGreenPath']
    let contextAnimGreenPath = this.contextObj['canvasAnimGreenPath']
    let canvasAnimHorse2 = this.canvasObj['canvasAnimHorse2']
    var img = new Image();
    var w = 10,
      x = 620;
    var addRadial2 = ()=> {
      contextAnimGreenPath.save(); //保存当前绘图状态
      contextAnimGreenPath.beginPath(); //开始创建路径
      contextAnimGreenPath.rect(x, 650, w, 250);
      contextAnimGreenPath.closePath(); //关闭路径
      contextAnimGreenPath.clip();
      contextAnimGreenPath.drawImage(this.route2, 0, 0, this.baseWidth, this.baseHeight);
      contextAnimGreenPath.restore();
      x -= 10;
      w += 10;
      if (x > 90) {
        this.greedTimer = setTimeout(()=> {
          addRadial2();
        }, 50);
      } else {
        clearTimeout(this.greedTimer);
      }
    };
    if (flag == true) {
      // img.src = require("../../static/img/route2/xianlu2b0050.png");
      // img.onload = ()=> {
        canvasAnimGreenPath.style.visibility = "visible";
        if (!canvasAnimGreenPath.playing) {
          addRadial2();
          this.drawHorse2();
          canvasAnimGreenPath.playing = true;
        }
        // greedTimer = setInterval(() => {
        //     addRadial2(x,w)
        //     if (x <= 0) {
        //         clearInterval(greedTimer)
        //     }
        //     x -= 10
        //     w += 10
        // }, 50);
      // };
      // drawHorse2()
    } else {
      // console.log('clear')
      this.showCityAni(canvasAnimHorse2, false);
      canvasAnimGreenPath.playing = false;
      clearTimeout(this.greedTimer);
      canvasAnimGreenPath.style.visibility = "hidden";
      this.canvasClear(canvasAnimGreenPath);
      for (var i = 0; i <this.horsetimerGroup2.length; i++) {
        clearTimeout(this.horsetimerGroup2[i]);
      }
      clearTimeout(canvasAnimHorse2.timeout);
      canvasAnimHorse2.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject5);
      this.canvasClear(canvasAnimHorse2);
      clearInterval(this.drawHorsesTimeout2);
    }
  },
  drawRiverPath(flag) {
    if (flag == true) {
      if (this.drawRiverTimeout == 'end') {
        return;
      }
      this.drawRiverTimeout = 'end';
      this.m04.currentTime = 0;
      this.m04.play();
      this.m04.addEventListener('ended', () => {
        this.m05.currentTime = 0;
        this.m05.play();
      })
      // this.m05.addEventListener('ended', () => {
        
      // })
      // this.m07.addEventListener('ended', () => {
       
      // })
      // this.m06.addEventListener('ended', () => {
        
      // })
//////////////////
      this.timerGroup[0] = setTimeout(() => {
        this.control.river01 = true
      }, 1000);
      this.timerGroup[1] = setTimeout(() => {
        this.control.river04 = true
      }, 18000)
      this.m05.addEventListener('ended', () => {
        this.m07.currentTime = 0;
        this.m07.play();
        this.timerGroup[2] = setTimeout(() => {
          this.control.river05 = true
        }, 1000)
      })
      this.m07.addEventListener('ended', () => {
        this.m06.currentTime = 0;
        this.m06.play();
        this.timerGroup[3] = setTimeout(() => {
          this.control.river03 = true        
        }, 1000);
      })


      this.m06.addEventListener('ended', () => {
        this.m08.currentTime = 0;
        this.m08.play();
        this.timerGroup[4] = setTimeout(() => {
          this.control.river02 = true
        }, 1000);
      })
    }
  },
  drawRiverPathNoVoice(flag) {
    if (flag == true) {
      if (this.drawRiverTimeout == 'end') {
        return;
      }
      this.drawRiverTimeout = 'end';
      this.timerGroup[0] = setTimeout(() => {
        this.control.river01 = true
      }, 1000);
      this.timerGroup[1] = setTimeout(() => {
        this.control.river04 = true
      }, 3000);
      this.timerGroup[2] = setTimeout(() => {
        this.control.river05 = true
      }, 6000);
      this.timerGroup[3] = setTimeout(() => {
        this.control.river03 = true
      }, 9000);
      this.timerGroup[4] = setTimeout(() => {
        this.control.river02 = true
      }, 12000);
    }
  },
  drawHousePromise() {
    // console.log(horseObject4.animated,'4444')
    if (this.animatePlay == true) {
      return;
    }
    let canvasAnimHorse = this.canvasObj['canvasAnimHorse']
    let contextAnimHorse =this.contextObj['canvasAnimHorse']
    canvasAnimHorse.style.visibility = 'visible';
    contextAnimHorse.drawImage(this.horseObject1.source, this.horseObject1.position.points[0][0], this.horseObject1.position.points[0][1], this.horseObject1.width * 0.25, this.horseObject1.height * 0.25);
    this.showCityAni(canvasAnimHorse, true);
    this.horsetimerGroup[0] = setTimeout(()=> {
      this.drawHorsesTimeout[0] = setInterval(()=>{
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(this.horseObject1, false, canvasAnimHorse, contextAnimHorse).then(()=>{
          clearInterval(this.drawHorsesTimeout[0]);
        })
      }, 60);
    }, 1200);

    this.horsetimerGroup[1] = setTimeout(()=> {
      this.drawHorsesTimeout[1] = setInterval(()=> {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(this.horseObject2, false, canvasAnimHorse, contextAnimHorse).then(()=>{
          clearInterval(this.drawHorsesTimeout[1]);
        })
      }, 60);
    }, 2100);
    this.horsetimerGroup[2] = setTimeout(()=>{
      this.drawHorsesTimeout[2] = setInterval(()=> {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(this.horseObject3, false, canvasAnimHorse, contextAnimHorse).then(()=>{
          clearInterval(this.drawHorsesTimeout[2]);
        })
      }, 60);
    }, 3000);
    this.horsetimerGroup[3] = setTimeout(()=> {
     this.drawHorsesTimeout[3] = setInterval(()=> {
      this.canvasClear(canvasAnimHorse);
        var endfun = ()=>{
          this.horsetimerGroup[4] = setTimeout(()=> {
            this.canvasClear(canvasAnimHorse);
            this.waveSound.pause();
          }, 1000);
        };
        this.drawHorse(this.horseObject4, false, false, contextAnimHorse).then(()=>{
          clearInterval(this.drawHorsesTimeout[3]);
          this.horsetimerGroup[4] = setTimeout(()=> {
            this.canvasClear(canvasAnimHorse);
            this.waveSound.pause();
          }, 1000);
        })
      }, 60);
    }, 4300);
  },


  drawHorse(object, isInvert, endfun, contextS) {
    return new Promise((resolve, rej) => {
    let imageHorse = object.source
    // return new Promise((resolve, reject) => {

    if (object.position.currPoint + 1 < object.position.totalPoint) {
      // console.log(object.position.currPoint, object.position.totalPoint)
      contextS.save();
      // contextAnimHorse.position(canvasAnimHorse.width, 0);
      if (isInvert) {
        contextS.scale(-1, 1);
      }

      var position = new Array();
      var scale;

      if (object.position.scales[object.position.currPoint] != object.position.scales[object.position.currPoint + 1]) {
        if (object.position.scales[object.position.currPoint] > object.position.scales[object.position.currPoint + 1]) {
          scale = object.position.scales[object.position.currPoint] * (object.position.dur[object.position.currPoint] - object.position.currDur) / object.position.dur[object.position.currPoint];
        } else {
          scale = object.position.scales[object.position.currPoint + 1] * object.position.currDur / object.position.dur[object.position.currPoint];
        }
        if (scale < 0) {
          scale = 0;
        }
      } else {
        scale = 1;
      }
      position[0] = (object.position.points[object.position.currPoint][0] * (object.position.dur[object.position.currPoint] - object.position.currDur) + object.position.points[object.position.currPoint + 1][0] * object.position.currDur) / object.position.dur[object.position.currPoint];
      position[1] = (object.position.points[object.position.currPoint][1] * (object.position.dur[object.position.currPoint] - object.position.currDur) + object.position.points[object.position.currPoint + 1][1] * object.position.currDur) / object.position.dur[object.position.currPoint];
      contextS.drawImage(imageHorse, position[0], position[1], object.width * scale * 0.25, object.height * scale * 0.25);
      contextS.restore();
      // Anim Position control
      if (object.position.currDur <= object.position.dur[object.position.currPoint]) {
        object.position.currDur++;
      } else {
        object.position.currDur = 1;
        object.position.currPoint++;
      }
      if (object.point[object.position.currPoint] > 0) {
        // if(object.point[object.position.currPoint] == 1){
        //     showCityAni(canvasS, true)
        // }
        object.animating = false;
        object.animated = true;
        resolve("//");
        // if (object.id == 5) {
        //   clearInterval(this.drawHorsesTimeout2);
        // } else {
          
        //   clearInterval(this.drawHorsesTimeout);
        // }
        // if (typeof endfun == 'function') {
        //   console.log('end')
        //   endfun();
        // }
        // resolve()
        // return "ok";
      }
    } else {
      // position[0] = (object.position.points[object.position.totalPoint][0] * (object.position.dur[object.position.totalPoint] - object.position.currDur) + object.position.points[object.position.totalPoint + 1][0] * object.position.currDur) / object.position.dur[object.position.totalPoint];
      // position[1] = (object.position.points[object.position.totalPoint][1] * (object.position.dur[object.position.totalPoint] - object.position.currDur) + object.position.points[object.position.totalPoint + 1][1] * object.position.currDur) / object.position.dur[object.position.totalPoint];

      object.animating = false;
      object.animated = true;
      resolve("//");
      // console.log('end', object.position.currPoint, object.position.totalPoint);
      // contextAnimHorse.save();
      // contextAnimHorse.drawImage(imageHorse, position[0], position[1], object.width * scale * 0.25, object.height * scale * 0.25);
      // contextAnimHorse.restore();

      // if (object.id == 5) {
      //   clearInterval(this.drawHorsesTimeout2);
      // } else {
      //   // console.log('////',this.drawHorsesTimeout)
      //   clearInterval(this.drawHorsesTimeout);
      // }

      // showCityAni(canvasAnimHorse, true)
    }
  })
  },
  drawHorse2() {
    // console.log(horseObject5.animated);
    if (this.horseObject5.animated == true) {
      return;
    }
    let imageHorse = this.horseObject5.source
    let canvasAnimHorse2 = this.canvasObj['canvasAnimHorse2']
    let contextAnimHorse2 = canvasAnimHorse2.getContext('2d')
    canvasAnimHorse2.style.visibility = 'visible';
    contextAnimHorse2.drawImage(imageHorse, this.horseObject5.position.points[0][0], this.horseObject5.position.points[0][1], this.horseObject5.width * 0.25, this.horseObject5.height * 0.25);
    this.showCityAni(canvasAnimHorse2, true);
    this.horsetimerGroup2[0] = setTimeout(()=>{
      this.drawHorsesTimeout2 = setInterval(()=> {
        this.canvasClear(canvasAnimHorse2);
        this.drawHorse(this.horseObject5, false, false, contextAnimHorse2).then(()=>{
          clearInterval(this.drawHorsesTimeout2);
          this.horsetimerGroup2[1] = setTimeout(()=> {
            this.canvasClear(canvasAnimHorse2);
            this.waveSound.pause();
          }, 1000);
        })
      }, 60);
    }, 2000);
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
      if ((this.control[e] == true || this.control[e].show == true) && this.imageObj[e]) {
        this.contextObj['canvasImages'].drawImage(this.imageObj[e], 0, 0, this.baseWidth, this.baseHeight);
      }
    });
  }

}
export default animate;