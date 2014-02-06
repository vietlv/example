var appSettings = (function() {
	var that = this, fname = "appSettings.json", path, data = null, error = null, 
		changed = false, saveInterval = null, saveInProgress = false,
		
		readSettingsFile = function(callback){
			var paths = navigator.fileMgr.getRootPaths();
			path = paths[0] + fname;				
				
			navigator.fileMgr.testFileExists(path,
				// success
				function(o) {
					if (o) {
						var reader = new FileReader();
						
						reader.onload = function(evt){
							var res;
							console.debug("AppSettings readSettingsFile: " + JSON.stringify(evt.target && evt.target.result));
							error = null;
							try {
								console.debug("parsing " + evt.target.result);
								res = evt.target.result;
								data = JSON.parse(res);
								console.debug("parse end. " + JSON.stringify(data));
							} catch (err) {
								console.debug(JSON.stringify(err));
							}
							//console.debug(data);
							saveInterval = setInterval(saveChanges, 500);
							callback(that);
						};
						
						reader.onerror = function(evt){
							var e = JSON.stringify(evt);
							console.debug("AppSettings readSettingsFile error: " + e);
							error = e;
							
							callback(that);
						};
						
						// read file
						reader.readAsText(path);
					}
					else {
						var writer = new FileWriter(path);
						
						writer.onwrite = function(){
							console.debug("App settings: created new settings file.");
							error = null;							
							
							saveInterval = setInterval(saveChanges, 500);
							callback(that);
						};
						
						writer.onerror = function(evt){
							console.debug("App settings: error creating a new settings file. " + JSON.stringify(evt));
							error = evt;
							
							callback(that);
						};
						writer.write("{}");
					}
				},
				// fail
				function(o) {
					console.debug("App settings: error finding settings file " + path + ". Error: " + JSON.stringify(evt));
				}
			);
		},
		
		saveChanges = function() {
			if (saveInProgress) {
				return;
			} else {
				if (changed) {
					var writer = new FileWriter(path);
					
					writer.onwrite = function(){
						console.debug("App settings: updated settings file.");
						changed = false;
						saveInProgress = false;
					};
					
					writer.onerror = function(evt){
						console.debug("App settings: error updating settings file. " + JSON.stringify(evt));
						saveInProgress = false;
					};
					
					saveInProgress = true;
					writer.truncate(0);
					writer.write(JSON.stringify(data));
				}
			}
		};
	
	this.load = function(callbackFunc, appName) {
		if (typeof callbackFunc === "function") {
			if (typeof appName === "string") {
				fname = appName + "_settings.json";
			}
			try {
				console.debug("AppSettings: trying to load settings file " + fname);
				readSettingsFile(callbackFunc);
			} 
			catch (e) {
				console.debug("AppSettings: error in load: " + JSON.stringify(e));
				error = e;
				callbackFunc(that);
			}
		} else {
			console.debug("AppSettings: argument callbackFunc is not a function.");
			throw "AppSettings: argument callbackFunc is not a function.";
		}
	};
	
	this.set = function(key, value) {
		if (data === null) { 
			throw "No settings loaded."; 
		}
		
		if (!data[key] || data[key] !== value) {
			data[key] = value;
			if (saveInProgress) {
				setTimeout(function() { changed = true; }, 1000);
			} else {
				changed = true; 
			}
		}
	};
	
	this.get = function(key) {
		return data[key];
	};
	
	return this;
}());
