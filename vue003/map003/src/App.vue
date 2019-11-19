<template>
  <div id="app">
    <div id="main_container" :style="{'width':docWidth+'px','height':docHeight+'px'}">
      <div class="title_bar purpleGradient">
        <span>隋代運河分佈圖 (581-618 年)</span>
        <div id="soundCon"> </div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{'width':canvasW+'px','height':canvasH+'px'}" 
        v-touch:scaleTouch="{func:scalePic,param:''}"
        v-touch:slideTouch="{func:movePic,param:''}">
          
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" v-for="(item,index) in list" :key="index" @click="showCanvas(index)">
              <span>
                        <img :src="item.ico" class="icon fix_height">{{item.text}}</span>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all">全部顯示</div>
              <div class="blueButton action_all">全部隱藏</div>
            </div>
          </div>
          <div id="map_action_container" class="greyContainer" style="margin-bottom: 10px;">
            <div class="zoom_button zoom_out blueButton" style="width: 2.07em; margin: 5px 10px 3px;" @click="setScaleBtn('de')"><b>-</b></div>
            <div id="slider" class="zoom_button ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" style="width: 50%; height: 0.15em; border-radius: 0.06em;"><span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 0%;"></span></div>
            <div class="zoom_button zoom_in blueButton" style="width: 2.07em; margin: 5px 10px 3px;" @click="setScaleBtn('add')"><b>+</b></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    createMap
  } from './js/creatMap.js'
  import canvasImage from "./components/canvasImage/index.js";
  import ConvertImage from "./components/canvasImage/main.js";
  import zoom from './js/zoom.js'

  export default {
    components: {
      canvasImage
    },
    name: "App",
    mounted() {
      // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", load, false);
      this.zoomObj = require('./js/zoom.js')
      this.setRemUnit()
      
      
      // tt(this.$refs['canvasInnerDiv'],{width:300,height:300})
      // tt.setScale(0.1)
      // createMap.createMap()
      this.initCanvas()
      this.createMap()
      this.ele =document.getElementsByClassName('modal_content')[0]; // 这个应该在图片显示的时候设置
    },
    data() {
      return {
        zoomObj:null,
        data: [],
        imgList: ['/static/img/map.png', '/static/img/mapDetail.png'],
        list: [{
          ico: '/static/img/icon/shoudu.png',
          text: '首都'
        }, {
          ico: '/static/img/icon/guancang.png',
          text: '官倉'
        }, {
          ico: '/static/img/icon/jiangjiexian.png',
          text: '疆界'
        }, {
          ico: '/static/img/icon/shoudu.png',
          text: '大興（今西安市）',
          type: 'map'
        }, {
          ico: '/static/img/icon/question.png',
          text: '問題',
          type: 'question'
        }],
        bodytWidth: '',
        bodyHeight: '',
        baseWidth:'1430',
        baseHeight:'1315',
        orienta: '',
        boxscale: 1,
        o: '',
        dpr: 1,
        rem: '',
        canvasH: '',
        canvasW: '',
        docWidth:'',
        docHeight:'',
        horseObject1:{},
        scaleindex :1,
        ele:null
      }
    },
    methods: {
      scalePic: function(param, is_endScale){
      
      let nodeStyle = this.ele.style.transform;
      let changeSize = nodeStyle ?  parseFloat(nodeStyle.slice(nodeStyle.indexOf('scale')+6)) : 0;
      if(is_endScale){
        // 缩放图片结束，要重新计算定位
        this.setMaxdisp(changeSize,parseInt(this.ele.style.marginLeft), parseInt(this.ele.style.marginTop), 'scale')
        return 
      }
      console.log('changeSize',changeSize)
      if(nodeStyle){
        // 如果存在的话，就说明已经设置了，scale已经改变了
        let currScaleSize = changeSize + param; 
        currScaleSize > 3 ? currScaleSize = 3 : null
        currScaleSize < 1 ? currScaleSize = 1 : null
        this.ele.style.transform = 'translate(-50%, -50%) scale('+currScaleSize+','+currScaleSize+')';
      }else{ // 如果不存在，就说明是第一次设置
          let scale = param + 1 
          this.ele.style.marginLeft =  '0px';
          this.ele.style.marginTop  = '0px';
          this.ele.style.transform = 'translate(-50%, -50%) scale('+scale+','+scale+')';
      }
    },
    setMaxdisp:function(changeSize, changeX, changeY, type){
      // 计算最大位移
      // naturalWidth ： 是图片原始的宽度，通过比例可以计算出当前图片在页面的高度
      let picHeight =  this.bodyWidth  / (this.ele.naturalWidth / this.ele.naturalHeight); 
      let maxTop = ( picHeight * changeSize - window.innerHeight) /2 
      let maxLeft = this.bodyWidth / 2 * (changeSize - 1) 
      if(changeX >= maxLeft){
        this.ele.style.marginLeft = maxLeft + 'px'
      }else if(changeX < -maxLeft){
        this.ele.style.marginLeft = -maxLeft + 'px'
      }else if(type==='move'){
        this.ele.style.marginLeft =changeX +'px'; 
      }
      // 如果图片当前尺寸大于屏幕尺寸，可以移动
      if(maxTop > 0){
        if(changeY >= maxTop){
          this.ele.style.marginTop = maxTop + 'px';
        }else if(changeY < -maxTop){
          this.ele.style.marginTop = -maxTop + 'px'
        }else if(type==='move'){
          this.ele.style.marginTop = changeY+'px';
        }
      }else if(type==='move'){
        this.ele.style.marginTop = 0 +'px'; 
      }
    },
    movePic: function(param){
     if(param.is_endMove){ // 每次移动松开手指的时候要下次移动的基础坐标
        this.baseLeft = parseInt(this.ele.style.marginLeft.slice(0, -2));
        this.baseTop = parseInt(this.ele.style.marginTop.slice(0, -2));
      }else{
        let nodeStyle = this.ele.style.transform 
        if(nodeStyle){ // 有这个就表示应该是移动
          let currScaleSize = parseFloat(nodeStyle.slice(nodeStyle.indexOf('scale')+6))
          this.setMaxdisp(currScaleSize,this.baseLeft+ param.x, this.baseTop + param.y, 'move')
        }
      }
    },
      tt(e){
console.log(e)
      },
      setScaleBtn(type){
        console.log('////')
        this.scalePic(0.5,false)
        // if(type == 'add'){
        //   this.scaleindex++
        //   if(this.scaleindex>10){this.scaleindex=10}
        // }else{
        //   this.scaleindex--
        //   if(this.scaleindex<=0){this.scaleindex=1}
        // }
        // console.log(this.boxscale,this.scaleindex)
        // this.zoomObj.preSetScale(this.boxscale * (1+this.scaleindex * 0.1),0,0)
        // this.zoomObj.setTransform(true)
      },
      showCanvas(index) {},
      setRemUnit() {
        const u_agent = navigator.userAgent
        if (window.orientation === 0 || window.orientation === 180) {
          //竖屏
          console.log('竖屏', this.bodytWidth)
          this.orienta = 1
        } else if (window.orientation === 90 || window.orientation === -90) {
          //横屏
          console.log('横屏', this.bodytWidth)
          this.orienta = 2
        }
        // var that = this
        var selffun = () => {
          this.bodyHeight = window.innerHeight
          this.bodytWidth = window.innerWidth
          console.log(u_agent, this.bodyHeight, this.bodytWidth)
          if (this.bodytWidth > this.bodyHeight) {
            this.boxscale = this.bodyHeight / 1396
            this.o = this.bodyHeight
            var offest = (this.bodytWidth / this.bodyHeight)
            console.log(document.body.clientHeight, this.bodyHeight, this.boxscale,offest,'///')
            if (offest < 1.49 && offest > 1) {
              this.boxscale = this.bodytWidth / 2048
              this.o = 1396 * this.boxscale
            }
          } else {
            this.boxscale = this.bodytWidth / 2048
            this.o = this.bodytWidth
            console.log(o)
          }
          this.docWidth = 2048 * this.boxscale
          this.docHeight = 1396 * this.boxscale
          this.canvasW = Math.ceil(1430 * this.boxscale)
          this.canvasH = Math.ceil(1315 * this.boxscale)
          var s = 10
          // if(o<800){ s =13}
          if (/Android/.test(u_agent)) {
            this.dpr = 2
          }
          if (this.dpr >= 2) {
            this.dpr = 2
          }
          if (this.dpr >= 2) {
            this.rem = (this.o / this.dpr) / 7.5
            if (this.orienta == 2) {
              this.rem = (this.o / this.dpr) / 5.2
            }
          } else if (this.dpr == 1) {
            this.rem = this.o / s
          }
          // console.log(this.boxscale, o, this.dpr, canvasW, canvasH, this.rem)
          // docEl.style.fontSize = (this.rem) + 'px'
          document.documentElement.style.fontSize = (this.rem) + 'px'
          // var can = document.querySelectorAll('canvas')
          // for (var i = 0; i < can.length; i++) {
          //   $(can[i]).css({
          //     'zoom': this.boxscale
          //   })
          // }
        }
        // if ("onorientationchange" in window) {
        //   setTimeout(() => {
        //     selffun()
        //   }, 100);
        // } else {
        //   selffun()
        // }
        selffun()
      },
      initCanvas() {
        // for (let i = 0; i < this.imgList.length; i++) {
        //   const e = this.imgList[i];
        //   let c = new ConvertImage(e)
        //   console.log(c)
        //   this.data.push(c)
        //   // this.$refs['can1'] = c
        //   // document.getElementById('can1').append(c)
        // }
      },
      showCityAni(canvasStatic, bool) {
        if (!bool) {
          clearInterval(canvasStatic.timeout)
          canvasStatic.style.visibility = "hidden";
          canvasStatic.ani = false
          return
        }
        if (canvasStatic.ani == true) {
          return
        }
        let show = false
        let times = 4
        canvasStatic.timeout = setInterval(() => {
          if (times == 0) {
            clearInterval(canvasStatic.timeout)
            return;
          }
          canvasStatic.style.visibility = show ? 'visible' : 'hidden';
          show = !show
          times -= 1
        }, 260);
        canvasStatic.ani = true
      },
      createMap() {
        var divTag = document.createElement('div');
        var canvasBackground = document.createElement('canvas');
        var canvasTop = document.createElement('canvas');
        var canvasStatic1 = document.createElement('canvas');
        var canvasStatic2 = document.createElement('canvas');
        var canvasStatic3 = document.createElement('canvas');
        var canvasStatic4 = document.createElement('canvas');
        var canvasStatic5 = document.createElement('canvas');
        var canvasStatic6 = document.createElement('canvas');
        var canvasAnimRedPath = document.createElement('canvas');
        var canvasAnimGreenPath = document.createElement('canvas');
        var canvasAnimBluePath = document.createElement('canvas');
        var canvasAnimHorse = document.createElement('canvas');
        var canvasAnimHorse2 = document.createElement('canvas');
        var contextBackground = canvasBackground.getContext('2d');
        var contextTop = canvasTop.getContext('2d');
        var contextStatic1 = canvasStatic1.getContext('2d');
        var contextStatic2 = canvasStatic2.getContext('2d');
        var contextStatic3 = canvasStatic3.getContext('2d');
        var contextStatic4 = canvasStatic4.getContext('2d');
        var contextStatic5 = canvasStatic5.getContext('2d');
        var contextStatic6 = canvasStatic6.getContext('2d');
        var contextAnimRedPath = canvasAnimRedPath.getContext('2d');
        var contextAnimGreenPath = canvasAnimGreenPath.getContext('2d');
        var contextAnimBluePath = canvasAnimBluePath.getContext('2d');
        var contextAnimHorse = canvasAnimHorse.getContext('2d');
        var contextAnimHorse2 = canvasAnimHorse2.getContext('2d');
        var canvasStatic8 = document.createElement('canvas');
        var canvasStatic9 = document.createElement('canvas');
        var contextStatic8 = canvasStatic8.getContext('2d');
        var contextStatic9 = canvasStatic9.getContext('2d');
        /* 音频 */
        var m01 = document.createElement('audio')
        var m02 = document.createElement('audio')
        var m03 = document.createElement('audio')
        var waveSound = document.createElement('audio')
        var winSound = document.createElement('audio')
        m01.src = 'img/vo/Map002-1.mp3'
        m02.src = 'img/vo/Map002-2.mp3'
        m03.src = 'img/vo/Map002-3.mp3'
        waveSound.src = 'img/vo/wave.mp3'
        winSound.src = 'img/vo/win.mp3'
        waveSound.loop = 'loop'
        waveSound.volume = 0.4
        // Variable init
        divTag.appendChild(canvasBackground);
        divTag.appendChild(canvasTop);
        divTag.appendChild(canvasStatic1);
        divTag.appendChild(canvasStatic2);
        divTag.appendChild(canvasStatic3);
        divTag.appendChild(canvasStatic4);
        divTag.appendChild(canvasStatic5);
        divTag.appendChild(canvasStatic6);
        divTag.appendChild(canvasStatic8);
        divTag.appendChild(canvasStatic9);
        divTag.appendChild(canvasAnimRedPath);
        divTag.appendChild(canvasAnimGreenPath);
        divTag.appendChild(canvasAnimBluePath);
        divTag.appendChild(canvasAnimHorse);
        divTag.appendChild(canvasAnimHorse2);
        divTag.id = "canvasInnerDiv";
        canvasBackground.id = "myCanvasBackground";
        canvasTop.id = "myCanvasTop";
        canvasStatic1.id = "myCanvasStatic1";
        canvasStatic2.id = "myCanvasStatic2";
        canvasStatic3.id = "myCanvasStatic3";
        canvasStatic4.id = "myCanvasStatic4";
        canvasStatic5.id = "myCanvasStatic5";
        canvasStatic6.id = "myCanvasStatic6";
        canvasStatic8.id = "myCanvasStatic8";
        canvasStatic9.id = "myCanvasStatic9";
        canvasAnimRedPath.id = "myCanvasAnimRedPath";
        canvasAnimGreenPath.id = "myCanvasAnimGreenPath";
        canvasAnimBluePath.id = "myCanvasAnimBluePath";
        canvasAnimHorse.id = "myCanvasAnimHorse";
        canvasAnimHorse2.id = "myCanvasAnimHorse2";
        canvasBackground.style.position = "absolute";
        canvasTop.style.position = "absolute";
        canvasStatic1.style.position = "absolute";
        canvasStatic2.style.position = "absolute";
        canvasStatic3.style.position = "absolute";
        canvasStatic4.style.position = "absolute";
        canvasStatic5.style.position = "absolute";
        canvasStatic6.style.position = canvasStatic8.style.position = canvasStatic9.style.position = "absolute";
        canvasAnimRedPath.style.position = "absolute";
        canvasAnimGreenPath.style.position = "absolute";
        canvasAnimBluePath.style.position = "absolute";
        canvasAnimHorse.style.position = canvasAnimHorse2.style.position = "absolute";
        canvasBackground.style.zIndex = "0";
        canvasTop.style.zIndex = "2";
        canvasStatic1.style.zIndex = "3";
        canvasStatic2.style.zIndex = "3";
        canvasStatic3.style.zIndex = "3";
        canvasStatic4.style.zIndex = "2";
        canvasStatic5.style.zIndex = "2";
        canvasStatic6.style.zIndex = canvasStatic8.style.zIndex = canvasStatic9.style.zIndex = "2";
        canvasAnimRedPath.style.zIndex = "6";
        canvasAnimGreenPath.style.zIndex = "6";
        canvasAnimBluePath.style.zIndex = "2";
        canvasAnimHorse.style.zIndex = canvasAnimHorse2.style.zIndex = "6";
        canvasBackground.width = 0;
        canvasBackground.height = 0;
        canvasAnimRedPath.width = this.baseWidth;
        canvasAnimRedPath.height = this.baseHeight;
        canvasAnimGreenPath.width = this.baseWidth;
        canvasAnimGreenPath.height = this.baseHeight;
        canvasAnimBluePath.width = this.baseWidth;
        canvasAnimBluePath.height = this.baseHeight;
        canvasAnimHorse.width = canvasAnimHorse2.width = divTag.width=this.baseWidth;
        canvasAnimHorse.height = canvasAnimHorse2.height =divTag.height= this.baseHeight;
        var imageMap = new Image();
        var imageborder = new Image();
        var imageMapDetail = new Image();
        var imageCapital = new Image();
        var imageGate = new Image();
        var imageMainCity = new Image();
        var imageHorse = new Image();
        imageMap.src = "/static/img/map.png";
        imageborder.src = "/static/img/border.png";
        imageMapDetail.src = "/static/img/mapDetail.png";
        imageCapital.src = "/static/img/capital.png";
        imageGate.src = "/static/img/grainstore.png";
        imageHorse.src = "/static/img/rices.png";
        imageMapDetail.onload = () => {
          canvasTop.width = this.baseWidth;
          canvasTop.height = this.baseHeight;
          contextTop.drawImage(imageMapDetail, 0, 0, this.baseWidth, this.baseHeight);
        }
        imageMap.onload = () => {
          canvasBackground.width = this.baseWidth;
          canvasBackground.height = this.baseHeight;
          contextBackground.drawImage(imageMap, 0, 0, this.baseWidth, this.baseHeight);
        }
        imageCapital.onload = () => {
          canvasStatic1.width = this.baseWidth;
          canvasStatic1.height = this.baseHeight;
          contextStatic1.drawImage(imageCapital, 0, 0, this.baseWidth, this.baseHeight);
        }
        imageGate.onload = () => {
          canvasStatic2.width = this.baseWidth;
          canvasStatic2.height = this.baseHeight;
          contextStatic2.drawImage(imageGate, 0, 0, this.baseWidth, this.baseHeight);
        }
        imageHorse.onload = () => {
          var translate = [
            [700, 754],
            [790, 205]
            // [-1040, 830],
          ];
          var scale = [1, 1];
          var dur = [25, 7];
          var sharpPoint = [0, 2]
          this.horseObject1 = this.initHorseObject(translate, scale, dur, sharpPoint,imageHorse);
          console.log(this.horseObject1)
        }
        document.getElementById('map_container').append(divTag)
        this.$nextTick(()=>{
          this.zoomObj = new zoom(document.getElementById('canvasInnerDiv'), {
            width: this.canvasW,
            height: this.canvasH,
            top:0,
            left:0,
          })
          this.zoomObj.setScale(this.boxscale)
          this.zoomObj.setTransform(false,0,0)
          
        })
        // console.log(divTag)
      },
      initHorseObject(translate, scale, dur, sharpPoint,imageHorse) {
        var object = {
          'source': imageHorse,
          'totalFrame': 2,
          'currFrame': 0,
          'width': 180,
          'height': 160,
          'point': sharpPoint,
          'position': {
            'points': translate,
            'scales': scale,
            'currPoint': 0,
            'totalPoint': translate.length,
            'dur': dur,
            'currDur': 1
          },
          'division': 1,
          'animating': false,
          'animated': false,
          'timeout': null
        };
        return object;
      }
    }
  };
</script>

<style>
  #app {}
</style>
