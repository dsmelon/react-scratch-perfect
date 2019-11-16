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

interface props{
  clear?: boolean;
  color?: string;
  className?: string;
  size?: number;
  onSuccess?: () => void;
  onChange?: (p:number) => void;
  imgRepeat?: "width" | "height" | "repeat";
  round?: number[];
  img?: string;
  mode?: "move" | "end";
  percentage?: number;
}

interface state{
  ch: number;
  cw: number;
  isSuccess: boolean;
  visible: boolean;
}

export default class extends PureComponent<props, state>{
  state = {
    ch: 0,
    cw: 0,
    isSuccess: false,
    visible: false
  };
  image: HTMLImageElement;
  wrap: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ptg: number;
  size: number;
  round: number[];
  cells: boolean[];
  roundX: number[];
  roundY: number[];
  cellX: number;
  cellY: number;
  sum: number;
  roundLen: number;
  offsetLeft: number;
  offsetTop: number;
  preX: number;
  preY: number;
  ctx: CanvasRenderingContext2D;
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
  init = (bol: boolean): void => {
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
      this.ptg = 0;
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.strokeStyle = "#000000";
      this.size = size || cw / dpr / 10;
      this.ctx.lineWidth = this.size;
      this.ctx.lineCap = 'round';
      this.round = round;
      this.cells = [];
      this.roundX = [this.round[3], cw / dpr - this.round[1]];
      this.roundY = [this.round[0], ch / dpr - this.round[2]];
      this.cellX = (this.roundX[1] - this.roundX[0]) / 10;
      this.cellY = (this.roundY[1] - this.roundY[0]) / 10;
      this.sum = this.roundLen = 100;
      while(this.sum--) this.cells.push(false);
      setTimeout(() => {
        this.setState({visible: true});
      }, 500);
    });
  }
  down = (e: React.MouseEvent<HTMLCanvasElement> & React.TouchEvent): void => {
    const {left, top} = this.wrap.getClientRects()[0];
    this.offsetLeft = left;
    this.offsetTop = top;
    let changedTouches = e.changedTouches;
    if(changedTouches){
      const currentTouch = changedTouches[0];
      this.preX = currentTouch.pageX - this.offsetLeft;
      this.preY = currentTouch.pageY - this.offsetTop;
      window.addEventListener("touchmove", this.move, false);
      window.addEventListener("touchend", this.up, false);
    }else{
      this.preX = e.pageX - this.offsetLeft;
      this.preY = e.pageY - this.offsetTop;
      window.addEventListener("mousemove", this.move, false);
      window.addEventListener("mouseup", this.up, false);
    }

    this.handleRound(this.preX, this.preY);
  }
  move = (e: MouseEvent & TouchEvent): void => {
    const { mode = "move" } = this.props;
    let changedTouches = e.changedTouches;
    let preX = this.preX, preY = this.preY;
    this.ctx.beginPath();
    this.ctx.moveTo(this.preX, this.preY);
    if(changedTouches){
      const currentTouch = changedTouches[0];
      this.preX = currentTouch.pageX - this.offsetLeft;
      this.preY = currentTouch.pageY - this.offsetTop;
    }else{
      this.preX = e.pageX - this.offsetLeft;
      this.preY = e.pageY - this.offsetTop;
    }
    this.ctx.lineTo(this.preX, this.preY);
    this.ctx.stroke();
    this.canvas.style.zIndex = ((+this.canvas.style.zIndex || 0) + 1) % 2 + 2 + "";
    this.addRound(preX, preY, this.preX, this.preY);
    mode === "move" && this.checkRound(e);
  }
  up = (e: TouchEvent & MouseEvent, bol?: boolean): void => {
    const { mode } = this.props;
    let changedTouches = e.changedTouches;
    if(changedTouches){
      window.removeEventListener("touchmove", this.move, false);
      window.removeEventListener("touchend", this.up, false);
    }else{
      window.removeEventListener("mousemove", this.move, false);
      window.removeEventListener("mouseup", this.up, false);
    }
    mode === "end" && !bol && this.checkRound(e);
  }
  addRound = (preX: number, preY: number, curX: number, curY: number): void => {
    const dx = (curX - preX);
    const dy = (curY - preY);
    if(dx > this.cellX || dy > this.cellY){
      let chunkX, chunkY;
      if(dy === 0){
        chunkX = this.cellX;
        chunkY = 0;
      }else if(dx === 0){
        chunkY = this.cellY;
        chunkX = 0;
      }else{
        const ratio = Math.abs(dy / dx);
        if(ratio > this.cellY / this.cellX){
          chunkX = this.cellY / 2 / ratio;
          chunkY = this.cellY / 2;
        }else{
          chunkY = this.cellX / 2 * ratio;
          chunkX = this.cellX / 2;
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
  handleRound = (curX: number, curY: number): void => {
    const posX = (curX - this.round[3]) / this.cellX;
    const posY = (curY - this.round[0]) / this.cellY;
    const posXr = [Math.floor(posX - this.size / 2 / this.cellX), Math.floor(posX + this.size / 2 / this.cellX)];
    const posYr = [Math.floor(posY - this.size / 2 / this.cellY), Math.floor(posY + this.size / 2 / this.cellY)];
    for(let i = posXr[0]; i <= posXr[1]; i++){
      if(i >= 0 && i < 10){
        for(let j = posYr[0]; j <= posYr[1]; j++){
          if(j >= 0 && j < 10){
            const dx = curX - this.round[3] - (i + 0.5) * this.cellX;
            const dy = curY - this.round[0] - (j + 0.5) * this.cellY;
            const index = j * 10 + i;
            if(dx * dx + dy * dy < this.size * this.size / 4 && !this.cells[index]){
              this.cells[index] = true;
              this.ptg++;
            }
          }
        }
      }
    }
  }
  checkRound = (e: TouchEvent & MouseEvent): void => {
    const { percentage = 70, onChange, clear, onSuccess } = this.props;
    onChange && onChange(this.ptg);
    if(this.ptg >= percentage){
      clear && this.ctx.clearRect(0, 0, this.state.cw, this.state.ch);
      this.setState({isSuccess: true});
      this.up(e, true);
      onSuccess && onSuccess();
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