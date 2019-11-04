import React, { PureComponent } from 'react';
import './index.less';
const dpr = window.devicePixelRatio === 1 ? 2 : window.devicePixelRatio;
const preventDefault = e => e && e.preventDefault();
//判断是否支持快速滚动
let support = false;
try {
  let options = Object.defineProperty({}, "passive", {
    get: () => support = true
  });
  window.addEventListener("test", null, options);
} catch(err) {}
export default class extends PureComponent{
  state = {
    ch: 0,
    cw: 0,
    isSuccess: false,
    visible: false
  };
  componentDidMount(){
    const { img } = this.props;
    if(img){
      this.image = document.createElement("img");
      this.image.src = img;
      this.image.onload = () => this.init(true);
      this.image.onerror = () => this.init(false);
    }else{
      this.init(false);
    }
  }
  init = bol => {
    const { size, round = [0, 0, 0, 0], color = "#808080", imgRepeat } = this.props;
    const ch = this.wrap.clientHeight * dpr;
    const cw = this.wrap.clientWidth * dpr;
    this.setState({cw, ch}, ()=>{
      this.canvas.addEventListener("touchmove", preventDefault, support ? {passive: false} : false);
      this.ctx = this.canvas.getContext('2d');
      this.ctx.scale(dpr, dpr);
      if(bol){
        let { width, height } = this.image;
        if(imgRepeat === "height"){
          const w = width * (ch / dpr / height);
          this.ctx.drawImage(this.image, 0, 0, width, height, (cw / dpr - w) / 2, 0, w, ch / dpr);
        }else if(imgRepeat === "width"){
          const h = height * (cw / dpr / width);
          this.ctx.drawImage(this.image, 0, 0, width, height, 0, (ch / dpr - h) / 2, cw / dpr, h);
        }else if(imgRepeat === "repeat"){
          this.ctx.fillStyle = this.ctx.createPattern(this.image, "repeat");
          this.ctx.fillRect(0, 0, cw, ch);
        }else{
          this.ctx.drawImage(this.image, 0, 0, width, height, 0, 0, cw / dpr, ch / dpr);
        }
      }else{
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, cw, ch);
      }
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = "#000000";
      this.size = size || cw / dpr / 10;
      this.ctx.lineWidth = this.size;
      this.ctx.lineCap = 'round';
      this.round = round;
      this.cellsX = Math.round(cw / dpr / this.size * 3);
      this.cellsY = Math.round(ch / dpr / this.size * 3);
      this.cells = [];
      this.sum = this.cellsX * this.cellsY;
      this.startCellXAccurate = this.round[3] * 3 / this.size;
      this.endCellXAccurate = (cw / dpr - this.round[1]) * 3 / this.size;
      this.startCellYAccurate = this.round[0] * 3 / this.size;
      this.endCellYAccurate = (ch / dpr - this.round[2]) * 3 / this.size;
      this.startCellX = Math.floor(this.startCellXAccurate);
      this.endCellX = Math.floor(this.endCellXAccurate);
      this.startCellY = Math.floor(this.startCellYAccurate);
      this.endCellY = Math.floor(this.endCellYAccurate);
      this.roundLen = (this.endCellX - this.startCellX) * (this.endCellY - this.startCellY);
      this.roundLenAccurate = (this.endCellXAccurate - this.startCellXAccurate) * (this.endCellYAccurate - this.startCellYAccurate);
      this.Weighting = this.roundLen / this.roundLenAccurate;
      while(this.sum--) this.cells.push(false);
      setTimeout(() => {
        this.setState({visible: true});
      }, 500);
    });
  }
  down = e => {
    const {left, top} = this.wrap.getClientRects()[0];
    this.offsetLeft = left;
    this.offsetTop = top;
    let changedTouches = e.changedTouches;
    if(changedTouches){
      changedTouches = changedTouches[0];
      this.preX = changedTouches.pageX - this.offsetLeft;
      this.preY = changedTouches.pageY - this.offsetTop;
      window.addEventListener("touchmove", this.move, false);
      window.addEventListener("touchend", this.up, false);
    }else{
      this.preX = e.pageX - this.offsetLeft;
      this.preY = e.pageY - this.offsetTop;
      window.addEventListener("mousemove", this.move, false);
      window.addEventListener("mouseup", this.up, false);
    }
    this.addRound(this.preX, this.preY);
  }
  move = e => {
    let changedTouches = e.changedTouches;
    let preX = this.preX, preY = this.preY;
    this.ctx.beginPath();
    this.ctx.moveTo(this.preX, this.preY);
    if(changedTouches){
      changedTouches = changedTouches[0];
      this.preX = changedTouches.pageX - this.offsetLeft;
      this.preY = changedTouches.pageY - this.offsetTop;
    }else{
      this.preX = e.pageX - this.offsetLeft;
      this.preY = e.pageY - this.offsetTop;
    }
    this.ctx.lineTo(this.preX, this.preY);
    this.ctx.stroke();
    this.canvas.style.zIndex = ((+this.canvas.style.zIndex || 0) + 1) % 2 + 2;
    this.addRound(preX, preY, this.preX, this.preY);
  }
  up = e => {
    let changedTouches = e.changedTouches;
    if(changedTouches){
      window.removeEventListener("touchmove", this.move, false);
      window.removeEventListener("touchend", this.up, false);
    }else{
      window.removeEventListener("mousemove", this.move, false);
      window.removeEventListener("mouseup", this.up, false);
    }
    this.checkRound();
  }
  addRound = (preX, preY, curX, curY) => {
    const dx = (curX - preX);
    const dy = (curY - preY);
    const distance = Math.pow(dx * dx + dy * dy , 0.5);
    if(distance > this.size){
      let chunkX,chunkY;
      if(dy === 0){
        chunkX = this.size;
        chunkY = 0;
      }else if(dx === 0){
        chunkY = this.size;
        chunkX = 0;
      }else{
        const ratio = Math.abs(dy / dx);
        if(ratio > 1){
          chunkX = this.size / 2 / ratio;
          chunkY = this.size / 2;
        }else{
          chunkY = this.size / 2 * ratio;
          chunkX = this.size / 2;
        }
      }
      let [sx, ex] = dx > 0 ? [preX, curX] : [curX, preX];
      let [sy, ey] = dy > 0 ? [preY, curY] : [curY, curY];
      while(!(sx > ex || sy > ey)){
        sx += chunkX;
        sy += chunkY;
        this.handleRound(sx, sy);
      }
      this.handleRound(curX, curY);
    }else{
      this.handleRound(curX, curY);
    }
  }
  handleRound = (curX, curY) => {
    const posX = Math.floor(curX * 3 / this.size);
    const posY = Math.floor(curY * 3 / this.size);
    const pos9 = [];
    const posX3 = [
      posX - 1 < this.startCellX || posX - 1 >= this.endCellX ? "" : posX - 1,
      posX < this.startCellX || posX >= this.endCellX ? "" : posX,
      posX + 1 < this.startCellX || posX + 1 >= this.endCellX ? "" : posX + 1
    ];
    const posY3 = [
      posY - 1 < this.startCellY || posY - 1 >= this.endCellY ? "" : posY - 1,
      posY < this.startCellY || posY >= this.endCellY ? "" : posY,
      posY + 1 < this.startCellY || posY + 1 >= this.endCellY ? "" : posY + 1
    ];
    posX3.forEach((v, k) => {
      posY3.forEach((vv, kk) => {
        pos9[k * 3 + kk] = v !== "" && vv !== "" ? vv * this.cellsX + v : "";
      })
    })
    pos9.forEach(_=>{
      _ !== "" && (this.cells[_] = true);
    })
  }
  checkRound = () => {
    const { percentage = 70, onSuccess, clear } = this.props;
    const ptg = Math.round(this.cells.filter(_ => _).length / this.roundLen * this.Weighting * 100);
    if(ptg >= percentage){
      onSuccess && onSuccess(ptg);
      clear && this.ctx.clearRect(0, 0, this.state.cw, this.state.ch);
      this.setState({isSuccess: true});
    }
  }
  render(){
    const { children, className = "" } = this.props;
    return <div className={`___scratch ${className} ${this.state.isSuccess ? "frozen" : ""}`} ref={dom => this.wrap = dom}>
      <div className={`___content ${this.state.visible ? "visible" : ""}`}>{children}</div>
      <canvas
        ref={dom => this.canvas = dom}
        width={this.state.cw }
        height={this.state.ch }
        onMouseDown={this.down}
        onTouchStart={this.down}
      ></canvas>
    </div>
  }
}