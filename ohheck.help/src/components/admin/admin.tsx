﻿import * as React from 'react';
import { Link, Route } from 'react-router-dom';
import * as a from '.';
import { connect } from 'react-redux';
import { dismissNotification, authenticate } from 'actions/admin';
import { Icon } from 'components/common';
import { IReduxProps, IAdminStore } from 'types/redux';
import { Notification } from 'types/admin';

interface IAdminProps {
    admin: IAdminStore;
}

@connect(state => ({ admin: state.admin }))
export default class Admin extends React.Component<IAdminProps & IReduxProps, any> {
    constructor(props: IAdminProps & IReduxProps) {
        super(props);
    }

    auth = (token: string, expiration: Date): void => {
        const { dispatch } = this.props;

        dispatch(authenticate(token, expiration));
    }

    dismiss = (note: Notification) => {
        const { dispatch } = this.props;

        note.seen = true;

        dispatch(dismissNotification(note));
    }

    displayNotification = () => {
        const { notifications } = this.props.admin;

        if (notifications.length === 0) {
            return <div className="pure-u-2-3">&nbsp;</div>;
        }

        const note = notifications.find(item => !item.seen);

        if (!note) {
            return <div className="pure-u-2-3">&nbsp;</div>;
        }

        return (
            <div className="pure-u-15-24 item">
                <div className={`pure-u-1 notification ${note.level}`}>
                    <div className="pure-u-4-24">
                        {note.created.toDateString()}
                    </div>
                    <div className="pure-u-15-24">
                        {note.text}
                    </div>
                    <div className="pure-u-4-24">
                        {note.action ? <Link to={`${note.action.location}`}>{note.action.text}</Link> : ' '}
                    </div>
                    <div className="pure-u-1-24" onClick={event => { event.preventDefault(); this.dismiss(note); }} style={{ cursor: 'pointer' }}>
                        <Icon icon="close" />
                    </div>
                </div>
            </div>
        );
    }

    displayLogin = () => {
        if (!this.props.admin.bearer) {
            return (
                <div className="pure-u-1">
                    <a.Login authenticate={this.auth} />
                </div>
            );
        } else {
            return (
                <div>
                    <a.AdminNav />
                    <div className="pure-u-3-4 slide-in-container">
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

                        <Route exact path="/dashboard/cards/:id" component={a.SingleCard} />
                        <Route exact path="/dashboard/cards/:skip/:take" component={a.AllCards} />

                        <Route path="/dashboard/survey/:id" component={a.SurveyView} />
                        <Route exact path="/dashboard/survey" component={a.NewSurvey} />

                        <Route path="/dashboard/settings" component={a.Settings} />

                        <Route path="/dashboard/akiedit" component={a.AkiEdit} />
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="pure-u-1 some-space">
                <div className="pure-u-1 flex-contain">
                    <div className="pure-u-1-3 item">
                        <h1>Oh Heck! Admin</h1>
                    </div>
                    {this.displayNotification()}
                </div>
                {this.displayLogin()}
            </div>
        );
    }
}