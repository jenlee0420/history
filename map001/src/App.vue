<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;"><img :src="require('../static/img/loading.gif')"></div>
    <div  id="main_container" :style="{'width':docWidth+'px','height':docHeight+'px','display':load?'none':'block'}">
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>隋滅陳路線圖 (588-589 年)</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="noVoice=!noVoice"> </div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{'width':canvasW+'px','height':canvasH+'px'}">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <div class="detail_div pos_a"></div>
            <div class="chen_div pos_a" v-if="borderAni"></div>
            <div class="border_div pos_a" v-if="borderAni"></div>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{'clicked':item.show}" v-for="(item,index) in list" :key="index" @click="showCanvas(index)">
              <div class="iconItem">
                 <span class="icon"><img :src="item.ico"></span>
                 <span>{{item.text}}</span>
                 </div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">全部顯示</div>
              <div class="blueButton action_all " @click="showall(false)">全部隱藏</div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />

        </div>
      </div>
    </div>
    <modal class="" headTitle="问题" :hideFooter="true" v-if="popWindow" @cancel-event="popWindow=false;list[6].show=false">
      <div slot="modalCont">
        <div>
          <div class="question">
          <div>1. 隋軍要突破陳的防線，必先要突破哪一河流的天險？</div>
          <div>
            <span class="item" :class="{'selected':currAns==index}" v-for="(item,index) in questionItem" :key="index" @click="checkans(index)">{{item}}</span>
          </div>
          <div class="ansBox" :class="showWrong==false?'wrongico':'rightico'" v-if="currAns!=null"></div>
        </div>
        <div class="question">
          <div>2. 以下哪一個要邑並不是隋軍渡過長江後的攻擊目標？</div>
          <div>
            <span class="item" :class="{'selected':currAns2==index}" v-for="(item,index) in questionItem2" :key="index" @click="checkans2(index)">{{item}}</span>
          </div>
          <div class="ansBox" :class="showWrong2==false?'wrongico':'rightico'" v-if="currAns2!=null"></div>
        </div>
        </div>
        
      </div>
    </modal>
    <modal class=""  headTitle="建康（今南京市）" :hideFooter="true" v-if="mapPop" @cancel-event="mapPop=false;list[5].show=false">
      <div slot="modalCont">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1738801.539539802!2d119.2476953!3d31.6585725!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b58c9b668dcd83%3A0x8ffbb60b79df1b06!2z5Lit5ZyL5rGf6JiH55yB5Y2X5Lqs5biC!5e0!3m2!1szh-TW!2shk!4v1572421682457!5m2!1szh-TW!2shk"
          :width="bodytWidth/1.8" :height="bodyHeight/1.8" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
  import zoom from './js/zoom.js'
  import modal from "./components/modal";
  import bar from "./components/bar";
  export default {
    components: {
      modal,
      bar
    },
    name: "App",
    beforeCreate() {},
    created () {
    const that = this
    that.timer = setInterval(function () {
        console.log(document.readyState)
        if (document.readyState === 'complete') {
            that.load = false;
            window.clearInterval(that.timer)
        }
    }, 10)
    },
    mounted() {
      this.createMap()
      if ("onorientationchange" in window) {
        window.addEventListener("orientationchange", this.oriChange, false)
      } else {
        window.addEventListener("resize", this.setRemUnit, false)
      }
      // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
      this.zoomObj = require('./js/zoom.js')
      this.setRemUnit()
      this.initCanvas()
      
      document.getElementById('map_container').addEventListener("touchmove", this.bodyScroll, {
        passive: false //  禁止 passive 效果
      })
    },
    data() {
      return {
        load: true,
        noVoice: false,
        zoomObj: null,
        questionItem: [
          'A. 漢水',
          'B. 長江',
          'C. 淮河',
        ],
        rightans: 1,
        showWrong: 0,
        currAns: null,
        questionItem2: [
          'A. 襄陽',
          'B. 江夏',
          'C. 會稽',
        ],
        rightans2:0,
        showWrong2: 0,
        currAns2: null,
        data: [],
        mapPop: false,
        list: [{
          ico: require('../static/img/icon/capital_icon.png'),
          text: '首都',
          show: false
        }, {
          ico: require('../static/img/icon/city_icon.png'),
          text: '陳朝都城',
          show: false
        }, {
          ico: require('../static/img/icon/main_city.png'),
          text: '要邑',
          show: false
        }, {
          ico: require('../static/img/icon/route_icon.png'),
          text: '隋軍進攻路線',
          show: false
        }, {
          ico: require('../static/img/icon/border_icon.png'),
          text: '南北朝疆界',
          show: false
        }, {
          ico: require('../static/img/icon/capital_icon.png'),
          text: '建康（今南京市）',
          type: 'map',
          show: false
        }, {
          ico: require('../static/img/icon/question_icon.png'),
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
        horseObject2: {},
        horseObject3: {},
        horseObject4: {},
        horseObject5: {},
        scaleindex: 0,
        ele: null,
        popWindow: false,
        canvasData: ['myCanvasStatic1', 'myCanvasStatic2', 'myCanvasStatic4', 'myCanvasStatic5',false],
        m01: null,
        m02: null,
        m03: null,
        m04: null,
        license: null,
        horsetimerGroup: null,
        drawHorsesTimeout: null,
        drawHorsesTimeout2: null,
        redTimer: null,
        shipPlay: false,
        titleH: 70,
        canvasAnimHorse: null,
        prevorienta: '',
        borderAni: true,
        pathObject: {},
        chenTimer:null,
        lin2timer:null,
        scaleZoom:0,
        debug:''
      }
    },
    watch:{
      zoomObj:{
        handler(n, o) {
          this.scaleindex =(((n.scale- n.minScale) / (n.maxScale - n.minScale)) * 10 )
          this.debug = n.scale+"---"+n.maxScale+'--'+this.scaleindex
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
        this.m04.pause()
        this.license.pause()
      },
      showCanvas(index) {
        let c = document.getElementById(this.canvasData[index])
        let swip = !this.list[index].show
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
            c.style.visibility = swip ? 'visible' : 'hidden'
            break;
          case 3:
    
            if (swip) {
              if (!this.noVoice) {
                this.m03.currentTime = 0
                this.m03.play()
                this.license.currentTime = 0
                this.license.volume = 0.2
                this.license.play()
              }
               if(this.pathObject.playing !=true){          
                  this.drawGreenPath(true)
                  this.lin2timer = setTimeout(() => {
                    this.drawGreenPath2(true)
                  },2300)
                  this.drawHousePromise(true)
               }
            } else {
              this.drawGreenPath(false)
              this.drawGreenPath2(false)
              this.drawHousePromise(false)
              clearTimeout(this.lin2timer)
            }
            break;
          case 4:
            if (swip && !this.noVoice) {
              this.m04.currentTime = 0
              this.m04.play()
            }
            if (swip) {
              this.chenTimer = setTimeout(() => {
                this.borderAni = false
              }, 10000);
            } else {
              this.borderAni = true
              clearTimeout(this.chenTimer)
            }
            break;
          case 5:
            this.mapPop = swip
            break;
          case 6:
            this.popWindow = swip
            this.currAns=null
            this.currAns2=null
            break;
          default:
            break;
        }
        this.list[index].show = swip
      },
      oriChange() {
        setTimeout(() => {
          this.setRemUnit()
        }, 100)
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
          // console.log(u_agent, this.bodyHeight, this.bodytWidth)
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
          this.titleH = this.docHeight - this.canvasH
          var s = 10
          this.dpr = window.devicePixelRatio || 1
          if (/iPad|iPhone|Android|Adr/i.test(u_agent)) {
            this.dpr = 2;
          }
          if (this.dpr >= 2) {
            this.dpr = 2;
            this.rem = this.o / this.dpr / 7.5;
            if (this.orienta == 2) {
              this.rem = this.o / this.dpr / 5.2;
            }
          } else {
            this.rem = this.o / 10 / this.dpr;
          }
          console.log(this.boxscale, this.o, this.dpr, this.rem)
          document.documentElement.style.fontSize = (this.rem) + 'px'
        }
        selffun()
        this.setZoom()
      },
      initCanvas() {},
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
      drawHousePromise(flag) {
        this.canvasAnimHorse = document.getElementById('myCanvasAnimHorse')
        let contextAnimHorse = this.canvasAnimHorse.getContext('2d');
        if(flag){
          if (this.horseObject5.animated == true) {
            return
          }
          this.canvasAnimHorse.style.visibility = 'visible'

          // contextAnimHorse.drawImage(this.horseObject1.source, this.horseObject1.position.points[0][0], this.horseObject1.position.points[0][1], this.horseObject1.width * 0.55, this.horseObject1.height * 0.55);
          // this.showCityAni(canvasAnimHorse, true)
          // this.horsetimerGroup = setTimeout(() => {
            this.drawHorsesTimeout2 = setInterval(() => {
              this.canvasClear(this.canvasAnimHorse);
              if(this.horseObject1.animated == false){
                this.drawHorse(this.horseObject1, contextAnimHorse, this.horseObject1.source)
              }else{
                if(this.horseObject2.animated == false){
                  this.drawHorse(this.horseObject2, contextAnimHorse, this.horseObject2.source)
                }else{
                  if(this.horseObject3.animated == false){
                    this.drawHorse(this.horseObject3, contextAnimHorse, this.horseObject3.source)
                  }else{
                    if(this.horseObject4.animated == false){
                      this.drawHorse(this.horseObject4, contextAnimHorse, this.horseObject4.source)
                    }else{
                      if(this.horseObject5.animated == false){
                        this.drawHorse(this.horseObject5, contextAnimHorse, this.horseObject5.source)
                      }else{
                        this.license.pause()
                      }
                    }
                  }
                }
              }
            }, 60);
        // }, 500)
        }else{
          
          // for(var i= 0; i<this.drawHorsesTimeout2.length;i++){
          //     clearInterval(this.drawHorsesTimeout2[i])
          // }
          // clearTimeout(this.horsetimerGroup)
          clearInterval(this.drawHorsesTimeout2)
          this.canvasClear(this.canvasAnimHorse);
          this.canvasAnimHorse.style.visibility = 'hidden'
          this.resetHorseObject(this.horseObject1)
          this.resetHorseObject(this.horseObject2)
          this.resetHorseObject(this.horseObject3)
          this.resetHorseObject(this.horseObject4)
          this.resetHorseObject(this.horseObject5)
        }
      },
      drawHorse(object, contextS, imageHorse) {
        return new Promise((resolve,rej)=>{
          if (object.position.currPoint + 1 < object.position.totalPoint) {
            contextS.save();
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
            // return "ok";
            
          } else {
            resolve('//')
            object.animating = false;
            object.animated = true;
          }
          // this.drawHorsesTimeout = setTimeout(() => {
          //   this.canvasClear(this.canvasAnimHorse);
          //   this.drawHorse(object, contextS, imageHorse)
          // }, 60);
        })
        
        // })
      },
     
      drawGreenPath(flag) {
        let canvasAnimPath = document.getElementById('myCanvasAnimGreenPath')
        let contextAnimPath = canvasAnimPath.getContext('2d');
        let pathObject = this.pathObject
        if (flag == true) {
          if (pathObject.mask7.height < 350) {
            pathObject.playing = true
            this.canvasClear(canvasAnimPath);
            contextAnimPath.save();
            contextAnimPath.beginPath();
            contextAnimPath.rect(pathObject.mask1.currOriginX, pathObject.mask1.currOriginY, pathObject.mask1.width, pathObject.mask1.height);
            if (pathObject.mask1.width >= 590) {
                
              if (pathObject.mask2.width >= 580) {
                //
                contextAnimPath.rect(pathObject.mask3.currOriginX, pathObject.mask3.currOriginY, pathObject.mask3.width, pathObject.mask3.height);
                if (pathObject.mask3.currOriginX >= 153) {
                  contextAnimPath.rect(pathObject.mask4.currOriginX, pathObject.mask4.currOriginY, pathObject.mask4.width, pathObject.mask4.height);
                  if (pathObject.mask4.currOriginX >= 1060) {
                    contextAnimPath.rect(pathObject.mask5.currOriginX, pathObject.mask5.currOriginY, pathObject.mask5.width, pathObject.mask5.height);
                    if (pathObject.mask5.currOriginX <= 1070) {
                      contextAnimPath.rect(pathObject.mask7.currOriginX, pathObject.mask7.currOriginY, pathObject.mask7.width, pathObject.mask7.height);
                    }
                  }
                }
              }
            }
            contextAnimPath.clip();
            contextAnimPath.drawImage(pathObject.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
            if (pathObject.mask1.width <= 590) {
              // pathObject.mask1.currOriginX += pathObject.mask1.shiftX;
              pathObject.mask1.width += pathObject.mask1.shiftX;
            } else {
              if (pathObject.mask2.width < 580) {
                  //
              } else {
                contextAnimPath.drawImage(pathObject.mask3.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                if (pathObject.mask3.width < 153) {
                  pathObject.mask3.width += pathObject.mask3.shiftX;
                } else {
                  contextAnimPath.drawImage(pathObject.mask4.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                  if (pathObject.mask4.height < 20) {
                    pathObject.mask4.height += 2;
                  } else if (pathObject.mask4.currOriginX <= 1060) {
                    pathObject.mask4.currOriginX += 2;
                    pathObject.mask4.height += 3;
                  } else if (pathObject.mask5.currOriginX > 1060) {
                    pathObject.mask5.currOriginX -= 6;
                    pathObject.mask4.height += 2;
                  } else {
                    contextAnimPath.drawImage(pathObject.mask7.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
                    if (pathObject.mask5.currOriginX <= 1070) {
                      pathObject.mask7.height += pathObject.mask7.shiftX;
                    }
                  }
                }
              }
            }
            contextAnimPath.restore();
            canvasAnimPath.style.visibility = "visible";
            pathObject.timeout = setTimeout(() => {
              this.drawGreenPath(flag);
            }, 30);
          }
        } else {
          canvasAnimPath.style.visibility = "hidden";
          pathObject.mask1.currOriginX = pathObject.mask1.originX;
          pathObject.mask1.currOriginY = pathObject.mask1.originY;
          pathObject.mask1.width = 1;
          pathObject.mask3.currOriginX = pathObject.mask3.originX;
          pathObject.mask3.currOriginY = pathObject.mask3.originY;
          pathObject.mask3.width = 1;
          pathObject.mask4.currOriginX = pathObject.mask4.originX;
          pathObject.mask4.currOriginY = pathObject.mask4.originY;
          pathObject.mask4.height = 1;
          pathObject.mask5.currOriginX = pathObject.mask5.originX;
          pathObject.mask5.currOriginY = pathObject.mask5.originY;
          pathObject.mask7.currOriginX = pathObject.mask7.originX;
          pathObject.mask7.currOriginY = pathObject.mask7.originY;
          pathObject.mask7.height = 1;
          pathObject.playing= false
          clearTimeout(pathObject.timeout);
        }
      },
      drawGreenPath2(flag) {

        let canvasAnimPath2 = document.getElementById('myCanvasAnimGreenPath2')
        let contextAnimPath2 = canvasAnimPath2.getContext('2d');
        let pathObject = this.pathObject
        if (flag == true) {
          if(pathObject.mask2.width <= 580){
              this.canvasClear(canvasAnimPath2);
              contextAnimPath2.save();
              contextAnimPath2.beginPath();
              contextAnimPath2.rect(pathObject.mask2.currOriginX, pathObject.mask2.currOriginY, pathObject.mask2.width, pathObject.mask2.height);
              contextAnimPath2.clip();
              contextAnimPath2.drawImage(pathObject.mask2.source, pathObject.originX, pathObject.originY, pathObject.width, pathObject.height);
              contextAnimPath2.restore();
              pathObject.mask2.width += pathObject.mask2.shiftX;
        
        canvasAnimPath2.style.visibility = "visible";
         pathObject.mask2.timeout = setTimeout(() => {
              this.drawGreenPath2(flag);
            }, 30);
          }
        }else{
          canvasAnimPath2.style.visibility = "hidden";
          clearTimeout(pathObject.mask2.timeout)
          pathObject.mask2.currOriginX = pathObject.mask2.originX;
          pathObject.mask2.currOriginY = pathObject.mask2.originY;
          pathObject.mask2.width = 1;
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
      object.times=null
    },
    createMap() {
      var divTag = this.$refs.canvasInnerDiv
      var canvasStatic1 = document.createElement('canvas');
      var canvasStatic2 = document.createElement('canvas');
      var canvasStatic4 = document.createElement('canvas');
      var canvasStatic5 = document.createElement('canvas');
      var canvasAnimGreenPath = document.createElement('canvas');
      var canvasAnimGreenPath2 = document.createElement('canvas');
      var canvasAnimBluePath = document.createElement('canvas');
      var canvasAnimHorse = document.createElement('canvas');
      var contextStatic1 = canvasStatic1.getContext('2d');
      var contextStatic2 = canvasStatic2.getContext('2d');
      var contextStatic4 = canvasStatic4.getContext('2d');
      var contextStatic5 = canvasStatic5.getContext('2d');
      var contextAnimGreenPath = canvasAnimGreenPath.getContext('2d');
      var contextAnimGreenPath2 = canvasAnimGreenPath2.getContext('2d');
      var contextAnimHorse = canvasAnimHorse.getContext('2d');
      /* 音频 */
      this.m01 = document.createElement('audio')
      this.m02 = document.createElement('audio')
      this.m03 = document.createElement('audio')
      this.m04 = document.createElement('audio')
      this.license = document.createElement('audio')
      this.m01.src = require('../static/img/vo/Map001-1.mp3')
      this.m02.src = require('../static/img/vo/Map001-2.mp3')
      this.m03.src = require('../static/img/vo/Map001-4.mp3')
      this.m04.src = require('../static/img/vo/Map001-5.mp3')
      this.license.src = require('../static/img/vo/License.mp3')
      // Variable init
      divTag.appendChild(canvasStatic1);
      divTag.appendChild(canvasStatic2);
      divTag.appendChild(canvasStatic4);
      divTag.appendChild(canvasStatic5);
      divTag.appendChild(canvasAnimGreenPath2);
      divTag.appendChild(canvasAnimGreenPath);
      divTag.appendChild(canvasAnimHorse);
      canvasStatic1.id = "myCanvasStatic1";
      canvasStatic2.id = "myCanvasStatic2";
      canvasStatic4.id = "myCanvasStatic4";
      canvasStatic5.id = "myCanvasStatic5";
      canvasAnimGreenPath.id = "myCanvasAnimGreenPath";
      canvasAnimGreenPath2.id = "myCanvasAnimGreenPath2";
      canvasAnimHorse.id = "myCanvasAnimHorse";
      canvasStatic1.style.position = "absolute";
      canvasStatic2.style.position = "absolute";
      canvasStatic4.style.position = "absolute";
      canvasStatic5.style.position = "absolute";
      canvasAnimGreenPath.style.position = "absolute";
      canvasAnimGreenPath2.style.position = "absolute";
      canvasAnimHorse.style.position = "absolute";
      canvasStatic1.style.zIndex = "4";
      canvasStatic2.style.zIndex = "4";
      canvasStatic4.style.zIndex = "4";
      canvasStatic5.style.zIndex = "2";
      canvasAnimGreenPath.style.zIndex = "2";
      canvasAnimGreenPath2.style.zIndex = "2";
      canvasAnimHorse.style.zIndex = "6";
      canvasAnimGreenPath.width = this.baseWidth;
      canvasAnimGreenPath.height = this.baseHeight;
      canvasAnimGreenPath2.width = this.baseWidth;
      canvasAnimGreenPath2.height = this.baseHeight;
      canvasAnimHorse.width = this.baseWidth;
      canvasAnimHorse.height = this.baseHeight;
      var imageMap = new Image();
      var imageChen = new Image();
      var imageborder = new Image();
      var imageMapDetail = new Image();
      var imageCapital = new Image();
      var imageGate = new Image();
      var imageMainCity = new Image();
      var imageHorse = new Image();
      var route1 = new Image();
      var route2 = new Image();
      var route3 = new Image();
      var route4 = new Image();
      var route5 = new Image();
      imageMap.src = require('../static/img/map.png')
      imageborder.src = require('../static/img/border.png');
      imageChen.src = require('../static/img/chen.png');
      imageMapDetail.src = require('../static/img/mapDetail.png');
      imageCapital.src = require('../static/img/capital.png');
      imageMainCity.src = require('../static/img/main_city.png');
      imageHorse.src = require('../static/img/warship.png');
      imageGate.src = require('../static/img/city.png');
      route1.src = require('../static/img/route1.png');
      route2.src = require('../static/img/route2.png');
      route3.src = require('../static/img/route3.png');
      route4.src = require('../static/img/route4.png');
      route5.src = require('../static/img/route5.png');
      imageCapital.onload = () => {
        canvasStatic1.width = this.baseWidth;
        canvasStatic1.height = this.baseHeight;
        contextStatic1.drawImage(imageCapital, 0, 0, this.baseWidth, this.baseHeight);
        canvasStatic1.style.visibility = 'hidden'
      }
      imageGate.onload = () => {
        canvasStatic2.width = this.baseWidth;
        canvasStatic2.height = this.baseHeight;
        contextStatic2.drawImage(imageGate, 0, 0, this.baseWidth, this.baseHeight);
        canvasStatic2.style.visibility = 'hidden'
      }
      imageMainCity.onload = () => {
        canvasStatic4.width = this.baseWidth;
        canvasStatic4.height = this.baseHeight;
        contextStatic4.drawImage(imageMainCity, 0, 0, this.baseWidth, this.baseHeight);
        canvasStatic4.style.visibility = 'hidden'
      }
      route1.onload = () => {
        this.pathObject = {
          'source': route1,
          'originX': 0,
          'originY': 0,
          'width': this.baseWidth,
          'height': this.baseHeight,
          'mask1': {
            'originX': 130,
            'originY': 675,
            'width': 1,
            'height': 250,
            'currOriginX': 130,
            'currOriginY': 675,
            'shiftX': 10,
            'shiftY': 0
          },
          'timeout': null,
          'playing':false
        }
      }
      route2.onload = () => {
        this.pathObject.mask2 = {
          'source': route2,
          'originX': 356,
          'originY': 550,
          'width': 1,
          'height': 170,
          'currOriginX': 356,
          'currOriginY': 550,
          'shiftX': 15,
          'shiftY': 0
        }
      }
      route3.onload = () => {
        this.pathObject.mask3 = {
          'source': route3,
          'originX': 900,
          'originY': 484,
          'width': 1,
          'height': 57,
          'currOriginX': 900,
          'currOriginY': 484,
          'shiftX': 6,
          'shiftY': 0
        }
      }
      route4.onload = () => {
        this.pathObject.mask4 = {
          'source': route4,
          'originX': 1060,
          'originY': 410,
          'width': 64,
          'height': 1,
          'currOriginX': 1060,
          'currOriginY': 410,
          'shiftX': 10,
          'shiftY': 0
        }
        this.pathObject.mask5 = {
          'source': route4,
          'originX': 1130,
          'originY': 431,
          'width': 62,
          'height': 50,
          'currOriginX': 1130,
          'currOriginY': 431,
          'shiftX': 10,
          'shiftY': 0
        }
      }
      route5.onload = () => {
        this.pathObject.mask7 = {
          'source': route5,
          'originX': 1070,
          'originY': 410,
          'width': 178,
          'height': 1,
          'currOriginX': 1070,
          'currOriginY': 410,
          'shiftX': 10,
          'shiftY': 0
        }
      }
      imageHorse.onload = () => {
        var translate = [
          [130, 655],
          [300, 650],
          [490, 810],
          [630, 680],
          [730, 690]
          // [-1040, 830],
        ];
        var scale = [1, 1, 1,1,0];
        var dur = [10, 10, 10,10,5];
        var sharpPoint = [0, 0, 0,0,2]
        this.horseObject1 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);

        var translate = [
          [360, 510],
          [480, 580],
          [750, 730],
        ];
        var scale = [1, 1,0];
        var dur = [10,10,10];
        var sharpPoint = [0, 0,2]
        this.horseObject2 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);

        var translate = [
          [860, 480],
          [900, 450],
          [1080, 480],
        ];
        var scale = [1,1,0];
        var dur = [5,5,5];
        var sharpPoint = [0,0,2]
        this.horseObject3 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);

        var translate = [
          [1060, 380],
          [1100, 400],
          [1010, 480],
        ];
        var scale = [1,1,0];
        var dur = [5,5,10];
        var sharpPoint = [0,0,2]
        this.horseObject4 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);

        var translate = [
          [1060, 380],
          [1130, 400],
          [1130, 580],
          [1300, 720],
        ];
        var scale = [1,1,1,0];
        var dur = [5,10,15,10];
        var sharpPoint = [0,0,0,2]
        this.horseObject5 = this.initHorseObject(translate, scale, dur, sharpPoint, imageHorse);
      }
      // document.getElementById('map_container').append(divTag)   
      // divTag.append(divTag)
      this.$nextTick(() => {
        this.setZoom()
      })
    },
    setZoom() {
      if (!document.getElementById('canvasInnerDiv')) {
        return
      }
      this.zoomObj = new zoom(document.getElementById('canvasInnerDiv'), {
        width: this.baseWidth,
        height: this.baseHeight,
        top: 0,
        left: 0,
        minScale: this.boxscale,
        // maxScale: this.boxscale * 10,
        warpWidth: this.boxscale * this.baseWidth,
        warpHeight: this.boxscale * this.baseHeight
      })
      this.zoomObj.setScale(this.boxscale)
      // this.zoomObj.setTransform(false,0,0)
    },
    initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        'source': imageHorse,
        'totalFrame': 2,
        'currFrame': 0,
        'width': 400,
        'height': 200,
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
    checkans2(index) {
      this.currAns2 = index
      if (this.rightans2 == index) {
        this.showWrong2 = true
      } else {
        this.showWrong2 = false
      }
    },
    // offestx(x) {
    //   this.zoomObj.preSetScale(this.boxscale * (1 + x), 0, 0)
    //   this.zoomObj.setTransform(false)
    // },
    moveOut(x) {
      this.scaleindex = Math.ceil(x * 10)
    },
    drawArrow(ctx, x, y, radians, color) {
      ctx.save();
      ctx.beginPath();
      ctx.translate(x, y);
      ctx.rotate(radians);
      ctx.moveTo(0, 0);
      ctx.lineTo(6, 20);
      ctx.lineTo(-6, 20);
      ctx.moveTo(6, 20);
      ctx.quadraticCurveTo(0, 15, -6, 20);
      ctx.closePath();
      ctx.restore();
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
  };
</script>

<style lang="less">
  #app {
    .pos_a {
      position: absolute;
    }
    font-family: Verdana,
    Arial,
    sans-serif;
    .mapBackground {
      display: inline-block;
      background: url('../static/img/map.png');
      background-size: cover;
    }
    .detail_div {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url('../static/img/mapDetail.png');
      background-size: cover;
    }
    .chen_div {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url('../static/img/chen.png');
      background-size: cover;
    }
    .border_div {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url('../static/img/border.png');
      background-size: cover;
    }
    #canvasInnerDiv {
      width: 1430px;
      height: 1316px;
    }
    .iconItem{
      display: flex;
      align-items: center;
      height: 0.52rem;
      line-height: 0;
      .icon{
        padding: 0;
        width: 1.81em;
          height: 1.2em;
         line-height: 1.2em;
             position: relative;
    margin-right: 0.3em;
    margin-left: 0.42em;
        img{
          max-width: 100%;
          max-height: 100%;
              position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
          // object-fit:contain;
        }
      }
    }
  }
  
</style>
