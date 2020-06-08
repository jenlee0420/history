<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div
      id="main_container"
      :style="{'width':docWidth+'px','height':docHeight+'px','display':load?'none':'block'}"
    >
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>黃巢起事路線圖 (875-884 年)</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{'width':canvasW+'px','height':canvasH+'px'}"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <div class="detail_div pos_a"></div>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div
            id="action_container"
            class="greyContainer"
            style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;"
          >
            <div class="sample_title">圖例</div>
            <div
              class="sample blueButton action"
              :class="{'clicked':item.show}"
              v-for="(item,index) in list"
              :key="index"
              @click="showCanvas(index)"
            >
              <div class="iconItem">
                <span class="icon">
                  <img :src="item.ico" />
                </span>
                <span>{{item.text}}</span>
              </div>
            </div>
          </div>
          <div class="greyContainer">
            <div style="display: flex; width: 100%; justify-content: space-between;">
              <div class="blueButton action_all" @click="showall(true)">全部顯示</div>
              <div class="blueButton action_all" @click="showall(false)">全部隱藏</div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex" />
        </div>
      </div>
    </div>
    <modal
      class
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="popWindow=false;list[8].show=false"
    >
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="flex">
              <em class="mr5">1. </em><em>黃巢的起義部隊轉戰唐朝的東南地區<span class="dot">，</span>以下哪一個不是曾受<br>攻擊的沿海港口？</em>
            </div>
            <div>
              <span
                class="item"
                :class="{'selected':currAns==index}"
                v-for="(item,index) in questionItem"
                :key="index"
                @click="checkans(index)"
              >{{item}}</span>
            </div>
            <div
              class="ansBox"
              :class="showWrong==false?'wrongico':'rightico'"
              v-if="currAns!=null"
            ></div>
          </div>
          <div class="question">
            <div>2. 按地圖所示<span class="dot">，</span>黃巢起事後<span class="dot">，</span>率眾向哪一方向進攻？</div>
            <div>
              <span
                class="item"
                :class="{'selected':currAns2==index}"
                v-for="(item,index) in questionItem2"
                :key="index"
                @click="checkans2(index)"
              >{{item}}</span>
            </div>
            <div
              class="ansBox"
              :class="showWrong2==false?'wrongico':'rightico'"
              v-if="currAns2!=null"
            ></div>
          </div>
        </div>
      </div>
    </modal>
    <modal
      class
      :headTitle="list[7].text"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="mapPop=false;list[7].show=false"
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22083026.043237876!2d90.3322628713065!3d38.68419937372039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35c228a3278a80b3%3A0x5b09db3a09cd99e1!2z5rOw5bGx!5e0!3m2!1szh-TW!2shk!4v1575948308661!5m2!1szh-TW!2shk"
          :width="bodytWidth/1.8"
          :height="bodyHeight/1.8"
          frameborder="0"
          style="border:0;"
          allowfullscreen
        ></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
import zoom from "./js/zoom.js";
import modal from "./components/modal";
import bar from "./components/bar";
// import tools from './js/animate.js';
export default {
  components: {
    modal,
    bar
  },
  name: "App",
  beforeCreate() {},
  created() {
    const that = this;
    that.timer = setInterval(function() {
      if (document.readyState === "complete" && that.imgCount == that.imgTotal) {
        that.load = false;
        window.clearInterval(that.timer);
      }
    }, 10);
  },
  mounted() {
    this.createMap();
    if ("onorientationchange" in window) {
      window.addEventListener("orientationchange", this.oriChange, false);
    } else {
      window.addEventListener("resize", this.setRemUnit, false);
    }
    // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
    this.zoomObj = require("./js/zoom.js");
    this.setRemUnit();
    this.initCanvas();

    document
      .getElementById("map_container")
      .addEventListener("touchmove", this.bodyScroll, {
        passive: false //  禁止 passive 效果
      });
  },
  data() {
    return {
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: [
        "A. 江陵",
        "B. 福州",
        "C. 廣州"
      ],
      rightans: 0,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 北方", "B. 南方", "C. 西方"],
      rightans2: 1,
      showWrong2: 0,
      currAns2: null,
      data: [],
      mapPop: false,
      list: [
        {
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
          text: "要邑",
          show: false
        },
        {
          ico: require("../static/img/icon/uprise_icon.png"),
          text: "起事地點",
          show: false
        },
        {
          ico: require("../static/img/icon/mountain_icon.png"),
          text: "山嶺",
          show: false
        },
        {
          ico: require("../static/img/icon/route_green_010_icon.png"),
          text: "黃巢作戰路線",
          show: false
        },
        {
          ico: require("../static/img/icon/route_purple_010_icon.png"),
          text: "黃巢敗退路線",
          show: false
        },
        {
          ico: require("../static/img/icon/mountain_icon.png"),
          text: "泰山",
          type: "map",
          show: false
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
      baseHeight: "1315",
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
      horseObject2: {},
      horseObject3: {},
      horseObject4: {},
      horseObject5: {},
      scaleindex: 0,
      ele: null,
      popWindow: false,
      canvasData: [
        "myCanvasStatic1",
        "myCanvasStatic2",
        "myCanvasStatic3",
        "myCanvasStatic4",
        "myCanvasStatic5",
        false
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      m05: null,
      m06: null,
      license: null,
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      drawHorsesTimeout2: null,
      redTimer: {
        timer:null,
        animate:false
      },
      shipPlay: false,
      titleH: 70,
      prevorienta: "",
      borderAni: false,
      borderAni1: false,
      pathObject: {},
      pathObjectPurple: {},
      chenTimer: null,
      lin2timer: null,
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {},
      imgCount:0,
      imgTotal:18,
      timer:null
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
    imgCount:function(n,o){
      // console.log(this.imgCount)
    }
  },
  methods: {
    setVoice(){
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
      this.scream.pause();
    },
    showCanvas(index) {
      let c = this.canvasObj[this.canvasData[index]];
      let swip = !this.list[index].show;
      this.muteMe();
      switch (index) {
        case 0:
          if (swip && !this.noVoice) {
            this.m01.currentTime = 0;
            this.m01.play();
          }
          this.showCityAni(c, swip);
          break;
        case 1:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          this.showCityAni(c, swip);
          break;
        case 2:
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 3:
          if (swip && !this.noVoice) {
            this.license.currentTime = 0;
            this.license.play();
            this.m03.currentTime = 0;
            this.m03.play();
            this.playTimes(this.m03,this.license)
          }
          c.style.visibility = swip ? "visible" : "hidden";
          break;

        case 4:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
            this.m04.onended= ()=>{
              this.scream.currentTime = 0;
              this.scream.play();
            }
          }
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 5:
          if (swip && !this.noVoice) {
            this.m05.currentTime = 0;
            this.m05.play();
          }
          this.drawGreen(swip)
          this.drawGreen2(swip)
          this.drawHousePromise(swip)
          break;

        case 6:
          if (swip && !this.noVoice) {
            this.m06.currentTime = 0;
            this.m06.play();
          }
          this.drawPurple(swip)
          break;
        case 7:
          this.mapPop = swip;
          break;
        case 8:
          this.popWindow = swip;
          this.currAns = null;
          this.currAns2 = null;
          break;
        default:
          break;
      }
      this.list[index].show = swip;
      this.conflict();
    },
    conflict() {
      let swip4 = this.list[4].show;
      let swip6 = this.list[6].show;
      if (swip6 || swip4) {
        document.getElementById("myCanvasStatic5").style.visibility = "visible";
      }
    },
    oriChange() {
      setTimeout(() => {
        this.setRemUnit();
      }, 100);
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
        console.log(this.boxscale, this.o, this.dpr, this.rem);
        document.documentElement.style.fontSize = this.rem + "px";
      };
      selffun();
      this.setZoom();
    },
    initCanvas() {},
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
    showall(type) {
      this.list.forEach((e, index) => {
        if (!this.list[index].type) {
          if (type) {
            this.list[index].show = false;
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
      let list = [
        { name: "myCanvasStatic1", zindex: 2 }, //首都
        { name: "myCanvasStatic2", zindex: 4 }, //关口
        { name: "myCanvasStatic3", zindex: 4 }, //要邑
        { name: "myCanvasStatic4", zindex: 2 }, //起事地点
        { name: "myCanvasStatic5", zindex: 2 }, //山岭
        { name: "myCanvasAnimGreenPath", zindex: 3 },  
        { name: "myCanvasAnimGreenPath2", zindex: 3 },
        { name: "myCanvasAnimPurple", zindex: 3 },
        { name: "person", zindex: 4 },
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
      this.scream = document.createElement("audio");
      this.m01.src = require("../static/img/vo/Map010-1.mp3");
      this.m02.src = require("../static/img/vo/Map010-2.mp3");
      this.m03.src = require("../static/img/vo/Map010-4.mp3");
      this.m04.src = require("../static/img/vo/Map010-5.mp3");
      this.m05.src = require("../static/img/vo/Map010-6.mp3");
      this.m06.src = require("../static/img/vo/Map010-7.mp3");
      this.scream.src = require("../static/img/vo/scream.mp3");
      this.license.src = require("../static/img/vo/License.mp3");
      this.license.loop='loop'
      this.scream.volume=0.2
      this.license.volume=0.2
      // Variable init

      var imageCapital = new Image();
      var imageGate = new Image();
      var imageMainCity = new Image();
      var imageHorse = new Image();
      var mountain = new Image();
      var person = new Image();
        var uprise = new Image();
        var routepurple = new Image();
        var route1 = new Image();
        var route2 = new Image();
        var route3 = new Image();
        var route4 = new Image();
        var route5 = new Image();
        var route6 = new Image();
        var route7 = new Image();
        var route8 = new Image();
        var route9 = new Image();
        var route10 = new Image();
        var route11 = new Image();

        mountain.src = require("../static/img/mountain.png");
        uprise.src = require("../static/img/uprise.png");
        person.src = require("../static/img/people.png");

      imageCapital.src = require("../static/img/capital.png");
      imageMainCity.src = require("../static/img/main_city.png");
      imageGate.src = require("../static/img/gate.png");
      
      routepurple.src = require("../static/img/route_purple.png");
      route1.src = require("../static/img/route_green_1.png");
      route2.src = require("../static/img/route_green_2.png");
      route3.src = require("../static/img/route_green_3.png");
      route4.src = require("../static/img/route_green_4.png");
      route5.src = require("../static/img/route_green_5.png");
      route6.src = require("../static/img/route_green_6.png");
      route7.src = require("../static/img/route_green_7.png");
      route8.src = require("../static/img/route_green_8.png");
      route9.src = require("../static/img/route_green_9.png");
      route10.src = require("../static/img/route_green_10.png");
      route11.src = require("../static/img/route_green_11.png");

      this.insterCanvas(imageCapital, "myCanvasStatic1", false);
      this.insterCanvas(imageGate, "myCanvasStatic2", false);
      this.insterCanvas(imageMainCity, "myCanvasStatic3", false);
      this.insterCanvas(uprise, "myCanvasStatic4", false);
      this.insterCanvas(mountain, "myCanvasStatic5", false);

      person.onload = () => {
        this.imgCount++
        var translate = [[596, 352], [596, 805], [653, 631], [860, 516],[834,624],
        [830,771],[824,827],[619,923],[527,1111],[414,1099],[328,985],[457,782],
        [375,688],[379,582],[447,634],[535,552],[683,654],[729,644],[794,474],[785,338],
        [546,348],[394,274],[248,380]];
        var scale = [1, 1, 1,1, 1, 1,1, 1, 1,1, 1, 1,1, 1, 1,1, 1,1, 1, 1,1, 1,0];
        var dur = [25, 8, 8, 8,8,5,10,10,10,8,15,10,10,5,5,5,8,8,8,8,8,10,10,10,20];
        var sharpPoint = [0, 0, 0, 2];
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          person
        );
      };
      routepurple.onload = () => {
        this.imgCount++
        this.pathObjectPurple = {
          source: routepurple,
          originX: 0,
          originY: 0,
          width: this.baseWidth,
          height: this.baseHeight,
          mask1: {
            originX: 231,
            originY: 182,
            width: 1,
            height: 251,
            currOriginX: 231,
            currOriginY: 182,
            shiftX: 8,
            shiftY: 0,
            endPoint:495
          },
           mask2: {
            originX: 705,
            originY: 288,
            width: 120,
            height: 200,
            currOriginX: 705,
            currOriginY: 288,
            shiftX: 8,
            shiftY: 0,
            endPoint:150
          },
          timeout: null,
          playing: false
        };
      }
      route1.onload = () => {
        this.imgCount++
        this.pathObject = {
          source: route1,
          originX: 0,
          originY: 0,
          width: this.baseWidth,
          height: this.baseHeight,
          mask1: {
            source: route1,
            originX: 652,
            originY: 344,
            width: 86,
            height: 1,
            currOriginX: 652,
            currOriginY: 344,
            shiftX: 10,
            shiftY: 0,
            endPoint:570
          },
          mask2: {
            source: route1,
            originX: 724,
            originY: 895,
            width: 98,
            height: 302,
            currOriginX: 724,
            currOriginY: 895,
            shiftX: 10,
            shiftY: 0,
            endPoint:660
          },
          mask3: {
            source: route1,
            originX: 551,
            originY: 546,
            width: 220,
            height: 116,
            currOriginX: 551,
            currOriginY: 546,
            shiftX: 10,
            shiftY: 0,
            endPoint:790
          },
          timeout: null,
          timeout2: null,
          playing: false
        };
      };
      route2.onload = () => {
        this.imgCount++
        this.pathObject.mask4={
          source: route2,
          originX: 930,
          originY: 313,
          width: 128,
          height: 292,
          currOriginX: 930,
          currOriginY: 313,
          shiftX: 10,
          shiftY: 0,
          endPoint:603
        }
        this.pathObject.mask5={
          source: route2,
          originX: 967,
          originY: 874,
          width: 56,
          height: 20,
          currOriginX: 967,
          currOriginY: 874,
          shiftX: 10,
          shiftY: 0,
          endPoint:890
        }
      };
      route3.onload = () => {
        this.imgCount++
        this.pathObject.mask6={
          source: route3,
          originX: 1024,
          originY: 901,
          width: 400,
          height: 292,
          currOriginX: 1024,
          currOriginY: 901,
          shiftX: 10,
          shiftY: 0,
          endPoint:632
        }
      };
      route4.onload = () => {
        this.imgCount++
        this.pathObject.mask7={
          source: route4,
          originX: 660,
          originY: 1064,
          width: 247,
          height: 153,
          currOriginX: 660,
          currOriginY: 1064,
          shiftX: 10,
          shiftY: 0,
          endPoint:414
        }
      };
      route5.onload = () => {
        this.imgCount++
        this.pathObject.mask8={
          source: route5,
          originX: 414,
          originY: 1064,
          width: 247,
          height: 226,
          currOriginX: 414,
          currOriginY: 1064,
          shiftX: 10,
          shiftY: 0,
          endPoint:836
        }
      };
      route6.onload = () => {
        this.imgCount++
        this.pathObject.mask9={
          source: route6,
          originX: 457,
          originY: 829,
          width: 139,
          height: 165,
          currOriginX: 457,
          currOriginY: 829,
          shiftX: 10,
          shiftY: 0,
          endPoint:741
        }
        this.pathObject.mask17={
          source: route6,
          originX: 462,
          originY: 745,
          width: 41,
          height: 85,
          currOriginX: 462,
          currOriginY: 745,
          shiftX: 10,
          shiftY: 0,
          endPoint:657
        }
      };
      route7.onload = () => {
        this.imgCount++
        this.pathObject.mask10={
          source: route7,
          originX: 348,
          originY: 657,
          width: 151,
          height: 85,
          currOriginX: 348,
          currOriginY: 657,
          shiftX: 10,
          shiftY: 0,
          endPoint:502
        }
      };
      route8.onload = () => {
        this.imgCount++
        this.pathObject.mask11={
          source: route8,
          originX: 433,
          originY: 639,
          width: 228,
          height: 143,
          currOriginX: 433,
          currOriginY: 639,
          shiftX: 10,
          shiftY: 0,
          endPoint:661
        }
        //y
        this.pathObject.mask12={
          source: route8,
          originX: 886,
          originY: 739,
          width: 53,
          height: 222,
          currOriginX: 886,
          currOriginY: 739,
          shiftX: 10,
          shiftY: 0,
          endPoint:519
        }
      };
      route9.onload = () => {
        this.imgCount++
        //y
        this.pathObject.mask13={
          source: route9,
          originX: 857,
          originY: 512,
          width: 54,
          height: 106,
          currOriginX: 857,
          currOriginY: 512,
          shiftX: 10,
          shiftY: 0,
          endPoint:410
        }
        //x
        this.pathObject.mask14={
          source: route9,
          originX: 886,
          originY: 344,
          width: 409,
          height: 117,
          currOriginX: 886,
          currOriginY: 344,
          shiftX: 10,
          shiftY: 0,
          endPoint:493
        }
      };
      route10.onload = () => {
        this.imgCount++
        this.pathObject.mask15={
          source: route10,
          originX: 489,
          originY: 303,
          width: 148,
          height: 100,
          currOriginX: 489,
          currOriginY: 303,
          shiftX: 10,
          shiftY: 0,
          endPoint:345
        }
      };
      route11.onload = () => {
        this.imgCount++
        this.pathObject.mask16={
          source: route11,
          originX: 345,
          originY: 303,
          width: 65,
          height: 100,
          currOriginX: 345,
          currOriginY: 303,
          shiftX: 10,
          shiftY: 0,
          endPoint:284
        }
      };
      // document.getElementById('map_container').append(divTag)
      // divTag.append(divTag)
      this.$nextTick(() => {
        this.setZoom();
      });
    },
    setZoom() {
      if (!document.getElementById("canvasInnerDiv")) {
        return;
      }
      this.zoomObj = new zoom(document.getElementById("canvasInnerDiv"), {
        width: this.baseWidth,
        height: this.baseHeight,
        top: 0,
        left: 0,
        minScale: this.boxscale,
        // maxScale: this.boxscale * 10,
        warpWidth: this.boxscale * this.baseWidth,
        warpHeight: this.boxscale * this.baseHeight
      });
      this.zoomObj.setScale(this.boxscale);
      // this.zoomObj.setTransform(false,0,0)
    },
    insterCanvas(img, contextStatic, bool) {
      img.onload = () => {
        this.imgCount++
        this.contextObj[contextStatic].drawImage(
          img,
          0,
          0,
          this.baseWidth,
          this.baseHeight
        );
        this.canvasObj[contextStatic].style.visibility = bool
          ? "visible"
          : "hidden";
      };
    },
    initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 4,
        currFrame: 0,
        width: 388,
        height: 300,
        position: {
          currPoint: 0,
          dur: 1,
          currDur: 1,
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
    canvasClear(canvas) {
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
    display: inline-block;
    background: url("../static/img/map.png");
    background-size: cover;
  }
  .detail_div {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url("../static/img/mapDetail.png");
    background-size: cover;
    z-index: 4;
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
        margin: auto;
        // object-fit:contain;
      }
    }
  }
}
.question2 {
  flex-wrap: wrap;
  display: flex;
  // margin-bottom: 0.5em !important;
  .item {
    width: 50% !important;
    margin-bottom: 0.8em !important;
  }
}
.flex{
  display: flex;
  em{font-style: normal;}
}
</style>
