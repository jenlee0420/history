<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load" id="main_container" :style="mainBoxStyle">
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>三國鼎立形勢圖 (262 年)</span>
        <div id="soundCon" :class="{ mute: noVoice }" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{ width: canvasW + 'px', height: canvasH + 'px' }">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="3" @update="updateImg"></imageview>
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
          list[6].show = false;
        ">
      <div slot="modalCont">
        <div>
          <div class="question question2">
            <div class="flex">
              <em class="mr5">1.</em><em>以下哪項關於魏國的描述是<span class="underline">不正確</span>的？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns == index }" v-for="(item, index) in questionItem" :key="index" @click="checkans(index)"
              
              v-html="item"></span
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
                <em>以下哪項與三國得以鼎立的原因無關？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns2 == index }" v-for="(item, index) in questionItem2" :key="index" @click="checkans2(index)" v-html="item"></span
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
        :headTitle="list[5].text"
        :hideFooter="true"
        v-if="mapPop"
        @cancel-event="
          mapPop = false;
          list[5].show = false;
        "
      >
        <div slot="modalCont">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49398493.74013818!2d68.75226875236054!3d31.980603494102645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36efc52300447721%3A0xb98652ce2e240e02!2z5Lit5ZyL5Zub5bed55yB5oiQ6YO95biC!5e0!3m2!1szh-TW!2shk!4v1601019798996!5m2!1szh-TW!2shk"
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
          border:null,
          weiguo:null,
          shuguo:null,
          wuguo:null,
          
          
        },
        control: {
          border:false,
          weiguo:false,
          shuguo:false,
          wuguo:false,
          
          
        },
        canvasImagesObj: {
          city1: null,
          city2: null,
          city3: null,
        },
        load: true,
        noVoice: false,
        zoomObj: null,
        imgCount: 0,
        imgTotal: 13,
        questionItem: [
          "A. 版圖較另外兩國廣大 ",
          "B. 完全控制黃河下游地區",
          "C. 定都於長安"
        ],
        rightans: 2,
        showWrong: 0,
        currAns: null,
        questionItem2: ["A. 吳國有長江天險保護",
          "B. 蜀國控制黃河流域    ",
          "C. 曹丕侵吳受挫"
        ],
        rightans2: 1,
        showWrong2: 0,
        currAns2: null,
        data: [],
        mapPop: false,
        list: [{
            ico: require("../static/img/icon/city_icon.png"),
            text: "都城（魏國）",
            show: false
          },
          {
            ico: require("../static/img/icon/city_icon.png"),
            text: "都城（蜀國）",
            show: false
          },
          {
            ico: require("../static/img/icon/city_icon.png"),
            text: "都城（吳國）",
            show: false
          },
          {
            ico: require("../static/img/icon/battlefield_icon.png"),
            text: "戰場",
            show: false
          },
          {
            ico: require("../static/img/icon/border_036_icon.png"),
            text: "疆界",
            show: false
          },
          
          {
            ico: require("../static/img/icon/city_icon.png"),
            text: "成都（今四川省成都市）",
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
        route3:false
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
            this.showCityAni(this.canvasObj['city1'],swip)
            this.showCityAni(this.canvasObj['canvaswei'],true)
            if(!swip){              
              clearInterval(this.canvasObj['canvaswei'].timeout);
              this.canvasObj['canvaswei'].ani = false;
            }
            break;
          case 1:
            if (swip && !this.noVoice) {
              this.m02.currentTime = 0;
              this.m02.play();
            }
            this.showCityAni(this.canvasObj['city2'],swip)
            this.showCityAni(this.canvasObj['canvasshu'],true)
            if(!swip){              
              clearInterval(this.canvasObj['canvasshu'].timeout);
              this.canvasObj['canvasshu'].ani = false;
            }
            break;
          case 2:
            if (swip && !this.noVoice) {
              this.m03.currentTime = 0;
              this.m03.play();
            }
            this.showCityAni(this.canvasObj['city3'],swip)
            this.showCityAni(this.canvasObj['canvaswu'],true)
            if(!swip){              
              clearInterval(this.canvasObj['canvaswu'].timeout);
              this.canvasObj['canvaswu'].ani = false;
            }
            break;
          case 3:
            clearTimeout(this.timer1[0])
            clearTimeout(this.timer1[3])
            clearTimeout(this.timer1[4])
            if(swip){              
              if(!this.noVoice && !this.isShowall){
                this.m04.currentTime = 0;
                this.m04.play();
                this.m04.onended=()=>{
                  this.timer1[0] = setTimeout(()=>{
                    // this.canvasObj['canvasburning'].style.visibility = 'hidden';
                    this.drawHousePromise2(false,'canvasburning',895,690)
                  },3000)
                }
                this.timer1[3] = setTimeout(()=>{
                  // this.canvasObj['canvasburning'].style.visibility = 'visible';
                  this.drawHousePromise2(true,'canvasburning',895,690)
                },38000)
              }else if(this.noVoice || this.isShowall){
                this.timer1[4] = setTimeout(()=>{
                  // this.canvasObj['canvasburning'].style.visibility = 'visible';
                  this.drawHousePromise2(true,'canvasburning',895,690)
                },3000)
                this.timer1[0] = setTimeout(()=>{
                  // this.canvasObj['canvasburning'].style.visibility = 'hidden';
                  this.drawHousePromise2(false,'canvasburning',895,690)
                },6000)
              }
            }else{              
              this.drawHousePromise2(false,'canvasburning',932,740)
            }
            // this.control.zhanchang = swip
            this.canvasObj['zhanchang'].style.visibility = swip?'visible':'hidden'
            break;
          case 4:
            if (swip && !this.noVoice) {
              this.m05.currentTime = 0;
              this.m05.play();
            }
            clearTimeout(this.timer1[1])
            clearTimeout(this.timer1[2])
            if(swip){
              this.control.border = true
              this.control.weiguo=true
              this.timer1[1] = setTimeout(()=>{
                this.control.shuguo=true
              },14000)
              this.timer1[2] = setTimeout(()=>{
                this.control.wuguo=true
              },19000)
            }
            else{
              this.control.border=false
              this.control.weiguo=false
              this.control.shuguo=false
              this.control.wuguo=false
            }

            break;
         
          case 5:
            this.mapPop = swip;
            break;
          case 6:
            this.popWindow = swip;
            this.currAns = null;
            this.currAns2 = null;
            break;
          default:
            break;
        }
        this.list[index].show = swip;
        // if(index!=false)this.conflict();
      },
      conflict() {
        let swip5 = this.list[5].show;
        let swip6 = this.list[6].show;
        this.control.capital.show = this.list[0].show;
        this.control.main_city = this.list[2].show;
        this.control.xiyu1=this.control.xiyu2= this.list[3].show;
        this.control.mountain =this.list[4].show
        if (swip5) {
          this.control.capital.show = true
          this.control.main_city = true
          this.control.xiyu1 = true
          this.control.xiyu2 = true
        }
        if (swip6) {
          this.control.xiyu2 = true
          this.control.mountain=true
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
            zindex: 2
          },
          {
            name: "city1",
            zindex: 3
          },
          {
            name: "city2",
            zindex: 3
          },
          {
            name: "city3",
            zindex: 3
          },
          {
            name: "canvasshu",
            zindex: 3
          },
          {
            name: "canvaswei",
            zindex: 3
          },
          {
            name: "canvaswu",
            zindex: 3
          },
          {
            name: "canvasburning",
            zindex: 3
          },
          {
            name: "zhanchang",
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
        this.m07 = document.createElement("audio");
        this.license = document.createElement("audio");
        this.m01.src = require("../static/img/vo/chist_s1_map_036_1.mp3");
        this.m02.src = require("../static/img/vo/chist_s1_map_036_2.mp3");
        this.m03.src = require("../static/img/vo/chist_s1_map_036_3.mp3");
        this.m04.src = require("../static/img/vo/chist_s1_map_036_4.mp3");
        this.m05.src = require("../static/img/vo/chist_s1_map_036_5.mp3");

        Object.keys(this.imageObj).forEach(element => {
          this.imageObj[element] = new Image();
          this.insterCanvas(this.imageObj[element], String(element)+'.png', 'canvasImages', false)
        });

        Object.keys(this.canvasImagesObj).forEach(element => {
          this.canvasImagesObj[element] = new Image();
          this.insterCanvas(this.canvasImagesObj[element], String(element) + '.png', String(element), false)
        });

        var canvasburning = new Image();
        var canvaswu = new Image();
        var canvaswei = new Image();
        var canvasshu = new Image();
        var zhanchang = new Image();
        this.insterCanvas(canvasshu, 'shu.png', 'canvasshu', true)
        this.insterCanvas(canvaswei, 'wei.png', 'canvaswei', true)
        this.insterCanvas(canvaswu, 'wu.png', 'canvaswu', true)
        this.insterCanvas(zhanchang, 'zhanchang.png', 'zhanchang', false)
        // this.insterCanvas(canvasburning, 'burningships1.png', 'canvasburning', false)

this.insterCanvas2(canvasburning, 'burningships.png', () => {
    this.horseObject1 = this.initHorseObject2(            
            canvasburning
          );
})
        // this.insterCanvas2(Hutrooper, 'Hutrooper.png', () => {
        //   var translate = [
        //     [225, 148], [394.1,514],[544.1, 726]
        //   ];
        //   var scale = [1, 1, 0];
        //   var dur = [
        //    150,50,0
        //   ];
        //   var sharpPoint = [
        //     1, 1, 1,
        //   ];
        //   this.horseObject1 = this.initHorseObject(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     Hutrooper
        //   );
        // })
       
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
          totalFrame: 9,
          currFrame: 0,
          width: 353,
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
        totalFrame: 16,
        currFrame: 0,
        width: 153.2,
        height: 100,
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
    } 
    font-family: Verdana, Arial, sans-serif;
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
        width: 49% !important;
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
