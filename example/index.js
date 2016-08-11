var Store = require('../');
var EE = require('events').EventEmitter;

// observable state from discrete events
var store = Store({ count: 0 });

var subscribe = store({
    add: function (state, event) {
        return { count: state.count + event.value };
    },
    increment: function (state, event) {
        return { count: state.count + 1 };
    }
});

var emitter = new EE();
var unsubscribe = subscribe(emitter);

// store.state is an instance of `observ-struct`
store.state(function onChange (data) {
    console.log('change', data);
});

emitter.emit('increment');
emitter.emit('add', { value: 10 })

// here we consume the same events, but handle them differently
subscribeToSomethingElse = store({
    add: function (state, event) {
        return { count: state.count + event.value * 2 };
    }
});

var anotherEmitter = new EE();
subscribeToSomethingElse(anotherEmitter);
anotherEmitter.emit('add', { value: 3 });

