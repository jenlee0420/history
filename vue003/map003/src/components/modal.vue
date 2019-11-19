<template>
    <transition name="ease">
        <div class="modalWrap">
            <div class="modalWindow" :style="{width:width}">
                <div class="mwHeader">
                    <span>{{headTitle}}</span>
                    <i @click="cancelEvent"></i>
                </div>
                <div class="mwCont">
                    <slot name="modalCont"></slot>
                </div>
                <slot name="modalFooter">
                    <div class="mwFooter" v-if="!hideFooter">
                        <input :disabled="loading === true" @click="okEvent" type="button" name="okBtn" class="blue-button modalBtn" :value="okTxt|defaultVal">
                        <input v-if="!onlyConfirm" @click="cancelEvent" type="button" name="cancelBtn" class="line-button ml15 modalBtn" value="取消">
                    </div>
                </slot>
            </div>
            <div class="modalWindowBg" :class="{'dn':hideMask}"></div>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'modal',
    props: ['headTitle','width','okTxt','hideMask','hideFooter','loading', 'onlyConfirm'],
    mounted(){
    },
    data() {
        return {
        }
    },
    methods: {
        okEvent() {
            this.$emit('ok-event');
        },
        cancelEvent() {
            this.$emit('cancel-event');
        }
    },
    filters:{
        defaultVal(val){
            if( val == undefined ){
                return '确定';
            }else{
                return val;
            }
        }
    }
}
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
  width: 73vw;
  height: auto;
  min-height: 210px;
  background: #fff;
  position: relative;
  border-radius: 4px;
  z-index: 99;
  display: flex;
  flex-direction: column;
//   box-shadow: 0 0 8px 1px rgba(102, 102, 102, 0.5);
border: .07em solid #ff9900;
border-radius: 0.22em;
  font-size: 1em;

  .mwHeader {
    background: #ffedd2;
    border-bottom: 1px solid #f0f3f9;
    position: relative;
    font-size: 1em;
    text-align: left;
    color: #2b3245;
    border-radius: 0.22em 0.22em 0 0;
    box-sizing: border-box;
    padding: .16em .12em;
    display: flex;
    align-items: center;
    span{
        font-size: .25rem;
    }
    i {
      width: 0.45rem;
      height: 0.45rem;
      background: url('/static/img/close.png') no-repeat center center;
      cursor: pointer;
      background-size: 100%;
      position: absolute;
    //   top: 0;
      right: 0.1em;
      display: block;
      border-radius: 0 4px 0 0;

    //   &:hover {
    //     background: url('/static/img/icon/closeAct.png') no-repeat center center;
    //   }
    }
  }

  .mwCont {
       font-size: 1em;
    ._form {
      margin-top: 20px;
      padding-left: 48px;

      &>li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        &>label {
          padding-left: 15px;
          font-size: 12px;
          min-width: 69px;
          color: #868992;
          margin-right: 20px;

          &.require {
            background: url('/static/img/require.png') no-repeat left center;
          }
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

          input[type='text'] {
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

    input[type='button'].modalBtn {
      // width:auto;
    }
  }
}
</style>

