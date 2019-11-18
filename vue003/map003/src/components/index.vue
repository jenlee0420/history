<template>
  <div class="hello">
    <div id="main_container" style="position: relative; overflow: hidden; width: 1024px; height: 698px;">
      <div class="title_bar purpleGradient">
        <span>隋代運河分佈圖 (581-618 年)</span><div id="soundCon"> </div>
      </div>
      <div class="main_box">
        <div id="map_container" style="float: left; width: 715px; height: 658px; overflow: hidden;">
          <div id="canvasInnerDiv" class="ui-draggable ui-draggable-handle ui-draggable-disabled" style="width: 715px; height: 658px; position: relative;">
          </div>
        </div>
      </div>
      <div id="menu_container" style="float: right;"><div id="action_container" class="greyContainer" style="padding: 1px 0.03em 0.03em; height: auto; flex: 1 1 0%;"><div class="sample_title">圖例</div><div class="sample blueButton action"><span><img src="img/icon/capital_icon.png" class="icon fix_height">首都</span></div><div class="sample blueButton action"><span><img src="img/icon/dongdu.png" class="icon fix_height">東都</span></div><div class="sample blueButton action"><span><img src="img/icon/main_city_icon.png" class="icon fix_height">要邑</span></div><div class="sample blueButton action"><span><img src="img/icon/gate_icon.png" class="icon">關口</span></div><div class="sample blueButton action"><span><img src="img/icon/river_icon.png" class="icon">運河</span></div><div class="sample blueButton action"><span><img src="img/icon/redArrow_icon.png" class="icon">航綫 1</span></div><div class="sample blueButton action"><span><img src="img/icon/greenArrow_icon.png" class="icon">航綫 2</span></div><div class="sample blueButton action"><span><img src="img/icon/rice.png" class="icon">糧食儲存</span></div><div class="sample blueButton action googlemap"><span><img src="img/icon/capital_icon.png" class="icon">大興（今西安市）</span></div><div class="sample blueButton action ques"><span><img src="img/icon/question.png" class="icon">問題</span></div><div class="smallMap" style="width: 202px; height: auto; margin: 3px auto; overflow: hidden; visibility: hidden; display: none;"><div class="ui-draggable ui-draggable-handle ui-draggable-disabled" style="width: 200px; height: auto; border: 1px solid red; position: relative;"></div></div></div><div class="greyContainer"><div style="display: flex; width: 100%; justify-content: space-between;"><div class="blueButton action_all">全部顯示</div><div class="blueButton action_all">全部隱藏</div></div></div><div id="map_action_container" class="greyContainer" style="margin-bottom: 10px;"><div class="zoom_button zoom_out blueButton" style="width: 2.07em; margin: 5px 10px 3px;"><b>-</b></div><div id="slider" class="zoom_button ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" style="width: 50%; height: 0.15em; border-radius: 0.06em;"><span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 0%;"></span></div><div class="zoom_button zoom_in blueButton" style="width: 2.07em; margin: 5px 10px 3px;"><b>+</b></div></div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
