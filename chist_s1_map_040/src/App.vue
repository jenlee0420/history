<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load" id="main_container" :style="mainBoxStyle">
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>北宋統一全國形勢圖 (960 年)</span>
        <div id="soundCon" :class="{ mute: noVoice }" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{ width: canvasW + 'px', height: canvasH + 'px' }">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <!-- <imageview :imgsrc="'border.png'" :static="true" :zindex="1" @update="updateImg"></imageview> -->
            <imageview :imgsrc="'beisong.png'" :static="control2.beisong" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'nanhan.png'" :static="control2.nanhan" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'beihan.png'" :static="control2.beihan" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'nanping.png'" :static="control2.nanping" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'su.png'" :static="control2.su" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'nantang.png'" :static="control2.nantang" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'wuyue.png'" :static="control2.wuyue" :zindex="1" @update="updateImg"></imageview>
            <!-- <imageview :imgsrc="'nianfen01.png'" :static="control.nianfen01" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'nianfen02.png'" :static="control.nianfen02" :zindex="1" @update="updateImg"></imageview> -->

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
          list[5].show = false;
        ">
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="flex">
              <em class="mr5">1.</em><em> 以下哪個不是國土均位於長江以南的政權？</em>
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
            <div class="question question3">
              <div class="flex">
                <em class="mr5">2.</em>
                <em>
                以下哪項關於北漢的描述是正確的？</em>
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
        :headTitle="list[4].text"
        :hideFooter="true"
        v-if="mapPop"
        @cancel-event="
          mapPop = false;
          list[4].show = false;
        "
      >
        <div slot="modalCont">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31457797.784411725!2d80.88715147621804!3d35.9690934090060
6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35d0992038b6f237%3A0x6defd67fbb81498c!2z5Lit5ZyL5rKz5Y2X55yB6ZaL5b
CB5biC!5e0!3m2!1szh-TW!2shk!4v1605773793955!5m2!1szh-TW!2shk"
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
import { setTimeout, clearTimeout } from 'timers';
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
       that.load = false;
      // that.timer = setInterval(function() {
      //   //
      //   if (document.readyState === "complete" && that.imgCount >= that.imgTotal) {
      //     // console.log(document.readyState, that.imgCount)
      //     that.load = false;
      //     window.clearInterval(that.timer);
      //   }
      // }, 500);
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
          city:null,
          nianfen01:null,
          nianfen02:null,
          border:null
        },
        canvasImagesObj: {
          capital: null,
          // wuhu: null,
          // dongjin: null,
        },
        control2:{
          nanhan:true,
          nantang:true,
          beihan:true,
          su:true,
          nanping:true,
          wuyue:true,
          beisong:true,

        },
        control: {
          city:false,
          border:false,
          nianfen01:false,
          nianfen02:false,
          
          // border1:false,
          // border:false,
          // route:false,
          // refugee2:false
        },
        Redroadtimer: null,
        load: true,
        noVoice: false,
        zoomObj: null,
        imgCount: 0,
        imgTotal: 5,
        questionItem: [
          "A. 南漢",
          "B. 後蜀",
          "C. 吳越 "
        ],
        rightans: 1,
        showWrong: 0,
        currAns: null,
        questionItem2: ["A. 是唯一位於北方的十國政權",
          "B. 領地位於遼國與吳越之間 ",
          "C. 領土包括河南與淮北之地"
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
            ico: require("../static/img/icon/year01_icon.png"),
            text: "滅於宋太祖的政權（年分）",
            show: false
          },
          {
            ico: require("../static/img/icon/year02_icon.png"),
            text: "滅於宋太宗的政權（年分）",
            show: false
          },
          {
            ico: require("../static/img/icon/city_icon.png"),
            text: "歸降的地區 ",
            show: false
          },
          {
            ico: require("../static/img/icon/capital_icon.png"),
            text: "開封（今河南省開封市）",
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
        // this.m05.pause();
        // this.m06.pause();
        // this.license.pause();
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
            this.showCityAni(this.canvasObj['capital'],swip)
            if(!swip){
                        clearInterval(this.canvasObj['capital'].timeout);
                this.canvasObj['capital'].style.visibility = "visible";
                this.canvasObj['capital'].ani = false;
            }
            break;
          case 1:            
            
            if (swip && !this.noVoice) {
              this.m02.currentTime = 0;
              this.m02.play();
              // this.timer1 = setTimeout(()=>{
              //    this.drawHousePromise2(false,'canvaszhangqian',625,100)
              // },43000)
            }
            // if(this.isShowall){
            //   this.timer1 = setTimeout(()=>{
            //      this.drawHousePromise2(false,'canvaszhangqian',625,100)
            //   },5000)
            // }
            // // this.control.border=swip
            // this.drawHousePromise2(swip,'canvaszhangqian',625,100)
            // if(!swip){
            //   clearTimeout(this.timer1)
            // }
            this.control.nianfen01=swip
            break;
          case 2:
            if (swip && !this.noVoice) {
              this.m03.currentTime = 0;
              this.m03.play();
            }
            // this.drawRedPath(swip)
            this.control.nianfen02=swip
            break;
          case 3:  
          
         this.control.city=swip
            break;
          
          case 4:
            this.mapPop = swip;
            break;
          case 5:
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
        let swip3 = this.list[3].show;
        // this.control.capital.show = this.list[1].show;
        this.canvasObj['capital'].style.visibility = this.list[0].show?'visible':'hidden'

        if (swip3) {
          this.canvasObj['capital'].style.visibility = 'visible'
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
          this.bodyHeight = document.body.innerHeight;
          this.bodytWidth = document.body.clientWidth;
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
            name: "capital",
            zindex: 3
          },
          
        {
            name: "canvasroute",
            zindex: 4
          },
          {
            name: "canvasroute2",
            zindex: 4
          },
          {
            name: "canvaszhangqian2",
            zindex: 4
          },
          {
            name: "canvaszhangqian",
            zindex: 4
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
        // this.m05 = document.createElement("audio");
        // this.m06 = document.createElement("audio");
        this.license = document.createElement("audio");
        this.m01.src = require("../static/img/vo/Chist_s2_map_040_01.mp3");
        this.m02.src = require("../static/img/vo/Chist_s2_map_040_02.mp3");
        this.m03.src = require("../static/img/vo/Chist_s2_map_040_03.mp3");
        this.m04.src = require("../static/img/vo/Chist_s2_map_040_04.mp3");
        // this.m05.src = require("../static/img/vo/chist_s1_map_037_5.mp3");
        // this.m06.src = require("../static/img/vo/chist_s1_map_037_6.mp3");


        Object.keys(this.imageObj).forEach(element => {
          this.imageObj[element] = new Image();
          this.insterCanvas(this.imageObj[element], String(element)+'.png', 'canvasImages', false)
          // this.insterCanvas2(this.imageObj[element],String(element)+'.png',()=>{
          //   this.imagesCanvas()
          // })
        });
        
        
       Object.keys(this.canvasImagesObj).forEach((element,i) => {
          this.canvasImagesObj[element] = new Image();
          this.insterCanvas(this.canvasImagesObj[element], String(element) + '.png', String(element), i==0?true:false)
        });
        var imageHorse = new Image();
        var route = new Image();
        var routeb = new Image();
        // this.insterCanvas2(route, 'changcheng.png', () => {
        //   this.pathObject = {
        //   source: route,
        //   originX: 0,
        //   originY: 0,
        //   width: this.baseWidth,
        //   height: this.baseHeight,
        //   mask1: {
        //     originX: 330,
        //     originY: 51,
        //     width: 1,
        //     height: 806,
        //     currOriginX: 330,
        //     currOriginY: 51,
        //     shiftX: 2,
        //     shiftY: 0,
        //     endPoint: 600
        //   },
        //   }
        // })
        
        // this.insterCanvas2(imageHorse, 'Liaosoldier.png', () => {
        //   var translate = [
        //     [659.8,100]       
        //   ];
        //   var scale = [1];
        //   var dur = [
        //     60,
        //   ];
        //   var sharpPoint = [
        //     1, 
        //   ];
        //   this.horseObject1 = this.initHorseObject2(            
        //     imageHorse
        //   );
         

        // })
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
          totalFrame: 9,
          currFrame: 0,
          width: 277.5,
          height: 170,
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
          totalFrame: 9,
          currFrame: 0,
           width: 277.5,
          height: 170,
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
           totalFrame: 3,
          currFrame: 0,
           width: 246.5,
          height: 320,
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
    .question2,.question3 {
      flex-wrap: wrap;
      display: flex; // margin-bottom: 0.5em !important;
      .item {
        width: 70% !important;
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
