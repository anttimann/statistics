function click(el) {
    var ev = document.createEvent("MouseEvent");
    ev.initEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
}

module.exports = {
    click: click
}