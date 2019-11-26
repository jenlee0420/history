<template>
    <div class="image-box" :title="!imageLoaded ? '图片初始化中，请稍后...' : ''">
        <!--图片显示-->
		 <!-- crossOrigin="anonymous" -->
     <canvas ref="f"></canvas>
    </div>
</template>
<script>
/**
 * canvas图片转换
 * 1. 对本地上传的图片进行处理
 * 2. 对网络图片进行处理
 */
import ConvertImage from "./main.js";

export default {
  props: {
    // 外部传递原始图片地址 不会被内部修改 可以在父组件中修改
    value: {
      type: String
    },
    // 图片配置
    // option:{
    //   type: [Object,String],
    //   default: ()=>({})
    // },
    // 外部传递的ref的值，用作区分图片透传出去
    // dataRef:{
    //     type: String
    // },
    // 是否允许图片处理时显示loading
    allowLoading: {
      type: Boolean,
      default: true
    },
    // 是否隐藏操作区域
    hideModal: {
      type: Boolean,
      default: false
    },
    // 是否隐藏图片修改
    hideEdit:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 用作预览的url地址
      imgUrl: "",
      // 图片配置 旋转度数 是否水平旋转 是否垂直旋转
      imgOption: {
        rotate: 0, // 旋转度数为 rotate * 90  (0,1,2,3)
        flipX: -1, // 是否水平旋转 -1 否 1 是
        flipY: -1 // 是否垂直旋转 -1 否 1 是
      },

      // blobHistory: [], // blobUrl历史记录 当组件销毁时销毁,节省内存(默认是浏览器页面关闭时销毁)

      loadingInfo: {
        show: false,
        text: "图片处理中..."
      },
      cImage: null, // 图片canvas对象
      imageLoaded: false
    };
  },
  mounted() {
    this.initImage();
  },
  methods: {
    
    // 初始化图片 第一步 获取传递进来的图片和参数信息 第二步 根据参数信息将图片旋转或者翻转
    initImage() {
      this.imgUrl = this.value;
      //   this.$refs.img
      if (this.imgUrl) {
         this.imageLoaded = false
        this.cImage = new ConvertImage(this.imgUrl,()=>{
          this.imageLoaded = true
          //this.$emit('imageLoaded') // 图片初始化完毕事件 初始化完成才能对图片进行处理操作

        });
        this.cImage.baseCanvas =this.$refs['f']
        // this.$on("getImageFile", this.getImageFile);
        console.log(this.cImage);
      }
    },
  },
  watch: {
    
  }
};
</script>
