$(document).ready(function () {
    'use strict';
    //Bootstrap select
    $('select').selectpicker();
    //preloader
    $(window).on('load', function () {
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });
    //testimonial carousel
    $('.testimonial-slider').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });
//places slider
    $('.owl-places').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    });
    //dropzone
    Dropzone.options.myAwesomeDropzone = {maxFilesize: 20};
    $('.detail-slider').owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    });
});
