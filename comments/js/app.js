var React = require("react");
var ReactDOM = require("react-dom");
var CommentBox = require('./components/CommentBox.react');

ReactDOM.render(
    <CommentBox pollInterval={2000}/>,
    document.getElementById('comment-box')
);
