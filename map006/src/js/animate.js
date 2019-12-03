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
            if (this.horseObject5.animated == true) {
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
                760,
                678,
                object.width * 0.35,
                object.height * 0.35);
            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                850,
                528,
                object.width * 0.35,
                object.height * 0.35);
            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                948,
                430,
                object.width * 0.35,
                object.height * 0.35);
            contextS.drawImage(
                imageHorse,
                object.currFrame * object.width,
                0,
                object.width,
                object.height,
                1128,
                360,
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