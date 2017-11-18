import React, { Component } from 'react';
import './index.css';

let time;

class Tip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }
  componentWillMount() {
      time = setTimeout(() => {
        this.setState({
          show: false
        })
      }, 2000)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      show: false
    })
    if (this.props.timestamp != nextProps.timestamp) {
      clearTimeout(time)
      time = setTimeout(() => {
        this.setState({
          show: false
        })
      }, 2000)
      setTimeout(() => {
        this.setState({
          show: true
        })
      }, 0)
    }
  }
  render () {
    console.log('-------render', this.state.show, this.props.content)
    if (this.state.show && this.props.content) {
      console.log('-------render02')
      return (
        <div className={this.state.show ? 'tips' : 'hidden'}>
          {this.props.content}
        </div>
      )
    }
    return 1

  }
}

export default Tip