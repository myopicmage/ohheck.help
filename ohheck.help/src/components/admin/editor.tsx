﻿import * as React from 'react';
import { Icon, MDown } from 'components/common';

interface IEditorProps {
    name: string;
    value: string;
    disabled?: boolean;
    handleChange: (event: React.FormEvent<HTMLTextAreaElement>) => void;
}

export default class Editor extends React.Component<IEditorProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            edit: true
        };
    }

    editorbox: HTMLTextAreaElement | null = null;

    componentDidMount() {
        if (this.props.value) {
            this.resize();
        }
    }

    componentDidUpdate() {
        this.resize();
    }

    resize = () => {
        if (!this.editorbox) {
            return;
        }

        this.editorbox.style.height = 'auto';
        this.editorbox.style.height = `${this.editorbox.scrollHeight + 5}px`;
    }

    display = () => {
        if (this.state.edit) {
            return (
                <textarea
                    name={this.props.name}
                    value={this.props.value}
                    onChange={this.props.handleChange}
                    onKeyDown={this.resize}
                    className="pure-u-1 box"
                    disabled={this.props.disabled}
                    ref={el => this.editorbox = el} />
            );
        } else {
            return (
                <div className="box">
                    <b>Preview</b>
                    <MDown text={this.props.value} />
                </div>
            );
        }
    }

    setEdit = event => {
        event.preventDefault();

        this.setState({
            edit: true
        });
    }

    setPreview = event => {
        event.preventDefault();

        this.setState({
            edit: false
        });
    }

    render() {
        return (
            <div className="editor-container">
                This box allows <a href="http://commonmark.org/help/">markdown</a>.
                <div className="pure-u-1 editor">
                    {this.display()}
                </div>
                <button className="pure-button button-primary"
                    disabled={this.props.disabled}
                    onClick={this.setEdit}
                    onSubmit={event => event.preventDefault()}> 
                    <Icon icon="edit" /> Edit
                </button>
                <button className="pure-button button-primary"
                    disabled={this.props.disabled}
                    onClick={this.setPreview}
                    onSubmit={event => event.preventDefault()}>
                    <Icon icon="remove_red_eye" /> Preview
                </button>
            </div>
        );
    }
}
