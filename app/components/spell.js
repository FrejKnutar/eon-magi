import React from "react";
import ReactDom from "react-dom";
import _ from "lodash";
import constants from "../constants/eon_constants";
import actions from "../actions/extemporise_actions";
import Store from "../stores/extemporise_store";
import effects from "../../data/effects";
import AutosizeInput from 'react-input-autosize';
import Select from 'react-select';

const isInt = function(number) {
	return (
		(typeof number === 'number' && !isNaN(number) && isFinite(number) && parseInt(number) === number) ||
		(typeof number === 'string' && /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/.test(number))
	)
}

class Spell extends React.Component {
	constructor(props) {
		super(props);
		this.handleEditableChange = this.handleEditableChange.bind(this);
		this.state = {
			editable: true
		};
	}

	handleEditableChange(editable, disablePropagation, event) {
		if (typeof disablePropagation === 'boolean' && disablePropagation) {
			event.stopPropagation();
		}
		if (editable !== this.state.editable) {
			this.setState({ editable });
		}
	}

	render() {
		var { spell } = this.props;
		const spellIsDefined = typeof spell === "object" && spell !== null;
		
		var type = spell.hasOwnProperty('type') && isInt(spell.type) ? parseInt(spell.type) : 0;
		var filament = spell.hasOwnProperty('filament') && isInt(spell.filament) ? parseInt(spell.filament) : 0;
		var aspects = spell.hasOwnProperty('aspects') && Array.isArray(spell.aspects) ? spell.aspects: [];
		var scopes = spell.hasOwnProperty('scopes') && Array.isArray(spell.scopes) ? spell.scopes: [];
		var ranges = spell.hasOwnProperty('ranges') && Array.isArray(spell.ranges) ? spell.ranges: [];
		var durations = spell.hasOwnProperty('durations') && Array.isArray(spell.durations) ? spell.durations: [];
		var transformations = spell.hasOwnProperty('transformations') && Array.isArray(spell.transformations) ? spell.transformations: [];

		var f = function(sum, entry) {
			var cost = Array.isArray(entry.cost) ? entry.cost[spell.type] : entry.cost;
			if (typeof cost === 'function') {
				var addative = cost(filament, entry.value);
				return sum + (isInt(addative) && isFinite(addative) && !isNaN(addative) ? addative : 0);
			} else if (isInt(cost)) {
				return sum + parseInt(cost);
			}
			return sum;
		}.bind(this)
		var magnitude = (
			filament +
			scopes.reduce(f, 0) +
			ranges.reduce(f, 0) +
			durations.reduce(f, 0) +
			transformations.reduce(f, 0)
		);

		var difficulty;

		if (isInt(type) &&
			0 <= spell.type &&
			spell.type < constants.types.length &&
			typeof constants.types[spell.type].cost === 'function'
		) {
			difficulty = constants.types[spell.type].cost(magnitude);
		} else {
			difficulty = magnitude;
		}

		var text = (
			typeof spell.description === "function"
			? spell.description(filament, spell.scopes, spell.durations)
			: (typeof spell.description === "string" ? spell.description : "")
		);
		var rows = text.split('\n');
		var description;
		if (rows.length > 0) {
			description = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				description.push(<span key={i*2}>{rows[i]}</span>);
				description.push(<br key={(i*2) + 1}/>);
			}
		} else {
			description = text;
		}

		return (
			<div
				onClick={this.props.editable ? undefined : event => this.handleEditableChange(true, false, event)}
				className={this.props.editable ? undefined : 'clickable'}
			>
				<div className="flex">
					<h2 className="title flex-fill">{spell.name}</h2>
					{this.state.editable && [
						<button
							key={0}
							type="button"
							onClick={event => this.handleEditableChange(false, true, event)}
						>
							Spara
						</button>,
						<button
							key={1}
							type="button"
							onClick={() => this.props.onDeleteSpell(spell)}
						>
							Ta bort
						</button>
					]}
				</div>
				{spellIsDefined && 
					<p className="description">{description}</p>
				}
				<ul>
					<li className={this.state.editable ? "flex" : undefined}>
						<label
							htmlFor={`type${this.props.index}`}
							className="form-label"
						>
							Typ
						</label>
						{(this.state.editable &&
							<Select
								className="flex-fill"
								name={`type${this.props.index}`}
								value={type}
								clearable={false}
								onChange={event => this.props.onTypeChange(spell, event)}
								options={constants.types
									.filter(type => type.name !== 'extemporering')
									.map(function(type, value) {
										return { value: value, label: type.name };
									}, this)
								}
							/>
						) || (
							<span>{constants.types[type].name}</span>
						)}
					</li>
					<li>
						<label
							htmlFor={`difficulty${this.props.index}`}
							className="form-label"
						>
							Svårighet
						</label>
						{(this.state.editable &&
							<AutosizeInput
								name={`difficulty${this.props.index}`}
								className="form-control"
								value={difficulty}
								disabled
								style={{}}
							/>
						) || (
							<span>{difficulty}</span>
						)}
					</li>
					<li>
						<label
							htmlFor={`magnitude${this.props.index}`}
							className="form-label"
						>
							Magnitud
						</label>
						{(this.state.editable &&
							<AutosizeInput
								name={`magnitude${this.props.index}`}
								className="form-control"
								value={magnitude}
								disabled
								style={{}}
							/>
						) || (
							<span>{magnitude}</span>
						)}
					</li>
					<li>
						<label
							htmlFor={`filament${this.props.index}`}
							className="form-label"
						>
							Filament
						</label>
						{(this.state.editable &&
							<AutosizeInput
								name={`filament${this.props.index}`}
								className="form-control"
								placeholder="Filament"
								value={typeof spell.filament === 'number' && !isNaN(spell.filament) ? spell.filament : ''}
								onChange={event => this.props.onFilamentChange(spell, event)}
								style={{}}
							/>
						) || (
							<span>{spell.filament}</span>
						)}
					</li>
					{aspects.map(function(aspect, index) {
						return (
							<li key={index} className={this.state.editable ? "flex" : undefined}>
								<label
									htmlFor={`aspect-${this.props.index}-${index}`}
									className="form-label"
								>
									Aspekt{spell.aspects.length > 1 ? (' ' + (index + 1)) : ''}
								</label>
								{(this.state.editable &&
									<Select
										className="flex-fill"
										name={`aspect${this.props.index}-${index}`}
										placeholder="Aspekt"
										clearable={false}
										value={typeof aspect === 'number' && !isNaN(aspect) ? aspect : '0'}
										onChange={event => this.props.onAspectChange(spell, index, event)}
										options={constants.aspects.map(function(entry, value) {
											return { value: value, label: entry}
										}, this)}
									/>
								) || (
									<span>{constants.aspects[aspect]}</span>
								)}
							</li>
						);
					}, this)}
					{scopes.map(function(scope, index) {
						var inputs = false;
						var className = undefined;
						if (scope.hasOwnProperty('entries') && Array.isArray(scope.entries)) {
							if (this.state.editable) {
								className = 'flex';
								inputs = (
									<Select
										className="flex-fill"
										name={`scope${this.props.index}-${index}`}
										placeholder="Omfång"
										clearable={false}
										value={typeof scope.value === 'number' && !isNaN(scope.value) ? scope.value : '0'}
										onChange={event => this.props.onScopeChange(spell, index, event)}
										options={scope.entries.map(function(entry, value) {
											var name;
											if (typeof entry === 'string') {
												name = entry;
											} else if (typeof entry === 'function') {
												name = entry(0, value);
											} else if (typeof entry.name === "function") {
												name = entry.name(0, value);
											} else {
												name = entry.name
											}
											return { value: value, label: name };
										}, this)}
									/>
								);
							} else {
								var name;
								const entry = scope.entries[scope.value];
								if (typeof entry === 'string') {
									name = entry;
								} else if (typeof entry === 'function') {
									name = entry(0, value);
								} else if (typeof entry.name === "function") {
									name = entry.name(0, value);
								} else {
									name = entry.name
								}
								inputs = <span>{name}</span>
							}
						} else if (scope.hasOwnProperty('names') && Array.isArray(scope.names)) {
							var suffix = '';
							if (typeof scope.name === 'number' &&
								scope.name === parseInt(scope.name) &&
								0 <= scope.name &&
								scope.name < scope.names.length
							) {
								if (typeof scope.names[scope.name] === 'string') {
									suffix = scope.names[scope.name];
								} else if (typeof scope.names[scope.name] === 'function') {
									suffix = scope.names[scope.name](spell.filament, scope.value);
								} else if (typeof scope.names[scope.name].name === "function") {
									suffix = scope.names[scope.name].name(spell.filament, scope.value);
								} else {
									suffix = scope.names[scope.name].name
								}
							}
							inputs = (
								this.state.editable
								? [
									<AutosizeInput
										key={0}
										name={`scope${this.props.index}-${index}`}
										className="form-control"
										placeholder="Omfång"
										value={typeof scope.value === 'number' && !isNaN(scope.value) ? scope.value : ''}
										onChange={event => this.props.onScopeChange(spell, index, event)}
										style={{}}
									/>,
									<span key={1}> {suffix}</span>
								]
								: <span>{scope.value + " " + suffix}</span>
							);
						}
						return (
							<li key={index} className={className}>
								<label
									htmlFor={`scope${this.props.index}-${index}`}
									className="form-label"
								>
									Omfång
								</label>
								{inputs}
							</li>
						);
					}, this)}
					{ranges.map(function(range, index) {
						var input;
						if (this.state.editable) {
							input = (
								<Select
									className="flex-fill"
									name={`range${this.props.index}-${index}`}
									placeholder="Filament"
									clearable={false}
									value={typeof range.value === 'number' && !isNaN(range.value) ? range.value : '0'}
									onChange={event => this.props.onRangeChange(spell, index, event)}
									options={range.entries.map(function(entry, value) {
										var name = typeof entry.name === "function" ? entry.name(filament, value) : entry.name;
										return { value: value, label: name };
									}, this)}
								/>
							);
						} else {
							const entry = range.entries[range.value];
							var name = typeof entry.name === "function" ? entry.name(filament, value) : entry.name;
							input = <span>{name}</span>
						}
						return (
							<li key={index} className={this.state.editable ? "flex" : undefined}>
								<label
									htmlFor={`range${this.props.index}-${index}`}
									className="form-label"
								>
									Räckvidd
								</label>
								{input}
							</li>
						);
					}, this)}
					{durations.map(function(duration, index) {
						var input;
						if (this.state.editable) {
							var disabled = (
								isInt(duration.value) &&
								0 <= duration.value &&
								duration.value < duration.entries.length &&
								duration.entries[duration.value].hasOwnProperty('locked') &&
								typeof duration.entries[duration.value].locked === 'boolean' &&
								duration.entries[duration.value].locked
							);
							input = (
								<Select
									className="flex-fill"
									name={`duration${this.props.index}-${index}`}
									placeholder="Filament"
									clearable={false}
									value={typeof duration.value === 'number' && !isNaN(duration.value) ? duration.value : '0'}
									onChange={event => this.props.onDurationChange(spell, index, event)}
									disabled={disabled}
									options={duration.entries.map(function(entry, value) {
										var name = typeof entry.name === "function" ? entry.name(0, value) : entry.name;
										return (
											{ value: value, label: name, disabled: typeof entry.locked === 'boolean' && entry.locked}
										);
									}, this)}
								/>
							);
						} else {
							const entry = duration.entries[duration.value];
							var name = typeof entry.name === "function" ? entry.name(0, value) : entry.name;
							input = <span>{name}</span>
						}
						return (
							<li key={index} className={this.state.editable ? "flex" : undefined}>
								<label
									htmlFor={`duration${this.props.index}-${index}`}
									className="form-label"
								>
									Varaktighet
								</label>
								{input}
							</li>
						);
					}, this)}
				</ul>
			</div>
		);
	}
}

export default Spell;