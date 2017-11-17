import React, { Component } from 'react';
import marked from 'marked';
import './App.css';
import {HotKeys} from 'react-hotkeys';

const map = {
  'hotGetEvent': 'command+j',
  'hotSaveEvent': 'command+k',
  'deleteNode': ['del', 'backspace']
};
let readedArr = []

Array.prototype.remove = function(val) {
  debugger
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originValue: '',
      value: '',
      content: '',
      randomNum: -1
    };
    this.inputEvent = this.inputEvent.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
  }
  inputEvent (e) {
    // marked配置 https://github.com/chjj/marked
    let originValue = e.target.value
    let value = marked(originValue, {breaks:true, sanitize:true, gfm:true});
    this.setState(prevState => ({
      originValue: originValue,
      content: value
    }));
  }
  // 事件: 保存
  saveEvent () {
    let originValue = this.state.originValue

    if (originValue == '') return 
    this.saveData(this.state.originValue)
    this.setState(prevState => ({
      originValue: '',
      content: ''
    }));
  }
  // 事件: 获取
  getEvent () {
    let { randomMarkdown, randomNum } = this.getData()
    let value = marked(randomMarkdown, {breaks:true, sanitize:true, gfm:true});

    this.setState(prevState => ({
      originValue: randomMarkdown,
      content: value,
      randomNum: randomNum
    }));
  }
  // 事件: 修改
  updateEvent () {
    let { markdownArr } = this.getData();
    markdownArr[this.state.randomNum] = this.state.originValue;
    markdownArr = JSON.stringify(markdownArr)
    localStorage.setItem('markdowntest', markdownArr);
    alert('修改成功')
  }
  // 事件: 删除
  deleteEvent () {
    let { markdownArr } = this.getData();

    markdownArr.splice(this.state.randomNum, 1)
    readedArr.remove(this.state.randomNum)
    debugger
    markdownArr = JSON.stringify(markdownArr)
    localStorage.setItem('markdowntest', markdownArr);

    this.setState({
      randomNum: -1
    })

    this.getEvent()
  }
  // 保存数据
  saveData (markDownStr) {
    let markdownStorage = localStorage['markdowntest'] && localStorage['markdowntest'] || '[]';
    let markdownArr = JSON.parse(markdownStorage);

    markdownArr.push(markDownStr)
    markdownArr = JSON.stringify(markdownArr)

    localStorage.setItem('markdowntest', markdownArr);
  }
  // 获取数据
  getData () {
    let markdownArr = localStorage['markdowntest'] && JSON.parse(localStorage['markdowntest']) || [];
    let length = markdownArr.length;
    let randomNum,
        randomMarkdown;
    if (length == 0) {
      this.setState(prevState => ({
        originValue: '',
        content: ''
      }))
      alert('没有可取数据了')
      return
    }
    debugger
    // FIXME: 以下取不重复算法时间复杂度可以优化
    if (readedArr.length == length) {
      alert('全部读完,重新开始')
      readedArr = []
    }
    do {
      randomNum = parseInt(Math.random() * length);
    }
    while (readedArr.indexOf(randomNum) != -1)
    readedArr.push(randomNum)

    randomMarkdown = markdownArr[randomNum]

    return {
        randomNum: randomNum,
        markdownArr: markdownArr,
        length: length,
        randomMarkdown: randomMarkdown
    };
  }
  render() {
    const handlers = {
      'hotGetEvent': this.getEvent,
      'hotSaveEvent': this.saveEvent
    };
    return (
      <HotKeys keyMap={map} handlers={handlers} style={{height: '100%'}}>
        <div className="App">
          <textarea name="" id="J_input" className="markdown-input" onInput={this.inputEvent} value={this.state.originValue}></textarea>
          <div id="content" className="content" dangerouslySetInnerHTML={{__html: this.state.content}} />
          <div className="menu">
            <button id="J_save" onClick={this.saveEvent}>保存</button>
            <button id="J_get" onClick={this.getEvent}>随机取</button>
            <button id="J_delete" onClick={this.deleteEvent}>删除</button>
            <button id="J_updata" onClick={this.updateEvent}>修改</button>
          </div>
        </div>
      </HotKeys>
    );
  }
}

export default App;
