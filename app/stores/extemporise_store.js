import _ from "lodash";
import dispatcher from "../dispatcher/dispatcher";
import EventEmitter from "event-emitter";
import constants from "../constants/eon_constants";
import extemporiseConstants from "../constants/extemporise_constants";
import effects from "../constants/eon_constants";
import { Spell } from "../src/models";

var _spells = [];
var identifier = 0;

const getPath = function(previous, destination) {
    var cur = destination;
    var path = [];
    while (cur !== null && typeof cur !== 'undefined') {
        path.push(constants.aspects[cur]);
        cur = previous[cur];
    }
    return path.reverse();
}

const aspectTransformation = function(source, destination) {
    if (typeof source === 'undefined' ||
        typeof destination === 'undefined' ||
        source === destination
    ) {
        return {
            cost: 0,
            path: []
        };
    }
    var distances = constants.aspects.map(() => Infinity);
    var previous = constants.aspects.map(() => undefined);
    var Q = constants.aspects.map((a, i) => i);

    distances[source] = 0;

    while (Q.length > 0) {
        Q.sort(function(a, b) {
            if (isFinite(distances[a]) || isFinite(distances[b])) {
                return Math.sign(distances[a] - distances[b]);
            }
            return 0;
        })
        const u = Q.shift();
        if (u === destination) {
            return {
                cost: distances[u],
                path: getPath(previous, destination)
            };
        }
        constants.transformation[u].forEach(function(cost, v) {
            if (cost > 0) {
                const alt = distances[u] + cost;
                if (alt < distances[v]) {
                    distances[v] = alt;
                    previous[v] = u;
                }
            }
        });
    }
    return {
        cost: 0,
        path: getPath(previous, destination)
    };
}

const getSpell = function(content) {
    if (typeof content === "object" && content !== null && content.hasOwnProperty("spell")) {
        return content.spell;
    }
    return null;
}

const getSpellIndex = function(spell) {
    if (typeof spell === "object" && spell !== null && spell.hasOwnProperty("identifier")) {
        return _.findIndex(_spells, s => s.identifier === spell.identifier);
    }
    return -1;
}

const createSpell = function(content) {
    var spell = getSpell(content);
    if (spell !== null) {
        var newSpell = new Spell(_.assign(
            {},
            spell,
            {
                identifier: identifier++,
                transformations: spell.aspects.map(a => aspectTransformation(a, a))
            }
        ));
        _spells.push(newSpell);
        ExtemporiseStore.emitChange(_spells);
    }
};

const updateSpell = function(content) {
    var spell = getSpell(content);
    if (spell !== null) {
        var index = getSpellIndex(spell);
        if (index >= 0) {
            _spells[index] = _.assign(
                {},
                _spells[index],
                spell,
                {
                    transformations: spell.sourceAspects.map((a, i) => aspectTransformation(a, spell.aspects[i]))
                }
            );
            ExtemporiseStore.emitChange(_spells);
        }
    }
};

const deleteSpell = function(content) {
    var spell = getSpell(content);
    if (spell !== null) {
        var index = getSpellIndex(spell);
        if (index >= 0) {
            _spells = _spells.filter((s, i) => i !== index);
            ExtemporiseStore.emitChange(_spells);
        }
    }
};


var ExtemporiseStore = EventEmitter({
    getState: function() {
        return {
    		spells: _spells
    	};
    },
    addChangeListener: function(callback){
        this.on(extemporiseConstants.EXTEMPORISE_CHANGE_EVENT, callback);
    },
    removeListener: function(callback) {
        this.removeListener(extemporiseConstants.EXTEMPORISE_CHANGE_EVENT, callback);
    },
    emitChange: function(spells) {
    	this.emit(extemporiseConstants.EXTEMPORISE_CHANGE_EVENT, spells);
    },
    dispatchIndex: dispatcher.register(function(action) {
		switch (action.request) {
			case extemporiseConstants.EXTEMPORISE_CREATE:
                createSpell(action.content);
				break;
            case extemporiseConstants.EXTEMPORISE_UPDATE:
                updateSpell(action.content);
                break;
            case extemporiseConstants.EXTEMPORISE_CREATE:
                updateSpell(action.content);
                break;
            case extemporiseConstants.EXTEMPORISE_DELETE:
                deleteSpell(action.content);
                break;
			default:
				break;
		}
	})
});

export default ExtemporiseStore;