<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load" id="main_container" :style="mainBoxStyle">
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>張騫出使西域路線圖 (公元前138-前115 年)</span>
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
                <span>{{ item.text }}</span>
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
              <em class="mr5">1.</em><em> 根據地圖所示<span class="dot">，</span>張騫出使最遠到達哪一個中亞國家？</em>
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
            <div class="question">
              <div class="flex">
                <em class="mr5">2.</em>
                <em>
                根據地圖所示<span class="dot">，</span>大月氏位於蔥嶺的哪一個方向？</em>
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
        :headTitle="list[6].text"
        :hideFooter="true"
        v-if="mapPop"
        @cancel-event="
          mapPop = false;
          list[6].show = false;
        "
      >
        <div slot="modalCont">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23278334.698756777!2d89.68723170543443!3d36.92428114245354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x366379e922ac17b9%3A0x85d466fda794582e!2z5Lit5ZyL6Zmd6KW_55yB6KW_5a6J5biC!5e0!3m2!1szh-TW!2shk!4v1590113030654!5m2!1szh-TW!2shk"
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
          console.log(document.readyState, that.imgCount)
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
          route1:null,
          route2:null,
          main_city1: null,
          main_city2: null,
          mountain: null,
          xiyu01: null,
          xiyu02: null,
          xiyu03: null,
          
        },
        control: {
          capital: {
            show: false,
            ani: false,
            timer: null
          },
          route1:false,
          route2:false,
          mountain: false,
          xiyu01: false,
          xiyu02: false,
          xiyu03: false,
          main_city1: false,
          main_city2: false,
          
        },
        Redroadtimer: null,
        load: true,
        noVoice: false,
        zoomObj: null,
        imgCount: 0,
        imgTotal: 11,
        questionItem: [
          "A. 莎車",
          "B. 安息",
          "C. 烏孫"
        ],
        rightans: 1,
        showWrong: 0,
        currAns: null,
        questionItem2: ["A. 西方",
          "B. 東方 ",
          "C. 南方"
        ],
        rightans2: 0,
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
            ico: require("../static/img/icon/main_city_icon.png"),
            text: "要邑",
            show: false
          },
          {
            ico: require("../static/img/icon/mountain_028_icon.png"),
            text: "山嶺",
            show: false
          },
          {
            ico: require("../static/img/icon/xiyu_icon.png"),
            text: "西域國家",
            show: false
          },
          {
            ico: require("../static/img/icon/route_red_028_icon.png"),
            text: "第一次出使路線",
            show: false
          },
          {
            ico: require("../static/img/icon/route_green_028_icon.png"),
            text: "第二次出使路線",
            show: false
          },
          {
            ico: require("../static/img/icon/capital_icon.png"),
            text: "長安（今陝西省西安市）",
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
        btn1play:false
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
        console.log(n)
        if(n){
          this.drawHousePromise4(n)
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
            //  this.drawHousePromise1(swip,'canvasmonk1',1100,390);
            this.sharpCity(this.control.capital, swip);
            break;
          case 1:            
            if (swip) {
              if (!this.noVoice) {
                this.m02.currentTime = 0;
                this.m02.play();
                clearTimeout(this.timer1[0])
                this.timer1[0] = setTimeout(() => {
                  this.control.main_city2 = swip
                  this.btn1play=true
                }, 10000)
              }
              if(this.isShowall || this.noVoice){
                clearTimeout(this.timer1[0])
                this.timer1[0] = setTimeout(() => {
                  this.control.main_city2 = swip
                  this.btn1play=true
                }, 3000)
              }
            } else {
              clearTimeout(this.timer1[0])
              this.btn1play=false
              this.control.main_city2 = false
            }
            this.control.main_city1 = swip
            
            break;
          case 2:
            if (swip && !this.noVoice) {
              this.m03.currentTime = 0;
              this.m03.play();
            }
            this.control.mountain = swip
            break;
          case 3:
            if (swip && !this.noVoice) {
              this.m04.currentTime = 0;
              this.m04.play();
            }
            this.control.xiyu01 = swip
            this.control.xiyu02 = swip
            this.control.xiyu03 = swip
            break;
          case 4:
            if (swip && !this.noVoice) {
              this.m05.currentTime = 0;
              this.m05.play();
            }
            this.control.route1=swip
            this.drawHousePromise(swip);
            
            break;
          case 5:
            if (swip && !this.noVoice) {
              this.m06.currentTime = 0;
              this.m06.play();
            }
            this.control.route2 = swip
            this.drawHousePromise3(swip)
            if(!swip){
              this.route3=false
              this.drawHousePromise4(false)
            }
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
        let swip4 = this.list[4].show;
        let swip5 = this.list[5].show;
        this.control.capital.show = this.list[0].show;
        this.control.main_city1 = this.list[1].show;
        
        // if(this.btn1play){
          this.control.main_city2 = this.list[1].show && this.btn1play;
        // }
        this.control.gate = this.list[2].show;
        this.control.xiyu01=this.control.xiyu02=this.control.xiyu03 = this.list[3].show;
        if (swip4) {
          this.control.capital.show = true
          this.control.main_city1 = true
          this.control.main_city2 = true
          this.control.gate = true
          this.control.xiyu01 = true
          this.control.xiyu02 = true
        }
        if (swip5) {
          this.control.capital.show = true
          this.control.main_city1 = true
          this.control.main_city2 = true
          this.control.gate = true
          this.control.xiyu03 = true
          this.control.xiyu01 = true
        }
      },
      oriChange() {
        setTimeout(() => {
          this.setRemUnit();
        }, 200);
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
          this.pageTransform = 'rotate3d(0,0,1,-90deg)'
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
            zindex: 3
          },
          {
            name: "canvaszhangqian",
            zindex: 4
          },
          {
            name: "canvaszhangqian02",
            zindex: 4
          },
          {
            name: "canvaszhangqian03",
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
        this.m01.src = require("../static/img/vo/chist_s1_map_028_1.mp3");
        this.m02.src = require("../static/img/vo/chist_s1_map_028_2.mp3");
        this.m03.src = require("../static/img/vo/chist_s1_map_028_3.mp3");
        this.m04.src = require("../static/img/vo/chist_s1_map_028_4.mp3");
        this.m05.src = require("../static/img/vo/chist_s1_map_028_5.mp3");
        this.m06.src = require("../static/img/vo/chist_s1_map_028_6.mp3");

        Object.keys(this.imageObj).forEach(element => {
          this.imageObj[element] = new Image();
        });
        
        this.insterCanvas(this.imageObj.main_city1, 'main_city1.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.main_city2, 'main_city2.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.mountain, 'mountain.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.xiyu01, 'xiyu01.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.xiyu02, 'xiyu02.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.xiyu03, 'xiyu03.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.route1, 'route0001.png', 'canvasImages', false)
        this.insterCanvas(this.imageObj.route2, 'route0002.png', 'canvasImages', false)
        var zhangqian = new Image();
        var zhangqian_b = new Image();
        // zhangqian.src = require("../static/img/zhangqian.png");
        // zhangqian_b.src = require("../static/img/zhangqian02.png");
        this.insterCanvas2(zhangqian, 'zhangqian.png', () => {
          var translate = [
            [1331.8, 784.5], [1211.8, 802],[1063.8, 704],[1059.4, 431],[933.4, 609],
            [783.4, 663],[673.4, 713],[519.4, 783],[431.4, 735],[311.4, 613],
            [260.4, 613],
            [221.3, 807],[283.4, 949], [229.3, 855],[353.4, 869],[469.4, 821],
            [595.4, 835],[731.5, 763],[851.5, 717],[971.5, 687],[985.0, 437],            
            [1041.0,465],[1081.5, 565],[1143.6, 623], [1173.6, 725],[1367.7, 917]
          ];
          var scale = [1, 1, 1, 1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1, 1, 1, 1, 0];
          var dur = [
            25, 25, 30, 25, 25,
            25, 25, 25, 20, 5,
            20,
            25, 30, 25, 20, 25,
            20, 25, 25, 25, 20,
            20,20, 20, 20, 15
          ];
          var sharpPoint = [
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            -1, 
            -1, -1, -1, -1,-1,
            -1, -1, -1, -1, -1,
            -1,-1, -1, -1,-1
          ];
          this.horseObject1 = this.initHorseObject(
            translate,
            scale,
            dur,
            sharpPoint,
            zhangqian
          );

          var translate = [
            [1326.4, 782], [1192.4, 800],[1110.4, 732], [926.4, 707],[838.4, 715],
            [769.4, 791], [638.4, 862],[568.4, 940.5], 
           
          ];
          var scale = [1, 1, 1, 1, 1, 1, 1,  0];
          var dur = [
            35, 35, 35, 35, 35,
            35, 35, 20
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
            [435.9, 721], [356.9, 702],[230, 644], [236.6,800],[300.6,937],
            [495,1089]
           
          ];
          var scale = [1, 1, 1, 1, 1, 1, 1, 1,1, 0];
          var dur = [
            30, 25, 35, 35, 25,
            30, 35,30,30,30,
           20,
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
        this.insterCanvas2(zhangqian_b, 'zhangqian02.png', () => {
          this.horseObject1.source2=zhangqian_b     
          this.horseObject3.source2=zhangqian_b          
        })
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
          totalFrame: 1,
          currFrame: 0,
          width: 280,
          height: 300,
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
        width: 50% !important;
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
