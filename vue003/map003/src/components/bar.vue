<template>
<div class="bar" ref="sliderBox" @click.stop="setLoacl">
    <span class="squ" ref="slider" 
    @mousedown="moveStart" 
    @mousemove="move"
    @mouseup="moveOut"
    @mouseout="moveOut"
    @touchstart="moveStart" 
    @touchmove="move"
    @touchcancel="moveOut"
    ></span>
</div>
</template>

<script>
    export default {
        name: 'bar',
        props:[
            'scaleindex'
        ],
        data() {
            return {
                dargStart:false,
                u_agent:'',
                startx:'',
                amountW:''
            }
        },
        watch:{
            scaleindex(n){
                this.$refs.slider.style.left = (n*10) +'%'
                console.log(n,'///')
            }
        },
        mounted(){
            this.u_agent = navigator.userAgent
            this.amountW = this.$refs.sliderBox.clientWidth - this.$refs.slider.clientWidth; 
        },
        methods:{
            setLoacl(e){
                this.dargStart= true
                this.move(e)
                this.dargStart= false
            },
            moveStart(e){
                this.dargStart= true
                if(/iPad|iPhone|Android|Adr/i.test(this.u_agent)){
                   this.startx = e.touches[0].pageX;
                }
                
            },
            move(e){
                if(this.dargStart){
                let  box = this.$refs.sliderBox
                let slider=this.$refs.slider
                let distanceX = e.clientX - box.offsetLeft
                
                if(/iPad|iPhone|Android|Adr/i.test(this.u_agent)){
                    // distanceX= e.targetTouches[0].clientX - box.offsetLeft
                    distanceX = e.touches[0].pageX - box.offsetLeft; 
                }
                if((/Firefox/.test(this.u_agent) || (this.u_agent.indexOf('Trident')>-1 && u_agent.indexOf('rv:11')>-1)) ) {
                    distanceX=(e.pageX) - document.body.clientWidth -box.offsetLeft
                }

                // 滑动距离小于0 或者大于滑竿的宽度，return掉
                // console.log(this.amountW,'maxw')
                // if (distanceX < 0 || distanceX > this.amountW) {
                //     return;
                // }

                if(distanceX >=box.clientWidth-slider.clientWidth/2){
                    distanceX=box.clientWidth-slider.clientWidth/2
                }
                if(distanceX<=0){
                    distanceX = 0
                }
                slider.style.transformOrigin = 'left';
                slider.style.left = distanceX +'px'
                // console.log(box.clientWidth-slider.clientWidth)
                this.$emit('offestx',distanceX/box.clientWidth)
                }
            },
            moveOut(){
                this.dargStart= false
            }
        }
    }
</script>

<style lang="less">
    .bar{
        width: 50%;
        height: 0.15em; border-radius: 0.06em;
        border: 1px solid #aaaaaa;
        background-color: #fff;
        position: relative;
        .squ{
            width: 0.2rem !important;
            height: 0.2rem !important;
            top: -31%;
            margin-left: -.08em;
            display: inline-block;
            background-color: #e6e6e6;
            border-radius: 0.06em;
            border: 1px solid #d3d3d3;
            position:absolute;
            left: 0%;
            cursor: pointer;
            &:hover{
                border: 1px solid #999;
                background-color: #dadada;
            }
        }
    }
</style>
