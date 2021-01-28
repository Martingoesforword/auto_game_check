// var Person = require("../src/fake_actor/Person");

//工具和类型定义
var currentProject = "Slots";
var ERROR_TIP_PREFIX = currentProject + " "+ "项目自动测试工具提示" + "：\n";
var UserInterfaceType = {
	TYPE_BUTTON: 0
};
var InterfacePriorityType = {
	TYPE_PRIORITY_UNKNOWN: 0,
	TYPE_PRIORITY_SYSTEM_IN: 1,
	TYPE_PRIORITY_SYSTEM_OUT: 2,
	TYPE_PRIORITY_SYSTEM_CONTEXT: 3,
	TYPE_PRIORITY_IN_TEST_IN: 4,
	TYPE_PRIORITY_IN_TEST_OUT: 5,
	TYPE_PRIORITY_IN_TEST_CONTEXT: 6
};
var UserPersonType = {
	TYPE_PERSON_STUPID_CHILD: 0,
	TYPE_PERSON_STUPID_ADULT: 1
};
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

//定义用户类型的行动
var stupidChildAction = function(userInterface) {
	//通过 优先级，层级，用户类型，交互类型 等等来选出下一个操作
	// var userButtonPriority = userButton.priority;
	// var userDisabled = userButton.enabled;
	var userButtons = userInterface[UserInterfaceType.TYPE_BUTTON];
	return function(){
		userButtons[1] && userButtons[1].activate && userButtons[1].activate();
	};
};

//获取交互类型集合：按钮交互类型
var getCurrentInterfaceButton = function() {
	var listenersMap = cc.eventManager._listenersMap["__cc_touch_one_by_one"];
	if (!listenersMap) {
		cc.error(ERROR_TIP_PREFIX+"目前没有可用的button操作！");
		return;
	}
	var listeners = listenersMap._sceneGraphListeners;
	if (!listeners || !listeners.length) {
		cc.error(ERROR_TIP_PREFIX+"目前没有可用的button操作！");
		return;
	}
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
var getCurrentUserToDoAction = function(userInterface, personType) {
	var innerAction = null;
	var action = function(){
		innerAction && innerAction();
	}
	switch (personType) {
		case UserPersonType.TYPE_PERSON_STUPID_CHILD: {
			innerAction = stupidChildAction(userInterface);
			break;
		}
		case UserPersonType.TYPE_PERSON_STUPID_ADULT: {
			break;
		}
		default: {
			break;
		}
	}
	return action;
};
var buildCurrentUserAllInterface = function(userInterface) {
	userInterface[UserInterfaceType.TYPE_BUTTON] = getCurrentInterfaceButton();
};

//定义检测功能
var checkGameDataAndUI = function() {

};

//定义用户的一次交互行动
var userDoOneTouch = function(personType) {
	var userInterface = {};
	buildCurrentUserAllInterface(userInterface);
	var nextAction = getCurrentUserToDoAction(userInterface, personType);
	nextAction();
};

//定义行动帧
var updateUserActionFrame = function(personType) {
	//行动前检测
	checkGameDataAndUI();

	//瞬时行动
	userDoOneTouch(personType);

	//行动后检测
	checkGameDataAndUI();
};

//定义测试行为
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
