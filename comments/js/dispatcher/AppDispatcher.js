var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var AppDispatcher = assign({}, Dispatcher.prototype, {
    /**
     * A bridge function between the views and the dispatcher, marking the action as a view action. Another variant
     * here could be 'handleServerAction'.
     *
     * Note that this functionality isn't needed for this app. This is just an example of how to perform special
     * operations in the dispatcher. You can just use 'new Dispatcher()' if no custom functionality is needed.
     *
     * @param {object} action - The data coming from the view.
     */
    handleViewAction: function(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action: action
        });
    }
});

module.exports = AppDispatcher;

// If no special functionality is needed for the Dispatcher (like above), just do this:
//module.exports = new Dispatcher();