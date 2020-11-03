<template>
  <div id="app">
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')" />
    </div>
    <div v-show="!load"
      id="main_container"
      :style="{
        width: docWidth + 'px',
        height: docHeight + 'px',
        display: load ? 'none' : 'block'
      }"
    >
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>玄奘西行路線圖 (627-645 年)</span>
        <div
          id="soundCon"
          :class="{ mute: noVoice }"
           @click="setVoice"
        ></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{ width: canvasW + 'px', height: canvasH + 'px' }"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'capital.png'" :static="control.capital.show" :zindex="3" @update="updateImg"></imageview>
            <imageview :imgsrc="'main_city.png'" :static="control.maincity" :zindex="3" @update="updateImg"></imageview>
            <imageview :imgsrc="'main_city1.png'" :static="control.maincity1.show" :zindex="3" @update="updateImg"></imageview>
            <imageview :imgsrc="'gate.png'" :static="control.gate" :zindex="3" @update="updateImg"></imageview>
            <imageview :imgsrc="'route_green.png'" :static="control.routegreen" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'route_red.png'" :static="control.routered" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'temple.png'" :static="control.temple.show" :zindex="3" @update="updateImg"></imageview>
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
              :class="{ clicked: item.show }"
              v-for="(item, index) in list"
              :key="index"
              @click="showCanvas(index)"
            >
              <div class="iconItem">
                <span class="icon"><img :src="item.ico"/></span>
                <span>{{ item.text }}</span>
              </div>
            </div>
          </div>
          <div class="greyContainer">
            <div
              style="display: flex; width: 100%; justify-content: space-between;"
            >
              <div class="blueButton action_all" @click="showall(true)">
                全部顯示
              </div>
              <div class="blueButton action_all " @click="showall(false)">
                全部隱藏
              </div>
            </div>
          </div>
          <!-- 滑块 -->
          <bar
            @offestx="setScale"
            @moveOut="moveOut"
            :scaleindex.sync="scaleindex"
          />
        </div>
      </div>
    </div>
    <modal
      class=""
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="
        popWindow = false;
        list[7].show = false;
      "
    >
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="flex">
              <em class="mr5">1.</em><em> 玄奘選取了較遠的路線<span class="dot">，</span>取道向西北絲路進發<span class="dot">，</span>再南下天竺<span class="dot">，</span>為了避開哪一個邊族的統治區？</em>
            </div>
            <div>
              <span
                class="item"
                :class="{ selected: currAns == index }"
                v-for="(item, index) in questionItem"
                :key="index"
                @click="checkans(index)"
                >{{ item }}</span
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
              <em> 玄奘從哪一個關口離開大唐國境<span class="dot">，</span>展開他的取經求法之旅？</em></div>
            <div>
              <span
                class="item"
                :class="{ selected: currAns2 == index }"
                v-for="(item, index) in questionItem2"
                :key="index"
                @click="checkans2(index)"
                >{{ item }}</span
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23899995.664822634!2d88.44333895994264!3d37.11619687536117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3813ad017a41a499%3A0x1710fcbe82b250ec!2z5Lit5ZyL5paw55aG57at5ZC-54i-6Ieq5rK75Y2A6ZC16ZaA6Zec5biC!5e0!3m2!1szh-TW!2shk!4v1575951283588!5m2!1szh-TW!2shk"
          :width="bodytWidth / 1.8"
          :height="bodyHeight / 1.8"
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
        console.log(document.readyState,that.imgCount)
        that.load = false;
        window.clearInterval(that.timer);
        
      }
    }, 500);
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
      control:{
        capital:{
          show:false,
          ani:false,
          timer:null
        },
        temple:{
          show:false,
          ani:false,
          timer:null
        },
        maincity1:{
          show:false,
          ani:false,
          timer:null
        },
        gate:false,
        routegreen:false,
        routered:false,
        maincity:false,
      },
      Redroadtimer:null,
      load: true,
      noVoice: false,
      zoomObj: null,
      imgCount:0,
      imgTotal:12,
      questionItem: [
        "A. 吐蕃",
        "B. 突厥",
        "C. 獅子國"
      ],
      rightans: 0,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 玉門關",
        "B. 潼關",
        "C. 鐵門關"],
      rightans2: 2,
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
          ico: require("../static/img/icon/main_city_icon.png"),
          text: "要邑",
          show: false
        },
        {
          ico: require("../static/img/icon/gate_icon.png"),
          text: "關口",
          show: false
        },
        {
          ico: require("../static/img/icon/route_red_011_icon.png"),
          text: "玄奘西行路線",
          show: false
        },
        {
          ico: require("../static/img/icon/temple_icon.png"),
          text: "寺院",
          show: false
        },
        {
          ico: require("../static/img/icon/route_green_011_icon.png"),
          text: "玄奘回程路線",
          show: false
        },
        {
          ico: require("../static/img/icon/gate_icon.png"),
          text: "鐵門關（今新疆鐵門關市）",
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
      canvasData: [
        "canvasStatic1",
        false,
        "canvasStatic5",
        "canvasStatic2",
        false,
        "canvasStatic5",
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      license: null,
      horsetimerGroup: null,
      drawHorsesTimeout: null,
      drawHorsesTimeout1: null,
      drawHorsesTimeout2: null,
      drawHorsesTimeout3:null,
      redTimer: null,
      shipPlay: false,
      titleH: 70,
      canvasAnimHorse: null,
      prevorienta: "",
      map1: false,
      map2: false,
      map3: false,
      map4: false,
      map5: false,
      map6: false,
      map7: false,
      pathObject: {},
      pathObjectGreen: {},
      pathObjectblue: {},
      chenTimer: null,
      lin2timer: null,
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {},
      timer1: null,
      timer2: null,
      timer3:null,
      blueSwitch:true,
      point2:false,
      point2timer:null
      // blueSwitch:true
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
    imgCount(){
      // if(this.imgCount == this.imgTotal){
      //   this.load = false;
      //   this.Redroadtimer = setInterval(() => {
      //     // console.log(this.pathObject.animated)
      //     if(this.pathObjectblue.animated == true){
      //       this.load = false;
      //       this.drawbluePath(false)
      //       window.clearInterval(this.Redroadtimer);
      //     }
      //   }, 500);
      //   // this.drawHousePromise(true)
      //   // this.drawbluePath(true)
      // }
    }
  },
  methods: {
    updateImg(){
      this.imgCount ++ 
    },
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
     
    },
    showCanvas(index) {
      // let c = document.getElementById(this.canvasData[index]);
      let swip = !this.list[index].show;
      this.muteMe();
      switch (index) {
        case 0:
          //首都
          if (swip && !this.noVoice) {
            this.m01.currentTime = 0;
            this.m01.play();
          }
           this.drawHousePromise1(swip,'canvasmonk1',1100,390);
          this.sharpCity(this.control.capital, swip);
          break;
        case 1:
          this.control.maincity = swip
          this.control.maincity1.show = swip
          break;
        case 2:
         if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          this.control.gate= swip
          break;
        case 3:
          
          if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
          }
          this.control.routered = swip
          this.drawHousePromise(swip)
          document.getElementById('canvasmonk1').style.visibility = 'hidden';
          break;

        case 4:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
          }
          if(swip){
            this.timer2 = setTimeout(()=>{
            this.drawHousePromise2(false,'canvasmonk4');
          },14000)
          }else{
            clearTimeout(this.timer2)
          }
          
          this.sharpCity(this.control.temple, swip);
          this.drawHousePromise2(swip,'canvasmonk4',493,621);
          break;
        case 5:
        
          if (swip && !this.noVoice) {
            this.m05.currentTime = 0;
            this.m05.play();
          }
          this.control.routegreen = swip
          if(swip){
            this.timer1 = setTimeout(()=>{
            this.sharpCity(this.control.maincity1, true);
          },8500)
          this.timer3 = setTimeout(()=>{
            this.drawHousePromise3(swip,this)
          },11000)
            
          }else{
            this.drawHousePromise3(false,this)
            clearTimeout(this.timer1)
            clearTimeout(this.timer3)
            this.sharpCity(this.control.maincity1, false);
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
      this.conflict();
    },
    conflict() {
      let swip0 = this.list[0].show;
      let swip1 = this.list[1].show;
      let swip2 = this.list[2].show;
      let swip3 = this.list[3].show;
      let swip4 = this.list[4].show;
      let swip5 = this.list[5].show;
      
      this.control.capital.show = swip0
      this.control.maincity1.show=swip1
      this.control.gate=swip2
      this.control.temple.show=swip4
     
      if (swip3) {
        this.control.capital.show=true
        this.control.maincity1.show = true
        this.control.gate = true
        this.control.temple.show = true
      }
      if (swip5) {
        this.control.capital.show=true
      }
     
    },
    oriChange() {
      setTimeout(() => {
        this.setRemUnit();
      }, 200);
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
      this.canvasData.forEach((e, index) => {
        if (type) {
          this.list[index].show = false;
        } else {
          this.list[index].show = true;
        }
        this.showCanvas(index);
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
        // { name: "canvasStatic2", zindex: 1 },
        // { name: "canvasStatic3", zindex: 2 },
        // { name: "canvasStatic4", zindex: 2 },
        // { name: "canvasAnimRedPath", zindex: 1 },
        // { name: "canvasAnimGreenPath", zindex: 2 },
        { name: "canvasmonk1", zindex: 4 },
        { name: "canvasmonk4", zindex: 4 },
        { name: "canvasmonk2", zindex: 4 },
        { name: "canvasmonk3", zindex: 4 }
      ];
      this.createCanvas(list, divTag);
      /* 音频 */
      this.m01 = document.createElement("audio");
      this.m02 = document.createElement("audio");
      this.m03 = document.createElement("audio");
      this.m04 = document.createElement("audio");
      this.m05 = document.createElement("audio");
      this.m06 = document.createElement("audio");
      this.license = document.createElement("audio");
      this.m01.src = require("../static/img/vo/Map011-1.mp3");
      this.m02.src = require("../static/img/vo/Map011-3.mp3");
      this.m03.src = require("../static/img/vo/Map011-4.mp3");
      this.m04.src = require("../static/img/vo/Map011-5.mp3");
      this.m05.src = require("../static/img/vo/Map011-6.mp3");

    
      var monk3 = new Image();
      var monk3_b = new Image();
      var monk2 = new Image();
      
      monk3.src = require("../static/img/monk3.png");
      monk3_b.src = require("../static/img/monk3_b.png");
      monk2.src = require("../static/img/monk2.png");
      
      this.insterCanvas2(monk3,()=>{
        this.horseObject2 = this.initHorseObject2(monk3);
        this.horseObject4 = this.initHorseObject2(monk3);
         var translate = [
          [1097, 383],[1021, 387],[821, 315],[671, 245],[545,235],
          [345,181],[213,233],[194,328],[290,384],[312,502],
          [248,562],[252,586],[312,546],[340,664],[430,649],
          [420,686],[496,674],[572,694],[410,864],
          [356,838],[368,904],[322,988],[210,970],[164,738],
          [116,752],[136,718],[216,740],[274,726],[255,695],
          [61,699],[56,635],[140,543],[192,621],[378,758]
        ];
        var scale = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,  1,1,1,0];
        var dur = [
          5,15,8,10,15, 
        8,10,8,5,8,
        3,5,10,8,5,
        5,10,15,5,
        8,8,8,10,4,
        3,8,8,3,14,
        5,8,8,13,15
        ];
        var sharpPoint = [
          1,1,1,1,1,
          1,-1,-1,-1,1,
          -1,-1,-1,-1,1,
          -1,-1,1,1,
          1,1,1,1,1,
          -1,-1,-1,1,1,
          -1,-1,-1,-1,-1
        ];
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          monk3
        );
      })
      this.insterCanvas2(monk3_b,()=>{
       this.horseObject1.source2 = monk3_b
      })
      this.insterCanvas2(monk2,()=>{
         var translate = [
          [150, 625],[141, 460],[184, 380],[72, 300],[113,270],
          [167,307],[285,297],[316,348],[612,306],[764,336],
          [824,390],[1123,520]
        ];
        var scale = [1,1,1,1,1,1,1,1,1,1,1,0];
        var dur = [
          10,4,8,5,5,
          5, 5,8,8,5,
          8,8
        ];
        var sharpPoint = [
          1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        this.horseObject3 = this.initHorseObject3(
          translate,
          scale,
          dur,
          sharpPoint,
          monk2
        );
      })

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
    insterCanvas2(img, fun) {
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
         width: 135,
        height: 256,
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
    // background: url("../static/img/map.png");
    background-size: cover;
  }
  .detail_div {
    display: inline-block;
    width: 100%;
    height: 100%;
    background: url("../static/img/mapDetail.png");
    background-size: cover;
    z-index:2;
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
        margin: auto;
        // object-fit:contain;
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
  em{
    font-style: normal;
  }
}
.mr5{
  margin-right: 5px;
}
}
</style>
