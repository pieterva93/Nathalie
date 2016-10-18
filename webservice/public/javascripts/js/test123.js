
$(function () {
    var version = "1.1.001",
        reloadPage = function () {
            if ($.cookie('version') !== version) {
                $.cookie('version', version, { expires: 365 });
                location.reload(true);
            }
        };
    reloadPage();

    var userOS;    // will either be iOS, Android or unknown
    var userOSver; // this is a string, use Number(userOSver) to convert

    function getOS() {
        var ua = navigator.userAgent;
        var uaindex;

        // determine OS
        if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
            userOS = 'iOS';
            uaindex = ua.indexOf('OS ');
        }
        else if (ua.match(/Android/i)) {
            userOS = 'Android';
            uaindex = ua.indexOf('Android ');
        }
        else {
            userOS = 'unknown';
        }

        // determine version
        if (userOS === 'iOS' && uaindex > -1) {
            userOSver = ua.substr(uaindex + 3, 3).replace('_', '.');
        }
        else if (userOS === 'Android' && uaindex > -1) {
            userOSver = ua.substr(uaindex + 8, 3);
        }
        else {
            userOSver = 'unknown';
        }
    }
    getOS();

    /*
     $.urlParam = function (name) {
     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
     if (results == null) {
     return null;
     }
     else {
     return results[1] || 0;
     }
     }
     */

    /*  dedecteerd nu alleen iPad
     http://www.mobile247.eu/online-tools/user-agent-strings/dv/brand52248/iphone
     */
    /*
     iOS_5 - bug
     1.  navbar-fixed-top werkt niet goed op iOS 5.1.1
     - indien carousel, zal de navbar aan deze container worden gekoppeld
     - indien eenmaal touch op menuitem, werkt de menuitems vervolgens niet meer.
     Alleen een scroll verhelpt het probleem.
     Oplossing:
     - optijd de navar van position fixed naar absolute zetten!!
     */
    //var iOS_5 = navigator.userAgent.match(/iPad/i) != null,
    var iOS_5 = (userOS === 'iOS' && Number(userOSver.charAt(0)) <= 5)
    inCarousel = false,
        navbarAbsolute = false;



    //jQuery to collapse the navbar on scroll
    $(window)
        .on('touchmove', function () {
            if (inCarousel === false) {
                if (iOS_5) {
                    if (navbarAbsolute) {
                        $(".navbar").css({ 'position': '', 'top': '' });
                    }
                }
                if ($(window).scrollTop() > 50) {
                    $(".navbar").addClass("top-nav-collapse");
                } else {
                    $(".navbar").removeClass("top-nav-collapse");
                }
            }
        })
        .on('scroll', function () {
            if (inCarousel === false) {
                if ($(window).scrollTop() > 50) {
                    $(".navbar").addClass("top-nav-collapse");
                } else {
                    $(".navbar").removeClass("top-nav-collapse");
                }
            }
        });

    //  Initialisatie
    if ($(window).scrollTop() > 50) {
        $(".navbar").addClass("top-nav-collapse");
    } else {
        $(".navbar").removeClass("top-nav-collapse");
    }

    //jQuery to collapse the navbar on scroll -- ook voor Apple...
    if (!Modernizr.cssvhunit) {
        $(window)
            .on('resize', function () {
                var windowH = $(window).height();
                $('.section').css({ 'min-height': windowH + 'px' });
            });
        //  Initialisatie
        var windowH = $(window).height();
        $('.section').css({ 'min-height': windowH + 'px' });
    }


    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.page-scroll a:not([data-sbr-online])').on('click', function (event) {
        event.preventDefault();
        var $anchor = $(this);
        if (iOS_5 && navbarAbsolute) {
            $(".navbar").css({ 'position': '', 'top': '' });
        }
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'jswing', function () {
            if (iOS_5) {
                navbarAbsolute = true;
                $(".navbar").css({ 'position': 'absolute', 'top': Math.abs($(".navbar").position().top) });
            }
        });
    });



    $.fn.language = function () { return $('html').attr('xml:lang'); }

    var setlanguage = function (lang) {
        var langHide = (lang === 'nl' ? 'en' : 'nl');
        $.cookie('language', lang, { expires: 365 });
        $.stylesheet(':lang(en)', { 'display': (lang === 'en') ? "inline" : "none" });
        $.stylesheet(':lang(nl)', { 'display': (lang === 'nl') ? "inline" : "none" });
        $('.impressie').find('.carousel-inner').find('img[lang=' + lang + ']').removeClass('hide-lang');
        $('.impressie').find('.carousel-inner').find('img[lang=' + langHide + ']').addClass('hide-lang');
        $('input, textarea, select').filter('[data-placeholder_class]').each(function () {
            var $this = $(this);
            placeholder = $this.closest('.form-group').find('.placeholder').find('span[lang=' + lang + ']').text();
            if (placeholder !== '') {
                $this.attr('placeholder', placeholder)
            }
            $('.impressie').find('.carousel-inner').find('img[lang=' + lang + ']').removeClass('hide-lang');
            $('.impressie').find('.carousel-inner').find('img[lang=' + langHide + ']').addClass('hide-lang');
            $('input, textarea, select').filter('[placeholder_class]').each(function () {
                var $this = $(this);
                placeholder = $this.closest('.form-group').find('.placeholder').find('span[lang=' + lang + ']').text();
                if (placeholder !== '') {
                    $this.attr('placeholder', placeholder)
                }
            });
        });
        $('html').attr('xml:lang', lang);
        return lang;
    };

    $(".menu-lang_nl").bind("click", function (event) {
        event.preventDefault();
        setlanguage('nl')
    });
    $(".menu-lang_en").bind("click", function (event) {
        event.preventDefault();
        setlanguage('en')
    });

    setlanguage($.cookie('language') || 'nl');

    $('.btn-collapse')
        .on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            var $collapse = $this.closest('.collapse-group').find('.collapse');
            $collapse.collapse('toggle');
        });

    $('.collapse')
        .on('shown.bs.collapse', function () {
            var $this = $(this);
            var $button = $this.closest('.collapse-group').find('.btn-collapse');
            $button.find('span:lang(nl)').text('Verberg details');
            $button.find('span:lang(en)').text('Hide details');
            $this.closest('.about-section').css({ 'min-height': '800px' })


        })
        .on('hidden.bs.collapse', function () {
            var $this = $(this);
            var $button = $this.closest('.collapse-group').find('.btn-collapse');
            $button.find('span:lang(nl)').text('Waarom?');
            $button.find('span:lang(en)').text('Why?');
            $this.closest('.about-section').css({ 'min-height': '600px' })
        })

    $('.carousel')
        .on('slide.bs.carousel', function () {
            $(this).find('.carousel-caption').addClass('slide');
            inCarousel = true;
            if (iOS_5) {
                navbarAbsolute = true;
                $(".navbar").css({ 'position': 'absolute', 'top': Math.abs($(".navbar").position().top) });
            }
        })
        .on('slid.bs.carousel', function () {
            $(this).find('.carousel-caption').removeClass('slide');
            inCarousel = false;
        })
        .carousel({
            interval: iOS_5 ? false : 5000
        })

    $('.QapTcha').QapTcha({
        disabledSubmit: true,
        autoRevert: false,
        autoSubmit: true
    });

    /* Starten popup... */

    $.fn.launchModal = function () {
        var modal = '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h2 class="modal-title"><span lang="nl">Melding</span><span lang="en">Message</span></h2>' +
            '</div>' +
            '<div class="modal-body">' +
            '<h1 style="text-align:center;">' +
            '<span lang="nl">Het bericht is verzonden.</span><span lang="en">The message has been sent</span>' +
            '</h1>' +
            '<p style="text-align:center;">' +
            '<span lang="nl">Wij nemen zo spoedig mogelijk contact op.</span><span lang="en">We will contact you as soon as possible</span>' +
            '</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal"><span lang="nl">Sluiten</span><span lang="en">Close</span></button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        $(modal).modal('show');
        return this
    };
})/**
 * Created by pieter on 6-10-2016.
 */
