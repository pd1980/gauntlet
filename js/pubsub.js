define([
  "underscore",
  "jquery"
], 

function( _, $){

	var Pubsub = function() {
		this.subscribers_ = {};
	}

	Pubsub.prototype.guid = (function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	               .toString(16)
	               .substring(1);
	  }
	  return function() {
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	           s4() + '-' + s4() + s4() + s4();
	  };
	})();

	Pubsub.prototype.subscribe = function(event, callback, subscriber ) {

		var subscriptionId, callbackArgs, subscribers, length, i;

		if(!this.subscribers_[event]) {
			this.subscribers_[event] = [];
		} else {
			// check for existing subscription
			subscribers = this.subscribers_[event];
			length = subscribers.length;
			for(i=0; i<length; i++) {
				if(subscriber == subscribers[i]["subscriber"]) {
					window.console.log('WARNING: Subscription already exists with ID ' + subscribers[i][0]);
					return subscribers[i]["id"];
				}
			}
		}

		subscriptionId = this.guid();
		callbackArgs = Array.prototype.slice.call(arguments, 3);

		this.subscribers_[event].push({"id":subscriptionId, "subscriber":subscriber, "callback":callback, "args":callbackArgs});

		// window.console.log(event + ' :: ' + 'Subscription confirmed with ID ' + subscriptionId);

		return subscriptionId;

	}

	Pubsub.prototype.unsubscribe = function(event, subscriptionId) {

		var subscribers, length, i;

		subscribers = this.subscribers_[event];
		if(subscribers) length = subscribers.length;

		for(i=0; i<length; i++)
			if (subscribers[i]["id"] == subscriptionId)
				Array.prototype.splice.call(subscribers, i, 1);

	}

	Pubsub.prototype.publish = function(event, data) {

		var i, length, subscribers, subscriber, callback;

		if(this.subscribers_[event]) {

			subscribers = this.subscribers_[event];

			length = subscribers.length;

			for(i=0; i<length; i++) {
				subscriber = subscribers[i]["subscriber"];
				callback = subscribers[i]["callback"];
				args = subscribers[i]["args"];
				callback.apply(subscriber, [data].concat(args));
			}

		}

	}

	return Pubsub;

});
