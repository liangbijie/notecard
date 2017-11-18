import React, { Component } from 'react';
import marked from 'marked';
import './App.css';
import {HotKeys} from 'react-hotkeys';
import Tip from './components/tips'

const localStorageName = 'markdowntest'

const map = {
  'hotGetEvent': 'command+j',
  'hotSaveEvent': 'command+k',
  'deleteNode': ['del', 'backspace'],
  'hotNewNoteEvent': 'command+u'
};
let readedArr = []

Array.prototype.remove = function(val) {
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
    this.newNoteEvent = this.newNoteEvent.bind(this);
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
  // 事件: 新建
  newNoteEvent () {
    this.setState({
      originValue: '',
      value: '',
      content: '',
      randomNum: -1,
      tips: '新建文档',
      timestamp: new Date()
    })
  }
  // 事件: 保存和修改
  saveEvent () {
    let originValue = this.state.originValue

    if (originValue == '') return 

    let markdownStorage = localStorage[localStorageName] && localStorage[localStorageName] || '[]';
    let markdownArr = JSON.parse(markdownStorage);
    let length

    if (this.state.randomNum == -1) {
      // -1代表新建
      markdownArr.push(originValue)
      length = markdownArr.length - 1
      markdownArr = JSON.stringify(markdownArr)
      
      this.setState({
        randomNum: length
      })
    } else {
      markdownArr[this.state.randomNum] = this.state.originValue;
      markdownArr = JSON.stringify(markdownArr)
      localStorage.setItem(localStorageName, markdownArr);
    }
    localStorage.setItem(localStorageName, markdownArr);
    this.setState({
      tips: '保存成功',
      timestamp: new Date()
    })
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
  // 事件: 删除
  deleteEvent () {
    let { markdownArr } = this.getData();
    markdownArr.splice(this.state.randomNum, 1)
    readedArr.remove(this.state.randomNum)
    markdownArr = JSON.stringify(markdownArr)
    localStorage.setItem(localStorageName, markdownArr);

  }
  // 获取数据
  getData () {
    let markdownArr = localStorage[localStorageName] && JSON.parse(localStorage[localStorageName]) || [];
    let length = markdownArr.length;
    let randomNum,
        randomMarkdown;
    if (length == 0) {
      this.setState(prevState => ({
        originValue: '',
        content: '',
        tips: '没有可取数据了',
        timestamp: new Date()
      }))
      return {
        randomNum: -1,
        markdownArr: '',
        length: 0,
        randomMarkdown: ''
      };
    }
    // FIXME: 以下取不重复算法时间复杂度可以优化
    if (readedArr.length == length) {
      this.setState(prevState => ({
        tips: '全部读完,重新开始',
        timestamp: new Date()
      }))
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
      'hotSaveEvent': this.saveEvent,
      'hotNewNoteEvent': this.newNoteEvent
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
            <button id="J_new" onClick={this.newNoteEvent}>新建</button>
          </div>
        </div>
        <Tip content={this.state.tips} timestamp={this.state.timestamp}></Tip>
      </HotKeys>
    );
  }
}

export default App;
