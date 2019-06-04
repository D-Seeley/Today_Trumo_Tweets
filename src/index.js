import React, { Component } from 'react';
import { render } from 'react-dom';
const root = document.getElementById('root');


class Body extends Component {
    constructor() {
        super();

        this.state = {
            tweets: {
                tweet: "tweet, tweet"
            }
        }
    }

    render() {
        const tweet = Object.keys(this.state.tweets);


        return (
                <div>
                <h1>Today Trump Tweeted</h1>
                <p>{tweet}</p>
            </div>
        )
    }
}


render(<Body />, root);
