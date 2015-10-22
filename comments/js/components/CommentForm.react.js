var React = require("react");

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        // Stop the browser from actually submitting the form
        e.preventDefault();
        var author = this.refs.author.value.trim();
        var text = this.refs.text.value.trim();
        if(!text || !author) {
            return;
        }
        // Callback passed in from CommentBox
        this.props.onCommentSubmit({author: author, text: text});
        this.refs.author.value = '';
        this.refs.text.value = '';
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

module.exports = CommentForm;