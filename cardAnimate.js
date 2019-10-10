var cardAnimate = {
  prex: 0,
  prey: 0,
  prexMove: 0,
  preyMove: 0,
  speed: 0, // 速度
  lon: 0, // 实际速度 -> 叠加
  frondCard: '',
  // backCard: '',
  CardBox: '',
  prePos: 0,  //帧位移
  fingerTouch: false, //手指是否触摸屏幕
  moveDirect: 0, //1表示正向，-1表示反向
  ani_move : false, //动画是否进行
  transNum : 0,
  init: function(frond, back){
    var self = this;
    this.frondCard = document.getElementById(frond);
    // this.backCard = document.getElementById(back);
    this.frondCard.addEventListener("touchstart", this.throttles(this.onDocumentMouseDown.bind(self), 0));
    this.frondCard.addEventListener("touchmove", this.throttles(this.onDocumentMouseMove.bind(self), 0));
    this.frondCard.addEventListener("touchend", this.throttles(this.onDocumentMouseUp.bind(self), 0));
  },
  throttles (fn, wait = 100){
    let last = 0;
    console.log('节流函数 启动')
    return function(){
      let curr = +new Date();
      // 强制转换为数字Number
      if(curr - last > wait){
        fn.apply(this, arguments);
        last = curr;
      }
    }
  },
  animate: function(){
    this.prePos += (this.lon - this.prePos) * 0.1;
    if (this.prePos > 20) {
      this.lon = 20;
      this.prePos = 20;
    }
    // console.log('animate')
    console.log('animate', this.prePos, this.lon)
    //判断是否到达了目标位置
    // this.CardBox.style = `transform: translateX(${this.prex - this.prexMove}px) rotate(${(this.prePos) / this.CardBox.offsetWidth * 45}deg);transform-origin: 50% 450px;`;
    if (Math.abs(this.prePos - this.lon) < 0.01 && Math.abs(this.lon) > 0.01 && (!this.fingerTouch)) {
      this.ani_move = false;
      console.log('anirequestAnimationFrame')
      this.prePos = 0;
      // this.CardBox.style = `transform: translateX(${this.prePos * 10}px) rotate(${this.prePos / 10 * 30}deg) scale(${(20 - Math.abs(this.prePos)) / 20});transform-origin: 50% 450px;`;
      // this.backCard.style = "transform: translateX("+ this.prePos +"%)";
    } else {
      let scale = 'scale(1)'
      if (!this.fingerTouch) scale = `scale(${(20 - Math.abs(this.prePos)) / 20}) translateY(-${this.CardBox.offsetHeight * Math.abs(this.prePos) / 20}px)`
      this.CardBox.style = `transform: translateX(${this.prePos * 10}px) rotate(${this.prePos / 10 * 30}deg) ${scale};transform-origin: 50% 450px;`;
      console.log('requestAnimationFrame', this.prex - this.prexMove, this.fingerTouch)
      // this.CardBox.style = `transform: translateX(${this.prex - this.prexMove}px) rotate(${(this.prePos) / this.CardBox.offsetWidth * 45}deg);transform-origin: 50% 450px;`;
      // this.CardBox.style = "transform: translateX("+ this.prePos +"%)";
      // this.backCard.style = "transform: translateX("+ (-this.prePos) +"%)";
      requestAnimationFrame(this.animate.bind(this));
    }
  },
  onDocumentMouseDown : function(e){
    // 获取操作卡片
    let num = 0
    e.path.forEach((item, index) => {
      if (item.id == this.frondCard.id) num = index
    })
    this.CardBox = e.path[num - 1]
    console.log('onDocumentMouseDown')

    // 若是上次动画未结束不需要再次启动动画和重置目标位移
    if (!(this.ani_move && this.fingerTouch == false)) {
      this.lon = 0;
      this.animate();
    }
    e = e.touches[0];
    this.prex = this.prexMove = e.clientX;
    this.prey = this.preyMove = e.clientY;
    this.ani_move = true; //动画开启
  },
  onDocumentMouseMove : function(e){
    // this.animate();
    e = e.touches[0];
    // console.log('MouseMove', e.clientX, this.prex)
    if( this.ani_move && this.fingerTouch == false) {
      // 判断是否不同向
      if (((e.clientX - this.prex) > 0 ? 1: -1) == -this.moveDirect ) {
        this.lon = 0;
        this.prePos = 0;
        this.moveDirect = -this.moveDirect;
      }
    }
    //判断是否是移动事件
    if (Math.abs(e.clientX - this.prex) >= 4 ) {
      this.fingerTouch = true;
      this.speed = (e.clientX - this.prex) * Math.max(Math.abs(e.clientX - this.prex), 8) * 0.005;
      this.lon += this.speed;
      this.prex = e.clientX;
      this.prey = e.clientY;
    }
  },
  onDocumentMouseUp : function(e){
    //如果是点击事件 不设置移动
    if (!this.fingerTouch) return;
    this.moveDirect = this.lon > 0 ? 1 : -1;
    this.transNum = this.lon/20 + this.moveDirect;
    this.lon = Math.round(this.transNum) * 20;
    this.fingerTouch = false;    
  }
}
