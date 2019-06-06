import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
const root = document.getElementById('root');


class Body extends Component {
    constructor() {
        super();

        this.state = {
            tweets: {
                tweet: "tweet, tweet"
            },
            tweetCount: 0
        }
    }

    componentDidMount() {
        axios.get('/api/count')
            .then(res => res.data)
            .then(({ tweetCount }) => this.setState({tweetCount}))
    }

    render() {
        const tweet = Object.keys(this.state.tweets);


        return (
                <div>
                <h1>Today Trump Tweeted</h1>
                <p>{this.state.tweetCount}</p>
            </div>
        )
    }
}


render(<Body />, root);
