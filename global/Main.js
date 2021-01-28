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
UserInterfaceType = {
	TYPE_BUTTON: 0
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
UserPersonType = {
	TYPE_PERSON_STUPID_CHILD: 0,
	TYPE_PERSON_STUPID_ADULT: 1
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

var stupidChildAction = function(userInterface) {
	//通过 优先级，层级，用户类型，交互类型 等等来选出下一个操作
	// var userButtonPriority = userButton.priority;
	// var userDisabled = userButton.enabled;
	var userButtons = userInterface[UserInterfaceType.TYPE_BUTTON];
	return function(){
		userButtons[1] && userButtons[1].activate && userButtons[1].activate();
	};
};

var getCurrentUserToDoAction = function(userInterface, personType) {
	switch (personType) {
		case UserPersonType.TYPE_PERSON_STUPID_CHILD: {
			stupidChildAction(userInterface);
			break;
		}
		case UserPersonType.TYPE_PERSON_STUPID_ADULT: {
			break;
		}
		default: {
			break;
		}
	}
};

var buildCurrentUserAllInterface = function(userInterface) {
	userInterface[UserInterfaceType.TYPE_BUTTON] = getCurrentInterfaceButton();
};

var userDoOneTouch = function(personType) {
	var userInterface = {};
	buildCurrentUserAllInterface(userInterface);
	var nextAction = getCurrentUserToDoAction(userInterface, personType);
	nextAction();
};

var checkGameDataAndUI = function() {

};

var updateUserActionFrame = function(personType) {
	//行动前检测
	checkGameDataAndUI();

	userDoOneTouch(personType);

	//行动后检测
	checkGameDataAndUI();
};

var comeOneUser = function(personType) {
	// setInterval(updateUserActionMinFrame, 100);
	setInterval(updateUserActionFrame, 2000, personType);
};

// comeOneUser(personType);


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
