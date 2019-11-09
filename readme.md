# 欢迎使用react刮一刮组件

此组件使用图片是未使用getImageData方法,没有跨域问题,使用简单,适合多场景使用

安装
```cmd
 npm install react-scratch-perfect --save
```

例子: [https://dsmelon.github.io/react-scratch-perfect/dist/index.html](https://dsmelon.github.io/react-scratch-perfect/dist/index.html)

**api**

|    参数名    |         类型         |    默认值    |                  说明                  |                        值                        |
|:------------|:---------------------|:-------------|:--------------------------------------|:-------------------------------------------------|
| className   | string               | 无           | 容器的类名                             |                                                  |
| clear       | boolean              | false        | 完成后是否清除画布                      |                                                  |
| color       | string               | #808080      | 刮刮卡的颜色                           |                                                  |
| img         | string               | 无           | 刮刮卡的填充图片(如果图片加载失败,会使用颜色值)|                                             |
| imgRepeat   | string               | 无           | 图片填充方式                           | width: 宽度撑满，高度自适应并居中<br/> height: 高度撑满，宽度自适应并居中<br/> repeat: 重复填充无值或者其他值会被拉伸铺满容器 |
| size        | number               | 1/10容器宽度  | 画笔直径                               |                                                  |
| round       | array\[number\]      | \[0,0,0,0\]  | 奖品限定区域,分别为上右下左的padding值   |                                                  |
| percentage  | number               | 70           | 完成百分比(round之外的不参与计算)        |                                                 |
| mode        |string                | move         | 在什么时刻触发onChange和onSuccess       | move: 手指移动时触发onChange和onSuccess<br/> end: 手指抬起时触发onChange和onSuccess |
| onChange    | function(percentage) | 无           | 改变时触发的函数,回传的是已经刮出的百分比 |                                                  |
| onSuccess   | function             | 无           | 完成时的回调                           |                                                  |

使用方法
```jsx
<Scratch
    color="#808080"
    img=""
    round={[100,50,100,50]}
    size={40}
    imgRepeat="height"
    percentage={70}
    clear={false}
    mode="move"
    onChange={this.handleChange}
    onSuccess={this.onSuccess}
    className="scratch"
>
    <div className="s1">一等奖</div>
</Scratch>
```
```css
.s1{
    font-size: 100px;
    line-height: 320px;
    height: 320px;
    width: 450px;
    color: deeppink;
    display: inline-block;
}
```
github地址: [https://github.com/dsmelon/react-scratch-perfect](https://github.com/dsmelon/react-scratch-perfect)