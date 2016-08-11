var struct = require('observ-struct');

// (observ, object, ee) => fn unsubscribe
function Subscribe (state, actions, emitter) {
    var eventNames = Object.keys(actions);
    var evHandlers = eventNames.reduce(function (acc, name) {
        acc[name] = function (ev) {
            var newState = actions[name](state(), ev);
            state.set(newState);
        };
        return acc;
    }, {});

    eventNames.forEach(function (name) {
        emitter.on(name, evHandlers[name]);
    });

    return function unsubscribe () {
        eventNames.forEach(function (name) {
            emitter.removeListener(name, evHandlers[name]);
        });
    };
}

// (object) => fn store
function Store (initState) {
    var state = struct(initState);

    // (object) => fn subscribe
    function store (actions) {
        return Subscribe.bind(null, state, actions);
    }

    store.state = state;
    return store;
}

module.exports = Store;
