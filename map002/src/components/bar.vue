<template>
<div class="bar" ref="sliderBox">
    <div class="squ" ref="slider"
    @mousedown="moveStart" 
   
    @mouseup="moveOut"

    @touchstart="moveStart" 
    
    @touchend="moveOut"
    >
    <span ></span></div>
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
                amountW:'',
                distanceX:0,
            }
        },
        watch:{
            scaleindex(n){
                this.$refs.slider.style.left = (n*10) +'%'
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
                let slider=this.$refs.slider
                this.dargStart= true
                // alert('d')
                if(/iPad|iPhone|Android|Adr/i.test(this.u_agent)){
                    var ev = e || window.event;
                    var touch = ev.targetTouches[0];
                    this.startx = touch.clientX - slider.offsetLeft;
                }
                
                let box=document.getElementById('app')
                let timer=null
                box.addEventListener('mouseout',(e)=>{
                    timer=null
                    timer=setTimeout(() => {
                        this.moveOut()
                    }, 200);
                    
                })
                box.addEventListener('mousemove',(e)=>{
                    this.move(e)
                })
                box.addEventListener('mouseoup',(e)=>{
                    this.moveOut(e)
                })
                box.addEventListener('touchmove',(e)=>{
                   
                    this.move(e)
                })
                box.addEventListener('touchend',(e)=>{
                    this.moveOut(e)
                })
                
            },
            move(e){
                if(this.dargStart){
                let box = this.$refs.sliderBox
                let slider=this.$refs.slider
                this.distanceX = e.clientX - box.offsetLeft
                
                if(/iPad|iPhone|Android|Adr/i.test(this.u_agent)){
                    this.distanceX  = e.targetTouches[0].clientX - this.startx;
                    // this.distanceX= e.targetTouches[0].clientX - box.offsetLeft
                }
                if((/Firefox/.test(this.u_agent) || (this.u_agent.indexOf('Trident')>-1 && this.u_agent.indexOf('rv:11')>-1)) ) {
                    this.distanceX=(e.pageX)  -box.offsetLeft
                }

                // 滑动距离小于0 或者大于滑竿的宽度，return掉
                // console.log(this.amountW,'maxw')
                // if (distanceX < 0 || distanceX > this.amountW) {
                //     return;
                // }

                if(this.distanceX >=box.clientWidth-slider.clientWidth/2){
                    this.distanceX=box.clientWidth-slider.clientWidth/2
                }
                if(this.distanceX<=0){
                   this.distanceX = 0
                }
                // slider.style.transformOrigin = 'left';
                slider.style.left = this.distanceX +'px'
                // console.log(box.clientWidth-slider.clientWidth)
                this.$emit('offestx',(this.distanceX/box.clientWidth * 10))
                }
            },
            moveOut(){
                document.body.removeEventListener('mousemove',(e)=>{
                    this.move(e)
                })
                this.dargStart= false
                // let box = this.$refs.sliderBox
                // this.$emit('moveOut',this.distanceX/box.clientWidth)    
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
        .squbox{
            width: 0.3rem !important;
            height: 0.3rem !important;
            background-color: rgba(200, 200, 200, 0.3);
            position:absolute;
            top: -52%;
            left: 0%;
        }
        .squ{
            width: 0.2rem !important;
            height: 0.2rem !important;
            top: 0;
            bottom:0;
            margin: auto;
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
