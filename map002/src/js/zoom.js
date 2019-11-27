/**
 * 简洁的元素缩放功能。
 * @param {[type]} el     要缩放的元素
 * @param {[type]} option {windth:元素宽度（必须），height:元素高度（必须），minScale:最小缩放比例，maxScale:最大缩放比例，top:原始位置,left:原始位置}
 */
function Zoom(el, option) {
    if (!option || !option.width || !option.height) {
        throw "dom的尺寸参数错误";
    }
    option = Object.assign({
        minScale: 0.1,
        maxScale: 1,
        top: 0,
        left: 0,
    }, option);

    this.el = el;

    this.lastSapce = 0;
    this.touchState = 0;
    this.lastPoint = null
    this.targetPoint = null;

    //放大缩小的倍数 当前缩放倍数 
    this.minScale = option.minScale || 1;
    this.maxScale = option.maxScale || 10;

    //dom的尺寸参数
    this.width = option.width;
    this.height = option.height;
    this.top = option.top;
    this.left = option.left;
    this.scale = 1;


    // 位移后的回调事件
    this.transformCallback = option.transformCallback
    this.scaleCallback = option.scaleCallback

    //初始位置 以及 初始宽高
    this.originTop = option.top;
    this.originLeft = option.left;
    this.originW = this.width;
    this.originH = this.height;
    this.warpW = option.warpWidth
    this.warpH = option.warpHeight
        //图片中心点 
    this.centerX = this.left + this.originW / 2;
    this.centerY = this.top + this.originH / 2;

    this.el.style.position = 'absolute';

    this.init();
    return this;
}


Zoom.prototype.getTouches = function(event) {
    let touches = event.touches;
    if (!touches) {
        touches = event.originalEvent.touches;
    }
    return touches;
}

Zoom.prototype.getTouchsDistance = function(t1, t2) {

    let dx = parseInt(t1.pageX - t2.pageX);
    let dy = parseInt(t1.pageY - t2.pageY);

    let d = Math.pow((dx * dx + dy * dy), 0.5);

    return d.toFixed(5);
}

Zoom.prototype.restView = function() {
    this.el.style.width = this.width + 'px';
    this.el.style.height = this.height + 'px';
    this.el.style.top = this.top + 'px';
    this.el.style.left = this.left + 'px';
}


Zoom.prototype.init = function() {

        if ('ontouchmove' in window) {
          this.el.addEventListener('touchstart', this.touchStartHandler);
            this.el.addEventListener('touchmove', this.touchmoveHandler);
            this.el.addEventListener('touchstart', this.touchmoveHandler);
            this.el.addEventListener('touchend', this.touchEndHandler);
            this.el.addEventListener('touchcancel', this.touchEndHandler);
            
        } else {
            this.el.addEventListener('mousedown', this.mouseDownHandler);
            this.el.addEventListener('mousemove', this.mousemoveHandler);
            this.el.addEventListener('mouseup', this.touchEndHandler);
            this.el.addEventListener('mouseleave', this.touchEndHandler);
        }
        // this.el.addEventListener('touchstart',this.dbclickHandler);
        this.el.zoom = this;

    }
    // Zoom.prototype.dbclickHandler = function(event){
    // 	event.stopPropagation();
    // 	event.preventDefault();
    // 	let el = event.currentTarget;
    // 	let zoom = el.zoom;
    // 	let time = new Date(event.timeStamp).getTime(); 
    // 	let touchs = zoom.getTouches(event);
    // 	if (touchs.length == 1) {
    // 		if (!el.lastClickTime) {
    // 			el.lastClickTime = time;
    // 		}else{
    // 			if (time - el.lastClickTime < 300) {
    // 				el.lastClickTime = 0;
    // 				if (zoom.scale != 1) {
    // 					zoom.setScale(1);
    // 				}else if(zoom.scale == 1){
    // 					zoom.setScale(2);
    // 				}		
    // 			}else{
    // 				el.lastClickTime = time;
    // 			}
    // 		}
    // 	}
    // 	zoom.touchStartTime = new Date().getTime();
    // 	return false;
    // },
Zoom.prototype.drage = function(touch) {

    if (this.lastPoint == null) {
        this.lastPoint = {
            x: touch.pageX,
            y: touch.pageY,
        }
    } else {
        let dx = parseInt(touch.pageX - this.lastPoint.x);
        let dy = parseInt(touch.pageY - this.lastPoint.y);


        this.lastPoint.x = touch.pageX;
        this.lastPoint.y = touch.pageY;

        this.left += dx;
        this.top += dy;

        this.setTransform(false);
    }
}

Zoom.prototype.zoom = function(touchs) {
    this.lastPoint = null;
    let t1 = touchs[0];
    let t2 = touchs[1];

    let x1 = t1.pageX;
    let x2 = t2.pageX;
    let y1 = t1.pageY;
    let y2 = t2.pageY;

    let d = this.getTouchsDistance(t1, t2);
    if (this.touchState == 0) {
        this.lastSapce = d;
        this.touchState = 1;
        
        this.pointX = (x2 + (x1 - x2) / 2 - this.left) / this.scale;
        this.pointY = (y2 + (y1 - y2) / 2 - this.top) / this.scale;
        // alert(this.pointX )
    } else if (this.touchState == 1) {
        // document.getElementById('debug').html(this.pointX+","+this.pointY)

        let scaleChange = ((d / this.lastSapce) - 1) * 2;

        let scale = this.scale + scaleChange / 2;
        
        // this.setScale(scale, this.pointX, this.pointY);
        
        this.pointX = (x2 + (x1 - x2) / 2 - this.left) / this.scale;
        this.pointY = (y2 + (y1 - y2) / 2 - this.top) / this.scale;
        // alert(this.left)
        
        if ((d < this.lastSapce) && this.scale==this.minScale){
            return
        }else if ((d > this.lastSapce && this.scale==this.maxScale)){
            return
        }else{
            if (this.scale >= this.minScale && this.scale <= this.maxScale){
                this.setScale(scale, this.pointX, this.pointY);
            }
        }
        this.lastSapce = d;
    }
}
Zoom.prototype.touchStartHandler = function (event) {
  let el = event.currentTarget;
  let zoom = el.zoom;
  let touchs = zoom.getTouches(event);
  if (touchs.length>=2) {
    
  }
}
Zoom.prototype.touchmoveHandler = function(event) {
    // event.stopPropagation();
    // event.preventDefault();
    let el = event.currentTarget;
    let zoom = el.zoom;
    let touchs = zoom.getTouches(event);
    if (touchs.length == 1) {
        zoom.drage(touchs[0]); //拖动处理
    } else if (touchs.length >= 2) {    

        zoom.zoom(touchs); //缩放处理
        zoom.lastPoint = null; //终止拖动事件
        
      
    }
    return false;
}
Zoom.prototype.mouseDownHandler = function(event) {
    // console.log(event)
    this.dragStrat = true
}
Zoom.prototype.mousemoveHandler = function(event) {
    // event.stopPropagation();
    // event.preventDefault();
    let el = event.currentTarget;
    let zoom = el.zoom;
    // console.log(this.dragStrat)
    if (this.dragStrat) {
        zoom.drage(event); //拖动处理
    }


    return false;
}

Zoom.prototype.touchEndHandler = function(event) {
    this.dragStrat = false
    let zoom = event.currentTarget.zoom;

    zoom.touchState = 0;
    zoom.lastPoint = null;
    zoom.lastSapce = 0;

    let minSpace = 20;
    let parentWidth = zoom.el.parentElement.offsetWidth;
    let parentHight = zoom.el.parentElement.offsetHeight;
    let scale = zoom.scale;

    if (scale < zoom.minScale) {
        scale = zoom.minScale;
        zoom.lastPointX = 0
        zoom.lastPointY = 0
    }
    if (scale > zoom.maxScale) {
        scale = zoom.maxScale;
    }
    if (scale != zoom.scale) {
        zoom.preSetScale(scale, zoom.lastPointX, zoom.lastPointY);
    }
    // if((zoom.left + zoom.width) < minSpace){
    //     console.log("if((zoom.left + zoom.width) < minSpace){")
    //     console.log(zoom.left, - zoom.width , minSpace)
    // 		zoom.left = - zoom.width + minSpace;
    // }
    // if(zoom.left >= (parentWidth - minSpace)){
    //     console.log("if(zoom.left >= (parentWidth - minSpace)){")
    //     console.log(zoom.left, parentWidth , minSpace)
    // 		zoom.left = parentWidth - minSpace;
    // }

    // if((zoom.top + zoom.height) < minSpace){
    //     console.log("if((zoom.top + zoom.height) < minSpace){")
    //     console.log(zoom.top, - zoom.height , minSpace)
    // 	zoom.top = - zoom.height + minSpace;
    // }
    // if(zoom.top >= (parentHight - minSpace)){
    //     console.log("if(zoom.top >= (parentHight - minSpace)){")
    //     console.log(zoom.top, parentHight , minSpace)
    // 	zoom.top = parentHight - minSpace;
    // }



    zoom.setTransform(true);

    return;
}
Zoom.prototype.setTransform = function(needAnimation, originX, originY) {

    let distanceX = originX == undefined ? (this.left - this.originLeft) : -originX;
    let distanceY = originY == undefined ? (this.top - this.originTop) : -originY;
    // console.log(this.warpW, this.width)
    if (this.warpW - this.width >= this.left) {
        distanceX = this.warpW - this.width

    }
    if (this.warpH - this.height >= this.top) {
        distanceY = this.warpH - this.height
    }
    if (this.left > 0) {
        distanceX = 0
    }
    if (this.top > 0) {
        distanceY = 0
    }
    if (this.left >= this.originW * -1) {
        this.left = this.originW
    }

    let scale = this.scale;
    originX = originX == undefined ? (this.originTop + 'px') : originX;
    originY = originY == undefined ? (this.originLeft + 'px') : originY;
    this.el.style.transformOrigin = 'left top';
    this.el.style.transform = 'matrix(' + scale + ',0,0,' + scale + ',' + distanceX + ',' + distanceY + ')';

    this.left = distanceX

    this.top = distanceY
    if (needAnimation == true) {
        this.el.style.transition = 'all .3s ease-in-out 0s'
    } else {
        this.el.style.transition = ''
    }

    if (this.transformCallback) this.transformCallback(distanceX, distanceY, scale)
}

Zoom.prototype.destroy = function() {

        if ('ontouchmove' in window) {
            this.el.removeEventListener('touchmove', this.touchmoveHandler);
            this.el.removeEventListener('touchstart', this.touchmoveHandler);
            this.el.removeEventListener('touchend', this.touchEndHandler);
            this.el.removeEventListener('touchcancel', this.touchEndHandler);
        } else {
            this.el.removeEventListener('mousedown', this.mouseDownHandler);
            this.el.removeEventListener('mousemove', this.mousemoveHandler);
            this.el.removeEventListener('mouseup', this.touchEndHandler);
            this.el.removeEventListener('mouseleave', this.touchEndHandler);
        }

        this.el.zoom = null;
    }
    //初始化放大倍数
Zoom.prototype.setScale = function(scale, pointX, pointY) {
    this.preSetScale(scale, pointX, pointY);
    this.setTransform(false, 0, 0);
}

Zoom.prototype.preSetScale = function(scale, pointX, pointY) {
    if (scale < this.minScale) {
        scale = this.minScale;
    }

    if (pointX == undefined) {
    //   console.log(this.originW,'原始')
        this.left = this.centerX - this.originW / 2 - this.originW / 2 * (scale - 1);
        this.top = this.centerY - this.originH / 2 - this.originH / 2 * (scale - 1);

        this.width = scale * this.originW;
        this.height = scale * this.originH;

        this.scale = scale;
    } else {
        this.width = scale * this.originW;
        this.height = scale * this.originH;

        this.left = this.left - pointX * (scale - this.scale);
        this.top = this.top - pointY * (scale - this.scale);

        this.lastPointX = pointX;
        this.lastPointY = pointY;

        this.scale = scale;
    }

    // let distanceX = this.left - this.originLeft;
    // let distanceY = this.top - this.originTop;
    // this.scaleCallback && this.scaleCallback(distanceX,distanceY,this.scale)
}

export default Zoom