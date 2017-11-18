import React , { Component } from 'react';
import './index.css';
import '../../normalize.css';

class NoteList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            show: false
        }
        this.getMore = this.getMore.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    // 事件: 查看更多
    getMore () {
        this.setState({
            show: !this.state.show
        })
    }
    handleClick(e) {
        this.props.handleClick(e.target.dataset.id)
    }
    render () {
        return (
            <div className={this.state.show ? 'notes-list-wrap show' : 'notes-list-wrap hide'}>
                <ul className="notes-list">
                    {
                        this.props.notelist.map((item, index) => {
                            return <li data-id={index} onClick={this.handleClick}>{item}</li>
                        })
                    }
                </ul>
                <div className="show-list" onClick={this.getMore}>
                    查看更多
                </div>
            </div>
        )
    }
}

export default NoteList