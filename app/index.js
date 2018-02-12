import React from "react";
import ReactDom from "react-dom";
import Exercise from "./components/app";

ReactDom.render(
	(
		<div className="pane">
			<div className="brewRenderer">
				<div className="pages">
					<Exercise />
				</div>
			</div>
		</div>
	),
	document.getElementById("reactRoot")
);