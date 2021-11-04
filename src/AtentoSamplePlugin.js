import React from "react";
import { VERSION } from "@twilio/flex-ui";
import { FlexPlugin } from "flex-plugin";

const PLUGIN_NAME = "AtentoSamplePlugin";

export default class AtentoSamplePlugin extends FlexPlugin {
	constructor() {
		super(PLUGIN_NAME);
	}

	init(flex, manager) {
		// remove panel2.  not requested, but likely desired
		flex.AgentDesktopView.defaultProps.showPanel2 = false;

		// one hang-up button
		flex.Actions.addListener("afterHangupCall", (payload) => {
			flex.Actions.invokeAction("CompleteTask", { sid: payload.task.sid });
		});

		// handle customer hang-ups
		flex.Actions.addListener("afterWrapupTask", (payload) => {
			flex.Actions.invokeAction("CompleteTask", { sid: payload.task.sid });
		});

		// online automatically, make sure to set activity name or sid to the variables in your environment
		console.log("setting to available");
		flex.Actions.invokeAction("SetActivity", {
			activityName: "Idle",
			// activitySid: "WAxxx"
		});

		// remove info tab
		flex.TaskCanvasTabs.Content.remove("info");

		// remove hold button
		flex.CallCanvasActions.Content.remove("hold");

		// remove transfer button
		flex.CallCanvasActions.Content.remove("directory");

		// caller id mapping will require some custom code.  you'll likely need to leverage twilio lookup to get the country of the dialed number and then pick the approproate caller id.
		// below is general steps, but you'll definitely need to work more here:
		flex.Actions.replaceAction("StartOutboundCall", (payload, original) => {
			// get current destination
			let dialedNumber = payload.destination;

			// call twilio function to do twilio lookup and return country code

			// select number you would like to dial from
			let callerId = "blah";

			// set this back into the payload
			payload.callerId = callerId;

			// set any required task attributes
			payload.taskAttributes = {};

			original(payload);
		});
	}
}
