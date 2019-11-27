<template>
  <transition name="ease">
    <div class="modalWrap" id="modalWrap" ref="modalWrap">
      <div class="modalWindow" :style="{width:width}" ref="modalWindow">
        <div class="mwHeader" @mousedown="startDrag" @touchstart="startDrag">
          <span>{{headTitle}}</span>
          <i @click.stop="cancelEvent"></i>
        </div>
        <div class="mwCont">
          <slot name="modalCont"></slot>
        </div>
        <slot name="modalFooter">
          <div class="mwFooter" v-if="!hideFooter">
            <input
              :disabled="loading === true"
              @click="okEvent"
              type="button"
              name="okBtn"
              class="blue-button modalBtn"
              :value="okTxt|defaultVal"
            />
            <input
              v-if="!onlyConfirm"
              @click="cancelEvent"
              type="button"
              name="cancelBtn"
              class="line-button ml15 modalBtn"
              value="取消"
            />
          </div>
        </slot>
      </div>
      <div class="modalWindowBg" :class="{'dn':hideMask}"></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "modal",
  props: [
    "headTitle",
    "width",
    "okTxt",
    "hideMask",
    "hideFooter",
    "loading",
    "onlyConfirm"
  ],
  mounted() {
    document.getElementById('modalWrap').addEventListener("touchmove", this.bodyScroll, {
            passive: false //  禁止 passive 效果
        })
  },
  data() {
    return {
      el: null,
      isDown: false,
      distanceX: "",
      distanceY: "",
      outwindow: false,
      lastPoint: null,
      modalWrap:null
    };
  },
  methods: {
    bodyScroll(event) {
        event.preventDefault();
      },
    okEvent() {
      this.$emit("ok-event");
    },
    cancelEvent() {
      console.log('cancel')
      this.$emit("cancel-event");
    },
    startDrag(event) {
      console.log('startdarg')
      let touch = event;
      this.el = this.$refs.modalWindow;
      this.modalWrap = this.$refs.modalWrap
      this.isDown = true;
      
      if ("ontouchmove" in window && event.touches) {
        touch = event.touches[0];
        document.body.addEventListener("touchmove", this.move);
        document.body.addEventListener("touchend", this.moveOut);
        document.body.addEventListener("touchcancel", this.moveOut);
      } else {
        document.body.addEventListener("mousemove", this.move);
        document.body.addEventListener("mouseup", this.moveOut);
        document.body.addEventListener("mouseout", this.moveOut);
      }
      this.distanceX = touch.clientX - this.el.offsetLeft;
      this.distanceY = touch.clientY - this.el.offsetTop;
      console.log(this.el.offsetTop,this.el.offsetLeft)
      
      this.el.style.left = this.el.offsetLeft + "px";
      this.el.style.top = this.el.offsetTop + "px";
      this.el.style.position='absolute'
    },
    move(ev) {
      let touch = ev;
      if (this.isDown) {
        if ("ontouchmove" in window && ev.touches) {
        touch = ev.touches[0];
      }
        let left = touch.clientX - this.distanceX;
        let top = touch.clientY - this.distanceY;
        if (left <= 0) {
          left = 0;
        }
        if (top <= 0) {
          top = 0;
        }
        if (left >= window.innerWidth - this.el.offsetWidth) {
          left = window.innerWidth - this.el.offsetWidth;
        }
        if (top >= window.innerHeight - this.el.offsetHeight) {
          top = window.innerHeight - this.el.offsetHeight;
        }
        this.el.style.left = left + "px";
        this.el.style.top = top + "px";
      }
    },
    moveOut(ev) {
      if ("ontouchmove" in window) {
        document.body.addEventListener("touchmove", this.move);
        document.body.addEventListener("touchstart", this.touchmoveHandler);
        document.body.addEventListener("touchend", this.moveOut);
        document.body.addEventListener("touchcancel", this.moveOut);
      } else {
        document.body.removeEventListener("mousemove", this.move);
        document.body.removeEventListener("mouseup", this.moveOut);
        document.body.removeEventListener("mouseout", this.moveOut);
      }
      this.isDown = false;
      // if(ev.type == 'mouseup'){
      //   this.isDown = false
      // }
      // if(ev.type == 'mouseout'){
      //   setTimeout(() => {
      //     console.log('out',ev)
      //   this.isDown = false
      //   }, 1000);

      // }
    }
  },
  filters: {
    defaultVal(val) {
      if (val == undefined) {
        return "确定";
      } else {
        return val;
      }
    }
  }
};
</script>

<style lang="less">
.modalWrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalWindow {
  // max-width: 73vw;
  height: auto;
  // min-height: 210px;
  background: #fff;
  position: relative;
  border-radius: 4px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  //   box-shadow: 0 0 8px 1px rgba(102, 102, 102, 0.5);
  border: 0.07em solid #ff9900;
  border-radius: 0.22em;
  font-size: 1em;
  user-select: none;

  .mwHeader {
    background: #ffedd2;
    // border: 1px solid #ff9900;
    // border-bottom: 1px solid #fff;
    position: relative;
    font-size: 1em;
    text-align: left;
    color: #2b3245;
    border-radius: 0.15em 0.15em 0 0;
    box-sizing: border-box;
    padding: 0.16em 0.12em;
    display: flex;
    align-items: center;
    font-weight: bold;
    cursor: move;
    span {
      font-size: 0.25rem;
    }
    
  }

  .mwCont {
    font-size: 1em;
    ._form {
      margin-top: 20px;
      padding-left: 48px;

      & > li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        & > label {
          padding-left: 15px;
          font-size: 12px;
          min-width: 69px;
          color: #868992;
          margin-right: 20px;
        }

        .ipt {
          display: inline-flex;
          width: 284px;
          position: relative;
          align-items: center;
          justify-content: center;

          &.fradio {
            justify-content: flex-start;
          }

          input[type="text"] {
            height: 30px;
            font-size: 12px;
            color: #2b3245;
            width: 100%;
            min-width: auto;
          }

          .addressBook {
            margin-left: 10px;
            position: absolute;
            top: 5px;
            right: -30px;
            width: 20px;
            height: 20px;
            cursor: pointer;

            // background: url('../img/addressBook.png') no-repeat center center / 20px 20px;
            &:hover {
              // background-image: url("../img/addressBook1.png");
            }
          }

          textarea {
            min-width: initial;
            width: 100%;
          }
        }
      }
    }
  }

  .mwFooter {
    height: 70px;
    padding-top: 20px;
    border-top: 1px solid #f0f0f0;
    overflow: hidden;
    display: flex;
    justify-content: center;

    input[type="button"].modalBtn {
      // width:auto;
    }
  }
}
</style>

