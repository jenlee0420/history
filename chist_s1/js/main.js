$(function() {
    $(window).load(function() {

        var main_container = $("#main_container");
        var mp4_container = $("#mp4_container");


        var ori_width = canvasW;
        var ori_height = canvasH;
        console.log(ori_width, ori_height)
            // var ori_width = $(window).innerWidth() - $(window).innerWidth() * 0.2;
            // baseWidth = ori_width
            // var ori_height = $(window).innerHeight() - 50;
            //fix

        var arr_flag = [0, 0, 0, 0, 0, 0, 0, 0];
        var canvas = createMap(arr_flag, 1).draggable({
            disabled: true,
            drag: function(e, ui) {
                var newTop = ui.position.top;
                var newLeft = ui.position.left;
                var maxHeight = ui.helper.height() - ori_height;
                var maxWidth = ui.helper.width() - ori_width;
                if (ui.position.top < 0 && ui.position.top * -1 > maxHeight) {
                    newTop = maxHeight * -1;
                }
                if (ui.position.top > 0) {
                    newTop = 0;
                }
                if (ui.position.left < 0 && ui.position.left * -1 > maxWidth) {
                    newLeft = maxWidth * -1;
                }
                if (ui.position.left > 0) {
                    newLeft = 0;
                }
                ui.position.top = newTop;
                ui.position.left = newLeft;

                $("#main_container").data("redBox").css({
                    "top": -newTop / ui.helper.height() * (ori_height / 3),
                    "left": -newLeft / ui.helper.width() * (ori_height / 3)
                })

                /*
                $("#main_container").data("redBox").css({
                    "top": top,
                    "left": -newLeft/ori_width*(ori_width/ratio).toFixed(0)
                })
                */
                // if (ui.position.top<0) { ui.position.top = ori_height - ui.helper.height(); }
                // if(ui.position.left+580<580) { ui.position.left = 0; }
                // if(ui.position.top+550<550) { ui.position.top = 0; }

            }
        }).swipe({
            pinchStatus: function(event, phase, direction, distance, duration, fingerCount, pinchZoom) {
                var me = $(this);
                var data = $("#main_container").data();
                var prev_zoom = data["curr_zoom"];
                var curr_zoom;

                // prev_zoom = prev_zoom==0? 1: prev_zoom;
                if (pinchZoom == 1) {
                    return;
                }
                if (direction == null) {
                    return;
                }
                if (distance < 10) // 10 is just a feeling
                {
                    // return;
                }
                if (pinchZoom < 1) {
                    if (prev_zoom == 0) {
                        return;
                    }
                    curr_zoom = swipe_reduce_scale(data["curr_zoom"], data["max_zoom"], pinchZoom, distance, data["prev_distance"]);
                    // data["prev_distance"] = distance;
                } else {
                    var prev_zoom = $("#main_container").data("curr_zoom");
                    // var a = prev_zoom > 0 ? prev_zoom + pinchZoom: pinchZoom;
                    var a = swipe_enlarge_scale(prev_zoom, data["max_zoom"], pinchZoom, distance);
                    if (a < prev_zoom || a > data["max_zoom"])
                        return;
                    curr_zoom = Math.round(a);

                    // $("#log").css({"padding-left":"300px"}).empty().append(pinchZoom, prev_zoom);
                }
                /*
                if (pinchZoom > 1)
                    curr_zoom = Math.round(pinchZoom*2);
                else
                    curr_zoom = Math.round(pinchZoom * 10 * 2);
                */

                // if (direction != null && distance >=10)
                {
                    $("#main_container").triggerHandler("zoom_changed", curr_zoom);

                    // $("#log").css({"padding-left":"200px"}).empty().append("pinchStatus", pinchZoom, " ", direction, " ", distance);
                }
            },
            fingers: 2,
            pinchThreshold: 0
        });
        var redBox = $("<div/>").css({
            "width": "200px",
            "height": "auto",
            "border": "1px solid red"
        }).draggable({
            disabled: true,
            containment: "parent",
            drag: function(e, ui) {

                $("#main_container").data("mapCanvas").css({
                    "top": -ui.position.top / ui.helper.height() * (ori_height),
                    "left": -ui.position.left / ui.helper.width() * (ori_width)
                })
            }
        });
        main_container.data({
            "min_zoom": 0,
            "max_zoom": 10,
            "curr_zoom": 0,
            "scale": 1,
            "ori_width": ori_width,
            "ori_height": ori_height,
            "mapCanvas": canvas,
            "redBox": redBox,
            "arr_flag": arr_flag,
        });
        main_container.append(
                $("<div/>").addClass("title_bar purpleGradient").css({
                    // 'height':$(window).innerHeight() * 0.11 +'px'
                }).append(
                    $("<div/>").append($("<div/>").addClass("back_action blueButton").text("返回")).css({
                        "float": "right"
                    }).hide(),
                    $("<div/>", {
                        'id': 'soundCon'
                    }),
                    "<span>隋代運河分佈圖 (581-618 年)</span>"
                ),
                $("<div class='main_box'/>").append(
                    $("<div/>", {
                        "id": "map_container"
                    }).css({
                        "float": "left",
                        "width": ori_width + "px",
                        "height": ori_height + "px"
                    }).append(
                        canvas
                    ).css({
                        "overflow": "hidden"
                    }),
                    $("<div/>", {
                        "id": "menu_container"
                    }).append(
                        $("<div/>", {
                            "id": "action_container"
                        }).addClass("greyContainer").css({
                            "padding": "1px 3px 5px 1px",
                            "height": "auto",
                            "flex": '1'
                        }).append(
                            $("<div/>").addClass("sample_title").append("圖例"),
                            $("<div/>").addClass("sample blueButton action").data("action", "0").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/capital_icon.png"
                                }).addClass("icon fix_height"), "首都")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "1").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/dongdu.png"
                                }).addClass("icon fix_height"), "東都")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "2").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/main_city_icon.png"
                                }).addClass("icon fix_height"), "要邑")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "3").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/gate_icon.png"
                                }).addClass("icon"), "關口")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "4").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/river_icon.png"
                                }).addClass("icon"), "運河")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "5").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/redArrow_icon.png"
                                }).addClass("icon"), "航綫 1")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "6").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/greenArrow_icon.png"
                                }).addClass("icon"), "航綫 2")
                            ),
                            $("<div/>").addClass("sample blueButton action").data("action", "7").append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/rice.png"
                                }).addClass("icon"), "糧食儲存")
                            ),
                            $("<div />").addClass("sample blueButton action googlemap").data({
                                "action": "8",
                                "path": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d845158.7150065893!2d108.8816973!3d34.161658!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x366379e922ac17b9%3A0x85d466fda794582e!2z5Lit5ZyL6Zmd6KW_55yB6KW_5a6J5biC!5e0!3m2!1szh-TW!2shk!4v1570607554797!5m2!1szh-TW!2shk",
                                "title": "大興（今西安市）"
                            }).append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/capital_icon.png"
                                }).addClass("icon"), "大興（今西安市）")
                            ),
                            $("<div />").addClass("sample blueButton action ques").data({
                                "action": "9",
                                'title': '問題'
                            }).append(
                                $("<span />").append($("<img />", {
                                    "src": "img/icon/question.png"
                                }).addClass("icon"), "問題")
                            ),
                            $("<div/>").addClass("smallMap").css({
                                "width": "202px",
                                "height": "auto",
                                "margin": "3px auto",
                                "overflow": "hidden"
                            }).append(
                                redBox // .css({"visibility": "hidden"})
                            ).css({
                                "visibility": "hidden",
                                "display": 'none'
                            })
                            // $("<div/>").addClass("sample").css({"background-color":"transparent", "border-bottom":"2px solid black", "border-radius":"0px"}),
                        ),
                        $("<div/>").addClass("greyContainer").append(
                            $("<div/>").css({
                                "display": "flex",
                                "width": "100%",
                                "justify-content": 'space-between'
                            }).append(
                                $("<div/>").addClass("blueButton action_all").append("全部顯示").data("action", "show"),
                                $("<div/>").addClass("blueButton action_all").append("全部隱藏").data("action", "hide")
                            )
                        ),
                        $("<div/>", {
                            "id": "map_action_container"
                        }).addClass("greyContainer").css({
                            'margin-bottom': '10px'
                        })
                        .append(
                            /*
                            $("<div/>").addClass("smallMap").css({"width":"202px", "height":"202px", "margin":"3px auto", "overflow":"hidden"}).append(
                                redBox.css({"visibility": "hidden"})
                            ).hide(),
                            */
                            $("<div/>").addClass("zoom_button zoom_out blueButton").css({
                                "width": "2.07em",
                                "margin": "5px 10px 3px 10px"
                            }).append("<b>-</b>"),
                            $("<div/>", {
                                "id": "slider"
                            }).addClass("zoom_button").css({
                                "width": "50%",
                                "height": "0.06em",
                                "border-radius": '4px'
                            }).slider({
                                min: main_container.data("min_zoom"),
                                max: main_container.data("max_zoom"),
                                slide: function(e, ui) {
                                    main_container.triggerHandler("zoom_changed", ui.value);
                                }
                            }),
                            $("<div/>").addClass("zoom_button zoom_in blueButton").css({
                                "width": "2.07em",
                                "margin": "5px 10px 3px 10px"
                            }).append("<b>+</b>")

                        )
                    ).css({
                        "float": "right"
                    })
                )
            ).disableSelection() // end of main_container
            .data({
                "big_map": $("#map_container"),
                "slider": $("#slider")
            });
        bind_map_func(main_container, mp4_container);
        mp4_container.dialog({
            autoOpen: false,
            modal: true,
            resizable: false,
            width: 'auto',
            close: function() {
                $(this).empty();
            }
        });
        bind_ques($(".question"), '增加稅收')
        bind_sound($("#soundCon"))
        $("#loading").hide();
        $("#main_container").show();
        resetWidth()
    })

    function resetWidth(params) {
        console.log('ere', boxscale)
        $("#main_container").css({
            'width': docWidth,
            'height': docHeight
        })
        $(".title_bar").css({ 'height': 168 * boxscale })
        $('body').css({
            'overflow': 'hidden',
            'height': docHeight
        })
        var can = document.querySelectorAll('canvas')
        for(i=0;i<can.length; i++){
            $(can[i]).css({ 'zoom': boxscale})
        }
        $("#map_container").css({ width: canvasW, height: canvasH})
        $("#canvasInnerDiv").css({ width: canvasW, height: canvasH})
        
    }
    window.addEventListener('resize', resetWidth)
})