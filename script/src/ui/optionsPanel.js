UI.OptionsPanel = function(){

	var me = UI.panel();
	me.hide();

	var background = UI.scale9Panel(0,0,20,20,UI.Assets.panelMainScale9);
	background.ignoreEvents = true;
	me.addChild(background);

	var mainLabel = UI.label({
		label: "Options:",
		font: fontMed,
		left: 5,
		height: 18,
		top: 9,
		width: 200
	});
	me.addChild(mainLabel);

	var insetPanel = UI.scale9Panel(0,0,0,0,UI.Assets.panelInsetScale9);
	me.addChild(insetPanel);

	var closeButton = UI.Assets.generate("button20_20");
	closeButton.setLabel("x");
	closeButton.onClick = function(){
		UI.mainPanel.setView("resetTop");
	};
	me.addChild(closeButton);

	var closeButton2 = UI.Assets.generate("buttonLight");
	closeButton2.setLabel("Close");
	closeButton2.onClick = closeButton.onClick;
	me.addChild(closeButton2);

	var options = [
		{
			label: "Keyboard Layout:",
			values: ["QWERTY","AZERTY","QWERTZ"],
			setValue:function(index){
				if (index == 0){
					SETTINGS.keyboardTable = "qwerty";
				}if (index == 1){
					SETTINGS.keyboardTable = "azerty";
				}else{
					SETTINGS.keyboardTable = "qwertz";
				}
				Settings.saveSettings();
			},
			getValue:function(){
				var result = 0;
				if (SETTINGS.keyboardTable == "azerty") result = 1;
				if (SETTINGS.keyboardTable == "qwertz") result = 2;
				return result;
			}
		},
		{
			label: "VU bars:",
			values: ["NONE", "COLOURS: AMIGA","TRANSPARENT"],
			setValue: function (index) {
				console.error("set option " + index);
				if (index == 0){
					SETTINGS.vubars = "none";
				}else if (index == 2){
					SETTINGS.vubars = "trans";
				}else{
					SETTINGS.vubars = "colour";
				}
				Settings.saveSettings();
			},
			getValue: function () {
				var result = 1;
				if (SETTINGS.vubars == "none") result = 0;
				if (SETTINGS.vubars == "trans") result = 2;
				return result;
			}
		},
		{
			label: "Stereo:",
			values: ["Hard: Amiga", "Balanced", "None: mono"],
			setValue: function (index) {
				console.error("set option " + index);
				if (index == 0){
					Audio.setStereoSeparation(STEREOSEPARATION.FULL)
				}else if (index == 2){
					Audio.setStereoSeparation(STEREOSEPARATION.NONE)
				}
				else{
					Audio.setStereoSeparation(STEREOSEPARATION.BALANCED)
				}
				Settings.saveSettings();
			},
			getValue: function () {
				var result = 1;
				if (SETTINGS.stereoSeparation == STEREOSEPARATION.NONE) result = 2;
				if (SETTINGS.stereoSeparation == STEREOSEPARATION.FULL) result = 0;
				return result;
			}
		}
	];


	options.forEach(function(option){
		var label = UI.label();
		label.setProperties({
			label: option.label,
			font: fontMed,
			textAlign: "right"
		});
		me.addChild(label);
		option.label = label;

		var buttons = [];
		var selectedIndex = option.getValue();

		for (var i = 0; i<4; i++){
			var value = option.values[i];
			var button;
			if (value){
				button = UI.Assets.generate("buttonDarkGreen");
				button.setProperties({
					label: value,
					font: fontMed,
					textAlign: "center"
				});
				button.setActive(i==selectedIndex);
				button.index = i;
				button.option = option;
				button.onClick = function(){
					activateOption(this);
				}
			}else{
				button = UI.Assets.generate("buttonDark");
			}
			me.addChild(button);
			buttons.push(button);
		}
		option.buttons = buttons;
	});

	activateOption = function(button){
		var option = button.option;

		option.buttons.forEach(function(child){
			child.setActive(false);
		});
		button.setActive(true);
		option.setValue(button.index)
	};

	me.setLayout = function(){

		if (!UI.mainPanel) return;
		me.clearCanvas();

		background.setProperties({
			left: 0,
			top: 0,
			height: me.height,
			width: me.width
		});

		var startTop = 5;
		var innerHeight = me.height-(UI.mainPanel.defaultMargin*2) - startTop;

		closeButton.setProperties({
			top: startTop,
			left: me.width - 30
		});

		insetPanel.setProperties({
			left: me.left + UI.mainPanel.defaultMargin,
			top: me.top + startTop,
			height: innerHeight - 6 - mainLabel.height,
			width: me.width - (UI.mainPanel.defaultMargin*2) - 4
		});

		var optionTop = 35;
		var optionHeight = 30;
		var optionMargin = 5;
		var i = 0;
		options.forEach(function(option){
			var thisTop = optionTop + (i* (optionHeight + optionMargin));
			option.label.setProperties({
				top: thisTop,
				width: UI.mainPanel.col1W,
				height: optionHeight,
				left: 0
			});
			var selectedIndex = option.getValue();

			for (var b = 0; b<4; b++){
				var button = option.buttons[b];
				button.setProperties({
					top: thisTop,
					height: optionHeight,
					width: UI.mainPanel.col1W,
					left: UI.mainPanel['col' + (b+2) + 'X']
				});

				button.setActive(b == selectedIndex);
			}
			i++;
		});

		closeButton2.setProperties({
			left: UI.mainPanel.col1X + 5,
			width: UI.mainPanel.col1W - 5,
			height: optionHeight,
			top: (innerHeight - optionHeight) + 5
		});

	};


	return me;

};

