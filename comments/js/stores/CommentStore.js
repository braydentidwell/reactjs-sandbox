var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var CommentConstants = require('../constants/CommentConstants');
var ClientConstants = require('../constants/ClientConstants');
var assign = require('object-assign');
var $ = require('jquery');

var CHANGE_EVENT = 'change';
var _commentCache = [];
var _cacheInvalid = true;

/**
 * Create a comment object
 * @param {string} author
 * @param {string} text
 */
function createComment(author, text) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    return {
        id: id,
        author: author,
        text: text
    };
}

/**
 * Post a comment to the server
 * @param {object} comment
 */
function postComment(comment) {
    // Call the server to post the new comment
    $.ajax({
        url: ClientConstants.COMMENT_POST_URI,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
            _commentCache = data;
            _cacheInvalid = false;
            CommentStore.emitChange();
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(ClientConstants.COMMENT_POST_URI, status, err.toString());
        }.bind(this)
    });
}

/**
 * Ajax call to retrieve JSON comments from the server
 */
function retrieveComments() {
    if(_cacheInvalid) {
        $.ajax({
            url: ClientConstants.COMMENT_GET_URI,
            dataType: 'json',
            cache: false,
            success: function (data) {
                _commentCache = data;
                _cacheInvalid = false;
                CommentStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(ClientConstants.COMMENT_GET_URI, status, err.toString())
            }.bind(this)
        });
    }
    // Always return the cache. If the cache is invalid, it will be updated asynchronously and an event will be dispatched.
    return _commentCache;
}

/**
 * Views can use this to register listeners for state changes
 */
var CommentStore = assign({}, EventEmitter.prototype, {

    /**
     * Get all comments
     * @return {object}
     */
    getAll: function() {
        return retrieveComments();
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

/**
 * Register callback with the dispatcher to handle all updates
 */
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case CommentConstants.COMMENT_CREATE:
            var author = action.author;
            var text = action.text;
            if(author !== '' && text !== '') {
                var comment = createComment(author, text);
                postComment(comment);
            }
            break;
        default:
            console.log("Unrecognized action type detected: " + action.actionType);
    }
});

module.exports = CommentStore;