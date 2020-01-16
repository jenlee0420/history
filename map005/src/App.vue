<template>
  <div id="app">
    <!-- <div class="pos_a" style="font-size:0.5rem">{{debug}}</div> -->
    <div v-if="load" id="loading" style="width:820px;"><img :src="require('../static/img/loading.gif')"></div>
    <div  id="main_container" :style="{'width':docWidth+'px','height':docHeight+'px','display':load?'none':'block'}">
      <div class="title_bar purpleGradient" :style="{'height':titleH +'px'}">
        <span>隋唐疆域比較圖 (612年與669年)</span>
        <div id="soundCon" :class="{'mute':noVoice}" @click="noVoice=!noVoice"> </div>
      </div>
      <div class="main_box">
        <div id="map_container" class="modal_content" ref="map_container" :style="{'width':canvasW+'px','height':canvasH+'px'}">
          <div class="mapBackground" id="canvasInnerDiv" ref="canvasInnerDiv">
            <div class="detail_div pos_a map"></div>
          </div>
        </div>
        <div id="menu_container" style="float: right;">
          <div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;">
            <div class="sample_title">圖例</div>
            <div class="sample blueButton action" :class="{'clicked':item.show}" v-for="(item,index) in list" :key="index" @click="showCanvas(index)">
              <div class="iconItem">
                 <span class="icon"><img v-if="item.ico" :src="item.ico"></span>
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
    <modal class="" headTitle="問題" :hideFooter="true" v-if="popWindow" @cancel-event="popWindow=false;list[8].show=false">
      <div slot="modalCont">
        <div>
          <div class="question question2">
            <div class="title"><span>1. </span><span>貞觀年間，唐皇朝開疆辟土，大部新增的領土均位於_________？</span></div>
            <div>
              <span class="item" :class="{'selected':currAns==index}" v-for="(item,index) in questionItem" :key="index" @click="checkans(index)">{{item}}</span>
            </div>
            <div class="ansBox" :class="showWrong==false?'wrongico':'rightico'" v-if="currAns!=null"></div>
          </div>
            <div class="question">
            <div>2. 貞觀年間，唐帝國的東部領土與以下哪一國接壤？</div>
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
    <modal class=""  headTitle="長安（今西安市）" :hideFooter="true" v-if="mapPop" @cancel-event="mapPop=false;list[7].show=false">
      <div slot="modalCont">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24781696.25475321!2d86.13987929246206!3d38.700543890057766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x366379e922ac17b9%3A0x85d466fda794582e!2z5Lit5ZyL6Zmd6KW_55yB6KW_5a6J5biC!5e0!3m2!1szh-TW!2shk!4v1575948835917!5m2!1szh-TW!2shk"
          :width="bodytWidth/1.8" :height="bodyHeight/1.8" frameborder="0" style="border:0;" allowfullscreen=""></iframe>
      </div>
    </modal>
  </div>
</template>

<script>
import zoom from "./js/zoom.js";
import modal from "./components/modal";
import bar from "./components/bar"; 
export default {
  components: {
    modal,
    bar
  },
  name: "App",
  beforeCreate() {},
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
  created() {
    const that = this;
    that.timer = setInterval(function() {
      console.log(document.readyState);
      if (document.readyState === "complete") {
        that.load = false;
        window.clearInterval(that.timer);
      }
    }, 10);
  },
  data() {
    return {
      timer:null,
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: ["A. 南方", "B. 東方", "C. 北方"],
      rightans: 2,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 日本", "B. 新羅", "C. 吐蕃"],
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
          ico: require("../static/img/icon/border1_icon.png"),
          text: "唐代疆界",
          show: false
        },
        {
          ico: require("../static/img/icon/tangchao_icon.png"),
          text: "唐朝疆域",
          show: false
        },
        {
          ico: require("../static/img/icon/suichao_icon.png"),
          text: "隋朝疆域",
          show: false
        },
        {
          ico: "",
          text: "突厥",
          show: false
        },
        {
          ico: "",
          text: "吐蕃",
          show: false
        },
        
        {
          ico: require("../static/img/icon/route_red_icon.png"),
          text: "拓展領土",
          show: false
        },
        {
          ico: require("../static/img/icon/capital_icon.png"),
          text: "長安（今西安市）",
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
        "myCanvasStatic6",
        "myCanvasStatic5",
        false,
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
      redTimer: null,
      shipPlay: false,
      titleH: 70,
      canvasAnimHorse: null,
      prevorienta: "",
      cityAni: false,
      canalAni: false,
      maincityAni: false,
      grainstoreAni: false,
      pathObject: {},
      chenTimer: null,
      lin2timer: null,
      scaleZoom: 0,
      debug: ""
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
    }
  },
  methods: {
    bodyScroll(event) {
      event.preventDefault();
    },
    setScaleBtn(type) {
      this.scaleZoom = this.scaleindex;
      if (type == "add") {
        this.scaleZoom += 1;
      } else {
        this.scaleZoom -= 1;
      }
      if (this.scaleZoom > 10) {
        this.scaleZoom = 10;
      }
      if (this.scaleZoom <= 0) {
        this.scaleZoom = 0;
      }
      // console.log(this.scaleZoom,'scaleZoom')
      this.setScale(this.scaleZoom);
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
      let c = document.getElementById(this.canvasData[index]);
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
         c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 2:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 3:
          if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
          }
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 4:
          if (swip && !this.noVoice) {
            this.m05.currentTime = 0;
            this.m05.play();
          }
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 5:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
          }
          c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 6:
          if (swip && !this.noVoice) {
            // this.m06.currentTime = 0;
            // this.m06.play();
            this.license.play();
          }
          this.drawRedPath(swip)
          this.drawHousePromise(swip)
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
        { name: "myCanvasStatic1", zindex: 3 },
        { name: "myCanvasStatic2", zindex: 2 },
        { name: "myCanvasStatic3", zindex: 1 },
        { name: "myCanvasStatic4", zindex: 2 },
        { name: "myCanvasStatic5", zindex: 2 },
        { name: "myCanvasStatic6", zindex: 2 },
        { name: "myCanvasStatic7", zindex: 2 },
        { name: "myRedPath", zindex: 2 },
        { name: "myCanvasAnimHorse", zindex: 2 },
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
      this.m01.src = require("../static/img/vo/Map005-1.mp3");
      this.m02.src = require("../static/img/vo/Map005-3.mp3");
      this.m03.src = require("../static/img/vo/Map005-4.mp3");
      this.m04.src = require("../static/img/vo/Map005-5_1.mp3");
      this.m05.src = require("../static/img/vo/Map005-5_2.mp3");
      this.m06.src = require("../static/img/vo/Map005-5_3.mp3");
      this.license.src = require("../static/img/vo/License.mp3");

      var imageCapital = new Image();
      var imageGate = new Image();
      var imageborder = new Image();
      var imagemap1 = new Image();
      var imagemap2 = new Image();
      var imageMainCity = new Image();
      var imageHorse = new Image();
      var city1 = new Image();
      var city2 = new Image();
      var city3 = new Image();
      var route = new Image();
      imageCapital.src = require("../static/img/capital.png");
      imageHorse.src = require("../static/img/horse.png");

      imageborder.src=  require("../static/img/border.png");
      imagemap1.src=  require("../static/img/map1.png");
      imagemap2.src=  require("../static/img/shadow.png");
      city1.src=  require("../static/img/tubo.png");
      city2.src=  require("../static/img/tujue.png");
      city3.src=  require("../static/img/xinluo.png");
      route.src=  require("../static/img/route.png");
      this.insterCanvas(imageCapital, "myCanvasStatic1", false);
      this.insterCanvas(imageborder, "myCanvasStatic2", false);
      this.insterCanvas(imagemap1, "myCanvasStatic3", false);
      this.insterCanvas(imagemap2, "myCanvasStatic4", false);
      this.insterCanvas(city1, "myCanvasStatic5", false);
      this.insterCanvas(city2, "myCanvasStatic6", false);
      this.insterCanvas(city3, "myCanvasStatic7", false);
     
      imageHorse.onload = () => {
        var translate = [[497, 533], [298, 546], [127, 582]];
        var scale = [1, 1, 0];
        var dur = [15, 15, 15];
        var sharpPoint ='';
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
        var translate = [[835, 670], [807, 442], [788, 282]];
        var scale = [1, 1, 0];
        var dur = [15, 15, 15];
        var sharpPoint = '';
        this.horseObject2 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
        var translate = [[-1070, 431], [-1268, 474], [-1366, 610]];
        var scale = [1, 1, 0];
        var dur = [10, 10, 15];
        var sharpPoint = -1;
        this.horseObject3 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
      };
      route.onload = () => {
        this.pathObject = {
          source: route,
          originX: 0,
          originY: 0,
          width: this.baseWidth,
          height: this.baseHeight,
          mask1: {
            originX: 536,
            originY: 546,
            width: 1,
            height: 76,
            currOriginX: 536,
            currOriginY: 546,
            shiftX: 8,
            shiftY: 0,
            endPoint:440
          },
          mask2: {
            originX: 788,
            originY: 700,
            width: 150,
            height: 1,
            currOriginX: 788,
            currOriginY: 700,
            shiftX: 8,
          shiftY: 0,
          endPoint:436
          },
          mask3: {
            originX: 998,
            originY: 522,
            width: 1,
            height: 116,
            currOriginX: 998,
            currOriginY: 522,
            shiftX: 8,
            shiftY: 0,
            endPoint:360
          },
          timeout: null,
          playing: false
        };
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
        totalFrame: 8,
        currFrame: 0,
        width: 369,
        height: 296,
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
    z-index: 2;
  }
  .map {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  .border_div {
    background-image: url("../static/img/border.png");
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
.title{
  display: flex;
  span{
    &:last-child{
      margin-left:0.35em;
    }
  }
}
.question2 {
  // flex-wrap: wrap;
  // display: flex;
  .item {
    // width: 50% !important;
    margin-bottom: 0.8em !important;
  }
}
</style>
