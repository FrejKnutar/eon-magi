import constants from "../constants/extemporise_constants";
import { dispatch } from "../dispatcher/dispatcher";

const actions = {
	createSpell: function(spell) {
		dispatch({
			request: constants.EXTEMPORISE_CREATE,
			content: {
				spell: spell
			}
		});
		return actions;
	},
	updateSpell: function(spell) {
		dispatch({
			request: constants.EXTEMPORISE_UPDATE,
			content: {
				spell: spell
			}
		});
		return actions;
	},
	deleteSpell: function(spell) {
		console.log(spell);
		dispatch({
			request: constants.EXTEMPORISE_DELETE,
			content: {
				spell: spell
			}
		});
		return actions;
	}
};

export default actions;