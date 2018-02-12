import _ from "lodash";

const initializer = function(self, obj) {
	if (typeof obj === "object" && obj !== null) {
		for (var property in obj) {
			if (self.hasOwnProperty(property) &&
				obj.hasOwnProperty(property) &&
				typeof self[property] !== "undefined" &&
				typeof obj[property] !== "undefined"
			) {
				self[property] = obj[property];
			}
		}
	}
};

class Spell {
	constructor(obj) {
		this.sourceAspects = null;
		this.aspects = [];
		this.description = '';
		this.durations = [];
		this.effect = null;
		this.filament = null;
		this.identifier = null;
		this.name = '';
		this.ranges = [];
		this.scopes = [];
		this.transformations = [];
		this.type = 0,
		initializer(this, obj);
		if (this.sourceAspects === null) {
			this.sourceAspects = this.aspects.map(a => a);
		}
	}
};

export {
	Spell
};