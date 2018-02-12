import React from "react";
import ReactDom from "react-dom";
import _ from "lodash";

function Tile(props) {
	var tileExists = typeof props.tile === "object" && props.tile !== null,
		openTop,
		openRight,
		openBottom,
		openLeft,
		players,
		floorClassName,
		wallsClassName,
		doorsClassName,
		tileClassName = tileExists ? "tile" : "placeholder",
		showToolbox = typeof props.showToolbox === "boolean" && props.showToolbox,
		toolbox = null;

	if (tileExists) {
		openTop = typeof props.tile.openTop === "boolean" && props.tile.openTop;
		openRight = typeof props.tile.openRight === "boolean" && props.tile.openRight;
		openBottom = typeof props.tile.openBottom === "boolean" && props.tile.openBottom;
		openLeft = typeof props.tile.openLeft === "boolean" && props.tile.openLeft;
		players = _.isArray(props.tile.players) ? props.tile.players : [];
		
		floorClassName = "floor-" + (props.tile.walkable ? "active" : "inactive");
		wallsClassName = "walls-" + (props.tile.walkable ? "active" : "inactive");
		doorsClassName = "doors-" + (props.tile.walkable ? "active" : "inactive");
	}

	if (showToolbox) {
		toolbox = (
			<div key={4} className="toolbox">
				<i unselectable onClick={props.onRotateLeft}>rotate_left</i>
				<i unselectable onClick={props.onRotateRight}>rotate_right</i>
				<i unselectable onClick={props.onAcceptPlacement}>done</i>
			</div>
		)
	}

	return (
		<div
			className={tileClassName}
			onClick={showToolbox ? () => false : props.onClick}
		>
			{tileExists &&[
				<div key={0} className="floor">
					<div className={floorClassName}/>
				</div>,
				<div  key={1} className="walls">
					<div className={wallsClassName} />
				</div>,
				<div  key={2} className="doors">
					<div className={doorsClassName}>
						{!openTop && <div className="wall-top"/>}
						{!openRight && <div className="wall-right"/>}
						{!openBottom && <div className="wall-bottom"/>}
						{!openLeft && <div className="wall-left"/>}
					</div>
				</div>,
				<div key={3} className="players">
					{players.map(function(player, key) {
						return (
							<div
								key={key}
								className={"player player-" + player.playerNumber}
							>
								face
							</div>
						);
					})}
				</div>,
				toolbox
			]}
			{props.children}
		</div>
	);
}

export default Tile;