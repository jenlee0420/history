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
    drawHousePromise(flag) {
        this.canvasAnimHorse = document.getElementById("myCanvasAnimHorse");
        let contextAnimHorse = this.canvasAnimHorse.getContext("2d");
        if (flag) {
            // if (this.horseObject5.animated == true) {
            //     return;
            // }
            this.canvasAnimHorse.style.visibility = "visible";

            // contextAnimHorse.drawImage(this.horseObject1.source, this.horseObject1.position.points[0][0], this.horseObject1.position.points[0][1], this.horseObject1.width * 0.55, this.horseObject1.height * 0.55);
            // this.showCityAni(canvasAnimHorse, true)
            // this.horsetimerGroup = setTimeout(() => {
            this.drawHorsesTimeout = setInterval(() => {
                this.canvasClear(this.canvasAnimHorse);
                this.drawHorse(
                    this.horseObject1,
                    contextAnimHorse,
                    this.horseObject1.source,
                    850,
                    528
                );
                this.drawHorse(
                    this.horseObject2,
                    contextAnimHorse,
                    this.horseObject1.source,
                    948,
                    430,
                );
                this.drawHorse(
                    this.horseObject3,
                    contextAnimHorse,
                    this.horseObject1.source,
                    1128,
                    360,
                );

            }, 70);
            // }, 500)
        } else {
            // for(var i= 0; i<this.drawHorsesTimeout2.length;i++){
            //     clearInterval(this.drawHorsesTimeout2[i])
            // }
            // clearTimeout(this.horsetimerGroup)
            clearInterval(this.drawHorsesTimeout);
            this.canvasClear(this.canvasAnimHorse);
            this.canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject1);
            this.resetHorseObject(this.horseObject2);
            this.resetHorseObject(this.horseObject3);
        }
    },
    drawHousePromise2(flag) {
        let canvasAnimHorse = document.getElementById("myCanvasStatic5");
        let contextAnimHorse = canvasAnimHorse.getContext("2d");
        if (flag) {
            // if (this.horseObject4.animated == true) {
            //     return;
            // }
            canvasAnimHorse.style.visibility = "visible";

            this.drawHorsesTimeout2 = setInterval(() => {
                this.canvasClear(canvasAnimHorse);
                this.drawHorse(
                    this.horseObject4,
                    contextAnimHorse,
                    this.horseObject4.source,
                    1035,
                    731,
                );
            }, 70);
            // }, 500)
        } else {
            clearInterval(this.drawHorsesTimeout2);
            this.canvasClear(canvasAnimHorse);
            canvasAnimHorse.style.visibility = "hidden";
            this.resetHorseObject(this.horseObject4);
        }
    },
    drawHorse(object, contextS, imageHorse,x,y) {
        return new Promise((resolve, rej) => {
            contextS.save();
            var position = new Array();
            var scale;
            if (object.currFrame < object.totalFrame - 1) {
                object.currFrame++;
            } else {
                object.currFrame = 0;
            }

            // contextS.drawImage(
            //     imageHorse,
            //     object.currFrame * object.width,
            //     0,
            //     object.width,
            //     object.height,
            //     760,
            //     678,
            //     object.width * 0.35,
            //     object.height * 0.35);
            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                x,
                y,
                object.width * 0.35,
                object.height * 0.35);
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
        contextStatic2.strokeStyle = "#ff0000";
        // contextStatic2.save();
        contextStatic2.beginPath()
        contextStatic2.ellipse(917, 690, 50, 85, 0, 0, Math.PI * 2);
        contextStatic2.stroke();
        contextStatic2.closePath()

        contextStatic2.beginPath()
        contextStatic2.ellipse(1010, 600, 50, 85, 0, 0, Math.PI * 2);
        contextStatic2.stroke();
        contextStatic2.closePath()

        contextStatic2.beginPath()
        contextStatic2.ellipse(1090, 420, 50, 85, 0, 0, Math.PI * 2);
        contextStatic2.stroke();
        contextStatic2.closePath()

        // contextStatic2.restore();

        canvasStatic2.style.visibility = 'hidden'
    }
}
export default animate;