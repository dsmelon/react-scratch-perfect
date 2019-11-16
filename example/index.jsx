import React, {PureComponent} from 'react';
import ReactDom from 'react-dom';
import Scratch from '../src/index';
import './index.scss';

export default class App extends PureComponent{
  state = {
    mode: "move",
    p: 0,
    color: "#808080",
    img: "",
    round: [114,77,114,77],
    size: 40,
    clear: false,
    imgRepeat: "",
    key: 0,
    percentage: 70
  }
  timer = -1;
  handleChange = (p) => {
    this.setState({p})
  }
  onSuccess = () => {
    alert("success");
  }
  change = e => {
    const {name, value, checked} = e.currentTarget;
    switch(name){
      case "clear":
          this.setState({[name]: checked, key: ++this.state.key});
      break;
      case "size":
      case "img":
      case "percentage":
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.setState({[name]: value, key: ++this.state.key});
        },400)
      break;
      case "round":
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
          this.setState({[name]: value ? value.split(",").map(_=>+_) : [], key: ++this.state.key});
        },400)
      break;
      default:
          this.setState({[name]: value, key: ++this.state.key});
      break;
    }
    this.setState({p: 0});
  }
  render(){
    return <div className="wrap">
      <Scratch
        key={this.state.key}
        color={this.state.color}
        img={this.state.img}
        round={this.state.round}
        size={this.state.size}
        percentage={this.state.percentage}
        clear={this.state.clear}
        mode={this.state.mode}
        onChange={this.handleChange}
        onSuccess={this.onSuccess}
        imgRepeat={this.state.imgRepeat}
        className="left"
      >
        <div className="s1">一等奖</div>
        <p className="ppp">{this.state.p}</p>
      </Scratch>
      <div className="right">
        <p>颜色(<span> color </span>)</p>:<input onChange={this.change} type="color" name="color"/><br/>
        <p>图片(<span> img </span>)</p>:<input onChange={this.change} type="text" name="img" placeholder="请输入图片地址" /><br/>
        <p>图片填充方式(<span> imgRepeat </span>)</p>:<select name="imgRepeat" onChange={this.change}>
          <option value="">拉伸至全容器(默认)</option>
          <option value="width">宽度撑满，高度自适应并居中</option>
          <option value="height">高度撑满，宽度自适应并居中</option>
          <option value="repeat">重复填充</option>
        </select><br/>
        <p>范围(<span> round </span>)</p>:<input onChange={this.change} name="round" type="text" placeholder="上右下左四个位置用逗号隔开"/><br/>
        <p>模式(<span> mode </span>)</p>:<select name="mode" onChange={this.change}>
          <option value="move">手指移动时计算百分比(默认)</option>
          <option value="end">手指抬起时计算百分比</option>
        </select><br/>
        <p>画笔大小(<span> size </span>)</p>:<input onChange={this.change} name="size" type="text" placeholder="默认为宽度的1/10"/><br/>
        <p>完成百分比(<span> percentage </span>)</p>:<input onChange={this.change} name="percentage" type="text" placeholder="默认70%"/><br/>
        <p>完成后清除画布(<span> clear </span>)</p>:<input onChange={this.change} name="clear" type="checkbox"/>
      </div>
      <div className="doc">
        <table>
          <tbody>
            <tr><td>参数名</td><td>类型</td><td>默认值</td><td>说明</td><td>值</td></tr>
            <tr><td>className</td><td>string</td><td>无</td><td>容器的类名</td><td>{"\u3000"}</td></tr>
            <tr><td>clear</td><td>boolean</td><td>false</td><td>完成后是否清除画布</td><td>{"\u3000"}</td></tr>
            <tr><td>color</td><td>string</td><td>#808080</td><td>刮刮卡的颜色</td><td>{"\u3000"}</td></tr>
            <tr><td>img</td><td>string</td><td>无</td><td>刮刮卡的填充图片</td><td>{"\u3000"}</td></tr>
            <tr><td>imgRepeat</td><td>string</td><td>无</td><td>图片填充方式</td>
              <td>
                width: 宽度撑满，高度自适应并居中<br/>
                height: 高度撑满，宽度自适应并居中<br/>
                repeat: 重复填充<br/>
                无值或者其他值会被拉伸铺满容器
              </td>
            </tr>
            <tr><td>size</td><td>number</td><td>1/10容器宽度</td><td>画笔直径</td><td>{"\u3000"}</td></tr>
            <tr><td>round</td><td>array[number]</td><td>[0,0,0,0]</td><td>奖品限定区域,分别为上右下左的padding值</td><td>{"\u3000"}</td></tr>
            <tr><td>percentage</td><td>number</td><td>70</td><td>完成百分比(round之外的不参与计算)</td><td>{"\u3000"}</td></tr>
            <tr><td>mode</td><td>string</td><td>move</td><td>在什么时刻触发onChange和onSuccess</td>
              <td>
                move: 手指移动时触发onChange和onSuccess<br/>
                end: 手指抬起时触发onChange和onSuccess
              </td>
            </tr>
            <tr><td>onChange</td><td>function(percentage)</td><td>无</td><td>改变时触发的函数,回传的是已经刮出的百分比</td><td>{"\u3000"}</td></tr>
            <tr><td>onSuccess</td><td>function</td><td>无</td><td>完成时的回调</td><td>{"\u3000"}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  }
}

ReactDom.render(<App />, document.getElementById("root"));