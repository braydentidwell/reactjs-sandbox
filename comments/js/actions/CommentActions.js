var React = require("react");
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var Constants = require('../constants/CommentConstants.js');

var CommentActions = {

    postComment: function(author, text) {
        AppDispatcher.dispatch({
            actionType: Constants.COMMENT_CREATE,
            author: author,
            text: text
        });
    }
};

module.exports = CommentActions;