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
        <span>川漢、粵漢鐵路位置圖 (1911 年)</span>
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
            <imageview :imgsrc="'map.png'" :static="true" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail.png'" :static="true" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'mapDetail1.png'" :static="true" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'capital.png'" :static="control.capital.show" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'city1.png'" :static="control.city.show" :zindex="4" @update="updateImg"></imageview>
            <imageview :imgsrc="'border.png'" :static="control.border" :zindex="2" @update="updateImg"></imageview>
            <imageview :imgsrc="'provinceborder.png'" :static="control.provinceb" :zindex="1" @update="updateImg"></imageview>
            <imageview :imgsrc="'yuehan.png'" :static="control.yuehan" :zindex="3" @update="updateImg"></imageview>
            <imageview :imgsrc="'chuanhan.png'" :static="control.chuanhan" :zindex="3" @update="updateImg"></imageview>
            <imageview :imgsrc="'baolu.png'" :static="control.baolu" :zindex="1" @update="updateImg"></imageview>
            
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
              <em class="mr5">1.</em><em> 川漢和粵漢鐵路的「國有化」計劃影響了四省民眾的利益，<br>但不包括以下哪省？</em>
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
            <div>2. 按地圖所示，哪個受到保路風潮影響的省份較接近北京？</div>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24970710.508365147!2d82.5548310285697!3d38.15179355260856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36efc52300447721%3A0xb98652ce2e240e02!2z5Lit5ZyL5Zub5bed55yB5oiQ6YO95biC!5e0!3m2!1szh-TW!2shk!4v1575947068824!5m2!1szh-TW!2shk"
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
import imageview from "./components/ImageView";
// import tools from './js/animate.js';
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
      console.log(document.readyState);
      if (document.readyState === "complete") {
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
      control:{
        yuehan:false,
        chuanhan:false,
        capital:{
          show:false,
          ani:false,
          timer:null
        },
        city:{
          show:false,
          ani:false,
          timer:null
        },
        border:false,
        provinceb:false,
        baolu:false
      },
      load: true,
      noVoice: false,
      zoomObj: null,
      questionItem: [
        "A. 湖南",
        "B. 廣東",
        "C. 貴州"
      ],
      rightans: 2,
      showWrong: 0,
      currAns: null,
      questionItem2: ["A. 廣東",
        "B. 四川",
        "C. 湖北"],
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
          ico: require("../static/img/icon/city1_icon.png"),
          text: "城鎮",
          show: false
        },
        {
          ico: require("../static/img/icon/border1_icon.png"),
          text: "疆界",
          show: false
        },
        {
          ico: require("../static/img/icon/province border_icon.png"),
          text: "省界",
          show: false
        },
        {
          ico: require("../static/img/icon/yuehan_icon.png"),
          text: "粵漢鐵路",
          show: false
        },
        {
          ico: require("../static/img/icon/chuanhan_icon.png"),
          text: "川漢鐵路",
          show: false
        },
        {
          ico: require("../static/img/icon/erupting province.png"),
          text: "保路風潮爆發省份",
          show: false
        },
        {
          ico: require("../static/img/icon/city1_icon.png"),
          text: "成都",
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
        "myCanvasStatic3",
        "myCanvasStatic4",
        "myCanvasStatic5",
        "myCanvasStatic6",
        "myCanvasStatic7",
        "myCanvasStatic8",
        "myCanvasStatic9",
      ],
      m01: null,
      m02: null,
      m03: null,
      m04: null,
      m05: null,
      m06: null,
      train:null,
      train1:null,
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
      chenTimer: null,
      lin2timer: null,
      scaleZoom: 0,
      debug: "",
      canvasObj: {},
      contextObj: {},
      imgCount:0,
      imgTotal:11,
    licenseTimer:null
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
      // if(n == this.imgTotal && document.readyState == "complete"){
      //   console.log(n)
      //   // this.load = false;
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
      // this.m06.pause();
      this.license.pause();
      this.train.pause();
      this.train1.pause();
      clearTimeout(this.licenseTimer)
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
          // this.showCityAni(c, swip);
          this.sharpCity(this.control.capital,swip)
          break;
        case 1:
          if (swip && !this.noVoice) {
            this.m02.currentTime = 0;
            this.m02.play();
          }
          // this.drawHousePromise(swip);
          this.sharpCity(this.control.city,swip)
          break;
        case 2:
          // c.style.visibility = swip ? "visible" : "hidden";
          this.control.border =  swip
          break;
        case 3:
          this.control.provinceb =  swip
          // c.style.visibility = swip ? "visible" : "hidden";
          break;
        case 4:
          if (swip && !this.noVoice) {
            this.m03.currentTime = 0;
            this.m03.play();
            this.train.play();
          }
          // c.style.visibility = swip ? "visible" : "hidden";
          this.control.yuehan = swip
          this.drawHousePromise(swip)
          // this.drawHousePromise2(swip)
          break;
        case 5:
          if (swip && !this.noVoice) {
            this.m04.currentTime = 0;
            this.m04.play();
            this.train1.play();
          }
          this.control.chuanhan = swip
          // c.style.visibility = swip ? "visible" : "hidden";
          // this.drawHousePromise(swip)
          this.drawHousePromise2(swip)
          break;
        case 6:
          if(!swip){clearTimeout(this.licenseTimer);}
          if (swip && !this.noVoice) {
            this.licenseTimer =  setTimeout(() => {
              this.license.currentTime = 0;
              this.license.play();
            },10500)
            this.license.play();
            this.license.pause();
            this.m05.currentTime = 0;
            this.m05.play();
            this.m05.onended=()=>{
               this.license.pause();
            }
            // console.log(this.license.volume)
          }
          
          // c.style.visibility = swip ? "visible" : "hidden";
          this.control.baolu = swip
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
      let list = [
        { name: "myCanvasStatic1", zindex: 4 },
        { name: "myCanvasStatic2", zindex: 3 },
        { name: "myCanvasStatic3", zindex: 4 },
        { name: "myCanvasStatic4", zindex: 5 },
        { name: "myCanvasStatic5", zindex: 3 },
        { name: "myCanvasStatic6", zindex: 2 },
        { name: "myCanvasStatic7", zindex: 3 },
        { name: "myCanvasStatic8", zindex: 4 },
        { name: "myCanvasStatic9", zindex: 2 },
        { name: "myCanvasAnimHorse", zindex: 6 },
        { name: "myCanvasAnimHorse2", zindex: 6 },
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
      this.train = document.createElement("audio");
      this.train1 = document.createElement("audio");
      this.license = document.createElement("audio");
      this.m01.src = require("../static/img/vo/Map017-1.mp3");
      this.m02.src = require("../static/img/vo/Map017-2.mp3");
      this.m03.src = require("../static/img/vo/Map017-5.mp3");
      this.m04.src = require("../static/img/vo/Map017-6.mp3");
      this.m05.src = require("../static/img/vo/Map017-7.mp3");
      this.license.src = require("../static/img/vo/License.mp3");
      this.train.src = require("../static/img/vo/train.mp3");
      this.train1.src = require("../static/img/vo/train.mp3");
      this.license.loop='loop'
      this.license.volume =0.3
      this.train.loop='loop'
      this.train.volume =0.6
      this.train1.loop='loop'
      this.train1.volume =0.6
      // Variable init

      var imageCapital = new Image();
      var imageMapDetail = new Image();
      var imageMapDetail2 = new Image();
      var border = new Image();
      var imageMainCity = new Image();
      var privince =new Image();
      var route = new Image();
      var route1 = new Image();
      var ba0lu = new Image();
      var imageHorse = new Image();

      // this.insterCanvas(imageMapDetail, 'mapDetail.png',"myCanvasStatic1", true);
      // this.insterCanvas(imageMapDetail2, 'mapDetail1.png',"myCanvasStatic2", true);
      // this.insterCanvas(imageCapital, 'capital.png',"myCanvasStatic3", false);
      // this.insterCanvas(imageMainCity, 'city1.png',"myCanvasStatic4", false);
      // this.insterCanvas(border, 'border.png',"myCanvasStatic5", false);
      // this.insterCanvas(privince, 'province border.png',"myCanvasStatic6", false);
      // this.insterCanvas(route, 'yuehan.png',"myCanvasStatic7", false);
      // this.insterCanvas(route1, 'chuanhan.png',"myCanvasStatic8", false);
      // this.insterCanvas(ba0lu, 'baolu.png',"myCanvasStatic9", false);
      

      this.insterCanvas2(imageHorse,'platelayer.png',()=>{
        var translate = [[771, 685], [755, 770], [753, 862],[792,958],[898,1160]];
        var scale = [1, 1, 1,1,0];
        var dur = [10, 10, 10,10,10];
        var sharpPoint = ''
        this.horseObject1 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
        );
        var translate = [[365, 686], [395, 715],[563,640],[708,620],[895,718]];
        var scale = [1, 1,1,1,0];
        var dur = [5, 10, 10,10,10];
        var sharpPoint = ''
        this.horseObject2 = this.initHorseObject(
          translate,
          scale,
          dur,
          sharpPoint,
          imageHorse
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
    insterCanvas2(img, src, fun) {
      img.src = require(`../static/img/${src}`);
      img.onload = () => {
        this.imgCount++
        fun()
      }
    },
    insterCanvas(img, src,contextStatic, bool) {
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
        this.canvasObj[contextStatic].style.visibility = bool
          ? "visible"
          : "hidden";
      };
    },
    initHorseObject(translate, scale, dur, sharpPoint, imageHorse) {
      var object = {
        source: imageHorse,
        totalFrame: 7,
        currFrame: 0,
        width: 474.8,
        height: 320,
        point: sharpPoint,
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
    // background: url("../static/img/map.png");
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
</style>
