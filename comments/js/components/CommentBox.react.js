var React = require("react");
var $ = require('jquery');

var CommentList = require('./CommentList.react');
var CommentForm = require('./CommentForm.react');

var CommentBox = React.createClass({
    getInitialState: function() {
        return {data: []}
    },
    // Ajax call to retrieve JSON from the server
    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            // Comment Box UI will automatically updated when state changes
            // Note: CommentBox object owns the state data, not the comment list(!!)
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString())
            }.bind(this)
        });
    },
    handleCommentSubmit: function (comment) {
        // Optimistically add this comment to the list before the request completes to make the app feel faster.
        var existingComments = this.state.data;
        var newComments = existingComments.concat([comment]);
        this.setState({data: newComments});

        // Call the server to post the new comment
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function(data) {
                // React knows to update the view when internal state changes!
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    // Executed when the comment box is rendered
    componentDidMount: function() {
        this.loadCommentsFromServer();
        // Sets a sort of CRON job to poll the server after the first comment load
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
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