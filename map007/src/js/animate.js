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
    drawbluePath(flag = true) {
        let canvasAnimPath = document.getElementById("canvasAnimBluePath");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObjectblue;
        if (flag == true) {
            let buleRoad = () =>{
                if(!this.blueSwitch){return}
            if (pathObject.mask1.currOriginY > pathObject.mask1.endPoint) {
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
                if (pathObject.mask1.currOriginY > pathObject.mask1.endPoint) {
                    // pathObject.mask1.currOriginX += pathObject.mask1.shiftX;
                    pathObject.mask1.currOriginY -= pathObject.mask1.shiftX;
                }
                contextAnimPath.restore();
                canvasAnimPath.style.visibility = "visible";
                pathObject.timeout = setTimeout(() => {
                    this.drawbluePath(flag);
                }, 30);
                
                }else{
                    // this.blueSwitch = false
                    clearTimeout(pathObject.timeout)
                    this.sharpCity(this.control.lingwu,true)
                }
                // this.requestNextAnimationFrame()(buleRoad)
            }
            buleRoad()
        } else {
            canvasAnimPath.style.visibility = "hidden";
            pathObject.mask1.currOriginX = pathObject.mask1.originX;
            pathObject.mask1.currOriginY = pathObject.mask1.originY;

            pathObject.playing = false;
            clearTimeout(pathObject.timeout);

            this.sharpCity(this.control.lingwu,false)
        }
    },
    drawGreenPath(flag) {
        let canvasAnimPath = document.getElementById("canvasAnimGreenPath");
        let contextAnimPath = canvasAnimPath.getContext("2d");
        let pathObject = this.pathObjectGreen;
        if (flag == true) {
            
            if (pathObject.mask3.currOriginY < pathObject.mask3.endPoint) {
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
                    contextAnimPath.rect(
                        pathObject.mask2.currOriginX,
                        pathObject.mask2.currOriginY,
                        pathObject.mask2.width,
                        pathObject.mask2.height);
                    // this.showCityAni(this.canvasObj.canvasStatic7, true)
                    this.sharpCity(this.control.guimayi, true)
                    // this.point2=true
                    if (pathObject.mask2.currOriginX < pathObject.mask2.endPoint) {
                        contextAnimPath.rect(
                            pathObject.mask3.currOriginX,
                            pathObject.mask3.currOriginY,
                            pathObject.mask3.width,
                            pathObject.mask3.height);

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
                if (pathObject.mask1.currOriginY > pathObject.mask1.endPoint) {
                    pathObject.mask1.currOriginY -= pathObject.mask1.shiftX;
                } else {
                    if (pathObject.mask2.currOriginX > pathObject.mask2.endPoint) {
                        pathObject.mask2.currOriginX -= pathObject.mask2.shiftX;
                    } else {
                        contextAnimPath.drawImage(pathObject.mask2.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                        if (pathObject.mask3.currOriginY < pathObject.mask3.endPoint) {
                           
                            if(!pathObject.mask3.ani){
                                pathObject.mask3.currOriginY += pathObject.mask3.shiftX;
                            }else{
                                this.timer2 = setTimeout(() => {
                                    pathObject.mask3.ani = false                                
                                }, 1200)
                            }
                            
                        }
                    }
                }
                contextAnimPath.restore();
                canvasAnimPath.style.visibility = "visible";
                pathObject.timeout = setTimeout(() => {
                    this.drawGreenPath(flag);
                }, 30);
            } else {
                this.sharpCity(this.control.chengdu, true)
            }
        } else {
            canvasAnimPath.style.visibility = "hidden";
            pathObject.mask1.currOriginX = pathObject.mask1.originX;
            pathObject.mask1.currOriginY = pathObject.mask1.originY;

            pathObject.mask2.currOriginX = pathObject.mask2.originX;
            pathObject.mask2.currOriginY = pathObject.mask2.originY;
            pathObject.mask3.currOriginX = pathObject.mask3.originX;
            this.pathObjectGreen.mask3.currOriginY = this.pathObjectGreen.mask3.originY;
            pathObject.mask3.ani = true

            pathObject.playing = false;
            clearTimeout(this.timer2);
            clearTimeout(pathObject.timeout);
            this.sharpCity(this.control.guimayi, false)
            // this.showCityAni(this.canvasObj.canvasStatic7, false)
            this.sharpCity(this.control.chengdu, false)
            this.point2= false

        }
    },
    drawRedPath(flag) {
        // return new Promise((resolve, rej) => {
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

                    // contextAnimPath.drawImage(pathObject.mask2.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
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
            }else{
                console.log('aniend')
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
    // })
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
        if (!CanvasRenderingContext2D.prototype.ellipse) {
          contextStatic2.ellipse = function(x, y, radiusX, radiusY, rotation, startAngle, endAngle,
              anticlockwise) {
              var r = radiusX > radiusY ? radiusX : radiusY; //用打的数为半径
              var scaleX = radiusX / r; //计算缩放的x轴比例
              var scaleY = radiusY / r; //计算缩放的y轴比例
              this.save(); //保存副本                    
              this.translate(x, y); //移动到圆心位置
              this.rotate(rotation); //进行旋转
              this.scale(scaleX, scaleY); //进行缩放
              this.arc(0, 0, r, startAngle, endAngle, anticlockwise); //绘制圆形
              this.restore(); //还原副本
          }
      }
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
    testCanvas(){
        var canvas = document.getElementById('testCanvas'),
            context = canvas.getContext('2d'),
            discs = [
                { 
                   x: 150,
                   y: 250,
                   lastX: 150,
                   lastY: 250,
                   velocityX: -3.2,
                   velocityY: 3.5,
                   radius: 25,
                   innerColor: 'rgba(255,255,0,1)',
                   middleColor: 'rgba(255,255,0,0.7)',
                   outerColor: 'rgba(255,255,0,0.5)',
                   strokeStyle: 'gray',
                },
          
                { 
                   x: 50,
                   y: 150,
                   lastX: 50,
                   lastY: 150,
                   velocityX: 2.2,
                   velocityY: 2.5,
                   radius: 25,
                   innerColor: 'rgba(100,145,230,1.0)',
                   middleColor: 'rgba(100,145,230,0.7)',
                   outerColor: 'rgba(100,145,230,0.5)',
                   strokeStyle: 'blue'
                },
          
                { 
                   x: 150,
                   y: 75,
                   lastX: 150,
                   lastY: 75,
                   velocityX: 1.2,
                   velocityY: 1.5,
                   radius: 25,
                   innerColor: 'rgba(255,0,0,1.0)',
                   middleColor: 'rgba(255,0,0,0.7)',
                   outerColor: 'rgba(255,0,0,0.5)',
                   strokeStyle: 'orange'
                },
             ],
             numDiscs = discs.length,
             gradient=null
            let update = () => {
                var disc = null;
                for(var i=0; i < numDiscs; ++i) {
                   disc = discs[i];
                   //边缘检测
                   if (disc.x + disc.velocityX + disc.radius > context.canvas.width ||
                       disc.x + disc.velocityX - disc.radius < 0) 
                      disc.velocityX = -disc.velocityX;
             
                   if (disc.y + disc.velocityY + disc.radius > context.canvas.height ||
                       disc.y + disc.velocityY - disc.radius  < 0) 
                      disc.velocityY= -disc.velocityY;
             
                   disc.x += disc.velocityX;
                   disc.y += disc.velocityY;
                }
             }

             let draw= () => {
                var disc = discs[i];
             
                for(var i=0; i < numDiscs; ++i) {
                   disc = discs[i];
             
                   gradient = context.createRadialGradient(disc.x, disc.y, 0,
                                      disc.x, disc.y, disc.radius);
             
                   gradient.addColorStop(0.3, disc.innerColor);
                   gradient.addColorStop(0.5, disc.middleColor);
                   gradient.addColorStop(1.0, disc.outerColor);
             
                   context.save();
                   context.beginPath();
                   context.arc(disc.x, disc.y, disc.radius, 0, Math.PI*2, false);
                   context.fillStyle = gradient;
                   context.strokeStyle = disc.strokeStyle;
                   context.fill();
                   context.stroke();
                   context.restore();
                }
            }

            let animate11 = () =>{
                update();
                draw();
                this.requestNextAnimationFrame()(animate11);
            }
            animate11()
    },

    requestNextAnimationFrame(){
        var originalWebkitMethod,
            wrapper = undefined,
            selfcallback = undefined,
            geckoVersion = 0,
            userAgent = navigator.userAgent,
            index = 0,
            self = this;
        if(window.webkitRequestAnimationFrame){
            wrapper = (time)=>{
                if(time === undefined){
                    time += new Date();
                }
                selfcallback(time);
            };
            originalWebkitMethod = window.webkitRequestAnimationFrame;
            window.webkitRequestAnimationFrame = (callback,element)=>{
                selfcallback = callback;
                originalWebkitMethod(wrapper , element);
            }
        }
        if(window.mozRequestAnimationFrame){
            index = userAgent.indexOf('rv:');
            if(userAgent.indexOf('Gecko') != -1){
                geckoVersion = userAgent.substr(index+3 , 3);
                if(geckoVersion === '2.0'){
                    window.mozRequestAnimationFrame = undefined;
                }
            }
        }


        return window.requestNextAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimationFrame ||

               ((callback , element)=>{
                    var start,
                        finish;
                    window.setTimeout(()=>{
                        start = +new Date();
                        callback(start);
                        finish = +new Date();
                        self.timeout = 1000/500 - (finish - start);
                    } , self.timeout);
               })
    }
}
// window.requestNextAnimationFrame = (function(){
//     let originalWebkitMethod,
//         wrapper = undefined,
//         selfcallback = undefined,
//         geckoVersion = 0,
//         userAgent = navigator.userAgent,
//         index = 0,
//         self = this;
//     if(window.webkitRequestAnimationFrame){
//         wrapper = function(time){
//             if(time === undefined){
//                 time += new Date();
//             }
//             selfcallback(time);
//         };
//         originalWebkitMethod = window.webkitRequestAnimationFrame;
//         window.webkitRequestAnimationFrame = (callback,element)=>{
//             console.log(callback)
//             selfcallback = callback;
//             originalWebkitMethod(wrapper , element);
//         }
//     }
//     if(window.mozRequestAnimationFrame){
//         index = userAgent.indexOf('rv:');
//         if(userAgent.indexOf('Gecko') != -1){
//             geckoVersion = userAgent.substr(index+3 , 3);
//             if(geckoVersion === '2.0'){
//                 window.mozRequestAnimationFrame = undefined;
//             }
//         }
//     }


//     return window.requestNextAnimationFrame ||
//            window.webkitRequestAnimationFrame ||
//            window.mozRequestAnimationFrame ||
//            window.oRequestAnimationFrame ||
//            window.msRequestAnimationFrame ||


//            function (callback , element){
//                 var start,
//                     finish;
//                 window.setTimeout(function(){
//                     start = +new Date();
//                     callback(start);
//                     finish = +new Date();
//                     self.timeout = 1000/60 - (finish - start);
//                 } , self.timeout);
//            };
// })();
export default animate;