"use strict";

// 更新坐标
function updateCoords(e) {
    pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left;
    pointerY = (e.clientY || e.touches[0].clientY) - canvasEl.getBoundingClientRect().top;
}

// 设置粒子方向
function setParticuleDirection(e) {
    var angle = anime.random(0, 360) * Math.PI / 180;
    var value = anime.random(50, 180);
    var direction = [-1, 1][anime.random(0, 1)] * value;
    return {
        x: e.x + direction * Math.cos(angle),
        y: e.y + direction * Math.sin(angle)
    };
}

// 创建粒子
function createParticule(x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    p.draw = function () {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
    };
    return p;
}

// 创建圆圈
function createCircle(x, y) {
    var c = {};
    c.x = x;
    c.y = y;
    c.color = "#F00";
    c.radius = 0.1;
    c.alpha = 0.5;
    c.lineWidth = 6;
    c.draw = function () {
        ctx.globalAlpha = c.alpha;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = c.lineWidth;
        ctx.strokeStyle = c.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
    };
    return c;
}

// 渲染粒子
function renderParticule(anim) {
    for (var i = 0; i < anim.animatables.length; i++) {
        anim.animatables[i].target.draw();
    }
}

// 动画粒子
function animateParticules(x, y) {
    var circle = createCircle(x, y);
    var particules = [];
    for (var i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }
    anime.timeline().add({
        targets: particules,
        x: function (p) { return p.endPos.x; },
        y: function (p) { return p.endPos.y; },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: renderParticule
    }).add({
        targets: circle,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: { value: 0, easing: "linear", duration: anime.random(600, 800) },
        duration: anime.random(1200, 1800),
        easing: "easeOutExpo",
        update: renderParticule,
        offset: 0
    });
}

// 防抖函数
function debounce(func, wait) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

// 初始化
var canvasEl = document.querySelector(".fireworks");

if (canvasEl) {
    var ctx = canvasEl.getContext("2d");
    var numberOfParticules = 30;
    var pointerX = 0;
    var pointerY = 0;
    var tap = "mousedown";
    var colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];

    var setCanvasSize = debounce(function () {
        canvasEl.width = 2 * window.innerWidth;
        canvasEl.height = 2 * window.innerHeight;
        canvasEl.style.width = window.innerWidth + "px";
        canvasEl.style.height = window.innerHeight + "px";
        canvasEl.getContext("2d").scale(2, 2);
    }, 500);

    var render = anime({
        duration: Infinity,
        update: function () {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
    });

    document.addEventListener(tap, function (e) {
        if (e.target.id !== "sidebar" && e.target.id !== "toggle-sidebar" && e.target.nodeName !== "A" && e.target.nodeName !== "IMG") {
            render.play();
            updateCoords(e);
            animateParticules(pointerX, pointerY);
        }
    }, false);

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize, false);
}
