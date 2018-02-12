import React from "react";
import ReactDom from "react-dom";
import _ from "lodash";
import constants from "../constants/eon_constants";
import actions from "../actions/extemporise_actions";
import Store from "../stores/extemporise_store";
import effects from "../../data/effects";
import AutosizeInput from 'react-input-autosize';
import Select from 'react-select';
import Spell from './spell';

const isInt = function(number) {
	return (
		(typeof number === 'number' && !isNaN(number) && isFinite(number) && parseInt(number) === number) ||
		(typeof number === 'string' && /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(number))
	)
}

class Exercise extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.getState();
		this.handleAspectChange = this.handleAspectChange.bind(this);
		this.handleDeleteSpell = this.handleDeleteSpell.bind(this);
		this.handleDurationChange = this.handleDurationChange.bind(this);
		this.handleEffectButtonClick = this.handleEffectButtonClick.bind(this);
		this.handleFilamentChange = this.handleFilamentChange.bind(this);
		this.handleRangeChange = this.handleRangeChange.bind(this);
		this.handleScopeChange = this.handleScopeChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
	}

	componentWillMount() {
		this.handleStateChange = function(spells) {
			this.setState({ spells });
		}.bind(this);
		Store.addChangeListener(this.handleStateChange);
	}

	componentWillUnmount() {
		Store.addChangeListener(this.handleStateChange);
	}

	getEventValue(event) {
		if (isInt(event)) {
			value = parseInt(event);
		} else if (typeof event === 'object' && event !== null) {
			if (isInt(event.value)) {
				return parseInt(event.value);
			} else if (typeof event.target === 'object' && event.target !== null && isInt(event.target.value)) {
				return parseInt(event.target.value);
			}
		}
		return null;
	}

	handleAspectChange(spell, index, event) {
		var value = this.getEventValue(event);
		if (event !== null && typeof spell === "object" && spell !== null) {
			actions.updateSpell(_.assign(
				{},
				spell,
				{
					aspects: spell.aspects.map((aspect, i) => (i === index) ? value : aspect)
				}
			));
		}
	}

	handleDeleteSpell(spell) {
		actions.deleteSpell(spell);
	}

	handleDurationChange(spell, index, event) {
		var value = this.getEventValue(event);
		if (event !== null && typeof spell === "object" && spell !== null) {
			actions.updateSpell(_.assign(
				{},
				spell,
				{
					durations: spell.durations.map(function(duration, i) {
						if (i === index) {
							return _.assign({}, duration, { value: isNaN(value) ? undefined : value });
						}
						return duration;
					})
				}
			));
		}
	}
	handleEffectButtonClick(event) {
		var index = parseInt(event.target.value);
		if (0 <= index && index < effects.length) {
			actions.createSpell(effects[index]);
		}
	}


	handleEffectChange(spell, effect, event) {
		var index = this.getEventValue(event);
		if (index !== null) {
			if (typeof spell === "object" && spell !== null) {
				actions.updateSpell(_.assign({}, spell, { effect: index }));
			} else {
				actions.createSpell({ effect: index });
			}
		}
	}

	handleFilamentChange(spell, event) {
		var value = this.getEventValue(event);
		if (event !== null) {
			if (typeof spell === "object" && spell !== null) {
				actions.updateSpell(_.assign({}, spell, { filament: isNaN(value) ? undefined : value }));
			} else {
				actions.createSpell({ filament: value });
			}
		}
	}

	handleRangeChange(spell, index, event) {
		var value = this.getEventValue(event);
		if (event !== null && typeof spell === "object" && spell !== null) {
			actions.updateSpell(_.assign(
				{},
				spell,
				{
					ranges: spell.ranges.map(function(range, i) {
						if (i === index) {
							return _.assign({}, range, { value: isNaN(value) ? undefined : value });
						}
						return range;
					})
				}
			));
		}
	}

	handleScopeChange(spell, index, event) {
		var value = this.getEventValue(event);
		if (event !== null && typeof spell === "object" && spell !== null) {
			actions.updateSpell(_.assign(
				{},
				spell,
				{
					scopes: spell.scopes.map(function(scope, i) {
						if (i === index) {
							return _.assign({}, scope, { value: isNaN(value) ? undefined : value });
						}
						return scope;
					})
				}
			));
		}
	}

	handleTypeChange(spell, event) {
		var value = this.getEventValue(event);
		if (event !== null) {
			if (typeof spell === "object" && spell !== null) {
				actions.updateSpell(_.assign({}, spell, { type: isNaN(value) ? undefined : value }));
			} else {
				actions.createSpell({ type: value });
			}
		}
	}

	render() {
		return (
			<form className="phb">
				{this.state.spells.map(function(spell, key) {
					return (
						<Spell
							spell={spell}
							key={key}
							index={key}
							onAspectChange={this.handleAspectChange}
							onDeleteSpell={this.handleDeleteSpell}
							onDurationChange={this.handleDurationChange}
							onEffectButtonClick={this.handleEffectButtonClick}
							onFilamentChange={this.handleFilamentChange}
							onRangeChange={this.handleRangeChange}
							onScopeChange={this.handleScopeChange}
							onTypeChange={this.handleTypeChange}
						/>
					)
				}, this)}
				<div>
					{effects.map(function(effect, key) {
						return (
							<button
								key={key}
								type="button"
								value={key}
								onClick={this.handleEffectButtonClick}
							>
								{effect.name}
							</button>
						);
					}, this)}
				</div>
			</form>
		);
	}
}

export default Exercise;