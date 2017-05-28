﻿import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import * as a from '.';

export default class Admin extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            authenticated: document.cookie.indexOf('AspNetCore.Identity.Application') !== -1
        };
    }

    auth = () => {
        this.setState({
            authenticated: true
        });
    }

    render() {
        if (!this.state.authenticated) {
            return (
                <div className="pure-u-1">
                    <h1>Oh Heck! Admin</h1>
                    <a.Login authenticate={this.auth} />;
                </div>
            );
        } else {
            return (
                <div className="pure-u-1 some-space">
                    <h1>Oh Heck! Admin</h1>
                    <div className="pure-u-1-4">
                        <h3>menu</h3>
                        <a.AdminNav />
                    </div>
                    <div className="pure-u-3-4">
                        <Route exact path="/dashboard" component={a.AdminHome} />

                        <Route path="/dashboard/responses/:id" component={a.Responses} />
                        <Route exact path="/dashboard/responses" render={() => <h3>Please go back and select a survey.</h3>} />

                        <Route path="/dashboard/bycard/:id" component={a.SurveysByCard} />
                        <Route exact path="/dashboard/bycard" render={() => <h3>Please go back and select a survey.</h3>} />

                        <Route path="/dashboard/groups/:id" component={a.SingleGroup} />
                        <Route exact path="/dashboard/groups" component={a.Groups} />

                        <Route path="/dashboard/subunits/:id" component={a.SingleSubunit} />
                        <Route exact path="/dashboard/subunits" component={a.Subunits} />

                        <Route path="/dashboard/idols/:id" component={a.SingleIdol} />
                        <Route exact path="/dashboard/idols" component={a.Idols} />

                        <Route path="/dashboard/cards/:id" component={a.SingleCard} />
                        <Route exact path="/dashboard/cards" component={a.AllCards} />

                        <Route path="/dashboard/survey/:id" component={a.SurveyView} />
                        <Route exact path="/dashboard/survey" component={a.NewSurvey} />

                        <Route path="/dashboard/settings" component={a.Settings} />
                    </div>
                </div>
            );
        }
    }
}