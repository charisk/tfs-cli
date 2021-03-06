import trace = require("./trace");

export function httpErr(obj): any {
	let errorAsObj = obj;
	if (typeof errorAsObj === "string") {
		try {
			errorAsObj = JSON.parse(errorAsObj);
		} catch (parseError) {
			throw errorAsObj;
		}
	}
	let statusCode: number = errorAsObj.statusCode;	
	if (statusCode === 401) {
		throw "Received response 401 (Not Authorized). Check that your personal access token is correct and hasn't expired.";
	}
	if (statusCode === 403) {
		throw "Received response 403 (Forbidden). Check that you have access to this resource. Message from server: " + errorAsObj.message;
	}
	let errorBodyObj = errorAsObj.body;
	if (errorBodyObj) {
		if (typeof errorBodyObj === "string") {
			try {
				errorBodyObj = JSON.parse(errorBodyObj);
			} catch (parseError) {
				throw errorBodyObj;
			}
		}
		if (errorBodyObj.message) {
			let message = errorBodyObj.message;
			if (message) {
				throw message;
			} else {
				throw errorBodyObj;
			}
		}
	} else {
		throw errorAsObj.message || "Encountered an unknown failure issuing an HTTP request.";
	}
}

export function errLog(arg) {
	if (typeof arg === "string") {
		trace.error(arg);
	} else if (typeof arg.toString === "function") {
		trace.debug(arg.stack);
		trace.error(arg.toString());
	} else if (typeof arg === "object") {
		try {
			trace.error(JSON.parse(arg))
		} catch (e) {
			trace.error(arg);
		}
	} else {
		trace.error(arg);
	}
	process.exit(-1);
}