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
  drawGreenPath(flag) {
    let canvasAnimPath = document.getElementById("GreenAnimRoad");
    let contextAnimPath = canvasAnimPath.getContext("2d");
    let pathObject = this.pathObject;
    if (flag == true) {
      if (pathObject.mask2.width < pathObject.mask2.endPoint) {
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

        if (pathObject.mask1.currOriginY <= pathObject.mask1.endPoint) {
          contextAnimPath.rect(pathObject.mask2.currOriginX, pathObject.mask2.currOriginY, pathObject.mask2.width, pathObject.mask2.height);
        }
        contextAnimPath.clip();
        contextAnimPath.drawImage(
          pathObject.source,
          pathObject.originX,
          pathObject.originY,
          pathObject.width,
          pathObject.height
        );
        if (pathObject.mask1.currOriginY > pathObject.mask1.endPoint) {
          pathObject.mask1.currOriginY -= pathObject.mask1.shiftY;
        } else {
          if (pathObject.mask2.currOriginX <= pathObject.mask2.endPoint) {
            pathObject.mask2.width += pathObject.mask2.shiftX;
          } else {}
        }
        contextAnimPath.restore();
        canvasAnimPath.style.visibility = "visible";
        pathObject.timeout = setTimeout(() => {
          this.drawGreenPath(flag);
        }, 30);
      } else {
        
      }
    } else {
      canvasAnimPath.style.visibility = "hidden";
      for (var i = 1; i < 3; i++) {
        let element = pathObject['mask' + i]
        element.currOriginX = element.originX;
        element.currOriginY = element.originY;
      }
      pathObject.mask2.width = 1;
      pathObject.playing = false;
      clearTimeout(pathObject.timeout);
    }
  },
  drawGreenPath2(flag) {
    let canvasAnimPath = document.getElementById("GreenAnimRoad2");
    let contextAnimPath = canvasAnimPath.getContext("2d");
    let pathObject = this.greenObject;
    if (flag == true) {
      if (pathObject.mask6.currOriginY < pathObject.mask6.endPoint) {
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
        if (pathObject.mask1.width >= pathObject.mask1.endPoint) {
          contextAnimPath.rect(pathObject.mask2.currOriginX, pathObject.mask2.currOriginY, pathObject.mask2.width, pathObject.mask2.height);
          if (pathObject.mask2.currOriginX <= pathObject.mask2.endPoint) {
            contextAnimPath.rect(pathObject.mask3.currOriginX, pathObject.mask3.currOriginY, pathObject.mask3.width, pathObject.mask3.height);
            if (pathObject.mask3.currOriginX >= pathObject.mask3.endPoint) {
              contextAnimPath.rect(pathObject.mask4.currOriginX, pathObject.mask4.currOriginY, pathObject.mask4.width, pathObject.mask4.height);
              if (pathObject.mask4.currOriginY >= pathObject.mask4.endPoint) {
                contextAnimPath.rect(pathObject.mask5.currOriginX, pathObject.mask5.currOriginY, pathObject.mask5.width, pathObject.mask5.height);
                if (pathObject.mask5.currOriginX >= pathObject.mask5.endPoint) {
                  contextAnimPath.rect(pathObject.mask6.currOriginX, pathObject.mask6.currOriginY, pathObject.mask6.width, pathObject.mask6.height);

                }
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
        if (pathObject.mask1.width <= pathObject.mask1.endPoint) {
          pathObject.mask1.width += pathObject.mask1.shiftX;
        } else {
          if (pathObject.mask2.currOriginY >= pathObject.mask2.endPoint) {
            pathObject.mask2.currOriginY -= pathObject.mask2.shiftY;
          } else {
            if (pathObject.mask3.currOriginX <= pathObject.mask3.endPoint) {
              pathObject.mask3.currOriginX += pathObject.mask3.shiftX;
            } else {
              if (pathObject.mask4.currOriginY <= pathObject.mask4.endPoint) {
                pathObject.mask4.currOriginY += pathObject.mask4.shiftY;
              } else {
                if (pathObject.mask5.currOriginX < pathObject.mask5.endPoint) {
                  pathObject.mask5.currOriginX += pathObject.mask5.shiftX;
                } else {
                  if (pathObject.mask6.currOriginY <= pathObject.mask6.endPoint) {
                    pathObject.mask6.currOriginY += pathObject.mask6.shiftY;
                  } else {

                  }
                }
              }
            }
          }
        }
        contextAnimPath.restore();
        canvasAnimPath.style.visibility = "visible";
        pathObject.timeout = setTimeout(() => {
          this.drawGreenPath2(flag);
        }, 30);
      }
    } else {
      canvasAnimPath.style.visibility = "hidden";
      for (var i = 1; i < 7; i++) {
        let element = pathObject['mask' + i]
        element.currOriginX = element.originX;
        element.currOriginY = element.originY;
      }
      pathObject.mask1.width = 1;
      pathObject.playing = false;
      clearTimeout(pathObject.timeout);
    }
  },
  drawbluePath(flag) {
    return new Promise((resolve, rej) => {
      let canvasAnimPath = document.getElementById("Blue2AnimRoad");
      let contextAnimPath = canvasAnimPath.getContext("2d");
      let pathObject = this.blueObject;
      if (flag == true) {
        if (pathObject.mask7.currOriginX < pathObject.mask7.endPoint) {
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
          if (pathObject.mask1.currOriginY <= pathObject.mask1.endPoint) {
            contextAnimPath.rect(pathObject.mask2.currOriginX, pathObject.mask2.currOriginY, pathObject.mask2.width, pathObject.mask2.height);
            if (pathObject.mask2.currOriginY <= pathObject.mask2.endPoint) {
              this.d2_(contextAnimPath, pathObject.mask3);
              if (pathObject.mask3.ani > 100 - pathObject.mask3.speed) {
                contextAnimPath.rect(pathObject.mask4.currOriginX, pathObject.mask4.currOriginY, pathObject.mask4.width, pathObject.mask4.height);
                if (pathObject.mask4.currOriginX >= pathObject.mask4.endPoint) {
                  contextAnimPath.rect(pathObject.mask5.currOriginX, pathObject.mask5.currOriginY, pathObject.mask5.width, pathObject.mask5.height);
                  if (pathObject.mask5.currOriginX >= pathObject.mask5.endPoint) {
                    contextAnimPath.rect(pathObject.mask6.currOriginX, pathObject.mask6.currOriginY, pathObject.mask6.width, pathObject.mask6.height);
                    if (pathObject.mask6.currOriginX <= pathObject.mask6.endPoint) {
                      contextAnimPath.rect(pathObject.mask7.currOriginX, pathObject.mask7.currOriginY, pathObject.mask7.width, pathObject.mask7.height);
                    }
                  }
                }
              }
            }
          }
          // contextAnimPath.stroke();
          contextAnimPath.clip();
          contextAnimPath.drawImage(
            pathObject.source,
            pathObject.originX,
            pathObject.originY,
            pathObject.width,
            pathObject.height
          );
          if (pathObject.mask1.currOriginY >= pathObject.mask1.endPoint) {
            pathObject.mask1.currOriginY -= pathObject.mask1.shiftY;
            pathObject.mask1.currOriginX += pathObject.mask1.shiftX;
          } else {
            if (pathObject.mask2.currOriginY >= pathObject.mask2.endPoint) {
              // console.log(pathObject.mask2.currOriginY, pathObject.mask2.endPoint)
              pathObject.mask2.currOriginY -= pathObject.mask2.shiftY;
              pathObject.mask2.height += pathObject.mask2.shiftY;
            } else {
              if (pathObject.mask3.ani < 100 - pathObject.mask3.speed) {
                pathObject.mask3.ani = (pathObject.mask3.ani + pathObject.mask3.speed) % 100;
              } else {
                if (pathObject.mask4.currOriginX <= pathObject.mask4.endPoint) {
                  pathObject.mask4.currOriginX += pathObject.mask4.shiftX;
                } else {
                  if (pathObject.mask5.currOriginX < pathObject.mask5.endPoint) {
                    pathObject.mask5.currOriginX += pathObject.mask5.shiftX;
                  } else {
                    if (pathObject.mask6.currOriginX >= pathObject.mask6.endPoint) {
                      pathObject.mask6.currOriginX -= pathObject.mask6.shiftX;
                    } else {
                      if (pathObject.mask7.currOriginX <= pathObject.mask7.endPoint) {
                        pathObject.mask7.currOriginY += pathObject.mask7.shiftY;
                        pathObject.mask7.currOriginX += pathObject.mask7.shiftX;
                      }
                    }
                  }
                }
              }
            }
          }
          contextAnimPath.restore();
          canvasAnimPath.style.visibility = "visible";
          pathObject.timeout = setTimeout(() => {
            this.drawbluePath(flag);
          }, 45);
        } else {
          console.log('////')
          // resolve('end')

        }
      } else {
        canvasAnimPath.style.visibility = "hidden";
        for (var i = 1; i < 8; i++) {
          let element = pathObject['mask' + i]
          element.currOriginX = element.originX;
          element.currOriginY = element.originY;
        }
        pathObject.mask2.height = 1;
        pathObject.playing = false;
        pathObject.mask3.ani =0
        clearTimeout(pathObject.timeout);
      }
    })
  },
  drawbluePath2(flag) {
    let canvasAnimPath = document.getElementById("Blue2AnimRoad");
    let contextAnimPath = canvasAnimPath.getContext("2d");
    let pathObject = this.blueObject2;
    if (flag == true) {

      if (pathObject.mask2.currOriginX > pathObject.mask2.endPoint) {
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
        if (pathObject.mask1.currOriginY >= pathObject.mask1.endPoint) {
          contextAnimPath.rect(pathObject.mask2.currOriginX, pathObject.mask2.currOriginY, pathObject.mask2.width, pathObject.mask2.height);

        }

        contextAnimPath.clip();
        contextAnimPath.drawImage(
          pathObject.source,
          pathObject.originX,
          pathObject.originY,
          pathObject.width,
          pathObject.height
        );

        if (pathObject.mask1.currOriginY <= pathObject.mask1.endPoint) {
          pathObject.mask1.currOriginY += pathObject.mask1.shiftY;
        } else {
          if (pathObject.mask2.currOriginX >= pathObject.mask2.endPoint) {
            pathObject.mask2.currOriginX -= pathObject.mask2.shiftX;
          } else {


          }
        }
        contextAnimPath.restore();
        canvasAnimPath.style.visibility = "visible";
        pathObject.timeout = setTimeout(() => {
          this.drawbluePath2(flag);
        }, 30);
      }
    } else {
      canvasAnimPath.style.visibility = "hidden";
      for (var i = 1; i < 3; i++) {
        let element = pathObject['mask' + i]
        element.currOriginX = element.originX;
        element.currOriginY = element.originY;
      }
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
          clearInterval(this.drawHorsesTimeout2)
          this.aniTime2 = setTimeout(()=>{
            this.drawGreenPath2(flag)
            this.drawHousePromise2(flag)
            console.log('timerout2')
          },6000)
          
        })
      }, 110);
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
        )
      }, 100);
    } else {
      clearInterval(this.drawHorsesTimeout);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject2)
    }
  },
  drawHousePromise3(flag) {
    let canvasAnimHorse = document.getElementById("myCanvasAnimHorse3");
    let contextAnimHorse = canvasAnimHorse.getContext("2d");
    clearInterval(this.drawHorsesTimeout3);
    if (flag) {
      canvasAnimHorse.style.visibility = "visible";
      this.drawHorsesTimeout3 = setInterval(() => {
        this.canvasClear(canvasAnimHorse);
        this.drawHorse(
          this.horseObject3,
          contextAnimHorse,
          this.horseObject3.source
        )
      }, 120);
    } else {
      clearInterval(this.drawHorsesTimeout);
      this.canvasClear(canvasAnimHorse);
      canvasAnimHorse.style.visibility = "hidden";
      this.resetHorseObject(this.horseObject3)
    }
  },
  drawHorse(object, contextS, imageHorse) {
    return new Promise((resolve, rej) => {
      if (object.position.currPoint + 1 < object.position.totalPoint) {
        contextS.save();
        if (object.point == -1) {
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

          if(object.point[object.position.currPoint] == -1){
            contextS.drawImage(
              this.imageHorse2,
              object.currFrame * object.width,
              0,
              object.width,
              object.height,
              position[0],
              position[1],
              object.width * scale * 0.43,
              object.height * scale * 0.43);
          }else{
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
          }
        // contextS.drawImage(
        //   imageHorse,
        //   object.currFrame * object.width,
        //   0,
        //   object.width,
        //   object.height,
        //   position[0],
        //   position[1],
        //   object.width * scale * 0.43,
        //   object.height * scale * 0.43);
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

        object.animating = false;
        object.animated = true;
        resolve("//");
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
  d2_(oGc, point) {
    let size = point.size ? point.size : 10
    for (var t = 0; t <= point.ani / 100; t += 0.02) {
      var x = this.quadraticBezier(point.point1[0], point.point2[0], point.point3[0], t);
      var y = this.quadraticBezier(point.point1[1], point.point2[1], point.point3[1], t);
      // oGc.lineTo(x, y);
      oGc.rect(x, y, size, size)
      // oGc.arc(x,y,2,0,Math.PI*2)
      // oGc.fill()
    }
  },
  
  quadraticBezier(p0, p1, p2, t) {
    var k = 1 - t;
    return k * k * p0 + 2 * (1 - t) * t * p1 + t * t * p2; // 这个方程就是二次贝赛尔曲线方程 
  },
  imagesCanvas(){
    this.canvasClear(this.canvasObj['canvasImages']);
      this.canvasObj['canvasImages'].style.visibility = 'visible'
      Object.keys(this.control).forEach(e => {
        // console.log(e,this.imageObj[e])
        if((this.control[e]==true || this.control[e].show==true) && this.imageObj[e]){
          this.contextObj['canvasImages'].drawImage(this.imageObj[e],0,0,this.baseWidth,this.baseHeight);
        }
      });
  }
}
export default animate;