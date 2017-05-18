﻿import * as React from 'react';
import 'whatwg-fetch';
import Subunit from './subunit';
import Idol from './idol';

export default class Survey extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            chosen: {},
            comments: '',
            submitter: '',
            nextgroup: ''
        };
    }

    componentDidMount = () => {
        fetch("/api/cards")
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.setState({
                    cards: data
                });
            });
    }

    handleClick = id => {
        this.setState({
            chosen: {
                ...this.state.chosen,
                [id]: !this.state.chosen[id]
            }
        });
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submit = event => {
        event.preventDefault();

        console.log('submitting', this.state.chosen);

        fetch('/api/submit', {
            method: 'POST',
            body: JSON.stringify({
                surveyid: 1,
                chosen: this.state.chosen,
                comments: this.state.comments,
                submitter: this.state.submitter,
                nextgroup: this.state.nextgroup
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(data => {
            window.location.href = '/thanks';
        });
    }

    renderList = list => {
        return list.map((item, index) => {
            return (
                <span key={index}>
                    <Idol
                        imageurl={item.imageurl}
                        rarity={item.rarity}
                        attribute={item.attribute}
                        selected={this.state.chosen[item.id]}
                        handleClick={() => this.handleClick(item.id)}
                        name={item.id} />
                </span>
            );
        });
    }

    render() {
        const stuff = this.state.cards ? this.renderList(this.state.cards) : <p>loading survey...</p>;

        return (
            <div className="pure-u-1">
                <div>
                    {stuff}
                </div>
                <form name="survey" className="pure-form pure-form-stacked">
                    <fieldset>
                        <legend>some extra stuff</legend>
                        <label htmlFor="comments">do you have any comments or questions for us (totally optional)?</label>
                        <textarea
                            name="comments"
                            value={this.state.comments}
                            onChange={this.handleChange}
                            className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2" />
                        <label htmlFor="submitter">what is your name (totally optional)?</label>
                        <input type="text" name="submitter" value={this.state.submitter} onChange={this.handleChange} className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4" />
                        <label htmlFor="nextgroup">which subunit would you like to vote on next?</label>
                        <select name="nextgroup" value={this.state.nextgroup} onChange={this.handleChange} style={{ 'height': 'auto' }}>
                            <option value="">Select one...</option>
                            <option value="BiBi">BiBi</option>
                            <option value="lily white">lily white</option>
                            <option value="Printemps">Printemps</option>
                            <option value="Guilty Kiss">Guilty Kiss</option>
                            <option value="AZALEA">AZALEA</option>
                        </select>
                        <p className="center">
                            <button className="pure-button button-primary" onSubmit={this.submit} onClick={this.submit}>
                                submit!
                            </button>
                        </p>
                    </fieldset>
                </form>
            </div>
        );
    }
}