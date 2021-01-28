// var Person = require("../src/fake_actor/Person");

var isUserVisible = function(node, first) {
	//传入必须是node类型
	if(!(node instanceof cc.Node)) {
		return false;
	}
	if(first) {
		//检测node的可视性
		if(!node.visible) {
			return false;
		}
		//检测node的实际用户可视大小符合
		var width = node.getBoundingBoxToWorld()[2];
		var height = node.getBoundingBoxToWorld()[3];
		if(width * height < 50) {
			return false;
		}
	}
	//检测node的实际用户可视性
	if(node.parent) {
		if(node.parent.visible) {
			return isUserVisible(node.parent);
		} else {
			return false;
		}
	} else {
		return true;
	}
};

InterfacePriorityType = {
	TYPE_PRIORITY_UNKNOWN: 0,
	TYPE_PRIORITY_SYSTEM_IN: 1,
	TYPE_PRIORITY_SYSTEM_OUT: 2,
	TYPE_PRIORITY_SYSTEM_CONTEXT: 3,
	TYPE_PRIORITY_IN_TEST_IN: 4,
	TYPE_PRIORITY_IN_TEST_OUT: 5,
	TYPE_PRIORITY_IN_TEST_CONTEXT: 6
};

var listenersMap = cc.eventManager._listenersMap["__cc_touch_one_by_one"];
var listeners = listenersMap._sceneGraphListeners;

var getCurrentInterfaceButton = function() {
	var userButtons = [];
	listeners.forEach(function(listener){
		var menuNode = listener._node;
		if(menuNode) {
			for (var j = 0; j < menuNode.getChildren().length; j++) {
				var userButton = menuNode.getChildren()[j];
				if(isUserVisible(userButton) && userButton.enabled) {
					userButtons.push(userButton);
				}
			}
		}
	})

	userButtons.reverse();
	return userButtons;
};

var getCurrentUserToDoAction = function(userButtons) {
	//通过 优先级，层级，等等来选出下一个操作
	// var userButtonPriority = userButton.priority;
	// var userDisabled = userButton.enabled;
	return function(){
		userButtons[1].activate();
	};
};

var userDoOneTouch = function() {
	var userButtons = getCurrentInterfaceButton();
	var nextAction = getCurrentUserToDoAction(userButtons);
	nextAction();
}

var updateUserActionFrame = function() {
	var userButtons = getCurrentInterfaceButton();
	var nextAction = getCurrentUserToDoAction(userButtons);
	nextAction();
};

var comeOneUser = function() {
	// setInterval(updateUserActionMinFrame, 100);
	setInterval(updateUserActionFrame, 2000);
};

comeOneUser();


// for (var i = 0; i < listeners.length; i++) {
// 	var menuNode = listeners[i]._node;
// 	if(menuNode) {
// 		for (var j = 0; j < menuNode.getChildCount(); j++) {
// 			var userButton = menuNode.getChildren()[j];
// 			var userButtonPriority = userButton.priority;
// 			var userDisabled = userButton.disabled;
//
// 		}
// 	}
// }
