﻿import * as React from 'react';

export default class NewCheckboxes extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            checkboxes: []
        };
    }

    handleSave = event => {
        event.preventDefault();

        this.props.save(this.props.question);
    }

    addCheckbox = event => {
        event.preventDefault();

        this.setState({
            checkboxes: [
                ...this.state.checkboxes,
                {}
            ]
        });
    }

    renderCheckboxes = () => this.state.checkboxes.map(
        (item, index) =>
            <div className="pure-u-1" key={index}>
                <label>{index}</label>
                <input type="text" className="pure-u-3-4" placeholder="checkbox label goes here" />
            </div>
        );

    render() {
        return (
            <fieldset>
                <legend>Checkbox</legend>

                <label htmlFor="boxes">What do you want your question to say?</label>
                <input type="text" name="boxes" className="pure-u-3-4" />
                {this.renderCheckboxes()}
                <button onClick={this.addCheckbox}> Add a checkbox</button>
            </fieldset>
        );
    }
}