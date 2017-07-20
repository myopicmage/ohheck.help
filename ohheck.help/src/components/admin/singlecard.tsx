﻿import * as React from 'react';
import { connect } from 'react-redux';
import { Card } from 'types/commontypes';
import { IReduxProps, IAdminStore } from 'types/redux';
import { cardFetch, setNotification } from 'actions/admin';
import { Notification } from 'types/admin';

interface SingleCardProps {
    admin: IAdminStore;
}

@connect(state => ({ admin: state.admin }))
export default class SingleCard extends React.Component<SingleCardProps & IReduxProps, any> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const { dispatch } = this.props;

        if (!id) {
            dispatch(setNotification(Notification.error('No id given. Cannot download card.', 'singlecard', 'singlecard')));

            return;
        }


        if (!this.props.admin.fullcards) {
            dispatch(cardFetch(Number(id)));

            return;
        }

        const card = this.props.admin.fullcards.find(item => item.id === id);

        if (!card) {
            dispatch(cardFetch(Number(id)));
        }
    }

    render() {
        if (this.props.admin.cardloading || !this.props.admin.fullcards) {
            return (
                <div className="pure-u-1">
                    <h3>Loading...</h3>
                </div>
            );
        }

        const card = this.props.admin.fullcards.find(item => item.id === Number(this.props.match.params.id));

        if (!card) {
            return (
                <div className="pure-u-1">
                    <h3>Card not found!</h3>
                </div>
            );
        }

        return (
            <div className="pure-u-1 slide-in">
                <div className="pure-u-1">
                    <a href="#" onClick={this.props.history.goBack}>Back</a>
                </div>
                <hr />
                <div className="pure-u-1">
                    <img src={card.imageurl} />
                </div>
                <hr />
                <div className="pure-u-1-4">
                    <b>Game ID</b>: {card.gameid}
                </div>
                <div className="pure-u-1-4">
                    <b>Idlz</b>: {card.isidol ? "Yes" : "No"}
                </div>
                <div className="pure-u-1-4">
                    <b>Promo</b>: {card.ispromo ? "Yes" : "No"}
                </div>
                <div className="pure-u-1-4">
                    <b>Last Modified</b>: {card.modified}
                </div>
                <div className="pure-u-1">
                    <b>Tags</b>: (coming soon)
                </div>
            </div>
        );
    }
}
