const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

console.log('bat dau load')
window.onload = function(){
    console.log('load xong')
}


const MY_INFO = {
    nav: $('.info__body #nav'),
    content: $('.info__body #content'),
    // nav item
    navItem: $$('#nav .nav-item'),
    // Content
    contentItem: $$('#content .content-item'),
    // slider
    slideBar: $('.slider .slide-main .slide-bar'),
    slideItems: $$('.slide-bar .slide-item'),
    slideDot: $('.slider .slide-dot'),
    nextSlide: $('.slider #next-slide'),
    prevSlide: $('.slider #prev-slide'),
    // Skill
    skillElement: $('.skill'),
    // Popoup
    popupElement: $('#popup'),
    popupPlayBtn: $('#playBtn'),
    //load
    overlayElement: $('#overlay'),
    
    start: function(){
        this.handleLoad();

        this.handleScroll();

        this.handleSlider();

        this.handleClickNav();

        this.handlePopup();
    },

    // Function handle
    handleLoad: function(){
        let transition = 500;
        this.overlayElement.style.transition = `opacity ${transition}ms linear`;
        window.onload = ()=>{
            this.overlayElement.style.opacity = 0;
            setTimeout(()=>{
                document.body.removeChild(this.overlayElement);
            },transition);
        }
    },
    handleScroll: function(){
        
        window.onscroll = ()=>{
            let contentTop = content.offsetTop;
            let scrollTop = window.scrollY || document.documentElement.offsetTop;
            if(scrollTop > contentTop){
                nav.classList.add('fixed');
            }
            else if(scrollTop <= contentTop-24){
                nav.classList.remove('fixed');
            }

            // Show skill progress when scroll to view
            let skillElementToTop = this.skillElement.getBoundingClientRect().top;
            if(skillElementToTop < window.innerHeight){
                this.skillElement.setAttribute('style','--animation-progress: skill-progress 1s forwards');
            }else{
                this.skillElement.removeAttribute('style');
            }
        }
    },

    handleClickNav: function(){
        this.navItem.forEach((item,index)=>{
            item.onclick = ()=>{

                // cancel if is current item
                if(item.classList.contains('active'))
                    return;

                // Active current nav
                this.nav.querySelector('.nav-item.active').classList.remove('active');
                item.classList.add('active');
                // console.log('ok')

                // Active tab content and scroll content to top view
                this.content.querySelector('.content-item.active').classList.remove('active');
                this.contentItem[index].classList.add('active');
                this.content.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    },

    // Handle slider
    handleSlider: function(){
        // Config
        let timeTransition = 500; // ms
        let timeAutoNext = 7000; //ms

        let _this = this;
        let slideItemLength = this.slideItems.length - 2;
        let indexSlide = 1;
        let setAutoNext;

        // Create slide dot
        let dotElement = handleSlideDot(slideItemLength);

        // Gan su kien next, prev
        this.nextSlide.onclick = ()=>{
            next();
        }
        this.prevSlide.onclick = ()=>{
            prev();
        }

        // Auto Next Slide
        autoNextSlide();

        // Function

        function autoNextSlide(){
            setAutoNext = setTimeout(()=>{
                next();
            },timeAutoNext);
        }
        function next(){
            clearInterval(setAutoNext);
            autoNextSlide();

            indexSlide++;
            updateSlide();

        }
        function prev(){
            clearInterval(setAutoNext);
            autoNextSlide();

            indexSlide--;
            updateSlide()

        }
        function updateSlide(){

            Object.assign(_this.slideBar.style,{
                transition: `transform ${timeTransition}ms linear`,
                transform: `translateX(-${indexSlide*100}%)`
            });

            // active dot
            _this.slideDot.querySelector('.dot.active').classList.remove('active');
            if(indexSlide > slideItemLength)
                dotElement[0].classList.add('active');
            else if(indexSlide <= 0)
                dotElement[slideItemLength-1].classList.add('active');
            else
                dotElement[indexSlide-1].classList.add('active');

            setTimeout(()=>{
                if(indexSlide > slideItemLength){
                    indexSlide = 1;
                    Object.assign(_this.slideBar.style,{
                        transition: `transform 0ms linear`,
                        transform: `translateX(-${indexSlide*100}%)`
                    });
                }else if(indexSlide <= 0){
                    indexSlide = slideItemLength;
                    Object.assign(_this.slideBar.style,{
                        transition: `transform 0ms linear`,
                        transform: `translateX(-${indexSlide*100}%)`
                    });
                }
            },timeTransition);
                
        }

        // HANDLE DOT SLIDE
        function handleSlideDot(length){
            // create dotElement
            for(let i = 0; i < length; i++){
                let dotElement = document.createElement('span');
                dotElement.classList.add('dot');
                if(i==0)
                    dotElement.classList.add('active');
                dotElement.onclick = function(){
                    // Clear auto next
                    clearInterval(setAutoNext);
                    autoNextSlide();

                    // next slide
                    indexSlide = i+1;
                    updateSlide();
                }
                _this.slideDot.appendChild(dotElement);
            }

            return $$('.slide-dot .dot');
        }
    },
    handlePopup: function(){
        let _this = this;
        let isPlay = false;
        let setClose;

        // create audio
        let audio = new Audio('./assets/audio/QCIT.mp3');

        // Click show
        $('.text-popup').onclick = ()=>{
            this.popupElement.style.animation = `popup-in .3s linear forwards`;
            autoClosePopup();
        }
        // Click close
        $('#closeBtn').onclick = closePopup;

        // Click play
        this.popupPlayBtn.onclick = ()=>{
            if(!isPlay){
                this.popupPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                audio.play();
            }else{
                this.popupPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                audio.pause();
            }
            autoClosePopup();
            isPlay = !isPlay;
        }

        // this.popupElement.onmouseseenter = ()=>{
        //     if(setClose)
        //         clearTimeout(setClose);
        // }
        // this.popupElement.ontouchstart = ()=>{
        //     if(setClose)
        //         clearTimeout(setClose);
        // }
        // this.popupElement.onmouseout = ()=>{
        //     autoClosePopup();
        // }
        // this.popupElement.ontouchend = ()=>{
        //     autoClosePopup();
        // }

        // end song
        audio.onended = ()=>{
            this.popupPlayBtn.click();
        }
        
        function closePopup(){
            _this.popupElement.style.animation = `popup-out .3s linear forwards`;
        }
        function autoClosePopup(){
            if(setClose)
                clearTimeout(setClose);

            setClose = setTimeout(closePopup,7000);
        }
    }

}

MY_INFO.start();

// Snow
var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;
var transforms=["transform","msTransform","webkitTransform","mozTransform","oTransform"];
var transformProperty=getSupportedPropertyName(transforms);
var snowflakes=[];
var browserWidth;
var browserHeight;
var resetPosition=false;
var numberOfSnowflakes=34;
var snowIcon = '❆';

function setup(){
    let snowContainer = document.createElement('div');
    snowContainer.id = 'snowflakeContainer';
    snowContainer.innerHTML = `<p class="snowflake"><span class="snow">${snowIcon}</span></p>`;
    document.body.appendChild(snowContainer);

    window.addEventListener("DOMContentLoaded",generateSnowflakes,false);
    // window.addEventListener("resize",setResetFlag,false)
}
setup();

function getSupportedPropertyName(b){
    for(var a=0;a<b.length;a++){
        if(typeof document.body.style[b[a]]!="undefined"){
            return b[a];
        }
    }
    return null;
}
function Snowflake(b,a,d,e,c){
    this.element=b;
    this.radius=a;
    this.speed=d;
    this.xPos=e;
    this.yPos=c;
    this.counter=0;
    this.sign=Math.random()<0.5?1:-1;
    this.element.style.opacity=1;
    this.element.style.fontSize=4+(Math.random()*(30-10) + 10 )+"px";
}
Snowflake.prototype.update=function(){
    this.counter+=this.speed/5000;
    this.xPos+=this.sign*this.speed*Math.cos(this.counter)/40;
    this.yPos+=Math.sin(this.counter)/40+this.speed/30;
    setTranslate3DTransform(this.element,Math.round(this.xPos),Math.round(this.yPos));
    if(this.yPos>browserHeight){
        this.yPos=-50;
    }
}
function setTranslate3DTransform(a,c,b){
    var d="translate3d("+c+"px, "+b+"px, 0)";
    a.style[transformProperty]=d;
}
function generateSnowflakes(){
    var b=document.querySelector(".snowflake");
    var h=b.parentNode;
    browserWidth=document.documentElement.clientWidth;
    browserHeight=document.documentElement.clientHeight;
    for(var d=0;d<numberOfSnowflakes;d++){
        var j=b.cloneNode(true);
        h.appendChild(j);
        var e=getPosition(50,browserWidth);
        var a=getPosition(50,browserHeight);
        var c=5+Math.random()*40;
        var g=4+Math.random()*10;
        var f=new Snowflake(j,g,c,e,a);
        snowflakes.push(f);
    }
    h.removeChild(b);
    moveSnowflakes();
}
function moveSnowflakes(){
    for(var b=0;b<snowflakes.length;b++){
        var a=snowflakes[b];
        a.update();
    }
    if(resetPosition){
        browserWidth=document.documentElement.clientWidth;
        browserHeight=document.documentElement.clientHeight;
        for(var b=0;b<snowflakes.length;b++){
            var a=snowflakes[b];
            a.xPos=getPosition(50,browserWidth);
            a.yPos=getPosition(50,browserHeight);
        }
        resetPosition=false;
    }
    requestAnimationFrame(moveSnowflakes);
}
function getPosition(b,a){
    return Math.round(-1*b+Math.random()*(a+2*b));
}
function setResetFlag(a){
    resetPosition=true;
}

// vitbautroi