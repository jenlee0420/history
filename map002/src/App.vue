<template>
  <div id="app">
    <div class="pos_a" style="font-size:0.5rem" id="debug">{{debug}}</div>
    <div v-if="load" id="loading" style="width:820px;"><img src="static/img/loading.gif"></div>
    <div id="main_container" :style="{'width':docWidth+'px','height':docHeight+'px','display':load?'none':'block'}">
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>開皇年間官倉分佈圖 (581-600 年)</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="noVoice=!noVoice"> </div>
      </div>
      <div class="main_box" id="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{'width':canvasW+'px','height':canvasH+'px'}">
          <div  id="canvasInnerDiv" ref="canvasInnerDiv">
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{'clicked':item.show}" v-for="(item,index) in list" :key="index" @click="showCanvas(index)">
              <span>
                              <img :src="item.ico" class="icon fix_height">{{item.text}}</span>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">全部顯示</div>
              <div class="blueButton action_all " @click="showall(false)">全部隱藏</div>
            </div>
          </div>
          
            
            <!-- 滑块 -->
            <!-- <bar1 min="0" max="100" step="10" v-model="slider2"/> -->
            <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />
            
          <!-- </div> -->
        </div>
      </div>
    </div>
    <modal class="" headTitle="问题" :hideFooter="true" v-if="popWindow" @cancel-event="popWindow=false;list[4].show=false">
      <div slot="modalCont"  class="question">
        
          <div>1. 根據地圖，官倉大多鄰近大興，哪一個官倉離都城較遠？</div>
          <div>
            <span class="item" :class="{'selected':currAns==index}" v-for="(item,index) in questionItem" :key="index" @click="checkans(index)">{{item}}</span>
          </div>
          <div class="ansBox" :class="showWrong==false?'wrongico':'rightico'" v-if="currAns!=null"></div>
        </div>
    </modal>
    <modal class=""  headTitle="大興（今西安市）" :hideFooter="true" v-if="mapPop" @cancel-event="mapPop=false;list[3].show=false">
      <div slot="modalCont">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d845158.7150065893!2d108.8816973!3d34.161658!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x366379e922ac17b9%3A0x85d466fda794582e!2z5Lit5ZyL6Zmd6KW_55yB6KW_5a6J5biC!5e0!3m2!1szh-TW!2shk!4v1572421815894!5m2!1szh-TW!2shk"
          :width="bodytWidth/1.8" :height="bodyHeight/1.8" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
  import zoom from './js/zoom.js'
  import modal from "./components/modal";
  import bar from "./components/bar";
  import bar1 from "./components/bar1";
  export default {
    components: {
      modal,
      bar,
      bar1,
    },
    name: "App",
    beforeCreate(){

    },
    created () {
    },
    mounted() {
      this.createMap()
      if("onorientationchange" in window){
        window.addEventListener("orientationchange",this.oriChange,false)
      }else{
        window.addEventListener("resize",this.setRemUnit,false)
      }
      // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
      this.zoomObj = require('./js/zoom.js')
      this.setRemUnit()
      this.initCanvas()
      
      document.getElementById('main_box').addEventListener("touchmove", this.bodyScroll, {
            passive: false //  禁止 passive 效果
        })

    },
    data() {
      return {
        slider2: "0",
        load:true,
        noVoice:false,
        zoomObj: null,
        questionItem: [
          'A. 黎陽倉',
          'B. 廣通倉',
          'C. 河陽倉',
        ],
        rightans: 0,
        showWrong: 0,
        currAns: null,
        data: [],
        mapPop: false,
        imgList: ['static/img/map.png', 'static/img/mapDetail.png'],
        list: [{
          ico: 'static/img/icon/shoudu.png',
          text: '首都',
          show: false
        }, {
          ico: 'static/img/icon/guancang.png',
          text: '官倉',
          show: false
        }, {
          ico: 'static/img/icon/jiangjiexian.png',
          text: '疆界',
          show: false
        }, {
          ico: 'static/img/icon/shoudu.png',
          text: '大興（今西安市）',
          type: 'map',
          show: false
        }, {
          ico: 'static/img/icon/question.png',
          text: '問題',
          type: 'question',
          show: false
        }],
        bodytWidth: '',
        bodyHeight: '',
        baseWidth: '1430',
        baseHeight: '1315',
        orienta: '',
        boxscale: 1,
        o: '',
        dpr: 1,
        rem: '',
        canvasH: '',
        canvasW: '',
        docWidth: '',
        docHeight: '',
        horseObject1: {},
        scaleindex: 0,
        ele: null,
        popWindow: false,
        canvasData: ['myCanvasStatic1', 'myCanvasStatic2', 'myCanvasStatic3'],
        m01: null,
        m02: null,
        m03: null,
        horsetimerGroup: null,
        drawHorsesTimeout: null,
        redTimer: null,
        shipPlay: false,
        titleH:70,
        canvasAnimHorse:null,
        prevorienta:'',
        scaleZoom:0,
        imgCount:0,
        debug:''
      }
    },
    watch:{
      imgCount(n){
        if(this.imgCount>=5){
          this.load = false
        }
      },
      zoomObj:{
        handler(n, o) {
        
          this.scaleindex =(((n.scale- n.minScale) / (n.maxScale - n.minScale)) * 10 )
          // this.debug = n.lastSapce+"---"+n.minScale+'--'+n.scale
        },
        deep: true
      }
    },
    methods: {
      bodyScroll(event) {
        event.preventDefault();
      },
      
      setScale(scaleindex){
        this.zoomObj.preSetScale(scaleindex/10*(this.zoomObj.maxScale-this.zoomObj.minScale) + this.zoomObj.minScale, 0, 0)
        this.zoomObj.setTransform(false)
      },
      muteMe() {
        this.m01.pause()
        this.m02.pause()
        this.m03.pause()
      },
      showCanvas(index) {
        let c = document.getElementById(this.canvasData[index])
        let swip = !this.list[index].show
        // console.log(swip)
        this.muteMe()
        switch (index) {
          case 0:
            if (swip && !this.noVoice) {
              this.m01.currentTime = 0
              this.m01.play()
            }
            this.showCityAni(c, swip)
            break;
          case 1:
            if (swip && !this.noVoice) {
              this.m02.currentTime = 0
              this.m02.play()
            }
            this.showCityAni(c, swip)
            break;
          case 2:
            if (swip) {
              if(!this.noVoice){
                this.m03.currentTime = 0
              this.m03.play()}
              console.log('ani start')
              
              this.ship1(true)
              c.style.visibility = 'visible'
            } else {
              console.log('ani false')
              this.ship1(false)
              c.style.visibility = 'hidden'
            }
            break;
          case 3:
            this.mapPop = swip
            break;
          case 4:
            this.currAns=null
            this.popWindow = swip
            break;
          default:
            break;
        }
        this.list[index].show = swip
      },
      oriChange(){

        setTimeout(() => {
        this.setRemUnit()
        },100)
      },
      setRemUnit() {
        const u_agent = navigator.userAgent
        if (window.orientation === 0 || window.orientation === 180) {
          //竖屏
          this.orienta = 1
        } else if (window.orientation === 90 || window.orientation === -90) {
          //横屏
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
            if (offest < 1.49 && offest > 1) {
              this.boxscale = this.bodytWidth / 2048
              this.o = 1396 * this.boxscale
            }
          } else {
            this.boxscale = this.bodytWidth / 2048
            this.o = this.bodytWidth

          }
          this.docWidth = 2048 * this.boxscale
          this.docHeight = 1396 * this.boxscale
          this.canvasW = Math.ceil(1430 * this.boxscale)
          this.canvasH = Math.ceil(1315 * this.boxscale)
          this.titleH = this.docHeight  - this.canvasH
          var s = 10
          this.dpr = window.devicePixelRatio || 1
          // if(o<800){ s =13}
          if (/Android/.test(u_agent)) {
            this.dpr = 2
          }
          if (this.dpr >= 2) {
            this.dpr = 2
            
            if (this.orienta == 2) {
              this.rem = (this.o / this.dpr) / 5.2
            }else{
              this.rem = (this.o / this.dpr) / 7.5
            }
          } else  {
            this.rem = this.o / s /this.dpr
          }
          console.log(this.boxscale, this.o, this.dpr,this.rem)
          document.documentElement.style.fontSize = (this.rem) + 'px'
        }

        selffun()
        this.setZoom()
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
        let times = 6
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
      drawHousePromise() {
        if (this.horseObject1.animated == true) {
          return
        }
        this.canvasAnimHorse = document.getElementById('myCanvasAnimHorse')
        let contextAnimHorse = this.canvasAnimHorse.getContext('2d');
        this.canvasAnimHorse.style.visibility = 'visible'
        var imageHorse = new Image();
        imageHorse.src = "static/img/rices.png";
        contextAnimHorse.drawImage(imageHorse, this.horseObject1.position.points[0][0], this.horseObject1.position.points[0][1], this.horseObject1.width * 0.55, this.horseObject1.height * 0.55);
        // this.showCityAni(canvasAnimHorse, true)
        this.horsetimerGroup = setTimeout(() => {
            this.drawHorse(this.horseObject1, false, false, contextAnimHorse, imageHorse)
        }, 500)
      },
      drawHorse(object, isInvert, endfun, contextS, imageHorse) {
        if (object.position.currPoint + 1 < object.position.totalPoint) {
          contextS.save();
          if (isInvert) {
            contextS.scale(-1, 1);
          }
          var position = new Array();
          var scale;
          if (object.position.scales[object.position.currPoint] != object.position.scales[object.position.currPoint + 1]) {
            if (object.position.scales[object.position.currPoint] > object.position.scales[object.position.currPoint + 1]) {
              scale = object.position.scales[object.position.currPoint] * (object.position.dur[object.position.currPoint] - object.position.currDur) / object.position.dur[object.position.currPoint];
            } else {
              scale = object.position.scales[object.position.currPoint + 1] * (object.position.currDur) / object.position.dur[object.position.currPoint];
            }
            if (scale < 0) {
              scale = 0;
            }
          } else {
            scale = 1;
          }
          position[0] = (object.position.points[object.position.currPoint][0] * (object.position.dur[object.position.currPoint] - object.position.currDur) + object.position.points[object.position.currPoint + 1][0] * object.position.currDur) / object.position.dur[object.position.currPoint];
          position[1] = (object.position.points[object.position.currPoint][1] * (object.position.dur[object.position.currPoint] - object.position.currDur) + object.position.points[object.position.currPoint + 1][1] * object.position.currDur) / object.position.dur[object.position.currPoint];
          contextS.drawImage(imageHorse, position[0], position[1], object.width * scale * 0.55, object.height * scale * 0.55);
          contextS.restore();
          // Anim Position control
          if (object.position.currDur <= object.position.dur[object.position.currPoint]) {
            object.position.currDur++;
          } else {
            object.position.currDur = 1;
            object.position.currPoint++;
          }
          console.log('//')
          // resolve()
          // return "ok";
        } else {
          object.animating = false;
          object.animated = true;
          clearTimeout(this.drawHorsesTimeout)
        }
        this.drawHorsesTimeout = setTimeout(() => {
          this.canvasClear(this.canvasAnimHorse);
          this.drawHorse(object, false, false, contextS, imageHorse)
        }, 60);
        // })
      },
      ship1(flag) {
        let canvasAnimRedPath = document.getElementById('myCanvasAnimRedPath')
        let contextAnimRedPath = canvasAnimRedPath.getContext('2d');
        var img = new Image()
        let h = 50,
          y = 834,
          xx = 680,
          ww = 220
        var addRadial = () => {
          contextAnimRedPath.save(); //保存当前绘图状态
          contextAnimRedPath.beginPath(); //开始创建路径
          y -= 15
          h += 15
          contextAnimRedPath.rect(xx, y, ww, h)
          contextAnimRedPath.closePath(); //关闭路径
          contextAnimRedPath.clip();
          contextAnimRedPath.drawImage(img, 0, 0, this.baseWidth, this.baseHeight);
          contextAnimRedPath.rect(0, 0, this.baseWidth, this.baseHeight)
          contextAnimRedPath.restore();
          if (h < 987) {
            this.redTimer = setTimeout(() => {
              addRadial()
            }, 50);
          } else {
            clearTimeout(this.redTimer)
          }
        }
        if (flag == true) {
          img.src = 'static/img/route.png'
          img.onload = () => {
            canvasAnimRedPath.style.visibility = "visible";
            // console.log('anistart')
            if (!this.shipPlay) {
              addRadial()
              this.drawHousePromise()
              this.shipPlay = true
            }
            // redTimer = setInterval(() => {
            //     addRadial()
            //     if (h >= 1000) {
            //         clearInterval(redTimer)
            //     }
            //     y -= 10
            //     h += 10
            // }, 50);
          }
          // drawHousePromise()
          // drawHorsesTimeout = setTimeout(function () { ship1(flag); }, 1 / 30 * 1000);
        } else {
          this.shipPlay = false
          this.resetHorseObject(this.horseObject1);
          clearInterval(this.drawHorsesTimeout)
          clearTimeout(this.horsetimerGroup)
          clearTimeout(this.redTimer)
          document.getElementById('myCanvasAnimRedPath').style.visibility = 'hidden'
          this.canvasClear(document.getElementById('myCanvasAnimRedPath'));
          document.getElementById('myCanvasAnimHorse').style.visibility = 'hidden'
          this.canvasClear(document.getElementById('myCanvasAnimHorse'));
        }
      },
      showall(type) {
        this.canvasData.forEach((e, index) => {
          if (type) {
            this.list[index].show = false
          } else {
            this.list[index].show = true
          }
          this.showCanvas(index)
        });
        this.muteMe()
      },
      resetHorseObject(object) {
        object.currFrame = 0;
        object.position.currPoint = 0;
        object.position.currDur = 1;
        object.animating = false;
        object.animated = false;
      },
      createMap() {
        var divTag = this.$refs.canvasInnerDiv
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
        this.m01 = document.createElement('audio')
        this.m02 = document.createElement('audio')
        this.m03 = document.createElement('audio')
        this.m01.src = 'static/img/vo/Map002-1.mp3'
        this.m02.src = 'static/img/vo/Map002-2.mp3'
        this.m03.src = 'static/img/vo/Map002-3.mp3'
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
        canvasAnimHorse.width = canvasAnimHorse2.width = divTag.width = this.baseWidth;
        canvasAnimHorse.height = canvasAnimHorse2.height = divTag.height = this.baseHeight;
        var imageMap = new Image();
        var imageborder = new Image();
        var imageMapDetail = new Image();
        var imageCapital = new Image();
        var imageGate = new Image();
        var imageMainCity = new Image();
        var imageHorse = new Image();
        imageMap.src = "static/img/map.png";
        imageborder.src = "static/img/border.png";
        imageMapDetail.src = "static/img/mapDetail.png";
        imageCapital.src = "static/img/capital.png";
        imageGate.src = "static/img/grainstore.png";
        imageHorse.src = "static/img/rices.png";
        imageMapDetail.onload = () => {
          canvasTop.width = this.baseWidth;
          canvasTop.height = this.baseHeight;
          contextTop.drawImage(imageMapDetail, 0, 0, this.baseWidth, this.baseHeight);
          this.imgCount++
          
        }
        imageMap.onload = () => {
          canvasBackground.width = this.baseWidth;
          canvasBackground.height = this.baseHeight;
          contextBackground.drawImage(imageMap, 0, 0, this.baseWidth, this.baseHeight);
          this.imgCount++
          
        }
        imageCapital.onload = () => {
          canvasStatic1.width = this.baseWidth;
          canvasStatic1.height = this.baseHeight;
          contextStatic1.drawImage(imageCapital, 0, 0, this.baseWidth, this.baseHeight);
          canvasStatic1.style.visibility = 'hidden'
          this.imgCount++
        }
        imageGate.onload = () => {
          canvasStatic2.width = this.baseWidth;
          canvasStatic2.height = this.baseHeight;
          contextStatic2.drawImage(imageGate, 0, 0, this.baseWidth, this.baseHeight);
          canvasStatic2.style.visibility = 'hidden'
          this.imgCount++
        }
        imageborder.onload = () => {
          canvasStatic3.width = this.baseWidth;
          canvasStatic3.height = this.baseHeight;
          contextStatic3.drawImage(imageborder, 0, 0, this.baseWidth, this.baseHeight);
          canvasStatic3.style.visibility = 'hidden'
          this.imgCount++
        }
        imageHorse.onload = () => {
          this.imgCount++
          var translate = [
            [660, 754],
            [700, 455],
            [790, 185]
            // [-1040, 830],
          ];
          var scale = [1, 1, 0];
          var dur = [15, 15, 7];
          var sharpPoint = [0, 0, 2]
          this.horseObject1 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);
        }
        // document.getElementById('map_container').appendChild(divTag)
        this.$nextTick(() => {
          this.setZoom()
        })
        // console.log(divTag)
      },
      setZoom(){
        if(!document.getElementById('canvasInnerDiv')){
          return
        }
        this.zoomObj = new zoom(document.getElementById('canvasInnerDiv'), {
          width: this.baseWidth,
          height: this.baseHeight,
          top: 0,
          left: 0,
          minScale:this.boxscale,
          warpWidth :this.boxscale *this.baseWidth ,
          warpHeight:this.boxscale*this.baseHeight
        })
        this.zoomObj.setScale(this.boxscale)
          // this.zoomObj.setTransform(false,0,0)
      },
      initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
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
      },
      canvasClear(canvas) {
        var context = canvas.getContext('2d');
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
      },
      checkans(index) {
        this.currAns = index
        if (this.rightans == index) {
          this.showWrong = true
        } else {
          this.showWrong = false
        }
      },
      // offestx(x) {
      //   console.log(x, 'xx////')
      //   this.zoomObj.preSetScale(this.boxscale * (1 + x),0,0)
      //   this.zoomObj.setTransform(false)
        
      // },
      moveOut(x){
        this.scaleindex = Math.ceil(x*10)
      }
    }
  };
</script>
<style lang="less">
#app{
      font-family: Verdana, Arial, sans-serif
}
</style>
