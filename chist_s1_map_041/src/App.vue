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
        <span>北宋與遼<span class="dot">、</span>西夏並立形勢圖 (1111 年)</span>
        <div id="soundCon" :class="{ mute: noVoice }" @click="setVoice"></div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{ width: canvasW + 'px', height: canvasH + 'px' }">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'mapDetail.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :canvasW="baseWidth" :canvasH="baseHeight" :imgsrc="'capital.png'" :static="control.capital.show" :zindex="1" @update="updateImg"></imageview>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{ clicked: item.show }" v-for="(item, index) in list" :key="index" @click="showCanvas(index)">
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
          <div class="question question3">
            <div class="flex">
              <em class="mr5">1.</em>
              <em>以下哪項關於宋<span class="dot">、</span>遼<span class="dot">、</span>西夏對峙形勢的描述是正確的？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns == index }" v-for="(item, index) in questionItem" :key="index" @click="checkans(index)">{{ item }}</span>
            </div>
            <div class="ansBox" :class="showWrong == false ? 'wrongico' : 'rightico'" v-if="currAns != null"></div>
          </div>
          <div class="question question3">
            <div class="flex">
              <em class="mr5">2.</em>
              <em>以下哪項歷史事件與北宋和遼國的往來<span class="underline">無關</span>？</em>
            </div>
            <div>
              <span class="item" :class="{ selected: currAns2 == index }" v-for="(item, index) in questionItem2" :key="index" @click="checkans2(index)" v-html="item"></span>
            </div>
            <div class="ansBox" :class="showWrong2 == false ? 'wrongico' : 'rightico'" v-if="currAns2 != null"></div>
          </div>
        </div>
      </div>
    </modal>
    <modal class="" :style="AppStyle" :dragable="!isApp" :headTitle="list[4].text" :hideFooter="true" v-if="mapPop" @cancel-event="
                    mapPop = false;
                    list[4].show = false;
                  ">
      <div slot="modalCont">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25497397.093637623!2d84.94118990879376!3d38.7298555597580
    3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35db576c31918e2f%3A0xaa184fd36b43ef66!2z5Lit5ZyL5rKz5Y2X55yB5r-u6Z
    m95biC!5e0!3m2!1szh-TW!2shk!4v1605842594506!5m2!1szh-TW!2shk" :width="(isApp?docWidth:bodytWidth)/1.8" :height="(isApp?docHeight:bodyHeight)/1.8" frameborder="0" style="border:0;" allowfullscreen></iframe>
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
    beforeCreate() {},
    created() {
      if (document.body.clientWidth < 600) {
        this.baseWidth = this.baseWidth * 0.5
        this.baseHeight = this.baseHeight * 0.5
        this.baseWidth_doc = this.baseWidth_doc * 0.5
        this.baseHeight_doc = this.baseHeight_doc * 0.5
      }
    },
    computed: {
      mainBoxStyle() {
        var css = {
          width: this.docWidth + "px",
          height: this.docHeight + "px",
          display: this.load ? "none" : "block",
          transform: this.pageTransform,
          "margin-top": this.pageMarginTop + "px",
          "margin-left": this.pageMarginLeft * -1 + "px",
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
      if ("onorientationchange" in window) {
        window.addEventListener("orientationchange", this.oriChange, false)
      } else {
        window.addEventListener("resize", this.setRemUnit, false)
      }
      if (this.isApp) {
        this.forApp()
      } else {
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
        windowTimer: null,
        imageObj: {
          // capital: null,
          city: null,
          city1: null,
          battlefield01: null,
          battlefield02: null,
          battlefield03: null,
          border: null,
        },
        canvasImagesObj: {
          //  capital: null,
          //   city: null,
          //   city1:null,
          //   battlefield01:null,
          //   battlefield02:null,
          //   battlefield03:null,
        },
        control: {
          capital: {
            show: true,
            ani: false
          },
          city: false,
          city1: false,
          battlefield01: false,
          battlefield02: false,
          battlefield03: false,
          border: false,
        },
        load: true,
        noVoice: false,
        zoomObj: null,
        imgCount: 0,
        imgTotal: 15,
        questionItem: ["A. 西夏的領土最為狹小 ", "B. 遼國置中京於開封", "C. 北宋控制了河西走廊 "],
        rightans: 0,
        showWrong: 0,
        currAns: null,
        questionItem2: [
          "A. 高梁河之戰",
          "B. 澶淵之盟 ",
          "C. 好水川之戰"
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
            ico: require("../static/img/icon/city_icon.png"),
            text: "都城",
            show: false
          },
          {
            ico: require("../static/img/icon/battlefield_041_icon.png"),
            text: "戰場",
            show: false
          },
          {
            ico: require("../static/img/icon/border_icon.png"),
            text: "疆界",
            show: false
          },
          {
            ico: require("../static/img/icon/battlefield_041_icon.png"),
            text: "澶州（今河南省濮陽市）",
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
        orgSetting: {
          w: 1430,
          h: 1315
        },
        baseWidth: "1430", //地图大小
        baseHeight: "1315", //地图大小
        baseWidth_doc: "2048", //窗口大小
        baseHeight_doc: "1396", //窗口大小
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
        drawHorsesTimeout9: null,
        drawHorsesTimeout10: null,
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
        timer1: [null, null, null, null, null, null, ],
        timer2: null,
        isShowall: false,
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
      clear() {},
      muteMe() {
        this.m01.pause();
        this.m02.pause();
        this.m03.pause();
        this.m04.pause();
        // this.m05.pause();
        // this.m06.pause();
        // this.m07.pause();
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
            this.sharpCity(this.control.capital, swip)
            if (!swip) {
              this.control.capital.show = true
            }
            break;
          case 1:
            clearTimeout(this.timer2)
            if (swip) {
              if (this.noVoice || this.isShowall) {
                this.timer2 = setTimeout(() => {
                  this.control.city1 = true
                }, 3000)
              } else if (!this.noVoice) {
                this.m02.currentTime = 0;
                this.m02.play();
                this.timer2 = setTimeout(() => {
                  this.control.city1 = true
                }, 23000)
              }
            } else {
              this.control.city1 = false
            }
            this.control.city = swip
            break;
          case 2:
            clearTimeout(this.timer1[1]);
            clearTimeout(this.timer1[2]);
            clearTimeout(this.timer1[4]);
            if (swip) {
              if (!this.noVoice && !this.isShowall) {
                this.m03.currentTime = 0;
                this.m03.play();
                this.timer1[1] = setTimeout(() => {
                  this.control.battlefield02 = true
                  this.drawHousePromise3(false, 'canvasFighting2')
                  this.drawHousePromise3(swip, 'canvasFighting', 704, 620)
                }, 30000)
                this.timer1[2] = setTimeout(() => {
                  this.control.battlefield03 = true
                  this.drawHousePromise3(swip, 'canvasFighting', 562, 468)
                }, 65000)
                this.timer1[4] = setTimeout(() => {
                  this.control.battlefield03 = true
                  this.drawHousePromise3(false, 'canvasFighting', 562, 468)
                }, 85000)
              } else if (this.noVoice || this.isShowall) {
                this.timer1[1] = setTimeout(() => {
                  this.control.battlefield02 = true
                  this.drawHousePromise3(false, 'canvasFighting2')
                  this.drawHousePromise3(swip, 'canvasFighting', 704, 620)
                }, 3000)
                this.timer1[2] = setTimeout(() => {
                  this.control.battlefield03 = true
                  this.drawHousePromise3(swip, 'canvasFighting', 562, 468)
                }, 6000)
                this.timer1[4] = setTimeout(() => {
                  this.drawHousePromise3(false, 'canvasFighting', 562, 468)
                }, 9000)
              }
            } else {
              this.control.battlefield02 = false
              this.control.battlefield03 = false
              this.drawHousePromise3(false, 'canvasFighting', 704, 620)
              this.drawHousePromise3(false, 'canvasFighting', 704, 620)
            }
            this.drawHousePromise3(swip, 'canvasFighting2', 862, 506)
            this.control.battlefield01 = swip
            break;
          case 3:
            clearTimeout(this.timer1[3]);
            if (swip) {
              if (!this.noVoice && !this.isShowall) {
                this.m04.currentTime = 0;
                this.m04.play();
                this.timer1[3] = setTimeout(() => {
                  this.drawHousePromise2(false, 'canvasDust', 480, 516)
                }, 16000)
              } else if (this.noVoice || this.isShowall) {
                this.timer1[3] = setTimeout(() => {
                  this.drawHousePromise2(false, 'canvasDust', 480, 516)
                }, 6000)
              }
            } else {
            }
            this.drawHousePromise2(swip, 'canvasDust', 480, 516)
            this.control.border = swip
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
        this.canvasObj["capital"].style.visibility = this.list[0].show ?
          "visible" :
          "hidden";
        if (swip3) {
          this.canvasObj["capital"].style.visibility = "visible";
        }
      },
      oriChange() {
        this.windowTimer = setTimeout(() => {
          this.clearTimeout(this.windowTimer);
          this.setRemUnit();
        }, 200);
      },
      forApp() {
        const u_agent = navigator.userAgent;
        var selffun = () => {
          this.bodyHeight = document.body.innerHeight;
          this.bodytWidth = document.body.clientWidth;
          var offest = this.bodytWidth / this.bodyHeight;
          if (offest > 0.5) {
            this.boxscale = this.bodyHeight / this.baseWidth_doc
            this.o = this.baseHeigth_doc * this.boxscale
          } else {
            this.boxscale = this.bodytWidth / this.baseHeight_doc
            this.o = this.bodytWidth
          }
          this.docWidth = this.baseWidth_doc * this.boxscale;
          this.docHeight = this.baseHeight_doc * this.boxscale;
          this.canvasH = Math.ceil(this.baseHeight * this.boxscale);
          this.canvasW = Math.ceil(this.baseWidth * this.boxscale);
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
            this.boxscale = this.bodyHeight / this.baseHeight_doc;
            this.o = this.bodyHeight;
            var offest = this.bodytWidth / this.bodyHeight;
            if (offest < 1.49 && offest > 1) {
              this.boxscale = this.bodytWidth / this.baseWidth_doc;
              this.o = this.baseHeight_doc * this.boxscale;
            }
          } else {
            this.boxscale = this.bodytWidth / this.baseWidth_doc;
            this.o = this.bodytWidth;
          }
          this.docWidth = this.baseWidth_doc * this.boxscale;
          this.docHeight = this.baseHeight_doc * this.boxscale;
          this.canvasW = Math.ceil(this.baseWidth * this.boxscale);
          this.canvasH = Math.ceil(this.baseHeight * this.boxscale);
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
        let list = [{
            name: "canvasImages",
            zindex: 3
          }, {
            name: "canvasDust",
            zindex: 5,
            org: true,
          }, {
            name: "canvasFighting",
            zindex: 4,
            org: true,
          },
          {
            name: "canvasFighting2",
            zindex: 6,
            org: true,
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
        this.license = document.createElement("audio");
        this.m01.src = require("../static/img/vo/Chist_s2_map_041_01.mp3");
        this.m02.src = require("../static/img/vo/Chist_s2_map_041_02.mp3");
        this.m03.src = require("../static/img/vo/Chist_s2_map_041_03.mp3");
        this.m04.src = require("../static/img/vo/Chist_s2_map_041_04.mp3");
        Object.keys(this.imageObj).forEach(element => {
          this.imageObj[element] = new Image();
          this.insterCanvas(
            this.imageObj[element],
            String(element) + ".png",
            "canvasImages",
            false
          );
        });
        // Object.keys(this.canvasImagesObj).forEach((element, i) => {
        //   this.canvasImagesObj[element] = new Image();
        //   this.insterCanvas(
        //     this.canvasImagesObj[element],
        //     String(element) + ".png",
        //     String(element), false
        //   );
        // });
        var imageHorse = new Image();
        var fighting = new Image();
        this.insterCanvas2(imageHorse, "dust_041.png", () => {
          this.horseObject1 = this.initHorseObject2(imageHorse);
        });
        this.insterCanvas2(fighting, "fighting.png", () => {
          this.horseObject2 = this.initHorseObject3(fighting);
        });
        // this.insterCanvas2(imageHorse, "monk.png", () => {});
        // this.insterCanvas2(temple, "temple.png", () => {
        //   var translate = [[905, 607], [1190.3, 672], [1356, 708]];
        //   var scale = [1, 1, 0];
        //   var dur = [180, 20, 30];
        //   var sharpPoint = [1, 1, 1];
        //   this.horseObject2 = this.initHorseObject2(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     temple
        //   );
        //   translate = [
        //     [905, 607],
        //     [1098, 694],
        //     // [1154,738],
        //     [1283, 786]
        //   ];
        //   scale = [1, 1, 0];
        //   dur = [140, 30, 10];
        //   sharpPoint = [1, 1, 1];
        //   this.horseObject3 = this.initHorseObject2(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     temple
        //   );
        // });
        // this.insterCanvas2(buddhastatue, "buddhastatue.png", () => {
        //   var translate = [
        //     [435, 672],
        //     [279, 556],
        //     [209, 355],
        //     [373, 269],
        //     [651, 343],
        //     [857, 467],
        //     [1033, 539],
        //     [1159, 501]
        //   ];
        //   var scale = [1, 1, 1, 1, 1, 1, 1, 0];
        //   var dur = [30, 30, 30, 35, 30, 30, 30, 30];
        //   var sharpPoint = [1, 1, 1, 1, 1, 1, 1, 1];
        //   this.horseObject4 = this.initHorseObject3(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     buddhastatue
        //   );
        //   translate = [[209, 355], [435, 429], [587, 397], [651, 343]];
        //   scale = [1, 1, 1, 1];
        //   dur = [20, 20, 20, 20];
        //   sharpPoint = [1, 1, 1, 1];
        //   this.horseObject5 = this.initHorseObject3(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     buddhastatue
        //   );
        //   ///////////////////
        //   translate = [[981, 592], [1107, 406], [1145, 650]];
        //   scale = [1, 1, 0];
        //   dur = [50, 50, 40];
        //   sharpPoint = [1, 1, 1];
        //   this.horseObject6 = this.initHorseObject3(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     buddhastatue
        //   );
        //   ///////////////////
        //   translate = [[981, 592], [1175, 598], [1333, 702]];
        //   scale = [1, 1, 0];
        //   dur = [50, 50, 40];
        //   sharpPoint = [1, 1, 1];
        //   this.horseObject7 = this.initHorseObject3(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     buddhastatue
        //   );
        //   ///////////////////
        //   translate = [[981, 592], [1105, 644], [1261, 788]];
        //   scale = [1, 1, 0];
        //   dur = [50, 50, 40];
        //   sharpPoint = [1, 1, 1];
        //   this.horseObject8 = this.initHorseObject3(
        //     translate,
        //     scale,
        //     dur,
        //     sharpPoint,
        //     buddhastatue
        //   );
        // });
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
          this.canvasObj[contextStatic].style.visibility = bool ?
            "visible" :
            "hidden";
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
      initHorseObject2(imageHorse) {
        var object = {
          source: imageHorse,
          totalFrame: 3,
          currFrame: 0,
          width: 936,
          height: 400,
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
      initHorseObject3(imageHorse) {
        var object = {
          source: imageHorse,
          totalFrame: 3,
          currFrame: 0,
          width: 366.6,
          height: 360,
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
    font-family: Verdana,
    Arial,
    sans-serif;
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
