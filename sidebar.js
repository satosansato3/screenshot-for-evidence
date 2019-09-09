$("document").ready(function () {
    //height of top bar, or width in your case
    var height = '30px';

    //resolve html tag, which is more dominant than <body>
    var html;
    if (document.documentElement) {
        html = $(document.documentElement); //just drop $ wrapper if no jQuery
    } else if (document.getElementsByTagName('html') && document.getElementsByTagName('html')[0]) {
        html = $(document.getElementsByTagName('html')[0]);
    } else if ($('html').length > -1) {//drop this branch if no jQuery
        html = $('html');
    } else {
        alert('no html tag retrieved...!');
        throw 'no html tag retrieved son.';
    }

    ////position
    //if (html.css('position') === 'static') { //or //or getComputedStyle(html).position
    //    html.css('position', 'relative');//or use .style or setAttribute
    //}

    ////top (or right, left, or bottom) offset
    //var currentTop = html.css('top');//or getComputedStyle(html).top
    //if (currentTop === 'auto') {
    //    currentTop = 0;
    //} else {
    //    currentTop = parseFloat($('html').css('top')); //parseFloat removes any 'px' and returns a number type
    //}
    //html.css(
    //    'top',     //make sure we're -adding- to any existing values
    //    currentTop + parseFloat(height) + 'px'
    //);

    var iframeId = 'someSidebar';
    if (document.getElementById(iframeId)) {
        alert('id:' + iframeId + 'taken please dont use this id!');
        throw 'id:' + iframeId + 'taken please dont use this id!';
    }

    sidebar_style = ({
        "position": "fixed",
        "border": "none",
        "z-index": "10",
        "background-color": "rgba(255, 255, 255, 0.7)",
        "bottom": "-660px",
        "height": "700px",
        "width": "400px",
        "right": "0px",
        "transition": "all 150ms 0ms ease",
        "display": "inline"
    })

    window.addEventListener("message", (event) => {
        sidebar = $("#" + iframeId);
        if (event.data.status == "active") {
            sidebar.css("transform", "translateY(-660px)");
        } else {
            sidebar.css("transform", "");
        }
    });

    $("iframe").attr({
        id: iframeId,
        scrolling: "no",
        frameborder: "0",
        allowtransparency: "false",
        src: chrome.extension.getURL("content.html"),
    }).css(sidebar_style).appendTo(html)


})
