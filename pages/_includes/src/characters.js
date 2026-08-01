const images = document.getElementsByClassName("character");
const amplitude = 8;

document.body.onpointermove = event => {
    const { clientX, clientY } = event

    for (let i = 0; i < images.length; i++) {
        let image = images.item(i),
            rect = image.getBoundingClientRect();

        let centX = (rect.x + (rect.width / 2)),
            centY = (rect.y + (rect.height / 2));

        let wX = (clientX - centX) / document.body.scrollWidth * amplitude,
            wY = (clientY - centY) / document.body.scrollHeight * amplitude;

        image.animate({
            translate: `${wX}% ${wY}%`,
        }, { duration: 200, fill: "forwards" })
    }
}


$(function() {

    var pagePositon = 0,
        sectionsSeclector = 'section',
        $scrollItems = $(sectionsSeclector),
        offsetTolorence = 300,
        pageMaxPosition = $scrollItems.length - 1;

    //Map the sections:
    $scrollItems.each(function(index, ele) { $(ele).attr("debog", index).data("pos", index); });

    // Bind to scroll
    $(window).bind('scroll', upPos);

    //Move on click:
    $('#arrow span').click(function(e) {
        if ($(this).hasClass('next') && pagePositon + 1 <= pageMaxPosition) {
            pagePositon++;
            $('html, body').stop().animate({
                scrollTop: $scrollItems.eq(pagePositon).offset().top
            }, 600);
        }
        if ($(this).hasClass('previous') && pagePositon - 1 >= 0) {
            pagePositon--;
            $('html, body').stop().animate({
                scrollTop: $scrollItems.eq(pagePositon).offset().top
            }, 600);
            return false;
        }
    });

    //Update position func:
    function upPos() {
        var fromTop = $(this).scrollTop();
        var $cur = null;
        $scrollItems.each(function(index, ele) {
            if ($(ele).offset().top < fromTop + offsetTolorence) $cur = $(ele);
        });
        if ($cur != null && pagePositon != $cur.data('pos')) {
            pagePositon = $cur.data('pos');
        }
    }

});
