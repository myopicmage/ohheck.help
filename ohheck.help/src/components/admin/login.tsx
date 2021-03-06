﻿import * as React from 'react';
import 'whatwg-fetch';

export default class Login extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            message: ''
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    submit = event => {
        event.preventDefault();

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch('/account/connect', {
            method: 'POST',
            body: JSON.stringify({
                Username: this.state.username,
                Password: this.state.password
            }),
            headers: headers
        }).then(response => {
            return response.json();
        }).then((data: any) => {
            if (data) {
                this.props.authenticate(data.token, new Date(data.expiration));
            } else {
                this.setState({
                    username: '',
                    password: '',
                    message: data.message
                });
            }
        });
    }

    render() {
        return (
            <div className="pure-u-1 slide-in">
                <form className="pure-form pure-form-stacked">
                    <fieldset>
                        <legend>Login</legend>

                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />

                        <button className="pure-button" onClick={this.submit}>Login</button>
                        {this.state.message &&
                            <div style={{ 'margin-top': '20px' }}>
                                <b>Error</b>: {this.state.message}
                            </div>
                        }
                    </fieldset>
                </form>
            </div>
        );
    }
} 