<template>
  <div id="app">
    {{debug}}
    <!-- <canvas id="testCanvas"></canvas> -->
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;">
      <img :src="require('../static/img/loading.gif')">
    </div>
    <div v-show="!load" id="main_container" :style="mainBoxStyle">
      <div class="title_bar purpleGradient" :style="{ height: titleH + 'px' }">
        <span>佛教傳入中國路線與主要石窟分佈圖 (公元前6世紀-公元5世紀)</span>
        <div id="soundCon" :class="{ mute: noVoice }" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div
          id="map_container"
          class="modal_content"
          ref="map_container"
          :style="{ 'width': canvasW + 'px', 'height': canvasH + 'px' }"
        >
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
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
                <span class="icon">
                  <img :src="item.ico">
                </span>
                <span v-html="item.text"></span>
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
          <bar @offestx="setScale" @moveOut="moveOut" :scaleindex.sync="scaleindex"/>
        </div>
      </div>
    </div>
    <modal
      class=""
      :style="AppStyle"
      :dragable="!isApp"
      headTitle="問題"
      :hideFooter="true"
      v-if="popWindow"
      @cancel-event="
                popWindow = false;
                list[8].show = false;
              "
    >
      <div slot="modalCont">
        <div>
          <div class="question">
            <div class="flex">
              <em class="mr5">1.</em>
              <em>以下哪一個佛教石窟的始建時間最早？</em>
            </div>
            <div>
              <span
                class="item"
                :class="{ selected: currAns == index }"
                v-for="(item, index) in questionItem"
                :key="index"
                @click="checkans(index)"
              >{{ item }}</span>
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
              <em>以下哪項關於佛教傳入路線的描述是正確的？</em>
            </div>
            <div>
              <span
                class="item"
                :class="{ selected: currAns2 == index }"
                v-for="(item, index) in questionItem2"
                :key="index"
                @click="checkans2(index)"
                v-html="item"
              ></span>
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
      :style="AppStyle"
      :dragable="!isApp"
      :headTitle="list[7].text"
      :hideFooter="true"
      v-if="mapPop"
      @cancel-event="
                mapPop = false;
                list[7].show = false;
              "
    >
      <div slot="modalCont">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d35117116.51637757!2d81.04480650181601!3d31.48564225728168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37eac14a4a737231%3A0x7461bfc0c6bfc872!2z5Lit5ZyL55SY6IKF55yB6YWS5rOJ5biC5pWm54WM5biC!5e0!3m2!1szh-TW!2shk!4v1591589135677!5m2!1szh-TW!2shk"
          :width="(isApp?docWidth:bodytWidth)/1.8"
          :height="(isApp?docHeight:bodyHeight)/1.8"
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
import zoomApp from "./js/zoomApp.js";
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
  beforeCreate() {
  },
  created() {
     
    // const that = this;
    // that.timer = setInterval(function() {
    //   //
      
    //   if (
    //     document.readyState === "complete" &&
    //     that.imgCount >= that.imgTotal
    //   ) {
    //     // console.log(document.readyState, that.imgCount)
        
    //     that.load = false;
    //     window.clearInterval(that.timer);
    //   }
    // }, 500);
    
  },
  computed: {
    mainBoxStyle() {
      var css = {
        width: this.docWidth + "px",
        height: this.docHeight + "px",
        display: this.load ? "none" : "block",
        transform: this.pageTransform,
        "margin-top": this.pageMarginTop + "px",
        "margin-left": this.pageMarginLeft * -1 + "px"
      };
      return css;
    },
    AppStyle() {
      var css = {};
      if (this.isApp) {
        css = {
          width: this.docWidth + "px",
          height: this.docHeight + "px",
          transform: this.pageTransform,
          "margin-top": this.pageMarginTop + "px",
          "margin-left": this.pageMarginLeft * -1 + "px"
        };
      }
      return css;
    },
    isApp() {
      if (window.location.search.indexOf("app") >= 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    // this.testCanvas()
    this.createMap();    
    
    // window.addEventListener("onorientationchange" in window ?"orientationchange":"resize", this.setRemUnit, false);
    // this.zoomObj = require("./js/zoom.js");
    
    if (this.isApp) {
      this.forApp();
    } else {
      if ("onorientationchange" in window) {
      window.addEventListener("orientationchange", this.oriChange, false);
    } else {
      window.addEventListener("resize", this.setRemUnit, false);
    }
      this.setRemUnit();
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
      windowTimer:null,
      imageObj: {
        route: null,
        monk02: null
      },
      canvasImagesObj: {
        city1d: null,
        city1e: null,
        k: null,
        changan: null,
        dunhuang: null,
        pingcheng: null,
        louyang: null
      },
      control: {
        // city1d: false,
        // city1e: false,
        route: false,
        monk02: null
      },
      load: true,
      noVoice: false,
      zoomObj: null,
      imgCount: 0,
      imgTotal: 15,
      questionItem: ["A. 雲岡石窟", "B. 龍門石窟", "C. 莫高窟 "],
      rightans: 2,
      showWrong: 0,
      currAns: null,
      questionItem2: [
        "A. 佛教首先傳入中國南方",
        "B. 僧侶經西域傳入佛教  ",
        "C. 西域是佛教的發源地"
      ],
      rightans2: 1,
      showWrong2: 0,
      currAns2: null,
      data: [],
      mapPop: false,
      list: [
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "城鎮",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "敦煌（莫高窟）",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "平城（雲岡石窟）",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "洛陽（龍門石窟）",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "建康（今江蘇省南京市）",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "廬山（今江西省九江市）",
          show: false
        },
        {
          ico: require("../static/img/icon/route_038_icon.png"),
          text: "佛教傳入路線",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "敦煌（今甘肅省敦煌市）",
          show: false,
          type: "map"
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
      canvasH: 0,
      canvasW: 0,
      docWidth: "",
      docHeight: "",
      horseObject1: {},
      horseObject2: {},
      horseObject3: {},
      horseObject4: {},
      horseObject5: {},
      horseObject6: {},
      horseObject7: {},
      horseObject8: {},
      horseObject9: {},
      horseObject10: {},
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
      drawHorsesTimeout4: null,
      drawHorsesTimeout5: null,
      drawHorsesTimeout6: null,
      drawHorsesTimeout7: null,
      drawHorsesTimeout8: null,
      drawHorsesTimeout9: null,
      drawHorsesTimeout10: null,
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
      timer2: [],
      isShowall: false,
      btn2Play: false
    };
  },
  watch: {
    zoomObj: {
      handler(n, o) {
        this.scaleindex =
          ((n.scale - n.minScale) / (n.maxScale - n.minScale)) * 10;
      },
      deep: true
    },
    control: {
      handler(n, o) {
        this.imagesCanvas();
      },
      deep: true
    },
    btn2Play: function(n) {
      if (n) {
        this.drawStatue2(n);
      }
    }
  },
  methods: {
    updateImg() {
      this.imgCount++;
    },
    setVoice() {
      this.noVoice = !this.noVoice;
      this.muteMe();
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
    clear() {
      this.timer2[0] = setTimeout(() => {
        this.canvasObj["monk01"].style.visibility = "hidden";
      }, 5000);
      this.timer2[1] = setTimeout(() => {
        this.canvasObj["monk02"].style.visibility = "hidden";
      }, 5000);
    },
    muteMe() {
      this.m01.pause();
      this.m02.pause();
      this.m03.pause();
      this.m04.pause();
      this.m05.pause();
      this.m06.pause();
      this.m07.pause();
      // this.license.pause();
    },
    showCanvas(index) {
      let swip = !this.list[index].show;
      this.muteMe();
      if (index != 1 && index != 2) {
        // this.clear();
      }
      switch (index) {
        case 0:
          //首都
          if (swip && !this.noVoice) {
            this.m01.currentTime = 0;
            this.m01.play();
          }
          this.canvasObj["louyang"].ani = false;
          if (swip) {
            // this.showCityAni(this.canvasObj['changan'], swip)
            this.showCityAni(this.canvasObj["dunhuang"], swip);
            this.showCityAni(this.canvasObj["pingcheng"], swip);
            this.showCityAni(this.canvasObj["louyang"], swip);
          } else {
            this.canvasObj["dunhuang"].ani = false;
            this.canvasObj["pingcheng"].ani = false;
            this.canvasObj["louyang"].ani = false;
          }
          this.canvasObj["city1d"].style.visibility = swip
            ? "visible"
            : "hidden";
          this.canvasObj["city1e"].style.visibility = swip
            ? "visible"
            : "hidden";
          break;
        case 1:
          // this.control.monk01 = swip
          clearTimeout(this.timer1[0]);
          if (swip) {
            if (!this.noVoice && !this.isShowall) {
              this.m02.currentTime = 0;
              this.m02.play();
              this.timer1[0] = setTimeout(() => {
                this.drawHousePromise2(
                  false,
                  "monk01",
                  777,
                  394,
                  this.horseObject9
                );
              }, 45000);
            } else if (this.noVoice || this.isShowall) {
              this.timer1[0] = setTimeout(() => {
                this.drawHousePromise2(
                  false,
                  "monk01",
                  777,
                  394,
                  this.horseObject9
                );
              }, 5000);
            }
            this.showCityAni(this.canvasObj["dunhuang"], swip);
          } else {
            this.canvasObj["dunhuang"].ani = false;
            this.stopCityAni(this.canvasObj["dunhuang"]);
          }
          this.drawHousePromise2(swip, "monk01", 777, 394, this.horseObject9);
          break;
        case 2:
          // this.control.monk02 = swip
          clearTimeout(this.timer1[1]);
          if (swip) {
            if (!this.noVoice && !this.isShowall) {
              this.m03.currentTime = 0;
              this.m03.play();
              this.timer1[1] = setTimeout(() => {
                this.drawHousePromise3(false, "monk02", 1002, 425);
              }, 32000);
            } else if (this.noVoice || this.isShowall) {
              this.timer1[1] = setTimeout(() => {
                // this.control.monk02 = false
                this.drawHousePromise3(false, "monk02", 1002, 425);
              }, 6000);
            }
            this.showCityAni(this.canvasObj["pingcheng"], swip);
          } else {
            this.canvasObj["pingcheng"].ani = false;
            this.stopCityAni(this.canvasObj["pingcheng"]);
          }
          this.drawHousePromise3(swip, "monk02", 1002, 425);
          break;
        case 3:
          clearTimeout(this.timer1[2]);
          clearTimeout(this.timer1[7]);
          this.stopCityAni(this.canvasObj["louyang"]);
          if (swip) {
            if (!this.noVoice && !this.isShowall) {
              this.m04.currentTime = 0;
              this.m04.play();
              // this.m04.onended = () => {

              // }
            }
            this.timer1[2] = setTimeout(() => {
              this.canvasObj["louyang"].ani = false;
              this.drawHousePromise(false);
            }, 32000);
            // console.log(this.canvasObj['louyang'].ani)
            this.showCityAni(this.canvasObj["louyang"], swip);
            this.timer1[7] = setTimeout(() => {
              this.drawHousePromise(swip);
            }, 5000);
          } else {
            this.drawHousePromise(false);
          }
          break;
        case 4:
          clearTimeout(this.timer1[3]);
          if (swip) {
            if (!this.noVoice && !this.isShowall) {
              this.m05.currentTime = 0;
              this.m05.play();
              // this.m05.onended = () => {

              // }
            } else if (this.noVoice || this.isShowall) {
              this.timer1[3] = setTimeout(() => {
                this.canvasObj["city1d"].ani = false;
                // this.drawCity(false)
              }, 15000);
            }
            this.showCityAni(this.canvasObj["city1d"], swip).then(() => {
              this.drawCity(swip);
            });
          } else {
            this.canvasObj["city1d"].ani = false;
            clearInterval(this.canvasObj["city1d"].timeout);
            this.drawCity(false);
          }
          break;
        case 5:
          clearTimeout(this.timer1[4]);
          if (swip) {
            if (!this.noVoice && !this.isShowall) {
              this.m06.currentTime = 0;
              this.m06.play();
              // this.m06.onended = () => {

              // }
            } else if (this.noVoice || this.isShowall) {
              this.timer1[4] = setTimeout(() => {
                this.canvasObj["city1d"].ani = false;
                // this.drawCity2(false)
              }, 15000);
            }
            this.showCityAni(this.canvasObj["city1e"], true).then(() => {
              this.drawCity2(true);
            });
          } else {
            this.canvasObj["city1e"].ani = false;
            this.drawCity2(false);
            clearInterval(this.canvasObj["city1e"].timeout);
          }
          break;
        case 6:
          clearTimeout(this.timer1[5]);
          clearTimeout(this.timer1[6]);
          if (swip) {
            if (!this.noVoice && !this.isShowall) {
              this.m07.currentTime = 0;
              this.m07.play();
              this.m07.onended = () => {};
            } else if (this.noVoice || this.isShowall) {
            }
            this.drawStatue(swip);
            // this.drawStatuePath2(true)
            this.control.route = swip;
          } else {
            this.control.route = false;
            this.drawStatue(false);
            this.drawStatue2(false);
            this.drawStatuePath2(false);
            this.btn2Play = false;
          }
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
      // if(index!=false)this.conflict();
    },
    conflict() {
      let swip3 = this.list[3].show;
      // this.control.capital.show = this.list[1].show;
      this.canvasObj["capital"].style.visibility = this.list[0].show
        ? "visible"
        : "hidden";
      if (swip3) {
        this.canvasObj["capital"].style.visibility = "visible";
      }
    },
    oriChange() {
      this.windowTimer=setTimeout(() => {
          this.clearTimeout(this.windowTimer)
          this.setRemUnit();
        }, 200)
    },
    forApp() {
      const u_agent = navigator.userAgent;
      var selffun = () => {
        this.bodyHeight = window.innerHeight;
        this.bodytWidth = window.innerWidth;
        
        var offest = this.bodytWidth / this.bodyHeight;
        if (offest > 0.5) {
          this.boxscale = this.bodyHeight / 2048;
          this.o = 1396 * this.boxscale;
        } else {
          this.boxscale = this.bodytWidth / 1396;
          this.o = this.bodytWidth;
        }
        this.docWidth = 2048 * this.boxscale;
        this.docHeight = 1396 * this.boxscale;
        
        this.canvasH = Math.ceil(1315 * this.boxscale);

        this.canvasW = Math.ceil(1430 * this.boxscale);
                
        this.titleH = this.docHeight - this.canvasH;
        var s = 10;
        this.dpr = window.devicePixelRatio || 1;
        if (/iPad|iPhone|Android|Adr/i.test(u_agent)) {
          this.dpr = 2;
        }
        if (this.dpr >= 2) {
          this.dpr = 2;
          this.rem = this.o / this.dpr / 5.2;
        } else {
          this.rem = this.o / 10 / this.dpr;
        }
        document.documentElement.style.fontSize = this.rem + "px";

        this.pageTransform = "rotate3d(0,0,1,-90deg)";
        this.pageMarginTop = this.pageMarginLeft =
          (this.docWidth - this.docHeight) / 2;
      };
      
      selffun();
      
      this.setZoom();
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
      this.isShowall = type;
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
        {
          name: "k",
          zindex: 3
        },
        {
          name: "canvasImages",
          zindex: 3
        },
        {
          name: "changan",
          zindex: 3
        },
        {
          name: "dunhuang",
          zindex: 3
        },
        {
          name: "louyang",
          zindex: 3
        },
        {
          name: "pingcheng",
          zindex: 4
        },
        {
          name: "city1d",
          zindex: 4
        },
        {
          name: "city1e",
          zindex: 4
        },
        {
          name: "monk01",
          zindex: 4
        },
        {
          name: "monk02",
          zindex: 4
        },
        {
          name: "canvasroute",
          zindex: 4
        },
        {
          name: "canvaszhangqian",
          zindex: 4
        },
        {
          name: "canvastemple",
          zindex: 4
        },
        {
          name: "canvastemple2",
          zindex: 4
        },
        {
          name: "canvasStatue",
          zindex: 4
        },
        {
          name: "canvasStatue2",
          zindex: 4
        },
        {
          name: "canvasStatue3",
          zindex: 4
        },
        {
          name: "canvasStatue4",
          zindex: 4
        },
        {
          name: "canvasStatue5",
          zindex: 4
        }
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
      this.m01.src = require("../static/img/vo/chist_s1_map_038_01.mp3");
      this.m02.src = require("../static/img/vo/chist_s1_map_038_02.mp3");
      this.m03.src = require("../static/img/vo/chist_s1_map_038_03.mp3");
      this.m04.src = require("../static/img/vo/chist_s1_map_038_04.mp3");
      this.m05.src = require("../static/img/vo/chist_s1_map_038_05.mp3");
      this.m06.src = require("../static/img/vo/chist_s1_map_038_06.mp3");
      this.m07.src = require("../static/img/vo/chist_s1_map_038_07.mp3");
      Object.keys(this.imageObj).forEach(element => {
        this.imageObj[element] = new Image();
        this.insterCanvas(
          this.imageObj[element],
          String(element) + ".png",
          "canvasImages",
          false
        );
      });
      Object.keys(this.canvasImagesObj).forEach((element, i) => {
        this.canvasImagesObj[element] = new Image();
        this.insterCanvas(
          this.canvasImagesObj[element],
          String(element) + ".png",
          String(element),
          i > 1 ? true : false
        );
      });
      var imageHorse = new Image();
      var temple = new Image();
      var buddhastatue = new Image();
      var monk01 = new Image();
      this.insterCanvas2(monk01, "monk1.png", () => {
        this.horseObject9 = this.initHorseObject4(monk01);
        var translate = [[1002, 425], [1132, 522], [1213, 598]];
        var scale = [1, 1, 1];
        var dur = [65, 35, 35];
        var sharpPoint = [1, 1, 1];
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          monk01
        );
      });
      this.insterCanvas2(imageHorse, "monk.png", () => {});
      this.insterCanvas2(temple, "temple.png", () => {
        var translate = [[905, 607], [1190.3, 672], [1356, 708]];
        var scale = [1, 1, 0];
        var dur = [180, 20, 30];
        var sharpPoint = [1, 1, 1];
        this.horseObject2 = this.initHorseObject2(
          translate,
          scale,
          dur,
          sharpPoint,
          temple
        );
        translate = [
          [905, 607],
          [1098, 694],
          // [1154,738],
          [1283, 786]
        ];
        scale = [1, 1, 0];
        dur = [140, 30, 10];
        sharpPoint = [1, 1, 1];
        this.horseObject3 = this.initHorseObject2(
          translate,
          scale,
          dur,
          sharpPoint,
          temple
        );
      });
      this.insterCanvas2(buddhastatue, "buddhastatue.png", () => {
        var translate = [
          [435, 672],
          [279, 556],
          [209, 355],
          [373, 269],
          [651, 343],
          [857, 467],
          [1033, 539],
          [1159, 501]
        ];
        var scale = [1, 1, 1, 1, 1, 1, 1, 0];
        var dur = [30, 30, 30, 35, 30, 30, 30, 30];
        var sharpPoint = [1, 1, 1, 1, 1, 1, 1, 1];
        this.horseObject4 = this.initHorseObject3(
          translate,
          scale,
          dur,
          sharpPoint,
          buddhastatue
        );
        translate = [[209, 355], [435, 429], [587, 397], [651, 343]];
        scale = [1, 1, 1, 1];
        dur = [20, 20, 20, 20];
        sharpPoint = [1, 1, 1, 1];
        this.horseObject5 = this.initHorseObject3(
          translate,
          scale,
          dur,
          sharpPoint,
          buddhastatue
        );
        ///////////////////
        translate = [[981, 592], [1107, 406], [1145, 650]];
        scale = [1, 1, 0];
        dur = [50, 50, 40];
        sharpPoint = [1, 1, 1];
        this.horseObject6 = this.initHorseObject3(
          translate,
          scale,
          dur,
          sharpPoint,
          buddhastatue
        );
        ///////////////////
        translate = [[981, 592], [1175, 598], [1333, 702]];
        scale = [1, 1, 0];
        dur = [50, 50, 40];
        sharpPoint = [1, 1, 1];
        this.horseObject7 = this.initHorseObject3(
          translate,
          scale,
          dur,
          sharpPoint,
          buddhastatue
        );
        ///////////////////
        translate = [[981, 592], [1105, 644], [1261, 788]];
        scale = [1, 1, 0];
        dur = [50, 50, 40];
        sharpPoint = [1, 1, 1];
        this.horseObject8 = this.initHorseObject3(
          translate,
          scale,
          dur,
          sharpPoint,
          buddhastatue
        );
      });
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
      if (this.isApp) {
        this.zoomObj = new zoomApp(document.getElementById("canvasInnerDiv"), {
          width: this.baseWidth,
          height: this.baseHeight,
          top: 0,
          left: 0,
          minScale: this.boxscale,
          // maxScale: this.boxscale * 10,
          warpWidth: this.boxscale * this.baseWidth,
          warpHeight: this.boxscale * this.baseHeight
        });
      } else {
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
      }
      this.zoomObj.setScale(this.boxscale);
      this.windowTimer = setTimeout(() => {
          this.load = false;
        }, 500);
    },
    insterCanvas(img, src, contextStatic, bool) {
      img.src = require(`../static/img/${src}`);
      img.onload = () => {
        this.imgCount++;
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
    insterCanvas2(img, src, fun) {
      img.src = require(`../static/img/${src}`);
      img.onload = () => {
        this.imgCount++;
        fun();
      };
    },
    initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 3,
        currFrame: 0,
        width: 319.5,
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
        totalFrame: 1,
        currFrame: 0,
        width: 190,
        height: 270,
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
    initHorseObject4(imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 3,
        currFrame: 0,
        width: 319.5,
        height: 300,
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
    initHorseObject2(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 1,
        currFrame: 0,
        width: 220,
        height: 250,
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
    canvasClear(canvas) {
      if (!canvas) {
        return;
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
  .fs21 {
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
  .question2,
  .question3 {
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
