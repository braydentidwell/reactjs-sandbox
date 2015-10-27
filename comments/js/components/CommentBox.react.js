var React = require('react');
var CommentStore = require('../stores/CommentStore.js');
var CommentActions = require('../actions/CommentActions.js');
var CommentList = require('./CommentList.react');
var CommentForm = require('./CommentForm.react');

function getComments() {
    return CommentStore.getAll();
}

var CommentBox = React.createClass({

    updateComments: function() {
        this.setState({data: getComments()});
    },

    getInitialState: function() {
        return {data: getComments()};
    },

    // Executed when the comment box is rendered
    componentDidMount: function() {
        CommentStore.addChangeListener(this._onChange);
        // Sets a sort of CRON job to poll the server after the first comment load
        setInterval(this.updateComments(), this.props.pollInterval);
    },

    componentWillUnmount: function() {
        CommentStore.removeChangeListener(this._onChange);
    },

    /**
     * Event handler for 'change' events coming from the CommentStore
     */
    _onChange: function() {
        // React knows to update the view when internal state changes!
        this.updateComments();
    },

    handleCommentSubmit: function (author, text) {
        // Optimistically add this comment to the list before the request completes to make the app feel faster.
        //var existingComments = this.state.data;
        //var newComments = existingComments.concat([{author: author, text: text}]);
        //this.setState({data: newComments});
        // Broadcast the change
        CommentActions.postComment(author, text);
    },

    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

module.exports = CommentBox;