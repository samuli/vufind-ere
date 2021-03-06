finna.feed = (function() {
    var calculateScrollSpeed = function(scrollCnt) {
        return 750 * Math.max(1, (scrollCnt/5));
    };

    // Horizontal carousel:
    var centerImages = function(holder) {
        holder.find(".carousel-feed:not(.slick-vertical) .slick-slide .wrapper img").each (function() {
            centerImage($(this));
        });
    };

    var centerImage = function(img) {
        var offset = img.width() - img.closest(".slick-slide").width();
        img.css("margin-left", offset > 0 ? "-" + offset/2 + "px" : "auto");
    };

    var adjustWidth = function(holder) {
        holder.find(".carousel-slide-header p, .carousel-text")
            .width(holder.find(".slick-slide").width()-20);

        holder.find(".slick-slide .wrapper img").each (function() {
            centerImage($(this));
        });
    };

    var adjustTitles = function(holder) {
        // Move title field below image
        var maxH = 0;
        holder.find(".carousel-feed .slick-slide .carousel-slide-header p").each(function() {
            maxH = Math.max(maxH, $(this).innerHeight());
            $(this).addClass("title-bottom");
        });
        holder.find(".carousel-feed .slick-list").css("padding-bottom", maxH + "px");
        holder.find(".carousel-feed .slick-slide .carousel-text").addClass("text-bottom");
    };

    // Vertical carousel:
    var adjustTextFields = function(holder) {
        holder.find(".carousel-feed .slick-slide").each(function() {
            adjustTextField($(this));
        });
    };

    var adjustTextField = function(slide) {
        var imgH = slide.find(".wrapper").height();
        var titleH = slide.find(".carousel-slide-header p").height();
        var textF = slide.find(".carousel-text");
        var pos = titleH+10;
        textF.css("margin-top", pos + "px");
        var h = imgH-pos-10;
        if (h < 0) {
            return;
        }
        if (lineH = textF.css("line-height")) {
            lineH = Math.floor(parseInt(lineH.replace('px', '')));
            var dif = h/lineH;
            h -= (dif-2);
            textF.height(h);
        }
    };

    var loadFeed = function(holder) {
        var id = holder.data('feed');
        if (typeof id == "undefined") {
            return;
        }

        // Append spinner
        holder.append('<i class="fa fa-spin fa-spinner hide"></i>');
        holder.find(".fa-spin").delay(1000).fadeIn();

        var url = path + '/AJAX/JSON?method=getFeed&id=' + id;
        url += "&touch-device=" + (finna.layout.isTouchDevice() ? 1 : 0);

        $.getJSON(url, function(response) {
            if (response.status == 'ERROR') {
                holder.html("<!-- Feed could not be loaded: " + response.data + " -->");
                return;
            }

            if (response.status === 'OK' && response.data) {
                holder.html(response.data.html);
                var settings = response.data.settings;
                if (typeof settings['height'] == 'undefined') {
                    settings['height'] = 300;
                }
                var type = settings['type'];

                var carousel =
                    type == "carousel" || type == "carousel-vertical";

                if (carousel) {
                    var vertical = type == 'carousel-vertical';
                    settings['vertical'] = vertical;

                    var obj = holder.find(".carousel-feed")
                        .slick(getCarouselSettings(settings));

                    var titleBottom =
                        typeof settings['titlePosition'] != 'undefined'
                        && settings['titlePosition'] == 'bottom'
                    ;

                    var callbacks = {};
                    if (!vertical) {
                        callbacks['resize'] =
                            function() {
                                adjustWidth(holder);
                                if (titleBottom) {
                                    adjustTitles(holder);
                                }
                                centerImages(holder);
                            };
                    } else {
                        callbacks['resize'] = function() {
                            adjustTextFields(holder);
                        };
                    }

                    var refreshId = null;
                    $(window).resize(function() {
                        clearInterval(refreshId);
                        refreshId = setTimeout(function() {
                            callbacks['resize']();
                        }, 250);
                    });

                    if (!vertical) {
                        adjustWidth(holder);

                        if (titleBottom) {
                            adjustTitles(holder);
                            holder.find('.carousel-hover-title').hide();
                        }

                        holder.find(".slick-slide")
                            .css("max-height", settings['height'] + "px")
                            .addClass('adjusted-height')
                            .find(".wrapper img").css("height", settings['height'] + "px")
                            .find(".slick-track, .slick-slide .wrapper").css("max-height", settings['height'] + "px");
                    } else {
                        holder.find(".slick-track, .slick-slide .wrapper").css("height", settings['height'] + "px");
                    }

                    // Carousel image onload-listeners
                    holder.find(".carousel-feed .slick-slide .wrapper img").each (function() {
                        $(this).on("load", function() {
                            if (!vertical) {
                                centerImage($(this));
                            } else {
                                adjustTextField($(this).closest(".slick-slide"));
                            }
                        });
                    });

                    // Text hover for touch devices
                    if (finna.layout.isTouchDevice()
                        && typeof settings['linkText'] == 'undefined'
                    ) {
                        holder.find(".slick-slide a").click(function(event) {
                            if (!$(this).closest(".slick-slide").hasClass("clicked")) {
                                $(this).closest(".slick-slide").addClass("clicked");
                                return false;
                            }
                        });
                    }

                    // Force refresh to make sure that the layout is ok
                    obj.slickGoTo(0, true);
                }
            }
        });
    };

    var getCarouselSettings = function(settings) {
        return {
            dots: settings['dots'],
            swipe: !settings['vertical'],
            infinite: true,
            touchThreshold: 8,
            autoplay: settings['autoplay'],
            autoplaySpeed: settings['autoplay'],
            slidesToShow: settings['slidesToShow']['desktop'],
            slidesToScroll: settings['scrolledItems']['desktop'],
            speed: calculateScrollSpeed(settings['scrolledItems']['desktop']),
            vertical: settings['vertical'],
            responsive: responsive = [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: settings['slidesToShow']['desktop-small'],
                        slidesToScroll: settings['scrolledItems']['desktop-small'],
                        speed: calculateScrollSpeed(settings['scrolledItems']['desktop-small']),
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: settings['slidesToShow']['tablet'],
                        slidesToScroll: settings['scrolledItems']['tablet'],
                        speed: calculateScrollSpeed(settings['scrolledItems']['tablet']),
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: settings['slidesToShow']['mobile'],
                        slidesToScroll: settings['scrolledItems']['mobile'],
                        speed: calculateScrollSpeed(settings['scrolledItems']['mobile']),
                    }
                }
            ]
        }
    };

    var initComponents = function() {
        $(".feed-container").each(function() {
            loadFeed($(this));
        });
    };

    var my = {
        init: function() {
            initComponents();
        }
    };

    return my;

})(finna);
