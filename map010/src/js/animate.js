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
            console.log(times)
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
    drawGreen(flag){
        let canvasAnimPath = document.getElementById("myCanvasAnimGreenPath");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObject;
        if (flag == true) {

            if (pathObject.mask10.currOriginX < pathObject.mask10.endPoint) {
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
                if (pathObject.mask1.height > pathObject.mask1.endPoint) {
                    contextAnimPath.rect(
                        pathObject.mask2.currOriginX,
                        pathObject.mask2.currOriginY,
                        pathObject.mask2.width,
                        pathObject.mask2.height
                    )
                    if (pathObject.mask2.currOriginY <= pathObject.mask2.endPoint) {
                        contextAnimPath.rect(pathObject.mask3.currOriginX,pathObject.mask3.currOriginY,pathObject.mask3.width,pathObject.mask3.height)
                        if (pathObject.mask2.currOriginY < pathObject.mask2.endPoint) {
                            contextAnimPath.rect(
                                pathObject.mask3.currOriginX,
                                pathObject.mask3.currOriginY,
                                pathObject.mask3.width,
                                pathObject.mask3.height
                            )
                            if (pathObject.mask3.currOriginX > pathObject.mask3.endPoint) {
                                contextAnimPath.rect(
                                    pathObject.mask4.currOriginX,
                                    pathObject.mask4.currOriginY,
                                    pathObject.mask4.width,
                                    pathObject.mask4.height
                                )
                                if (pathObject.mask4.currOriginY >= pathObject.mask4.endPoint) {
                                    contextAnimPath.rect(
                                        pathObject.mask5.currOriginX,
                                        pathObject.mask5.currOriginY,
                                        pathObject.mask5.width,
                                        pathObject.mask5.height
                                    )
                                    if (pathObject.mask5.currOriginY >= pathObject.mask5.endPoint) {
                                        
                                        contextAnimPath.rect(
                                            pathObject.mask6.currOriginX,
                                            pathObject.mask6.currOriginY,
                                            pathObject.mask6.width,
                                            pathObject.mask6.height
                                        )
                                        if (pathObject.mask6.currOriginX <= pathObject.mask6.endPoint) {
                                            contextAnimPath.rect(
                                                pathObject.mask7.currOriginX,
                                                pathObject.mask7.currOriginY,
                                                pathObject.mask7.width,
                                                pathObject.mask7.height
                                            )
                                            if (pathObject.mask7.currOriginX < pathObject.mask7.endPoint) {
                                                contextAnimPath.rect(
                                                    pathObject.mask8.currOriginX,
                                                    pathObject.mask8.currOriginY,
                                                    pathObject.mask8.width,
                                                    pathObject.mask8.height
                                                )
                                                if (pathObject.mask8.currOriginY < pathObject.mask8.endPoint) {
                                                    contextAnimPath.rect(
                                                        pathObject.mask9.currOriginX,
                                                        pathObject.mask9.currOriginY,
                                                        pathObject.mask9.width,
                                                        pathObject.mask9.height
                                                    )
                                                    if (pathObject.mask9.currOriginY < pathObject.mask9.endPoint) {
                                                        contextAnimPath.rect(
                                                            pathObject.mask17.currOriginX,
                                                            pathObject.mask17.currOriginY,
                                                            pathObject.mask17.width,
                                                            pathObject.mask17.height
                                                        )
                                                        if (pathObject.mask17.currOriginY < pathObject.mask17.endPoint) {
                                                            contextAnimPath.rect(
                                                                pathObject.mask10.currOriginX,
                                                                pathObject.mask10.currOriginY,
                                                                pathObject.mask10.width,
                                                                pathObject.mask10.height
                                                            )
                                                        }                                                    
                                                    }
                                                }
                                            }
                                        }   
                                    }   
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
                if (pathObject.mask1.height < pathObject.mask1.endPoint) {
                    pathObject.mask1.height += pathObject.mask1.shiftX;
                }else{
                    if (pathObject.mask2.currOriginY > pathObject.mask2.endPoint) {
                        pathObject.mask2.currOriginY -= pathObject.mask2.shiftX;
                    }else{
                        if (pathObject.mask3.currOriginX < pathObject.mask3.endPoint) {
                            pathObject.mask3.currOriginX += pathObject.mask3.shiftX;
                        }else{
                            contextAnimPath.drawImage( pathObject.mask4.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                            if (pathObject.mask4.currOriginY < pathObject.mask4.endPoint) {
                                pathObject.mask4.currOriginY += pathObject.mask4.shiftX;
                            }else{
                                if (pathObject.mask5.currOriginY < pathObject.mask5.endPoint) {
                                    pathObject.mask5.currOriginY += pathObject.mask5.shiftX;
                                }else{
                                    contextAnimPath.drawImage( pathObject.mask6.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                    // console.log(pathObject.mask6.currOriginX)
                                    if (pathObject.mask6.currOriginX > pathObject.mask6.endPoint) {
                                        pathObject.mask6.currOriginX -= pathObject.mask6.shiftX;
                                    }else{
                                        contextAnimPath.drawImage( pathObject.mask7.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                        if (pathObject.mask7.currOriginX > pathObject.mask7.endPoint) {
                                            pathObject.mask7.currOriginX -= pathObject.mask7.shiftX;
                                        }else{
                                            contextAnimPath.drawImage( pathObject.mask8.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                            if (pathObject.mask8.currOriginY > pathObject.mask8.endPoint) {
                                                pathObject.mask8.currOriginY -= pathObject.mask8.shiftX;
                                            }else{
                                                contextAnimPath.drawImage( pathObject.mask9.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                                if (pathObject.mask9.currOriginY > pathObject.mask9.endPoint) {
                                                    pathObject.mask9.currOriginY -= pathObject.mask9.shiftX;
                                                }else{
                                                    if (pathObject.mask17.currOriginY > pathObject.mask17.endPoint) {
                                                        pathObject.mask17.currOriginY -= pathObject.mask17.shiftX;
                                                    }else{
                                                        contextAnimPath.drawImage( pathObject.mask10.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                                        if (pathObject.mask10.currOriginX < pathObject.mask10.endPoint) {
                                                            pathObject.mask10.currOriginX += pathObject.mask10.shiftX;
                                                        }
                                                    }
                                                }
                                            }
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
                    this.drawGreen(flag);
                }, 30);
            }
            else{
                clearTimeout(pathObject.timeout);
            }
        } else {
            canvasAnimPath.style.visibility = "hidden";
            for (var i=1;i<11;i++) {
                let element= pathObject['mask'+i]
                element.currOriginX = element.originX;
                element.currOriginY = element.originY;
            }
            pathObject.mask1.height = 1;

            pathObject.playing = false;
            clearTimeout(pathObject.timeout);
        }
    },
    drawGreen2(flag){
        let canvasAnimPath = document.getElementById("myCanvasAnimGreenPath2");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObject;
        if (flag == true) {
            if (pathObject.mask16.currOriginX > pathObject.mask16.endPoint) {
            if (pathObject.mask10.currOriginX > pathObject.mask10.endPoint) {
                
                pathObject.playing = true;
                this.canvasClear(canvasAnimPath);
                contextAnimPath.save();
                contextAnimPath.beginPath();
                    contextAnimPath.rect(
                        pathObject.mask11.currOriginX,
                        pathObject.mask11.currOriginY,
                        pathObject.mask11.width,
                        pathObject.mask11.height
                    );
                    if (pathObject.mask11.currOriginX > pathObject.mask11.endPoint) {
                        contextAnimPath.rect(
                            pathObject.mask12.currOriginX,
                            pathObject.mask12.currOriginY,
                            pathObject.mask12.width,
                            pathObject.mask12.height
                        )
                        if (pathObject.mask12.currOriginY <= pathObject.mask12.endPoint) {
                            contextAnimPath.rect(
                                pathObject.mask13.currOriginX,
                                pathObject.mask13.currOriginY,
                                pathObject.mask13.width,
                                pathObject.mask13.height
                            )
                            if (pathObject.mask13.currOriginY <= pathObject.mask13.endPoint) {
                                contextAnimPath.rect(
                                    pathObject.mask14.currOriginX,
                                    pathObject.mask14.currOriginY,
                                    pathObject.mask14.width,
                                    pathObject.mask14.height
                                )
                                if (pathObject.mask14.currOriginX < pathObject.mask14.endPoint) {
                                    contextAnimPath.rect(
                                        pathObject.mask15.currOriginX,
                                        pathObject.mask15.currOriginY,
                                        pathObject.mask15.width,
                                        pathObject.mask15.height
                                    )
                                    if (pathObject.mask15.currOriginX <= pathObject.mask15.endPoint) {
                                        contextAnimPath.rect(
                                            pathObject.mask16.currOriginX,
                                            pathObject.mask16.currOriginY,
                                            pathObject.mask16.width,
                                            pathObject.mask16.height
                                        )
                                    }
                                }
                            }
                        }
                    }
                
                contextAnimPath.clip();
                contextAnimPath.drawImage(
                    pathObject.mask11.source,
                    pathObject.originX,
                    pathObject.originY,
                    pathObject.width,
                    pathObject.height
                );
                if (pathObject.mask11.currOriginX < pathObject.mask11.endPoint) {
                    pathObject.mask11.currOriginX += pathObject.mask11.shiftX;
                }else{
                    if (pathObject.mask12.currOriginY > pathObject.mask12.endPoint) {
                        pathObject.mask12.currOriginY -= pathObject.mask12.shiftX;
                    }else{
                        contextAnimPath.drawImage(
                            pathObject.mask13.source,
                            pathObject.originX,
                            pathObject.originY,
                            pathObject.width,
                            pathObject.height
                        );
                        if (pathObject.mask13.currOriginY > pathObject.mask13.endPoint) {
                            pathObject.mask13.currOriginY -= pathObject.mask13.shiftX;
                        }else{
                            if (pathObject.mask14.currOriginX > pathObject.mask14.endPoint) {
                                pathObject.mask14.currOriginX -= pathObject.mask14.shiftX;
                            }else{
                                contextAnimPath.drawImage( pathObject.mask15.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                if (pathObject.mask15.currOriginX > pathObject.mask15.endPoint) {
                                    pathObject.mask15.currOriginX -= pathObject.mask15.shiftX;
                                }else{
                                    contextAnimPath.drawImage( pathObject.mask16.source, pathObject.originX,pathObject.originY,pathObject.width,pathObject.height);
                                    if (pathObject.mask16.currOriginX > pathObject.mask16.endPoint) {
                                        pathObject.mask16.currOriginX -= pathObject.mask16.shiftX;
                                    }
                                }
                            }
                        }
                    }
                    
                }
                
                contextAnimPath.restore();
                canvasAnimPath.style.visibility = "visible";
                
            }
        }
            pathObject.timeout2 = setTimeout(() => {
                this.drawGreen2(flag);
            }, 30);
        } else {
            canvasAnimPath.style.visibility = "hidden";
            for (var i=11;i<17;i++) {
                let element= pathObject['mask'+i]
                element.currOriginX = element.originX;
                element.currOriginY = element.originY;
            }
            pathObject.playing = false;
            clearTimeout(pathObject.timeout2);
        }
    },
    
    drawHousePromise(flag) {
        this.canvasAnimHorse = document.getElementById("person");
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
                );
            }, 105);
        } else {
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject1)
        }
    },
    drawPurple(flag){
        let canvasAnimPath = document.getElementById("myCanvasAnimPurple");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObjectPurple;
        var tt
        if (flag == true) {
            if (pathObject.mask2.currOriginY >= pathObject.mask2.endPoint) {
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
                if (pathObject.mask1.width > pathObject.mask1.endPoint) {
                    contextAnimPath.rect(
                        pathObject.mask2.currOriginX,
                        pathObject.mask2.currOriginY,
                        pathObject.mask2.width,
                        pathObject.mask2.height
                    )
                }

                contextAnimPath.clip();
                contextAnimPath.drawImage(
                    pathObject.source,
                    pathObject.originX,
                    pathObject.originY,
                    pathObject.width,
                    pathObject.height
                );
                if (pathObject.mask1.width < pathObject.mask1.endPoint) {
                    pathObject.mask1.width += pathObject.mask1.shiftX;
                }else{
                    if (pathObject.mask2.currOriginY >= pathObject.mask2.endPoint) {
                        pathObject.mask2.currOriginY -= pathObject.mask2.shiftX;
                    }
                }
                
                contextAnimPath.restore();
                canvasAnimPath.style.visibility = "visible";
                pathObject.timeout = setTimeout(() => {
                    this.drawPurple(flag);
                }, 30);
            }
            else{
                clearTimeout(pathObject.timeout);
                this.showCityAni(this.canvasObj['myCanvasStatic5'],true)
                tt= setTimeout(() => {
                    this.scream.pause();
                    clearTimeout(tt)
                }, 1000);
            }
        } else {
            clearTimeout(tt)
            canvasAnimPath.style.visibility = "hidden";
            pathObject.mask1.currOriginX = pathObject.mask1.originX;
            pathObject.mask1.currOriginY = pathObject.mask1.originY;
            pathObject.mask1.width = 1;
            pathObject.mask2.currOriginX = pathObject.mask2.originX;
            pathObject.mask2.currOriginY = pathObject.mask2.originY;

            pathObject.playing = false;
            clearTimeout(pathObject.timeout);
            this.showCityAni(this.canvasObj['myCanvasStatic5'],false)
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
            //   console.log(object.position.currPoint)
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
    playTimes(elem,elem2) {
        elem.addEventListener("ended",function() {
            elem2.pause();
        });
    }

}
export default animate;