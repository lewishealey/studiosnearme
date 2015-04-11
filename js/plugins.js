/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.3.15
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */

/* global window, document, define, jQuery, setInterval, clearInterval */

(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this,
                responsiveSettings, breakpoint;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return '<button type="button" data-role="none">' + (i + 1) + '</button>';
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                onBeforeChange: null,
                onAfterChange: null,
                onInit: null,
                onReInit: null,
                onSetPosition: null,
                pauseOnHover: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rtl: false,
                slide: 'div',
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                variableWidth: false,
                vertical: false,
                waitForAnimate: true
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.paused = false;
            _.positionProp = null;
            _.respondTo = null;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.windowWidth = 0;
            _.windowTimer = null;

            _.options = $.extend({}, _.defaults, settings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;
            responsiveSettings = _.options.responsive || null;

            if (responsiveSettings && responsiveSettings.length > -1) {
                _.respondTo = _.options.respondTo || "window";
                for (breakpoint in responsiveSettings) {
                    if (responsiveSettings.hasOwnProperty(breakpoint)) {
                        _.breakpoints.push(responsiveSettings[
                            breakpoint].breakpoint);
                        _.breakpointSettings[responsiveSettings[
                            breakpoint].breakpoint] =
                            responsiveSettings[breakpoint].settings;
                    }
                }
                _.breakpoints.sort(function(a, b) {
                    return b - a;
                });
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;

            _.init();

            _.checkResponsive();

        }

        return Slick;

    }());

    Slick.prototype.addSlide = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr("index",index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {}, _ = this;

        if(_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({height: targetHeight},_.options.speed);
        }

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {

                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.asNavFor = function(index) {
        var _ = this, asNavFor = _.options.asNavFor != null ? $(_.options.asNavFor).getSlick() : null;
        if(asNavFor != null) asNavFor.slideHandler(index, true);
    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

        if (_.slideCount > _.options.slidesToShow && _.paused !== true) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator,
                _.options.autoplaySpeed);
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;
        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this;

        if (_.options.infinite === false) {

            if (_.direction === 1) {

                if ((_.currentSlide + 1) === _.slideCount -
                    1) {
                    _.direction = 0;
                }

                _.slideHandler(_.currentSlide + _.options.slidesToScroll);

            } else {

                if ((_.currentSlide - 1 === 0)) {

                    _.direction = 1;

                }

                _.slideHandler(_.currentSlide - _.options.slidesToScroll);

            }

        } else {

            _.slideHandler(_.currentSlide + _.options.slidesToScroll);

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow = $(_.options.prevArrow);
            _.$nextArrow = $(_.options.nextArrow);

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.appendTo(_.options.appendArrows);
            }

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.appendTo(_.options.appendArrows);
            }

            if (_.options.infinite !== true) {
                _.$prevArrow.addClass('slick-disabled');
            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dotString;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            dotString = '<ul class="' + _.options.dotsClass + '">';

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dotString += '<li>' + _.options.customPaging.call(this, _, i) + '</li>';
            }

            dotString += '</ul>';

            _.$dots = $(dotString).appendTo(
                _.options.appendDots);

            _.$dots.find('li').first().addClass(
                'slick-active');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides = _.$slider.children(_.options.slide +
            ':not(.slick-cloned)').addClass(
            'slick-slide');
        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element).attr("index",index);
        });

        _.$slidesCache = _.$slides;

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();

        if (_.options.accessibility === true) {
            _.$list.prop('tabIndex', 0);
        }

        _.setSlideClasses(typeof this.currentSlide === 'number' ? this.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.checkResponsive = function() {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();
        if (_.respondTo === "window") {
          respondToWidth = windowWidth;
        } else if (_.respondTo === "slider") {
          respondToWidth = sliderWidth;
        } else if (_.respondTo === "min") {
          respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (_.originalSettings.responsive && _.originalSettings
            .responsive.length > -1 && _.originalSettings.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (respondToWidth < _.breakpoints[breakpoint]) {
                        targetBreakpoint = _.breakpoints[breakpoint];
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        _.refresh();
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    _.options = $.extend({}, _.originalSettings,
                        _.breakpointSettings[
                            targetBreakpoint]);
                    _.refresh();
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    _.refresh();
                }
            }

        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.target),
            indexOffset, slideOffset, unevenOffset,navigables, prevNavigable;

        // If target is a link, prevent default action.
        $target.is('a') && event.preventDefault();

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide  - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $(event.target).parent().index() * _.options.slidesToScroll;

                navigables = _.getNavigableIndexes();
                prevNavigable = 0;
                if(navigables[index] && navigables[index] === index) {
                    if(index > navigables[navigables.length -1]){
                        index = navigables[navigables.length -1];
                    } else {
                        for(var n in navigables) {
                            if(index < navigables[n]) {
                                index = prevNavigable;
                                break;
                            }
                            prevNavigable = navigables[n];
                        }
                    }
                }
                _.slideHandler(index, false, dontAnimate);

            default:
                return;
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if(_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    }

    Slick.prototype.destroy = function() {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        $('.slick-cloned', _.$slider).remove();
        if (_.$dots) {
            _.$dots.remove();
        }
        if (_.$prevArrow && (typeof _.options.prevArrow !== 'object')) {
            _.$prevArrow.remove();
        }
        if (_.$nextArrow && (typeof _.options.nextArrow !== 'object')) {
            _.$nextArrow.remove();
        }
        if (_.$slides.parent().hasClass('slick-track')) {
            _.$slides.unwrap().unwrap();
        }

        _.$slides.removeClass(
            'slick-slide slick-active slick-center slick-visible')
            .removeAttr('index')
            .css({
                position: '',
                left: '',
                top: '',
                zIndex: '',
                opacity: '',
                width: ''
            });

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');

        _.$list.off('.slick');
        $(window).off('.slick-' + _.instanceUid);
        $(document).off('.slick-' + _.instanceUid);

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = "";

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(oldSlide, slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: 1000
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

            _.$slides.eq(oldSlide).animate({
                opacity: 0
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);
            _.applyTransition(oldSlide);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: 1000
            });

            _.$slides.eq(oldSlide).css({
                opacity: 0
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);
                    _.disableTransition(oldSlide);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.filterSlides = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.getCurrent = function() {

        var _ = this;

        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if(_.options.infinite === true) {
            pagerQty = Math.ceil(_.slideCount / _.options.slidesToScroll);
        } else {
            while (breakPoint < _.slideCount){
                ++pagerQty;
                breakPoint = counter + _.options.slidesToShow;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll  : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            slideWidth,
            targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight();

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if(slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if(slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow){
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if(_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }
            targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            if (_.options.centerMode === true) {
                if(_.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

         // 1680

        return targetLeft;

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var indexes = [];

        while (breakPoint < _.slideCount){
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll  : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this, slidesTraversed;

        if(_.options.swipeToSlide === true) {
            var swipedSlide = null;
            _.$slideTrack.find('.slick-slide').each(function(index, slide){
                if (slide.offsetLeft + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });
            slidesTraversed = Math.abs($(swipedSlide).attr('index') - _.currentSlide);
            return slidesTraversed;
        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.init = function() {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
        }

        if (_.options.onInit !== null) {
            _.options.onInit.call(this, _);
        }

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.on('click.slick', {
                message: 'previous'
            }, _.changeSlide);
            _.$nextArrow.on('click.slick', {
                message: 'next'
            }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.options.autoplay === true) {
            $('li', _.$dots)
                .on('mouseenter.slick', function(){
                    _.paused = true;
                    _.autoPlayClear();
                })
                .on('mouseleave.slick', function(){
                    _.paused = false;
                    _.autoPlay();
                });
        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        if (_.options.pauseOnHover === true && _.options.autoplay === true) {
            _.$list.on('mouseenter.slick', function(){
                _.paused = true;
                _.autoPlayClear();
            });
            _.$list.on('mouseleave.slick', function(){
                _.paused = false;
                _.autoPlay();
            });
        }

        if(_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if(_.options.focusOnSelect === true) {
            $(_.options.slide, _.$slideTrack).on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, function() {
            _.checkResponsive();
            _.setPosition();
        });

        $(window).on('resize.slick.slick-' + _.instanceUid, function() {
            if ($(window).width() !== _.windowWidth) {
                clearTimeout(_.windowDelay);
                _.windowDelay = window.setTimeout(function() {
                    _.windowWidth = $(window).width();
                    _.checkResponsive();
                    _.setPosition();
                }, 50);
            }
        });

        $('*[draggable!=true]', _.$slideTrack).on('dragstart', function(e){ e.preventDefault(); })

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

        if (_.options.autoplay === true) {

            _.autoPlay();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;

        if (event.keyCode === 37 && _.options.accessibility === true) {
            _.changeSlide({
                data: {
                    message: 'previous'
                }
            });
        } else if (event.keyCode === 39 && _.options.accessibility === true) {
            _.changeSlide({
                data: {
                    message: 'next'
                }
            });
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {
            $('img[data-lazy]', imagesScope).each(function() {
                var image = $(this),
                    imageSource = $(this).attr('data-lazy');

                image
                  .load(function() { image.animate({ opacity: 1 }, 200); })
                  .css({ opacity: 0 })
                  .attr('src', imageSource)
                  .removeAttr('data-lazy')
                  .removeClass('slick-loading');
            });
        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow/2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow/2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow/2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = rangeStart + _.options.slidesToShow;
            if (_.options.fade === true ) {
                if(rangeStart > 0) rangeStart--;
                if(rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

          if (_.slideCount <= _.options.slidesToShow){
              cloneRange = _.$slider.find('.slick-slide')
              loadImages(cloneRange)
          }else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange)
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if (_.options.onAfterChange !== null) {
            _.options.onAfterChange.call(this, _, index);
        }

        _.animating = false;

        _.setPosition();

        _.swipeLeft = null;

        if (_.options.autoplay === true && _.paused === false) {
            _.autoPlay();
        }

    };

    Slick.prototype.progressiveLazyLoad = function() {

        var _ = this,
            imgCount, targetImage;

        imgCount = $('img[data-lazy]', _.$slider).length;

        if (imgCount > 0) {
            targetImage = $('img[data-lazy]', _.$slider).first();
            targetImage.attr('src', targetImage.attr('data-lazy')).removeClass('slick-loading').load(function() {
                targetImage.removeAttr('data-lazy');
                _.progressiveLazyLoad();
            })
         .error(function () {
          targetImage.removeAttr('data-lazy');
          _.progressiveLazyLoad();
         });
        }

    };

    Slick.prototype.refresh = function() {

        var _ = this,
            currentSlide = _.currentSlide;

        _.destroy();

        $.extend(_, _.initials);

        _.init();

        _.changeSlide({
            data: {
                message: 'index',
                index: currentSlide,
            }
        }, true);

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides = _.$slideTrack.children(_.options.slide).addClass(
            'slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.setProps();

        _.setupInfinite();

        _.buildArrows();

        _.updateArrows();

        _.initArrowEvents();

        _.buildDots();

        _.updateDots();

        _.initDotEvents();

        if(_.options.focusOnSelect === true) {
            $(_.options.slide, _.$slideTrack).on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(0);

        _.setPosition();

        if (_.options.onReInit !== null) {
            _.options.onReInit.call(this, _);
        }

    };

    Slick.prototype.removeSlide = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if(removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {}, x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? position + 'px' : '0px';
        y = _.positionProp == 'top' ? position + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if(_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            var trackWidth = 0;
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.children('.slick-slide').each(function(){
                trackWidth += Math.ceil($(this).outerWidth(true));
            });
            _.$slideTrack.width(Math.ceil(trackWidth) + 1);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: 800,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: 800,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: 900,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if(_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        if (_.options.onSetPosition !== null) {
            _.options.onSetPosition.call(this, _);
        }

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if(_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = "-o-transform";
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = "-moz-transform";
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = "-webkit-transform";
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = "-ms-transform";
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = "transform";
            _.transitionType = 'transition';
        }
        _.transformsEnabled = (_.animType !== null && _.animType !== false);

    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        _.$slider.find('.slick-slide').removeClass('slick-active').removeClass('slick-center');
        allSlides = _.$slider.find('.slick-slide');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if(_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides.slice(index - centerOffset, index + centerOffset + 1).addClass('slick-active');
                } else {
                    indexOffset = _.options.slidesToShow + index;
                    allSlides.slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2).addClass('slick-active');
                }

                if (index === 0) {
                    allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
                } else if (index === _.slideCount - 1) {
                    allSlides.eq(_.options.slidesToShow).addClass('slick-center');
                }

            }

            _.$slides.eq(index).addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {
                _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active');
            } else if ( allSlides.length <= _.options.slidesToShow ) {
                allSlides.addClass('slick-active');
            } else {
                remainder = _.slideCount%_.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
                if(_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {
                    allSlides.slice(indexOffset-(_.options.slidesToShow-remainder), indexOffset + remainder).addClass('slick-active');
                } else {
                    allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active');
                }
            }

        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }

    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                    infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('index', slideIndex-_.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('index', slideIndex+_.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;
        var index = parseInt($(event.target).parents('.slick-slide').attr("index"));
        if(!index) index = 0;

        if(_.slideCount <= _.options.slidesToShow){
            _.$slider.find('.slick-slide').removeClass('slick-active');
            _.$slides.eq(index).addClass('slick-active');
            if(_.options.centerMode === true) {
                _.$slider.find('.slick-slide').removeClass('slick-center');
                _.$slides.eq(index).addClass('slick-center');
            }
            _.asNavFor(index);
            return;
        }
        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index,sync,dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, unevenOffset, targetLeft = null,
            _ = this;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if(_.options.fade === false) {
                targetSlide = _.currentSlide;
                if(dontAnimate!==true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if(_.options.fade === false) {
                targetSlide = _.currentSlide;
                if(dontAnimate!==true) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay === true) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        if (_.options.onBeforeChange !== null && index !== _.currentSlide) {
            _.options.onBeforeChange.call(this, _, _.currentSlide, animSlide);
        }

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if(dontAnimate!==true) {
                _.fadeSlide(oldSlide,animSlide, function() {
                    _.postSlide(animSlide);
                });
            } else {
                _.postSlide(animSlide);
            }
            return;
        }

        if(dontAnimate!==true) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this, slideCount;

        _.dragging = false;

        _.shouldClick = (_.touchObject.swipeLength > 10) ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            switch (_.swipeDirection()) {
                case 'left':
                    _.slideHandler(_.currentSlide + _.getSlideCount());
                    _.currentDirection = 0;
                    _.touchObject = {};
                    break;

                case 'right':
                    _.slideHandler(_.currentSlide - _.getSlideCount());
                    _.currentDirection = 1;
                    _.touchObject = {};
                    break;
            }
        } else {
            if(_.touchObject.startX !== _.touchObject.curX) {
                _.slideHandler(_.currentSlide);
                _.touchObject = {};
            }
        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
           return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
           return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            curLeft, swipeDirection, positionOffset, touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + _.touchObject.swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (_.touchObject
                .swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();
        if (_.$dots) {
            _.$dots.remove();
        }
        if (_.$prevArrow && (typeof _.options.prevArrow !== 'object')) {
            _.$prevArrow.remove();
        }
        if (_.$nextArrow && (typeof _.options.nextArrow !== 'object')) {
            _.$nextArrow.remove();
        }
        _.$slides.removeClass(
            'slick-slide slick-active slick-visible').css('width', '');

    };

    Slick.prototype.updateArrows = function() {

        var _ = this, centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2)

        if (_.options.arrows === true && _.options.infinite !==
            true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow.removeClass('slick-disabled');
            _.$nextArrow.removeClass('slick-disabled');
            if (_.currentSlide === 0) {
                _.$prevArrow.addClass('slick-disabled');
                _.$nextArrow.removeClass('slick-disabled');
            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
                _.$nextArrow.addClass('slick-disabled');
                _.$prevArrow.removeClass('slick-disabled');
            } else if (_.currentSlide > _.slideCount - _.options.slidesToShow + centerOffset  && _.options.centerMode === true) {
                _.$nextArrow.addClass('slick-disabled');
                _.$prevArrow.removeClass('slick-disabled');
            }
        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots.find('li').removeClass('slick-active');
            _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');

        }

    };

    $.fn.slick = function(options) {
        var _ = this;
        return _.each(function(index, element) {

            element.slick = new Slick(element, options);

        });
    };

    $.fn.slickAdd = function(slide, slideIndex, addBefore) {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.addSlide(slide, slideIndex, addBefore);

        });
    };

    $.fn.slickCurrentSlide = function() {
        var _ = this;
        return _.get(0).slick.getCurrent();
    };

    $.fn.slickFilter = function(filter) {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.filterSlides(filter);

        });
    };

    $.fn.slickGoTo = function(slide, dontAnimate) {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.changeSlide({
                data: {
                    message: 'index',
                    index: parseInt(slide)
                }
            }, dontAnimate);

        });
    };

    $.fn.slickNext = function() {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.changeSlide({
                data: {
                    message: 'next'
                }
            });

        });
    };

    $.fn.slickPause = function() {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.autoPlayClear();
            element.slick.paused = true;

        });
    };

    $.fn.slickPlay = function() {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.paused = false;
            element.slick.autoPlay();

        });
    };

    $.fn.slickPrev = function() {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.changeSlide({
                data: {
                    message: 'previous'
                }
            });

        });
    };

    $.fn.slickRemove = function(slideIndex, removeBefore) {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.removeSlide(slideIndex, removeBefore);

        });
    };

    $.fn.slickRemoveAll = function() {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.removeSlide(null, null, true);

        });
    };

    $.fn.slickGetOption = function(option) {
        var _ = this;
        return _.get(0).slick.options[option];
    };

    $.fn.slickSetOption = function(option, value, refresh) {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.options[option] = value;

            if (refresh === true) {
                element.slick.unload();
                element.slick.reinit();
            }

        });
    };

    $.fn.slickUnfilter = function() {
        var _ = this;
        return _.each(function(index, element) {

            element.slick.unfilterSlides();

        });
    };

    $.fn.unslick = function() {
        var _ = this;
        return _.each(function(index, element) {

          if (element.slick) {
            element.slick.destroy();
          }

        });
    };

    $.fn.getSlick = function() {
        var s = null;
        var _ = this;
        _.each(function(index, element) {
            s = element.slick;
        });

        return s;
    };

}));

//--------------------------------------------------------------------------
// JScoord
// jscoord.js
//
// (c) 2005 Jonathan Stott
//
// Created on 21-Dec-2005
//
// 1.1.1 - 16 Jan 2006
//  - Fixed radix bug in getOSRefFromSixFigureReference that would return
//    the incorrect reference if either the northing or the easting started
//    with a leading zero.
// 1.1 - 23 Dec 2005
//  - Added getOSRefFromSixFigureReference function.
// 1.0 - 11 Aug 2005
//  - Initial version created from PHPcoord v1.1
//--------------------------------------------------------------------------
// ================================================================== LatLng
function LatLng(lat, lng) {
    this.lat = lat;
    this.lng = lng;

    this.distance = LatLngDistance;

    this.toOSRef = LatLngToOSRef;
    this.toUTMRef = LatLngToUTMRef;

    this.WGS84ToOSGB36 = WGS84ToOSGB36;
    this.OSGB36ToWGS84 = OSGB36ToWGS84;

    this.toString = LatLngToString;
}

function LatLngToString() {
    return "(" + this.lat + ", " + this.lng + ")";
}

// =================================================================== OSRef
// References given with OSRef are accurate to 1m.
function OSRef(easting, northing) {
    this.easting = easting;
    this.northing = northing;

    this.toLatLng = OSRefToLatLng;

    this.toString = OSRefToString;
    this.toSixFigureString = OSRefToSixFigureString;
    this.toTenFigureString = OSRefToTenFigureString;
    this.getFirstAndSecondLetter = OSRefGetFirstAndSecondLetter;
}

function OSRefToString() {
    return "(" + this.easting + ", " + this.northing + ")";
}

function OSRefGetFirstAndSecondLetter() {
    var hundredkmE = Math.floor(this.easting / 100000);
    var hundredkmN = Math.floor(this.northing / 100000);
    var firstLetter = "";
    if (hundredkmN < 5) {
        if (hundredkmE < 5) {
            firstLetter = "S";
        } else {
            firstLetter = "T";
        }
    } else if (hundredkmN < 10) {
        if (hundredkmE < 5) {
            firstLetter = "N";
        } else {
            firstLetter = "O";
        }
    } else {
        firstLetter = "H";
    }

    var secondLetter = "";
    var index = 65 + ((4 - (hundredkmN % 5)) * 5) + (hundredkmE % 5);
    var ti = index;
    if (index >= 73) {
        index++;
    }
    secondLetter = chr(index);
    return firstLetter + secondLetter;
}

function OSRefToSixFigureString() {
    var hundredkmE = Math.floor(this.easting / 100000);
    var hundredkmN = Math.floor(this.northing / 100000);

    var e = Math.floor((this.easting - (100000 * hundredkmE)) / 100);
    var n = Math.floor((this.northing - (100000 * hundredkmN)) / 100);
    var es = e.toString();
    if (e < 100) {
        es = "0" + es;
    }
    if (e < 10) {
        es = "0" + es;
    }
    var ns = n.toString();
    if (n < 100) {
        ns = "0" + ns;
    }
    if (n < 10) {
        ns = "0" + ns;
    }

    return this.getFirstAndSecondLetter() + es + ns;
}

function OSRefToTenFigureString() {
    var hundredkmE = Math.floor(this.easting / 100000);
    var hundredkmN = Math.floor(this.northing / 100000);

    var e = Math.floor(this.easting - (100000 * hundredkmE));
    var n = Math.floor(this.northing - (100000 * hundredkmN));
    var es = e.toString();
    if (e < 10000) {
        es = "0" + es;
    }
    if (e < 1000) {
        es = "0" + es;
    }
    if (e < 100) {
        es = "0" + es;
    }
    if (e < 10) {
        es = "0" + es;
    }
    var ns = n.toString();
    if (n < 10000) {
        ns = "0" + ns;
    }
    if (n < 1000) {
        ns = "0" + ns;
    }
    if (n < 100) {
        ns = "0" + ns;
    }
    if (n < 10) {
        ns = "0" + ns;
    }

    return this.getFirstAndSecondLetter() + " " + es + " " + ns;
}

// ================================================================== UTMRef
function UTMRef(easting, northing, latZone, lngZone) {
    this.easting = easting;
    this.northing = northing;
    this.latZone = latZone;
    this.lngZone = lngZone;

    this.toLatLng = UTMRefToLatLng;

    this.toString = UTMRefToString;
}

function UTMRefToString() {
    return this.lngZone + this.latZone + " " + this.easting + " " + this.northing;
}

// ================================================================== RefEll
function RefEll(maj, min) {
    this.maj = maj;
    this.min = min;
    this.ecc = ((maj * maj) - (min * min)) / (maj * maj);
}

// ================================================== Mathematical Functions
function sinSquared(x) {
    return Math.sin(x) * Math.sin(x);
}

function cosSquared(x) {
    return Math.cos(x) * Math.cos(x);
}

function tanSquared(x) {
    return Math.tan(x) * Math.tan(x);
}

function sec(x) {
    return 1.0 / Math.cos(x);
}

function deg2rad(x) {
    return x * (Math.PI / 180);
}

function rad2deg(x) {
    return x * (180 / Math.PI);
}

function chr(x) {
    var h = x.toString(16);
    if (h.length === 1) {
        h = "0" + h;
    }
    h = "%" + h;
    return decodeURIComponent(h);
}

function ord(x) {
    var c = x.charAt(0);
    var i;
    for (i = 0; i < 256; ++i) {
        var h = i.toString(16);
        if (h.length === 1) {
            h = "0" + h;
        }
        h = "%" + h;
        h = decodeURIComponent(h);
        if (h === c) {
            break;
        }
    }
    return i;
}

// ========================================================= Other Functions
function LatLngDistance(to) {
    var er = 6366.707;

    var latFrom = deg2rad(this.lat);
    var latTo = deg2rad(to.lat);
    var lngFrom = deg2rad(this.lng);
    var lngTo = deg2rad(to.lng);

    var x1 = er * Math.cos(lngFrom) * Math.sin(latFrom);
    var y1 = er * Math.sin(lngFrom) * Math.sin(latFrom);
    var z1 = er * Math.cos(latFrom);

    var x2 = er * Math.cos(lngTo) * Math.sin(latTo);
    var y2 = er * Math.sin(lngTo) * Math.sin(latTo);
    var z2 = er * Math.cos(latTo);

    var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));

    return d;
}

// ==================================================== Conversion Functions
function OSGB36ToWGS84() {
    var airy1830 = new RefEll(6377563.396, 6356256.909);
    var a = airy1830.maj;
    var b = airy1830.min;
    var eSquared = airy1830.ecc;
    var phi = deg2rad(this.lat);
    var lambda = deg2rad(this.lng);
    var v = a / (Math.sqrt(1 - eSquared * sinSquared(phi)));
    var H = 0;
    var x = (v + H) * Math.cos(phi) * Math.cos(lambda);
    var y = (v + H) * Math.cos(phi) * Math.sin(lambda);
    var z = ((1 - eSquared) * v + H) * Math.sin(phi);

    var tx = 446.448;
    var ty = -124.157;
    var tz = 542.060;
    var s = -0.0000204894;
    var rx = deg2rad(0.00004172222);
    var ry = deg2rad(0.00006861111);
    var rz = deg2rad(0.00023391666);

    var xB = tx + (x * (1 + s)) + (-rx * y) + (ry * z);
    var yB = ty + (rz * x) + (y * (1 + s)) + (-rx * z);
    var zB = tz + (-ry * x) + (rx * y) + (z * (1 + s));

    var wgs84 = new RefEll(6378137.000, 6356752.3141);
    a = wgs84.maj;
    b = wgs84.min;
    eSquared = wgs84.ecc;

    var lambdaB = rad2deg(Math.atan(yB / xB));
    var p = Math.sqrt((xB * xB) + (yB * yB));
    var phiN = Math.atan(zB / (p * (1 - eSquared)));
    for (var i = 1; i < 10; i++) {
        v = a / (Math.sqrt(1 - eSquared * sinSquared(phiN)));
        var phiN1 = Math.atan((zB + (eSquared * v * Math.sin(phiN))) / p);
        phiN = phiN1;
    }

    var phiB = rad2deg(phiN);

    this.lat = phiB;
    this.lng = lambdaB;
}

function WGS84ToOSGB36() {
    var wgs84 = new RefEll(6378137.000, 6356752.3142);
    var a = wgs84.maj;
    var b = wgs84.min;
    var eSquared = wgs84.ecc;
    var phi = deg2rad(this.lat);
    var lambda = deg2rad(this.lng);
    var v = a / (Math.sqrt(1 - eSquared * sinSquared(phi)));
    var H = 0;
    var x = (v + H) * Math.cos(phi) * Math.cos(lambda);
    var y = (v + H) * Math.cos(phi) * Math.sin(lambda);
    var z = ((1 - eSquared) * v + H) * Math.sin(phi);

    var tx = -446.448;
    var ty = 125.157;
    var tz = -542.060;
    var s = 0.0000204894;
    var rx = deg2rad(-0.00004172222);
    var ry = deg2rad(-0.00006861111);
    var rz = deg2rad(-0.00023391666);

    var xB = tx + (x * (1 + s)) + (-rx * y) + (ry * z);
    var yB = ty + (rz * x) + (y * (1 + s)) + (-rx * z);
    var zB = tz + (-ry * x) + (rx * y) + (z * (1 + s));

    var airy1830 = new RefEll(6377563.396, 6356256.909);
    a = airy1830.maj;
    b = airy1830.min;
    eSquared = airy1830.ecc;

    var lambdaB = rad2deg(Math.atan(yB / xB));
    var p = Math.sqrt((xB * xB) + (yB * yB));
    var phiN = Math.atan(zB / (p * (1 - eSquared)));
    for (var i = 1; i < 10; i++) {
        v = a / (Math.sqrt(1 - eSquared * sinSquared(phiN)));
        var phiN1 = Math.atan((zB + (eSquared * v * Math.sin(phiN))) / p);
        phiN = phiN1;
    }

    var phiB = rad2deg(phiN);

    this.lat = phiB;
    this.lng = lambdaB;
}

function OSRefToLatLng() {
    var airy1830 = new RefEll(6377563.396, 6356256.909);
    var OSGB_F0 = 0.9996012717;
    var N0 = -100000.0;
    var E0 = 400000.0;
    var phi0 = deg2rad(49.0);
    var lambda0 = deg2rad(-2.0);
    var a = airy1830.maj;
    var b = airy1830.min;
    var eSquared = airy1830.ecc;
    var phi = 0.0;
    var lambda = 0.0;
    var E = this.easting;
    var N = this.northing;
    var n = (a - b) / (a + b);
    var M = 0.0;
    var phiPrime = ((N - N0) / (a * OSGB_F0)) + phi0;
    do {
        M = (b * OSGB_F0) * (((1 + n + ((5.0 / 4.0) * n * n) + ((5.0 / 4.0) * n * n * n)) * (phiPrime - phi0)) - (((3 * n) + (3 * n * n) + ((21.0 / 8.0) * n * n * n)) * Math.sin(phiPrime - phi0) * Math.cos(phiPrime + phi0)) + ((((15.0 / 8.0) * n * n) + ((15.0 / 8.0) * n * n * n)) * Math.sin(2.0 * (phiPrime - phi0)) * Math.cos(2.0 * (phiPrime + phi0))) - (((35.0 / 24.0) * n * n * n) * Math.sin(3.0 * (phiPrime - phi0)) * Math.cos(3.0 * (phiPrime + phi0))));
        phiPrime += (N - N0 - M) / (a * OSGB_F0);
    } while((N - N0 - M) >= 0.001);
    var v = a * OSGB_F0 * Math.pow(1.0 - eSquared * sinSquared(phiPrime), -0.5);
    var rho = a * OSGB_F0 * (1.0 - eSquared) * Math.pow(1.0 - eSquared * sinSquared(phiPrime), -1.5);
    var etaSquared = (v / rho) - 1.0;
    var VII = Math.tan(phiPrime) / (2 * rho * v);
    var VIII = (Math.tan(phiPrime) / (24.0 * rho * Math.pow(v, 3.0))) * (5.0 + (3.0 * tanSquared(phiPrime)) + etaSquared - (9.0 * tanSquared(phiPrime) * etaSquared));
    var IX = (Math.tan(phiPrime) / (720.0 * rho * Math.pow(v, 5.0))) * (61.0 + (90.0 * tanSquared(phiPrime)) + (45.0 * tanSquared(phiPrime) * tanSquared(phiPrime)));
    var X = sec(phiPrime) / v;
    var XI = (sec(phiPrime) / (6.0 * v * v * v)) * ((v / rho) + (2 * tanSquared(phiPrime)));
    var XII = (sec(phiPrime) / (120.0 * Math.pow(v, 5.0))) * (5.0 + (28.0 * tanSquared(phiPrime)) + (24.0 * tanSquared(phiPrime) * tanSquared(phiPrime)));
    var XIIA = (sec(phiPrime) / (5040.0 * Math.pow(v, 7.0))) * (61.0 + (662.0 * tanSquared(phiPrime)) + (1320.0 * tanSquared(phiPrime) * tanSquared(phiPrime)) + (720.0 * tanSquared(phiPrime) * tanSquared(phiPrime) * tanSquared(phiPrime)));
    phi = phiPrime - (VII * Math.pow(E - E0, 2.0)) + (VIII * Math.pow(E - E0, 4.0)) - (IX * Math.pow(E - E0, 6.0));
    lambda = lambda0 + (X * (E - E0)) - (XI * Math.pow(E - E0, 3.0)) + (XII * Math.pow(E - E0, 5.0)) - (XIIA * Math.pow(E - E0, 7.0));

    return new LatLng(rad2deg(phi), rad2deg(lambda));
}

/**
* Convert a latitude and longitude into an OSGB grid reference
*
* @param latitudeLongitude the latitude and longitude to convert
* @return the OSGB grid reference
* @since 0.1
*/
function LatLngToOSRef() {
    var airy1830 = new RefEll(6377563.396, 6356256.909);
    var OSGB_F0 = 0.9996012717;
    var N0 = -100000.0;
    var E0 = 400000.0;
    var phi0 = deg2rad(49.0);
    var lambda0 = deg2rad(-2.0);
    var a = airy1830.maj;
    var b = airy1830.min;
    var eSquared = airy1830.ecc;
    var phi = deg2rad(this.lat);
    var lambda = deg2rad(this.lng);
    var E = 0.0;
    var N = 0.0;
    var n = (a - b) / (a + b);
    var v = a * OSGB_F0 * Math.pow(1.0 - eSquared * sinSquared(phi), -0.5);
    var rho = a * OSGB_F0 * (1.0 - eSquared) * Math.pow(1.0 - eSquared * sinSquared(phi), -1.5);
    var etaSquared = (v / rho) - 1.0;
    var M = (b * OSGB_F0) * (((1 + n + ((5.0 / 4.0) * n * n) + ((5.0 / 4.0) * n * n * n)) * (phi - phi0)) - (((3 * n) + (3 * n * n) + ((21.0 / 8.0) * n * n * n)) * Math.sin(phi - phi0) * Math.cos(phi + phi0)) + ((((15.0 / 8.0) * n * n) + ((15.0 / 8.0) * n * n * n)) * Math.sin(2.0 * (phi - phi0)) * Math.cos(2.0 * (phi + phi0))) - (((35.0 / 24.0) * n * n * n) * Math.sin(3.0 * (phi - phi0)) * Math.cos(3.0 * (phi + phi0))));
    var I = M + N0;
    var II = (v / 2.0) * Math.sin(phi) * Math.cos(phi);
    var III = (v / 24.0) * Math.sin(phi) * Math.pow(Math.cos(phi), 3.0) * (5.0 - tanSquared(phi) + (9.0 * etaSquared));
    var IIIA = (v / 720.0) * Math.sin(phi) * Math.pow(Math.cos(phi), 5.0) * (61.0 - (58.0 * tanSquared(phi)) + Math.pow(Math.tan(phi), 4.0));
    var IV = v * Math.cos(phi);
    var V = (v / 6.0) * Math.pow(Math.cos(phi), 3.0) * ((v / rho) - tanSquared(phi));
    var VI = (v / 120.0) * Math.pow(Math.cos(phi), 5.0) * (5.0 - (18.0 * tanSquared(phi)) + (Math.pow(Math.tan(phi), 4.0)) + (14 * etaSquared) - (58 * tanSquared(phi) * etaSquared));

    N = I + (II * Math.pow(lambda - lambda0, 2.0)) + (III * Math.pow(lambda - lambda0, 4.0)) + (IIIA * Math.pow(lambda - lambda0, 6.0));
    E = E0 + (IV * (lambda - lambda0)) + (V * Math.pow(lambda - lambda0, 3.0)) + (VI * Math.pow(lambda - lambda0, 5.0));

    return new OSRef(E, N);
}

/**
* Convert an UTM reference to a latitude and longitude
*
* @param ellipsoid A reference ellipsoid to use
* @param utm the UTM reference to convert
* @return the converted latitude and longitude
* @since 0.2
*/
function UTMRefToLatLng() {
    var wgs84 = new RefEll(6378137, 6356752.314);
    var UTM_F0 = 0.9996;
    var a = wgs84.maj;
    var eSquared = wgs84.ecc;
    var ePrimeSquared = eSquared / (1.0 - eSquared);
    var e1 = (1 - Math.sqrt(1 - eSquared)) / (1 + Math.sqrt(1 - eSquared));
    var x = this.easting - 500000.0;
    ;
    var y = this.northing;
    var zoneNumber = this.lngZone;
    var zoneLetter = this.latZone;

    var longitudeOrigin = (zoneNumber - 1.0) * 6.0 - 180.0 + 3.0;

    // Correct y for southern hemisphere
    if ((ord(zoneLetter) - ord("N")) < 0) {
        y -= 10000000.0;
    }

    var m = y / UTM_F0;
    var mu = m / (a * (1.0 - eSquared / 4.0 - 3.0 * eSquared * eSquared / 64.0 - 5.0 * Math.pow(eSquared, 3.0) / 256.0));

    var phi1Rad = mu + (3.0 * e1 / 2.0 - 27.0 * Math.pow(e1, 3.0) / 32.0) * Math.sin(2.0 * mu) + (21.0 * e1 * e1 / 16.0 - 55.0 * Math.pow(e1, 4.0) / 32.0) * Math.sin(4.0 * mu) + (151.0 * Math.pow(e1, 3.0) / 96.0) * Math.sin(6.0 * mu);

    var n = a / Math.sqrt(1.0 - eSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
    var t = Math.tan(phi1Rad) * Math.tan(phi1Rad);
    var c = ePrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
    var r = a * (1.0 - eSquared) / Math.pow(1.0 - eSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
    var d = x / (n * UTM_F0);

    var latitude = (phi1Rad - (n * Math.tan(phi1Rad) / r) * (d * d / 2.0 - (5.0 + (3.0 * t) + (10.0 * c) - (4.0 * c * c) - (9.0 * ePrimeSquared)) * Math.pow(d, 4.0) / 24.0 + (61.0 + (90.0 * t) + (298.0 * c) + (45.0 * t * t) - (252.0 * ePrimeSquared) - (3.0 * c * c)) * Math.pow(d, 6.0) / 720.0)) * (180.0 / Math.PI);

    var longitude = longitudeOrigin + ((d - (1.0 + 2.0 * t + c) * Math.pow(d, 3.0) / 6.0 + (5.0 - (2.0 * c) + (28.0 * t) - (3.0 * c * c) + (8.0 * ePrimeSquared) + (24.0 * t * t)) * Math.pow(d, 5.0) / 120.0) / Math.cos(phi1Rad)) * (180.0 / Math.PI);

    return new LatLng(latitude, longitude);
}

/**
* Convert a latitude and longitude to an UTM reference
*
* @param ellipsoid A reference ellipsoid to use
* @param latitudeLongitude The latitude and longitude to convert
* @return the converted UTM reference
* @since 0.2
*/
function LatLngToUTMRef() {
    var wgs84 = new RefEll(6378137, 6356752.314);
    var UTM_F0 = 0.9996;
    var a = wgs84.maj;
    var eSquared = wgs84.ecc;
    var longitude = this.lng;
    var latitude = this.lat;

    var latitudeRad = latitude * (Math.PI / 180.0);
    var longitudeRad = longitude * (Math.PI / 180.0);
    var longitudeZone = Math.floor((longitude + 180.0) / 6.0) + 1;

    // Special zone for Norway
    if (latitude >= 56.0 && latitude < 64.0 && longitude >= 3.0 && longitude < 12.0) {
        longitudeZone = 32;
    }

    // Special zones for Svalbard
    if (latitude >= 72.0 && latitude < 84.0) {
        if (longitude >= 0.0 && longitude < 9.0) {
            longitudeZone = 31;
        } else if (longitude >= 9.0 && longitude < 21.0) {
            longitudeZone = 33;
        } else if (longitude >= 21.0 && longitude < 33.0) {
            longitudeZone = 35;
        } else if (longitude >= 33.0 && longitude < 42.0) {
            longitudeZone = 37;
        }
    }

    var longitudeOrigin = (longitudeZone - 1) * 6 - 180 + 3;
    var longitudeOriginRad = longitudeOrigin * (Math.PI / 180.0);

    var UTMZone = getUTMLatitudeZoneLetter(latitude);

    var ePrimeSquared = (eSquared) / (1 - eSquared);

    var n = a / Math.sqrt(1 - eSquared * Math.sin(latitudeRad) * Math.sin(latitudeRad));
    var t = Math.tan(latitudeRad) * Math.tan(latitudeRad);
    var c = ePrimeSquared * Math.cos(latitudeRad) * Math.cos(latitudeRad);
    var A = Math.cos(latitudeRad) * (longitudeRad - longitudeOriginRad);

    var M = a * ((1 - eSquared / 4 - 3 * eSquared * eSquared / 64 - 5 * eSquared * eSquared * eSquared / 256) * latitudeRad - (3 * eSquared / 8 + 3 * eSquared * eSquared / 32 + 45 * eSquared * eSquared * eSquared / 1024) * Math.sin(2 * latitudeRad) + (15 * eSquared * eSquared / 256 + 45 * eSquared * eSquared * eSquared / 1024) * Math.sin(4 * latitudeRad) - (35 * eSquared * eSquared * eSquared / 3072) * Math.sin(6 * latitudeRad));

    var UTMEasting = (UTM_F0 * n * (A + (1 - t + c) * Math.pow(A, 3.0) / 6 + (5 - 18 * t + t * t + 72 * c - 58 * ePrimeSquared) * Math.pow(A, 5.0) / 120) + 500000.0);

    var UTMNorthing = (UTM_F0 * (M + n * Math.tan(latitudeRad) * (A * A / 2 + (5 - t + (9 * c) + (4 * c * c)) * Math.pow(A, 4.0) / 24 + (61 - (58 * t) + (t * t) + (600 * c) - (330 * ePrimeSquared)) * Math.pow(A, 6.0) / 720)));

    // Adjust for the southern hemisphere
    if (latitude < 0) {
        UTMNorthing += 10000000.0;
    }

    return new UTMRef(UTMEasting, UTMNorthing, UTMZone, longitudeZone);
}

/**
* Take a string formatted as a six-figure OS grid reference (e.g.
* "TG514131") and return a reference to an OSRef object that represents
* that grid reference. The first character must be H, N, S, O or T.
* The second character can be any uppercase character from A through Z
* excluding I.
*
* @param ref
* @return
* @since 1.1
*/
function getOSRefFromSixFigureReference(ref) {
    var char1 = ref.substring(0, 1);
    var char2 = ref.substring(1, 2);

    var east = parseInt(ref.substring(2, 5), 10) * 100;
    east += adjustEast(char1);

    var north = parseInt(ref.substring(5, 8), 10) * 100;
    north += adjustNorth(char1);

    var nx = getNx(char2);
    var ny = getNy(char2);
    return new OSRef(east + nx, north + ny);
}

function getOSRefFromTenFigureReference(ref) {
    var char1 = ref.substring(0, 1);
    var char2 = ref.substring(1, 2);

    var east = parseInt(ref.substring(3, 8), 10);
    east += adjustEast(char1);

    var north = parseInt(ref.substring(9, 14), 10);
    north += adjustNorth(char1);

    var nx = getNx(char2);
    var ny = getNy(char2);
    return new OSRef(east + nx, north + ny);
}

function getOsRef(ref) {
    var grWoSpaces = ref.replace(/\s+/g, "");

    if (grWoSpaces.length === 8) {
        return getOSRefFromSixFigureReference(grWoSpaces);
    } else {
        return getOSRefFromTenFigureReference(ref);
    }
}

function adjustEast(char1) {
    if (char1 === "O") {
        return 500000;
    } else if (char1 === "T") {
        return 500000;
    }

    return 0;
}

function adjustNorth(char1) {
    if (char1 === "H") {
        return 1000000;
    } else if (char1 === "N") {
        return 500000;
    } else if (char1 === "O") {
        return 500000;
    }
    return 0;
}

function charToOrd(char2) {
    var char2ord = ord(char2);
    if (char2ord > 73) {
        char2ord--; // Adjust for no I
    }
    return char2ord;
}

function getNy(char2) {
    var char2ord = charToOrd(char2);
    return (4 - Math.floor((char2ord - 65) / 5)) * 100000;
}

function getNx(char2) {
    var char2ord = charToOrd(char2);
    return ((char2ord - 65) % 5) * 100000;
}

/**
*  Work out the UTM latitude zone from the latitude
*
* @param latitude
* @return
* @since 0.2
*/
function getUTMLatitudeZoneLetter(latitude) {
    if ((84 >= latitude) && (latitude >= 72)) {
        return "X";
    } else if ((72 > latitude) && (latitude >= 64)) {
        return "W";
    } else if ((64 > latitude) && (latitude >= 56)) {
        return "V";
    } else if ((56 > latitude) && (latitude >= 48)) {
        return "U";
    } else if ((48 > latitude) && (latitude >= 40)) {
        return "T";
    } else if ((40 > latitude) && (latitude >= 32)) {
        return "S";
    } else if ((32 > latitude) && (latitude >= 24)) {
        return "R";
    } else if ((24 > latitude) && (latitude >= 16)) {
        return "Q";
    } else if ((16 > latitude) && (latitude >= 8)) {
        return "P";
    } else if ((8 > latitude) && (latitude >= 0)) {
        return "N";
    } else if ((0 > latitude) && (latitude >= -8)) {
        return "M";
    } else if ((-8 > latitude) && (latitude >= -16)) {
        return "L";
    } else if ((-16 > latitude) && (latitude >= -24)) {
        return "K";
    } else if ((-24 > latitude) && (latitude >= -32)) {
        return "J";
    } else if ((-32 > latitude) && (latitude >= -40)) {
        return "H";
    } else if ((-40 > latitude) && (latitude >= -48)) {
        return "G";
    } else if ((-48 > latitude) && (latitude >= -56)) {
        return "F";
    } else if ((-56 > latitude) && (latitude >= -64)) {
        return "E";
    } else if ((-64 > latitude) && (latitude >= -72)) {
        return "D";
    } else if ((-72 > latitude) && (latitude >= -80)) {
        return "C";
    } else {
        return "Z";
    }
}


/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

