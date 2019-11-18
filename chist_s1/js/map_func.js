function bind_map_func(div, mp4div) {
    div.on("check_bound", function() {
        var me = $(this);
        var data = me.data();
        var map = data["mapCanvas"];
        var box = data["redBox"];
        var maxHeight = box.height() - data["ori_height"] / 3;
        var maxWidth = box.width() - data["ori_width"] / 3;
        var map_position = {
            "top": map.position().top - map.parent().position().top,
            "left": map.position().left - map.parent().position().left
        };
        var box_position = {
            "top": box.position().top - box.parent().position().top,
            "left": box.position().left - box.parent().position().left
        };

        if (box_position.top < 0 && box_position.top * -1 > maxHeight) {
            newTop = maxHeight * -1;
        }
        if (box_position.top > 0) {
            newTop = 0;
        }
        if (box_position.left < 0 && box_position.left * -1 > maxWidth) {
            newLeft = maxWidth * -1;
        }
        if (box_position.left > 0) {
            newLeft = 0;
        }
        box_position.top = newTop;
        box_position.left = newLeft;
        box.css({
            "top": parseInt(newTop),
            "left": parseInt(newLeft)
        });
        $("#main_container").data("mapCanvas").css({
            "top": -box_position.top / box.height() * (data["ori_height"] / 3),
            "left": -box_position.left / box.width() * (data["ori_width"] / 3)
        });
    }).on("zoom_changed", function(e, curr_zoom) {
        var me = $(e.delegateTarget);
        var data = me.data();
        var arr = data["arr_flag"];
        var max = data["max_zoom"];
        var min = data["min_zoom"];
        var canvas = data["mapCanvas"].draggable("widget").get(0);
        var redWidth = data["redBox"].width();
        var redHeight = data["redBox"].height();
        curr_zoom = curr_zoom > max ? max : curr_zoom < min ? min : curr_zoom;
        // scale is from 1.0 to 3.0
        // var scale = data["scale"] = (curr_zoom != max)? ((curr_zoom%20)/10+1): 3;
        // scale is from 1.0 to 2.0
        var scale = curr_zoom / 10 + 1;
        data["mapCanvas"].draggable("option", "disabled", !(curr_zoom > 0));
        data["redBox"].draggable("option", "disabled", !(curr_zoom > 0));
        /*
        data["redBox"].animate({
        	"width":200/scale + "px",
        	"height":200/scale + "px"
        }, 10);
        */
        data["redBox"].width(200 / scale);
        data["redBox"].height(200 / scale); {
            var margin = 3;
            var red_w = data["redBox"].width();
            var red_h = data["redBox"].height();
            var red_top = data["redBox"].position().top - data["redBox"].parent().position().top - margin;
            var red_left = data["redBox"].position().left - data["redBox"].parent().position().left;
            var new_left, new_top;

            if (red_top + red_h > 200) {
                new_top = 200 - red_h;
                data["redBox"].css({ "top": new_top });
                data["mapCanvas"].css({ "top": -new_top / red_h * data["ori_height"] });
            } else if (red_top < 0) {
                data["redBox"].css({ "top": 0 });
                data["mapCanvas"].css({ "top": 0 });
            }
            if (red_left + red_w > 200) {
                new_left = 200 - red_w;
                data["redBox"].css({ "left": new_left });
                data["mapCanvas"].css({ "left": -new_left / red_w * data["ori_width"] });
            } else if (red_left < 0) {
                data["redBox"].css({ "left": 0 });
                data["mapCanvas"].css({ "left": 0 });
            }
        }
        /*
        if (data["redBox"].position().top + 200/scale > 200)
        {
        	var top = -200/scale+200;
        	data["redBox"].css({"top":top});
        	data["mapCanvas"].css({"top": -top/data["redBox"].height() * data["ori_height"]});
        }
        if (data["redBox"].position().left + 200/scale > 200)
        {
        	var left = -200/scale+200;
        	data["redBox"].css({"left":left});
        	data["mapCanvas"].css({"left": -left/data["redBox"].width() * data["ori_width"]});
        }
        */
        data["redBox"].trigger("dragstop");

        data["slider"].slider("value", curr_zoom);
        data["curr_zoom"] = curr_zoom;
        if (!(curr_zoom > 0)) {
            data["mapCanvas"].css({ "top": 0, "left": 0 });
            data["redBox"].css({ "top": 0, "left": 0 });
        }
        createMap(arr, scale);
        data["scale"] = scale;
    }).on("click", ".zoom_in", function(e) {
        var me = $(e.delegateTarget);
        me.triggerHandler("zoom_changed", me.data("curr_zoom") + 1);
    }).on("click", ".zoom_out", function(e) {
        var me = $(e.delegateTarget);
        me.triggerHandler("zoom_changed", me.data("curr_zoom") - 1);
    }).on("click", ".action img", function(e) {}).on("click", ".action", function(e) {
        var target = e.target === this ? $(e.target) : $(e.target).closest("div.blueButton");
        var action = target.data("action");
        var me = $(e.delegateTarget);
        var arr = me.data("arr_flag");
        if (target.hasClass("movie")) {
            var path = target.data("path");
            var title = target.data("title");
            var v = $("<video />").attr("width", 800).attr("height", 450).attr("controls", "controls").html('<source src="mp4/' + path + '" type="video/mp4">');
            mp4div.append(v);
            mp4div.dialog("option", "title", title).dialog('open');
        } else if (target.hasClass("googlemap")) {
            var path = target.data("path");
            var title = target.data("title");
            var v = $("<iframe src='" + path + "' ></iframe>").attr("width", bodytWidth / 1.8).attr("height", bodyHeight / 1.8);

            mp4div.append(v);
            mp4div.dialog("option", "title", title).dialog('open');
        } else if (target.hasClass("ques")) {
            var title = target.data("title");
            $(".ansBox").hide();
            var q = $(".question").clone(true);
            // $.extend(q,$('.question'))
            mp4div.append(q.css('display', 'block'));
            mp4div.dialog("option", "title", title).dialog('open');
        } else {
            target.toggleClass("clicked");
            arr[action] = target.hasClass("clicked") ? 1 : 0;
            console.log($(e.delegateTarget).data());
            createMap(arr, $(e.delegateTarget).data("scale"));
            setSound(arr[action], action);
        }
        me.data("arr_flag", arr);
    }).on("mouseup", ".action_all", function(e) {
        var target = $(e.target);
        target.toggleClass("clicked", false);
    }).on("mousedown", ".action_all", function(e) {
        var target = $(e.target);
        var action = target.data("action");
        var me = $(e.delegateTarget);
        var arr = me.data("arr_flag");
        var actions = me.find(".action").filter(function() {
            return !$(this).is(".movie,.googlemap,.ques");
        });
        var new_arr;
        target.toggleClass("clicked", true);

        muteMe();
        switch (action) {
            case "show":
                new_arr = $.map(arr, function(o) {
                    return 1;
                });
                actions.toggleClass("clicked", true);
                break;
            case "hide":
                new_arr = $.map(arr, function(o) {
                    return 0;
                });
                actions.toggleClass("clicked", false);
                clearInterval(redTimer);
                clearInterval(greedTimer);
                for (var i = 0; i < timerGroup.length; i++) {
                    clearTimeout(timerGroup[i]);
                }
                break;
            default:
                break;
        }
        createMap(new_arr, $(e.delegateTarget).data("scale"));
        me.data("arr_flag", new_arr);
    });
}

function bind_ques(div, rightIndex) {
    div.on('click', '.item', function(e) {
        $(".ansBox").removeClass('rightico wrongico');
        $(e.target).addClass('selected').siblings().removeClass('selected');
        console.log(e.target.innerHTML, $(e.target).innerHTML);
        if (e.target.innerHTML.indexOf(rightIndex) > -1) {
            $(".ansBox").show().addClass('rightico');
        } else {
            $(".ansBox").show().addClass('wrongico');
        }
    });

}

function bind_sound(div) {
    div.on('click', function() {
        if (div.hasClass('mute')) {
            div.removeClass('mute');
            isMute = false;
        } else {
            div.addClass('mute');
            isMute = true;
            muteMe();
        }
    });
}

function swipe_enlarge_scale(prev_zoom, max_zoom, pinchZoom, distance) {
    return prev_zoom > 0 ? distance / max_zoom : pinchZoom;
}

function swipe_reduce_scale(prev_zoom, max_zoom, pinchZoom, distance, prev_distance) {
    prev_distance = prev_distance || 300;
    var curr_zoom = (prev_distance - distance) / prev_distance * max_zoom;
    if (curr_zoom > prev_zoom) {
        curr_zoom = prev_zoom * pinchZoom;
    }
    return curr_zoom;
    // return prev_distance? (distance - prev_distance)  / max_zoom: pinchZoom * prev_zoom;
    // return Math.round(prev_zoom * pinchZoom);
}