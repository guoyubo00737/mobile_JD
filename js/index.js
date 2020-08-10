var MIN_OPACITY = 0;
var MAX_OPACITY = 0.9;
var BANNER_INTERVAL = 1000;
var BANNER_WIDTH_PER = 10;
var SECOND_KILL_TIME_SCOPE = 5;

window.onload = function(){
    // search box opacity
    search();

    // banner
    bannerFunction();

    // second kill timer
    secondKillTimer();
}

var search = function(){
    var banner = document.querySelector('#jd-banner');
    var height = banner.offsetHeight;

    var searchBox = document.querySelector('#jd-search');

    window.onscroll = function(){
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        var opacity = MIN_OPACITY;
        if(scrollTop < height){
            // Banner is still in screen
            opacity = scrollTop / height * MAX_OPACITY;
        }else{
            opacity = MAX_OPACITY;
        }
        
        searchBox.style.background = 'rgba(201,21,35,' + opacity +')';
    }
}

var bannerFunction = function(){
    // 1. 自动轮播，圆点的更新
    // 2. 当郭哥手touch的时候，banner应该停止自动轮播，跟随手运动
    //    touch结束是，如果移动的距离大于1/3banner宽度，移动一屏，否则移动回来
    // PC mousedown mouseup mousemove
    // 手机 touchstart touchend touchmove
    // mouse只要一个点，touch可以有多个点
    // touches[] targetTouches[] changedTouches[]
    var banner = document.querySelector('#jd-banner');
    var imageBox = banner.querySelector('ul:first-child');
    var pointBox = banner.querySelector('ul:last-child');
    var points = pointBox.querySelectorAll('li');
    var width = banner.offsetWidth;


    var addTrans = function(){
        imageBox.style.transition = 'all 0.2s';
        imageBox.style.webkitTransition = 'all 0.2s';
    }

    var removeTrans = function(){
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    }

    var setTranslateX = function(transitionX){
        imageBox.style.transform = 'translateX(' + transitionX + '%)';
        imageBox.style.webkitTransform = 'translateX(' + transitionX + '%)';
    }

    var setTranslateXpx = function(transitionX){
        imageBox.style.transform = 'translateX(' + transitionX + 'px)';
        imageBox.style.webkitTransform = 'translateX(' + transitionX + 'px)';
    }

    var setPoint = function(points){
        for(var i = 0; i < points.length; i++){
            points[i].classList.remove('now');
        }
        points[index - 1].classList.add('now');
    }

    var index = 1;
    var timer = setInterval(function(){
        index++;
        // 设定过渡/缓动
        addTrans();
        // 滑动banner
        setTranslateX(-index * BANNER_WIDTH_PER);
        
    }, BANNER_INTERVAL);

    // 监听过渡完成
    imageBox.addEventListener('transitionend', function(){
        // 过渡/缓动是异步的，所以要在事件回调中完成
        if(index >= 9){
            index = 1;
            // 为了避免穿帮，消除缓动
            removeTrans();
            setTranslateX(-index * BANNER_WIDTH_PER);
        }else if(index <= 0){// 自动轮播只涉及从最右回到最左，但是不会涉及从最左回到最右
            index = 8;
            removeTrans();
            setTranslateX(-index * BANNER_WIDTH_PER);
        }
        // 圆点的更新
        setPoint(points);
    });

    var startX = 0;
    var diffX = 0;
    var isMoved = false;

    imageBox.addEventListener('touchstart', function(e){
        // 清除定时器
        clearInterval(timer);

        // 记录开始位置
        startX = e.touches[0].clientX;
    });

    imageBox.addEventListener('touchmove', function(e){
        // 处理跟随
        var moveX = e.touches[0].clientX;

        diffX = moveX - startX;

        // 关闭缓动
        removeTrans();
        setTranslateXpx(-index * width + diffX);
        isMoved = true;
    });

    imageBox.addEventListener('touchend', function(e){
        // 判断滑动是否超过1/3，自动对齐
        if(isMoved){
            if(Math.abs(diffX) >= width / 3){ // 回到原位，index不处理
                // 到下一张
                if(diffX > 0){
                    // 下一张
                    index--;
                }else{
                    // 上一张
                    index++;
                }
            }

            addTrans();
            setTranslateX(-index * BANNER_WIDTH_PER);
        }
        // 恢复定时器

        startX = 0;
        diffX = 0;
        isMoved = false;
        clearInterval(timer);
        timer = setInterval(function(){
            index++;
            // 设定过渡/缓动
            addTrans();
            // 滑动banner
            setTranslateX(-index * BANNER_WIDTH_PER);
            
        }, BANNER_INTERVAL);

    });
}

var secondKillTimer = function(){
    var time0 = Math.floor(Date.now()/1000) + SECOND_KILL_TIME_SCOPE * 60 * 60;
    var spans = document.querySelectorAll('.time span');

    var h1 = Math.floor(SECOND_KILL_TIME_SCOPE/10);
    var h2 = SECOND_KILL_TIME_SCOPE%10;
    spans[0].innerHTML = h1;
    spans[1].innerHTML = h2;
    spans[3].innerHTML = 0;
    spans[4].innerHTML = 0;
    spans[6].innerHTML = 0;
    spans[7].innerHTML = 0;

    var timer = setInterval(function(){
        var time1 = Math.floor(Date.now()/1000);
        var time = time0 - time1;

        var h = Math.floor(time/3600);
        var m = Math.floor(time%3600/60);
        var s = Math.floor(time%60);

        var h1 = Math.floor(h/10);
        var h2 = h%10;
        var m1 = Math.floor(m/10);
        var m2 = m%10;
        var s1 = Math.floor(s/10);
        var s2 = s%10;

        spans[0].innerHTML = h1;
        spans[1].innerHTML = h2;
        spans[3].innerHTML = m1;
        spans[4].innerHTML = m2;
        spans[6].innerHTML = s1;
        spans[7].innerHTML = s2;

        if(time <= 0){
            clearInterval(timer);
        }

    }, 1000);
}