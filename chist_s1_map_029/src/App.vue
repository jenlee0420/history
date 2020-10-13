<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load" id="main_container" :style="mainBoxStyle">
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>漢代絲綢之路路線圖 (公元前138-前220 年)</span>
        <div id="soundCon" :class="{ mute: noVoice }" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{ width: canvasW + 'px', height: canvasH + 'px' }">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'capital.png'" :static="control.capital.show" :zindex="2" @update="updateImg"></imageview>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{ clicked: item.show }" v-for="(item, index) in list" :key="index" @click="showCanvas(index)">
              <div class="iconItem">
                <span class="icon"><img :src="item.ico"/></span>
                <span v-html="item.text"></span>
              </div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">
                全部顯示
              </div>
              <div class="blueButton action_all " @click="showall(false)">
                全部隱藏
              </div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />
        </div>
      </div>
    </div>
    <modal class="" :style="AppStyle" :dragable="!isApp" headTitle="問題" :hideFooter="true" v-if="popWindow" @cancel-event="
          popWindow = false;
          list[7].show = false;
        ">
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="flex">
              <em class="mr5">1.</em><em> 根據地圖所示<span class="dot">，</span>絲綢之路最遠能到達何地？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns == index }" v-for="(item, index) in questionItem" :key="index" @click="checkans(index)">{{ item }}</span
                >
              </div>
              <div
                class="ansBox"
                :class="showWrong == false ? 'wrongico' : 'rightico'"
                v-if="currAns != null"
              ></div>
            </div>
            <div class="question question2">
              <div class="flex">
                <em class="mr5">2.</em>
                <em>
                根據地圖<span class="dot">，</span>以下哪項關於西域都護府的描述是<span class="underline">不正確</span>的？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns2 == index }" v-for="(item, index) in questionItem2" :key="index" @click="checkans2(index)">{{ item }}</span
                >
              </div>
              <div
                class="ansBox"
                :class="showWrong2 == false ? 'wrongico' : 'rightico'"
                v-if="currAns2 != null"
              ></div>
            </div>
          </div>
        </div>
      </modal>
      <modal
        class=""
        :style="AppStyle" :dragable="!isApp"
        headTitle="玉門關（今甘肅省敦煌市西北）"
        :hideFooter="true"
        v-if="mapPop"
        @cancel-event="
          mapPop = false;
          list[6].show = false;
        "
      >
        <div slot="modalCont">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25783786.321107246!2d84.51139092770767!3d35.70993815133558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37eb644ca5f0213d%3A0x553901203e8a9932!2z546J6ZaA6Zec!5e0!3m2!1szh-TW!2shk!4v1590116670966!5m2!1szh-TW!2shk"
            :width="(isApp?docWidth:bodytWidth)/1.8" :height="(isApp?docHeight:bodyHeight)/1.8"
            frameborder="0"
            style="border:0;"
            allowfullscreen=""
          ></iframe>
        </div>
      </modal>
    </div>
</template>

<script>
  import zoom from "./js/zoom.js";
  import zoomApp from './js/zoomApp.js'
  // import canvasFun from "./js/canvas.js";
  import modal from "./components/modal";
  import bar from "./components/bar";
  import imageview from "./components/ImageView";
  export default {
    components: {
      modal,
      bar,
      imageview
    },
    name: "App",
    beforeCreate() {},
    created() {
      const that = this;
      that.timer = setInterval(function() {
        //
        if (document.readyState === "complete" && that.imgCount >= that.imgTotal) {
          // console.log(document.readyState, that.imgCount)
          that.load = false;
          window.clearInterval(that.timer);
        }
      }, 500);
    },
    computed:{
      mainBoxStyle(){
        var css = {'width':this.docWidth+'px',
        'height':this.docHeight+'px',
        'display':this.load?'none':'block',       
        transform:this.pageTransform,
        'margin-top':this.pageMarginTop+'px',
        'margin-left':(this.pageMarginLeft *-1) +'px'    
        }
        return css
      },
      AppStyle() {
        var css = {}
        if (this.isApp) {
          css = {
            'width': this.docWidth + 'px',
            'height': this.docHeight + 'px',
            transform: this.pageTransform,
            'margin-top': this.pageMarginTop + 'px',
            'margin-left': (this.pageMarginLeft * -1) + 'px'
          }
        }
        return css
      },


      isApp(){
        if(window.location.search.indexOf('app')>=0){
          return true
        }else{
          return false
        }
      }
    },

    mounted() {
      // this.testCanvas()
      this.createMap();
      if ("onorientationchange" in window) {
        window.addEventListener("orientationchange", this.oriChange, false);
      } else {
        window.addEventListener("resize", this.setRemUnit, false);
      }
      // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
      // this.zoomObj = require("./js/zoom.js");
      if(this.isApp){
        this.forApp()
      }else{
        this.setRemUnit()
      }

      this.initCanvas();
      document
        .getElementById("map_container")
        .addEventListener("touchmove", this.bodyScroll, {
          passive: false //  禁止 passive 效果
        });
    },
    data() {
      return {
        imageObj: {
          gate:null,
          main_city01:null,
          main_city02: null,
          main_city03: null,
          main_city04: null,
          main_city05: null,
          route:null,
          xiyu:null,
          
        },
        control: {
          route:null,
          capital: {
            show: false,
            ani: false,
            timer: null
          },
          
          main_city01:null,
          main_city02: null,
          main_city03: null,
          main_city04: null,
          main_city05: null,
          gate:null,
          xiyu:null,
          
        },
        Redroadtimer: null,
        load: true,
        noVoice: false,
        zoomObj: null,
        imgCount: 0,
        imgTotal: 11,
        questionItem: [
          "A. 康居",
          "B. 大秦",
          "C. 安息"
        ],
        rightans: 1,
        showWrong: 0,
        currAns: null,
        questionItem2: ["A. 駐所位於天山以南",
          "B. 都護府設於地勢較平坦之處",
          "C. 駐所毗連匈奴"
        ],
        rightans2: 2,
        showWrong2: 0,
        currAns2: null,
        data: [],
        mapPop: false,
        list: [{
            ico: require("../static/img/icon/capital_icon.png"),
            text: "首都",
            show: false
          },
          {
            ico: require("../static/img/icon/gate_icon.png"),
            text: "關口",
            show: false
          },
          {
            ico: require("../static/img/icon/main_city_icon.png"),
            text: "要邑／治所",
            show: false
          },
          {
            ico: require("../static/img/icon/xiyu_icon.png"),
            text: "西域國家",
            show: false
          },
          {
            ico: require("../static/img/icon/mountain_icon.png"),
            text: "山嶺",
            show: false
          },
          {
            ico: require("../static/img/icon/route_red_029_icon.png"),
            text: "絲綢之路路線",
            show: false
          },
          {
            ico: require("../static/img/icon/gate_icon.png"),
            text: "玉門關<span class='fs21'>（今甘肅省敦煌市西北）</span>",
            show: false,
            type: "map",
          },
          {
            ico: require("../static/img/icon/question_icon.png"),
            text: "問題",
            type: "question",
            show: false
          }
        ],
        bodytWidth: "",
        bodyHeight: "",
        baseWidth: "1430",
        baseHeight: "1316",
        orienta: "",
        boxscale: 1,
        o: "",
        dpr: 1,
        rem: "",
        canvasH: "",
        canvasW: "",
        docWidth: "",
        docHeight: "",
        horseObject1: {},
        scaleindex: 0,
        ele: null,
        popWindow: false,
        m01: null,
        m02: null,
        m03: null,
        m04: null,
        m05: null,
        m06: null,
        m07: null,
        m08: null,
        license: null,
        horsetimerGroup: null,
        drawHorsesTimeout: null,
        drawHorsesTimeout1: null,
        drawHorsesTimeout2: null,
        drawHorsesTimeout3: null,
        shipPlay: false,
        titleH: 70,
        canvasAnimHorse: null,
        prevorienta: "",
        pathObject: {},
        pathObjectGreen: {},
        pathObjectblue: {},
        scaleZoom: 0,
        debug: "",
        canvasObj: {},
        contextObj: {},
        timer1: [],
        isShowall:false,
        route3:false,
        btn2Play:false,
      };
    },
    watch: {
      zoomObj: {
        handler(n, o) {
          this.scaleindex =
            ((n.scale - n.minScale) / (n.maxScale - n.minScale)) * 10;
          this.debug = n.scale + "---" + n.maxScale + "--" + this.scaleindex;
        },
        deep: true
      },
      control: {
        handler(n, o) {
          this.imagesCanvas()
        },
        deep: true
      },
      route3:function(n){
        if(n){
          this.drawHousePromise3(n)
        }
      }
    },
    methods: {
      updateImg() {
        this.imgCount++
      },
      setVoice() {
        this.noVoice = !this.noVoice
        this.muteMe()
      },
      bodyScroll(event) {
        event.preventDefault();
      },
      setScale(scaleindex) {
        this.zoomObj.preSetScale(
          (scaleindex / 10) * (this.zoomObj.maxScale - this.zoomObj.minScale) +
          this.zoomObj.minScale,
          0,
          0
        );
        this.zoomObj.setTransform(false);
      },
      muteMe() {
        this.m01.pause();
        this.m02.pause();
        this.m03.pause();
        this.m04.pause();
        this.m05.pause();
        this.m06.pause();
        this.license.pause();
      },
      showCanvas(index) {
     
        let swip = !this.list[index].show;
        this.muteMe();
        switch (index) {
          case 0:
            //首都
            if (swip && !this.noVoice) {
              this.m01.currentTime = 0;
              this.m01.play();
            }
            this.sharpCity(this.control.capital, swip);
            break;
          case 1:
            if (swip && !this.noVoice) {
              this.m02.currentTime = 0;
              this.m02.play();
            }
            this.control.gate = swip
            break;
          case 2:
            clearTimeout(this.timer1[0])
              clearTimeout(this.timer1[1])
              clearTimeout(this.timer1[2])
              clearTimeout(this.timer1[3])
            if (swip) {
              if (!this.noVoice) {
                this.m03.currentTime = 0;
                this.m03.play();
                this.timer1[0] = setTimeout(() => {
                  this.control.main_city02 = swip
                }, 9000)
                this.timer1[1] = setTimeout(() => {
                  this.control.main_city03 = swip
                }, 10000)
                this.timer1[2] = setTimeout(() => {
                  this.control.main_city04 = swip
                }, 11000)
                this.timer1[3] = setTimeout(() => {
                  this.control.main_city05 = swip
                  this.btn2Play= true
                }, 12000)
              }
              if(this.isShowall && this.noVoice){
                this.timer1[0] = setTimeout(() => {
                  this.control.main_city02 = swip
                }, 3000)
                this.timer1[1] = setTimeout(() => {
                  this.control.main_city03 = swip
                }, 3000)
                this.timer1[2] = setTimeout(() => {
                  this.control.main_city04 = swip
                }, 3000)
                this.timer1[3] = setTimeout(() => {
                  this.control.main_city05 = swip
                  this.btn2Play= true
                }, 3000)
              }
            } else {
              
              this.control.main_city02 = false
              this.control.main_city03 = false
              this.control.main_city04 = false
              this.control.main_city05 = false
              this.btn2Play= false
            }
            this.control.main_city01 = swip
            break;
          
          case 3:
            if (swip && !this.noVoice) {
              this.m04.currentTime = 0;
              this.m04.play();
            }
            this.control.xiyu = swip
            break;
          case 4:
            clearTimeout(this.timer1[4])
              clearTimeout(this.timer1[5])
              clearTimeout(this.timer1[6])
            if (swip) {
              if (!this.noVoice) {
                this.m05.currentTime = 0;
                this.m05.play();
                this.timer1[4] = setTimeout(() => {
                  this.showCityAni(this.canvasObj['mountain01'],swip)
                }, 5000)
                this.timer1[5] = setTimeout(() => {
                 this.showCityAni(this.canvasObj['mountain02'],swip)
                }, 7500)
                this.timer1[6] = setTimeout(() => {
                  this.showCityAni(this.canvasObj['mountain03'],swip)
                }, 9000)
              }
              if(this.isShowall && this.noVoice){
                this.timer1[4] = setTimeout(() => {
                  this.showCityAni(this.canvasObj['mountain01'],swip)
                }, 3000)
                this.timer1[5] = setTimeout(() => {
                 this.showCityAni(this.canvasObj['mountain02'],swip)
                }, 3000)
                this.timer1[6] = setTimeout(() => {
                  this.showCityAni(this.canvasObj['mountain03'],swip)
                }, 3000)
              }
            } else {
              clearTimeout(this.timer1[4])
              clearTimeout(this.timer1[5])
              clearTimeout(this.timer1[6])
              this.showCityAni(this.canvasObj['mountain01'],false)
              this.showCityAni(this.canvasObj['mountain02'],false)
              this.showCityAni(this.canvasObj['mountain03'],false)
            }
            break;
          case 5:
            if (swip && !this.noVoice) {
              this.m06.currentTime = 0;
              this.m06.play();
            }
            this.control.route = swip
            this.drawHousePromise(swip)
            if(!swip){
              this.route3=false
              this.drawHousePromise3(false)
            }
            // this.drawHousePromise3(swip)
            break;
          case 6:
            this.mapPop = swip;
            break;
          case 7:
            this.popWindow = swip;
            this.currAns = null;
            this.currAns2 = null;
            break;
          default:
            break;
        }
        this.list[index].show = swip;
        if(index!=false)this.conflict();
      },
      conflict() {
        let swip5 = this.list[5].show;
        this.control.capital.show = this.list[0].show;
        this.control.main_city01 = this.list[2].show;
        if(this.btn2Play){
        this.control.main_city02 = this.control.main_city03 =this.control.main_city04 =this.control.main_city05 =this.list[2].show;
        }else{
          this.control.main_city02 = this.control.main_city03 =this.control.main_city04 =this.control.main_city05 =false
        }
        this.control.xiyu= this.list[3].show;
        
        if (swip5) {
          this.control.capital.show = true
          this.control.main_city01 = true
          this.control.main_city02= true
          this.control.main_city03= true
          this.control.main_city04= true
          this.control.main_city05= true
          this.control.xiyu = true
        }
      },
      oriChange() {
        setTimeout(() => {
          this.setRemUnit();
        }, 100);
      },
      forApp(){
        const u_agent = navigator.userAgent
        var selffun = () => {
          this.bodyHeight = window.innerHeight
          this.bodytWidth = window.innerWidth
          var offest = (this.bodytWidth / this.bodyHeight)
          if (offest > 0.5) {
              this.boxscale = this.bodyHeight / 2048
              this.o = 1396 * this.boxscale
          }else{
            this.boxscale = this.bodytWidth / 1396
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
            this.rem = this.o / this.dpr / 5.2;
          } else {
            this.rem = this.o / 10 / this.dpr;
          }
          document.documentElement.style.fontSize = (this.rem) + 'px'
          this.pageTransform = 'rotate(-90deg)'
          this.pageMarginTop =this.pageMarginLeft=(this.docWidth - this.docHeight) /2
        }
        selffun()
        this.setZoom()
      },

      setRemUnit() {
        const u_agent = navigator.userAgent;
        if (window.orientation === 0 || window.orientation === 180) {
          //竖屏
          this.orienta = 1;
        } else if (window.orientation === 90 || window.orientation === -90) {
          //横屏
          this.orienta = 2;
        }
        // var that = this
        var selffun = () => {
          this.bodyHeight = window.innerHeight;
          this.bodytWidth = window.innerWidth;
          // console.log(u_agent, this.bodyHeight, this.bodytWidth)
          if (this.bodytWidth > this.bodyHeight) {
            this.boxscale = this.bodyHeight / 1396;
            this.o = this.bodyHeight;
            var offest = this.bodytWidth / this.bodyHeight;
            if (offest < 1.49 && offest > 1) {
              this.boxscale = this.bodytWidth / 2048;
              this.o = 1396 * this.boxscale;
            }
          } else {
            this.boxscale = this.bodytWidth / 2048;
            this.o = this.bodytWidth;
          }
          this.docWidth = 2048 * this.boxscale;
          this.docHeight = 1396 * this.boxscale;
          this.canvasW = Math.ceil(1430 * this.boxscale);
          this.canvasH = Math.ceil(1315 * this.boxscale);
          this.titleH = this.docHeight - this.canvasH;
          var s = 10;
          this.dpr = window.devicePixelRatio || 1;
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
          document.documentElement.style.fontSize = this.rem + "px";
        };
        selffun();
        this.setZoom();
      },
      initCanvas() {},
      showall(type) {
        this.isShowall= type
        this.list.forEach((e, index) => {
        if (!this.list[index].type) {
          if (type) {
            this.list[index].show = false
          } else {
            this.list[index].show = true;
          }
          this.showCanvas(index);
        }
      });
        this.muteMe();
      },
      resetHorseObject(object) {
        object.currFrame = 0;
        object.position.currPoint = 0;
        object.position.currDur = 1;
        object.animating = false;
        object.animated = false;
        object.times = null;
      },
      createMap() {
        var divTag = this.$refs.canvasInnerDiv;
        let list = [{
            name: "canvasImages",
            zindex: 2
          },
          {
            name: "mountain01",
            zindex: 2
          },
          {
            name: "mountain02",
            zindex: 2
          },
          {
            name: "mountain03",
            zindex: 3
          },
          {
            name: "canvaszhangqian",
            zindex: 4
          },
          {
            name: "canvaszhangqian2",
            zindex: 3
          },
        ];
        let obj = this.createCanvas(list, divTag);
        this.canvasObj = obj[0];
        this.contextObj = obj[1];
        /* 音频 */
        this.m01 = document.createElement("audio");
        this.m02 = document.createElement("audio");
        this.m03 = document.createElement("audio");
        this.m04 = document.createElement("audio");
        this.m05 = document.createElement("audio");
        this.m06 = document.createElement("audio");
        this.license = document.createElement("audio");
        this.m01.src = require("../static/img/vo/chist_s1_map_029_1.mp3");
        this.m02.src = require("../static/img/vo/chist_s1_map_029_2.mp3");
        this.m03.src = require("../static/img/vo/chist_s1_map_029_3.mp3");
        this.m04.src = require("../static/img/vo/chist_s1_map_029_4.mp3");
        this.m05.src = require("../static/img/vo/chist_s1_map_029_5.mp3");
        this.m06.src = require("../static/img/vo/chist_s1_map_029_6.mp3");

        Object.keys(this.imageObj).forEach(element => {
          this.imageObj[element] = new Image();
          this.insterCanvas(this.imageObj[element], String(element)+'.png', 'canvasImages', false)
        });
        
        var mountain01 = new Image();
        this.insterCanvas(mountain01, 'mountain01.png', 'mountain01', false)
        var mountain02 = new Image();
        this.insterCanvas(mountain02, 'mountain02.png', 'mountain02', false)
        var mountain03 = new Image();
        this.insterCanvas(mountain03, 'mountain03.png', 'mountain03', false)
        // this.insterCanvas(this.imageObj.main_city2, 'main_city2.png', 'canvasImages', false)
        // this.insterCanvas(this.imageObj.mountain, 'mountain.png', 'canvasImages', false)
        // this.insterCanvas(this.imageObj.xiyu01, 'xiyu01.png', 'canvasImages', false)
        // this.insterCanvas(this.imageObj.xiyu02, 'xiyu02.png', 'canvasImages', false)
        // this.insterCanvas(this.imageObj.xiyu03, 'xiyu03.png', 'canvasImages', false)
        // this.insterCanvas(this.imageObj.route1, 'route0001.png', 'canvasImages', false)
        // this.insterCanvas(this.imageObj.route2, 'route0002.png', 'canvasImages', false)
        var zhangqian = new Image();
        // var zhangqian_b = new Image();

        this.insterCanvas2(zhangqian, 'camel.png', () => {
          var translate = [
            [1299.7, 127], [1232.7, 132],[1167.7, 70],[991.7, 59],[860.6, 128],
            [782.5, 184],[662.5, 165],[534.4, 176],[386.4, 144],[120.3, 179],
            [29, 71],[8,262]
           
          ];
          var scale = [1, 1, 1, 1,1, 1, 1, 1,1, 1,1, 0];
          var dur = [
            35, 35, 35, 45,45,
            35, 30, 35, 50, 50,
            25,20,
           
          ];
          var sharpPoint = [
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1,1,
          ];
          this.horseObject1 = this.initHorseObject(
            translate,
            scale,
            dur,
            sharpPoint,
            zhangqian
          );

          var translate = [
            [991.7, 59],[954.5, 15],[878.5, 60], [797.4, 69],[695.4, 74],
            [627.4, 126], [544.4, 79],[497.4, 289], 
           
          ];
          var scale = [1, 1, 1, 1, 1, 1, 1,  0];
          var dur = [
            30, 30, 30, 35, 35,
            25, 25, 15
          ];
          var sharpPoint = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          ];
          this.horseObject2 = this.initHorseObject(
            translate,
            scale,
            dur,
            sharpPoint,
            zhangqian
          );

          /////////////////
          var translate = [
            [838.4, 715],[783.5,623],[750.5,678],[638.5,704],
            [435.9, 721], [351.9, 702],[260, 644], [236.6,800],[300.6,937],
            [488.6,1089]
           
          ];
          var scale = [1, 1, 1, 1, 1, 1, 1, 1,1, 0];
          var dur = [
            20, 15, 25, 25, 15,
            20, 25, 20,20,20,
            10,
          ];
          var sharpPoint = [
            1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1,
          ];
          this.horseObject3 = this.initHorseObject(
            translate,
            scale,
            dur,
            sharpPoint,
            zhangqian
          );
        })
        // this.insterCanvas2(zhangqian_b, 'zhangqian02.png', () => {
        //   this.horseObject1.source2=zhangqian_b     
        //   this.horseObject3.source2=zhangqian_b          
        // })
        // document.getElementById('map_container').append(divTag)
        // divTag.append(divTag)
        this.$nextTick(() => {
          this.setZoom();
        });
      },
     setZoom() {
      if (!document.getElementById('canvasInnerDiv')) {
        return
      }
      if(this.isApp){
        this.zoomObj = new zoomApp(document.getElementById('canvasInnerDiv'), {
        width: this.baseWidth,
        height: this.baseHeight,
        top: 0,
        left: 0,
        minScale: this.boxscale,
        // maxScale: this.boxscale * 10,
        warpWidth: this.boxscale * this.baseWidth,
        warpHeight: this.boxscale * this.baseHeight
      })
      }else{
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
      }
      this.zoomObj.setScale(this.boxscale)
    },

      insterCanvas(img, src, contextStatic, bool) {
        img.src = require(`../static/img/${src}`);
        img.onload = () => {
          this.imgCount++
            this.contextObj[contextStatic].drawImage(
              img,
              0,
              0,
              this.baseWidth,
              this.baseHeight
            );
          this.canvasObj[contextStatic].style.visibility = bool ?
            "visible" :
            "hidden";
        };
      },
      insterCanvas2(img, src, fun) {
        img.src = require(`../static/img/${src}`);
        img.onload = () => {
          this.imgCount++
            fun()
        }
      },
      initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
        var object = {
          source: imageHorse,
          totalFrame: 5,
          currFrame: 0,
          width: 196,
          height: 320,
          point: sharpPoint,
          position: {
            points: translate,
            scales: scale,
            currPoint: 0,
            totalPoint: translate.length,
            dur: dur,
            currDur: 1
          },
          division: 1,
          animating: false,
          animated: false,
          timeout: null
        };
        return object;
      },
      initHorseObject3(translate, scale, dur, sharpPoint, imageHorse) {
        var object = {
          source: imageHorse,
          totalFrame: 5,
          currFrame: 0,
          width: 396,
          height: 320,
          point: sharpPoint,
          position: {
            points: translate,
            scales: scale,
            currPoint: 0,
            totalPoint: translate.length,
            dur: dur,
            currDur: 1
          },
          division: 1,
          animating: false,
          animated: false,
          timeout: null
        };
        return object;
      },
      initHorseObject2(imageHorse) {
        var object = {
          source: imageHorse,
          totalFrame: 5,
          currFrame: 0,
          width: 135,
          height: 256,
          position: {
            currPoint: 0,
            dur: 1,
            currDur: 1
          },
          division: 1,
          animating: false,
          animated: false,
          timeout: null
        };
        return object;
      },
      canvasClear(canvas) {
        if (!canvas) {
          return
        }
        var context = canvas.getContext("2d");
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
      },
      checkans(index) {
        this.currAns = index;
        if (this.rightans == index) {
          this.showWrong = true;
        } else {
          this.showWrong = false;
        }
      },
      checkans2(index) {
        this.currAns2 = index;
        if (this.rightans2 == index) {
          this.showWrong2 = true;
        } else {
          this.showWrong2 = false;
        }
      },
      // offestx(x) {
      //   this.zoomObj.preSetScale(this.boxscale * (1 + x), 0, 0)
      //   this.zoomObj.setTransform(false)
      // },
      moveOut(x) {
        this.scaleindex = Math.ceil(x * 10);
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
    .fs21{
      font-size: 0.22rem;
    }
    .pos_a {
      position: absolute;
    } // font-family: Verdana, Arial, sans-serif;
    .mapBackground {
      display: inline-block; // background: url("../static/img/map.png");
      background-size: cover;
    }
    .detail_div {
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url("../static/img/mapDetail.png");
      background-size: cover;
      z-index: 2;
    }
    .map {
      display: inline-block;
      width: 100%;
      height: 100%;
      background-size: cover;
    }
    #canvasInnerDiv {
      width: 1432px;
      height: 1317px;
    }
    .iconItem {
      display: flex;
      align-items: center;
      height: 0.52rem;
      line-height: 0;
      .icon {
        padding: 0;
        width: 1.81em;
        height: 1.2em;
        line-height: 1.2em;
        position: relative;
        margin-right: 0.3em;
        margin-left: 0.42em;
        img {
          max-width: 100%;
          max-height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto; // object-fit:contain;
        }
      }
    }
    .question2 {
      flex-wrap: wrap;
      display: flex; // margin-bottom: 0.5em !important;
      .item {
        width: 52% !important;
        margin-bottom: 0.8em !important;
      }
    }
    .flex {
      display: flex;
      em {
        font-style: normal;
      }
    }
    .mr5 {
      margin-right: 5px;
    }
  }
</style>
