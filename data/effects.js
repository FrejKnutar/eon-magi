import _ from 'lodash';
import constants from '../app/constants/eon_constants';

const initializeArray = function(spell, properties, defaultElement) {
	var a = properties.reduce(function(a, prop) {
		if (spell.hasOwnProperty(prop)) {
			if (Array.isArray(spell[prop])) {
				return a.concat(spell[prop]);
			} else {
				a.push(spell[prop]);
				return a;
			}
		}
		return a;
	}, []);
	return defaultElement !== 'undefined' && a.length === 0 ? [defaultElement] : a;
}

const toObT6 = function(value) {
	const t6 = Math.floor(value/4);
	const modifier = value % 4
	return (t6 === 0 ? '' : `${t6}T6`) + (modifier === 0 ? '' : `+${modifier}`);
}

const autofillSpell = function(spell) {
	if (typeof spell === 'object' && spell !== null) {
		return Object.assign({}, spell, {
			scopes: initializeArray(spell, ['scope', 'scopes'], constants.scope).map(function(scope) {
				if (typeof scope === 'object' &&
					scope !== null &&
					scope.hasOwnProperty('type') &&
					typeof scope.type === 'string' &&
					scope.type in constants.scope
				) {
					return Object.assign({}, constants.scope[scope.type], scope)
				} else if (typeof duration === 'string') {
					const index = _.findIndex(constants.scope.entries, r => r.name === scope.toLowerCase());
					if (index >= 0) {
						return Object.assign({}, constants.scope, { value: index });
					}
				}
				return Object.assign({}, constants.scope.entries[0]);
			}),
			ranges: initializeArray(spell, ['range', 'ranges'], constants.range).map(function(range) {
				if (typeof range === 'object' && range !== null) {
					return Object.assign({}, constants.range, range)
				} else if (typeof duration === 'string') {
					const index = _.findIndex(constants.range.entries, r => r.name === range.toLowerCase());
					if (index >= 0) {
						return Object.assign({}, constants.range, { value: index });
					}
				}
				return Object.assign({}, constants.range);
			}),
			durations: initializeArray(spell, ['duration', 'durations'], constants.duration).map(function(duration) {
				if (typeof duration === 'object' && duration !== null) {
					return Object.assign({}, constants.duration.entries[duration.type], duration)
				} else if (typeof duration === 'string') {
					const index = _.findIndex(constants.duration.entries, d => d.name === duration.toLowerCase());
					if (index >= 0) {
						return Object.assign({}, constants.duration, { value: index });
					}
				}
				return Object.assign({}, constants.duration);
			}),
			aspects: initializeArray(spell, ['aspect', 'aspects']).map(function(aspect) {
				if (typeof aspect === 'string'){
					return _.indexOf(constants.aspects, aspect.toLowerCase());
				} else if (typeof aspect === 'number' &&
					!isNaN(aspect) &&
					parseInt(aspect) === aspect &&
					0 <= aspect &&
					aspect < constants.aspects.length
				) {
					return aspect;
				}
				return -1;
			}),
			transformations: initializeArray(spell, ['transformation', 'transformations']).map(function(transformation) {
				if (typeof transformation === 'string'){
					return _.indexOf(constants.aspects, transformation.toLowerCase());
				} else if (typeof transformation === 'number' &&
					!isNaN(transformation) &&
					parseInt(transformation) === transformation &&
					0 <= transformation &&
					transformation < constants.aspects.length
				) {
					return transformation;
				}
				return -1;
			})
		});
	}
	return null;
}

const effects = [
	{
		name: 'Väcka',
		aspect: 'ataxotropi',
		scope: {
			type: 'target',
			name: 3
		},
		range: { value: 0 },
		duration: 'momentan',
		description: function(filament, scope, duration) {
			var differens = (filament - 4);
			var suffix = "";
			if (differens !== 0) {
				if (differens > 0) {
					suffix = `, dra sedan av ${differens} från det`;
				} else {
					suffix = `, lägg sedan till ${-differens} till det`;
				}
			}
			return (
				'Målet får slå ett nytt Chockslag för att vakna upp. Utgå ' +
				'från det högsta av Utmattning och/eller svårigheten på det ' +
				'Chockslag som fick varelsen utslagen' + suffix + ' och ' + 
				'slå ett nytt Chockslag.'
			);
		}
	},
	{
		name: 'Livsförstärkning',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		duration: 'koncentration',
		minFilaments: 8,
		description: function(filament, scope, duration) {
			return (
				`+${((Math.floor(filament / 2)) - 6)} Livskraft vid Dödsslag.`
			);
		}
	},
	{
		name: 'Skada vandöd',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: (f, i) => i !== 1 ? 'vandöda varelser' : 'vandöd varelse'
		},
		description: function(filament, scope, duration) {
			return (
				'Kroppbyggnad mot ' + (filament + 4) + ': De nekrotropiska ' +
				'fälten i den vandöda varelsen förstörs. Fungerar endast ' +
				'mot vandöda utan Livskraft.'
			);
		}
	},
	{
		name: 'Skadeläkning',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		minFilaments: 4,
		duration: 3,
		description: function(filament, scope, duration) {
			return (
				`Ökar läkningstakten samtliga skador med ${Math.floor(filament / 4)}.`
			);
		}
	},
	{
		name: 'Skelettläkning',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		minFilaments: 4,
		duration: 3,
		description: function(filament, scope, duration) {
			return (
				'Ökar läkningstakten för brutna ben och sprickor med '
				(Math.floor(filament / 2) - 1) + '. För alver påskyndas även utväxten ' +
				'av avslagna tänder (där varje månad räknas som ' + 
				(Math.floor(filament / 2)) + ' månader).'
			);
		}
	},
	{
		name: 'Smärtläkning',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		minFilaments: 4,
		duration: 3,
		description: function(filament, scope, duration) {
			return (
				`Ökar läkningstakten för Smärta med ${Math.floor(filament / 2) - 1}.`
			);
		}
	},
	{
		name: 'Blodläkning',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		description: function(filament, scope, duration) {
			return (
				'Stoppar en blödning vars svårighet är högst ' + filament +
				' oberoende av blödningstakt.'
			);
		}
	},
	{
		name: 'Sårläkning',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		minFilaments: 4,
		duration: 3,
		description: function(filament, scope, duration) {
			return (
				`Ökar läkningstakten för Sår med ${Math.floor(filament / 2) - 1}.`
			);
		}
	},
	{
		name: 'Återuppliva',
		aspect: 'biotropi',
		scope: {
			type: 'target',
			name: 3
		},
		description: function(filament, scope, duration) {
			return (
				filament + ' måste vara minst lika mycket som det dödande ' + 
				'Dödsslaget som då hävs. Samma scen. Ger Nedbrytning 50 ' +
				'(övernaturligt).'
			);
		}
	},
	{
		name: 'Händelsehorisont',
		aspect:'kosmotropi',
		filament: 16,
		scope: {
			type: 'area'
		},
		duration: 'koncentration',
		description: function(filament, scope, duration) {
			return (
				"Effekten skapar över hela omfånget ett område som ter sig " +
				"becksvart för alla som ser det från utsidan. " +
				"Händelsehorisonten kan inte flyttas, men allt som sker " + 
				"inom den blir omöjligt att förnimma med syn, hörsel och " +
				"liknande för individer som befinner sig utanför; alla slag " +
				"för Uppfattning för detta ändamål misslyckas automatiskt. " +
				"Mystisk förnimmelse, lukt, känsel samt hoppfull intuition " +
				"fungerar dock fortfarande. Händelsehorisonten blockerar " +
				"även insyn i saker som sker bakom den för varelser " +
				"sombefinner sig framför den, men i dessa fall är det bara " +
				"synen som påverkas."
			);
		}
	},
	{
		name: 'Kväva eld',
		aspect:'kosmotropi',
		scope: {
			type: 'area'
		},
		description: function(filament, scope, duration) {
			return (
				`Effekten har värde ${filament * 2} i Kväva eld, som ` +
				"används i konflikt mot eldens skadeslag. Om släckningen " +
				"lyckas upphör upphör eld inom omfånget omedelbart ut, och " +
				"glöden kvävs av ett tunt lager rimfrost."
			);
		}
	},
	{
		name: 'Oubliette',
		aspect:'kosmotropi',
		scope: {
			type: 'target',
			name: 3
		},
		description: function(filament, scope, duration) {
			return (
				`Självkontroll mot ${filament - 2}. Förvisar målet till ett ` +
				"utomvärldsligt miniatyrplan av mörk energi. Man åldras " +
				"inte så länge man befinner sig i oublietten, inte heller " +
				"kan man bli skadad eller dö. Oublietten ter sig för de som " +
				"fångats i den som en mörk och dyster, men inte hotfull, " + 
				"dröm, där tankar och känslor från ens undermedvetna " +
				"manifesteras och utgör grunden för allt som händer i " +
				"oublietten. För omvärlden tycks personen som hamnade i " +
				"oublietten spårlöst försvunnen, men punkten för hennes " +
				"försvinnande kan nattetid tyckas egendomligt mörk och glåmig."
			);
		}
	},
	{
		name: 'Plåga',
		aspect:'kosmotropi',
		scope: {
			type: 'target',
			name: 3
		},
		duration: 'scen',
		description: function(filament, scope, duration) {
			return (
				"Effekten drabbar målet med plötslig inre plåga. Det känns " +
				"som om en svart, kall hand nyss kramat om ens själ.\n" +
				`[I]: Självkontroll mot ${filament+4}: Välmående räknas som 1 lägre.\n` +
				`[II]: Självkontroll mot ${filament+3}: Välmående räknas som 2 lägre.\n` +
				`[III]: Självkontroll mot ${filament+2}: Välmående räknas som 3 lägre.\n` +
				`[IV]: Självkontroll mot ${filament+1}: Välmående räknas som 4 lägre.\n` +
				`[V]: Självkontroll mot ${filament}: Välmående räknas som 5 lägre.`
			);
		}
	},
	{
		name: 'Sammanbrott',
		aspect:'kosmotropi',
		scope: {
			type: 'target',
			name: 3
		},
		description: function(filament, scope, duration) {
			return (
				`Självkontroll mot ${filament+6}: Bryter ihop.`
			);
		}
	},
	{
		name: 'Sfärernas musik',
		aspect:'kosmotropi',
		scope: {
			type: 'target',
			name: 3
		},
		filament: 14,
		duration: 'scen',
		description: function(filament, scope, duration) {
			return (
				"Effekten fördjupar magikerns förmåga att manipulera de " +
				"kraftvibrationer som orsakas av de celestiala sfärernas " +
				"och himlakropparnas interaktion. Alla slag för Ceremoni, " +
				"Extemporera, Förnimma, Förvränga, Harmonisera och " +
				"Kanalisera kan istället göras med färdigheten Sång & musik."
			);
		}
	},
	{
		name: 'Tystnad',
		aspect:'kosmotropi',
		scope: {
			type: 'area',
		},
		duration: 'scen',
		description: function(filament, scope, duration) {
			return (
				"Effekten sår tystnad inom omfånget. Alla försök att med " +
				"Vaksamhet eller hörsel-relaterade färdigheter förnimma " +
				`ljud ökar i svårighet med ${filament}.`
			);
		}
	},
	{
		name: 'Blödning',
		aspect:'nekrotropi',
		scope: {
			type: 'target',
			name: 2
		},
		description: function(filament, scope, duration) {
			return (
				"Beskrivning: Välj en av följande effekter:\n" +
				`[I]: Orsakar Blödning: 1/${filament - 2}.\n` + 
				`[II]: Orsakar Blödning: 2/${filament - 4}.\n` +
				`[III]: Orsakar Blödning: 3/${filament - 6}.`
			);
		}
	},
	{
		name: 'Infektion',
		aspect:'nekrotropi',
		scope: {
			type: 'target',
			name: 2
		},
		description: function(filament, scope, duration) {
			return (
				"Beskrivning: Välj en av följande effekter:\n" +
				`[I]: Orsakar Blödning: 1/${filament - 1}.\n` + 
				`[II]: Orsakar Blödning: 2/${filament - 2}.\n` +
				`[III]: Orsakar Blödning: 3/${filament - 3}.\n` +
				`[IV]: Orsakar Blödning: 4/${filament - 4}.\n` +
				`[V]: Orsakar Blödning: 5/${filament - 5}.`
			);
		}
	},
	{
		name: 'Kontrollera vandöd',
		aspect:'nekrotropi',
		scope: {
			type: 'target',
			name: (f, i) => `${i} fysiskt ${(i > 1 ? 'vandöda kroppar' : 'vandöd kropp')}`
		},
		duration: 'koncentration',
		description: function(filament, scope, duration) {
			return (
				`Kontrollerar en vandöd upp till rang ${filament}.`
			);
		}
	},
	{
		name: 'Stank',
		aspect:'nekrotropi',
		scope: {
			type: 'area'
		},
		description: function(filament, scope, duration) {
			return (
				"Effekten skapar en frukt­ans­ värd stank. De som träder in " +
				`i området måste klara Självkontroll mot ${filament} ` +
				"eller drabbas av konsekvensen Kraftigt äckel. Varelser " +
				"som har lukten som sitt primära sinne slår istället mot " +
				`${filament + 4}. Om man misslyckas fortsätter man dock ` +
				"att ha –1T6 så länge man befinner sig i området. Man " +
				"behöver som regel inte slå fler än ett slag för samma område."
			);
		}
	},
	{
		name: 'Stympa',
		aspect:'nekrotropi',
		scope: {
			type: 'target',
			name: 2
		},
		description: function(filament, scope, duration) {
			return (
				"Välj en av följande effekter:\n" +
				`[I]: Kroppsbyggnad mot ${filament - 2}: Hand, underarm, armbåge, överarm, axel, fot, vad, knä, lår eller höft amputeras.\n` +
				`[II]: Kroppsbyggnad mot ${filament - 4}: Nacken amputeras.\n` +
				`[III]: Kroppsbyggnad mot ${filament - 8}: Torson amputeras.`
			);
		}
	},
	{
		name: 'Sår',
		aspect:'nekrotropi',
		scope: {
			type: 'target',
			name: 2
		},
		description: function(filament, scope, duration) {
			return (
				`Livskraft mot ${filament + 4}: Sår i det berörda ` +
				`träffområdet. För Huvud och Torso används ${filament}.`
			);
		}
	},
	{
		name: 'Vissna',
		aspect:'nekrotropi',
		scope: {
			type: 'area'
		},
		description: function(filament, scope, duration) {
			const prefix = (
				"Magikern suger ut de biotropiska energierna ur naturen " +
				"kring sig och ersätter dessa med nekrotropi som får gro i " +
				"den sakta förtvinande floran. De högre magnituderna bör " +
				"kombineras med en rejäl utökning av omfånget för att uppnå " +
				"maximal effekt. De växter som vissnar kommer sedan att " +
				"förmultna och utgöra en god grogrund för nya växter och " +
				"nytt liv."
			);
			if (filament >= 60) {
				return (
					prefix + " De största och äldsta träden i skogen jämrar " +
					"sig innan de för evigt somnar in"
				);
			} else if (filament >= 40) {
				return (
					prefix + " Stora träd vissnar och en matta av löv som " +
					"skiftar från gult till rött täcker underlaget."
				);
			} else if (filament >= 20) {
				return (
					prefix + " Små träd förtvinar och fåglarna lämnar sina " +
					"bon."
				);
			} else if (filament >= 8) {
				return (
					prefix + " Buskar drar ihop sig och deras blommor " +
					"faller till marken."
				);
			} else if (filament >= 4) {
				return (
					prefix + " Gräs torkar ut och kvar blir endast bruna " +
					"små stickor."
				);
			} else if (filament >= 1) {
				return (
					prefix + " En blomma vissnar."
				);
			} else {
				return prefix;
			}
		}
	},
	{
		name: 'Skydd mot magi',
		aspect:'nomotropi',
		scope: {
			type: 'target',
			name: 0
		},
		duration: 'koncentration',
		description: function(filament, scope, duration) {
			return (
				"Påverkas inte av direkt magi med magnitud som är " + 
				`${filament} eller lägre. Kan fortfarande påverkas av ` +
				"indirekt genom områdesomfång."
			);
		}
	},
	{
		name: 'Antända',
		aspect:'pyrotropi',
		scope: {
			type: 'target',
			name: 0
		},
		description: function(filament, scope, duration) {
			return (
				`Orsakar Eldskada 0/${toObT6(filament + 8)}`
			);
		}
	},
	{
		name: 'Eldskydd',
		aspect:'pyrotropi',
		scope: {
			type: 'target',
			name: 0
		},
		duration: 'koncentration',
		description: function(filament, scope, duration) {
			return (
				`Eldskyddet ökar med ${Math.floor(filament / 2)}.`
			);
		}
	},
	{
		name: 'Flamma',
		aspect:'pyrotropi',
		scope: {
			type: 'area'
		},
		description: function(filament, scope, duration) {
			return (
				`Orsakar Eldskada ${toObT6(filament)}/${toObT6(filament)}`
			);
		}
	},
	{
		name: 'Hunger',
		aspect:'pyrotropi',
		scope: {
			type: 'area'
		},
		duration: 'scen',
		description: function(filament, scope, duration) {
			return (
				`Självkontroll mot ${filament}: Målet känner en oerhört ` +
				"stark hungerkänsla, på gränsen till svält, och kan endast " +
				"lindra den genom att konstant stoppa i sig mat. Detta " +
				"slutar ofta i att målet sätter i sig för mycket och sedan " +
				"spyr upp allt innan kroppen kollapsar. Såvida målet inte " +
				"befinner sig i fara får denne ett avdrag på –1T6 för alla " +
				"handlingar som inte leder till att mer mat äts."
			);
		}
	},
	{
		name: 'Härd',
		aspect:'pyrotropi',
		scope: {
			type: 'area',
			nameSuffix: ' kring en eld'
		},
		duration: 'eld',
		description: function(filament, scope, duration) {
			return (
				"Effekten förtrollar en eld och får den att brinna och " +
				"spraka på ett särskilt hemtrevligt och tryggt vis. " +
				"Varelser utanför omfånget kan bara ta sig in om de lyckas " +
				`med ett slag för Självkontroll mot ${filament}. Varelser ` +
				"inom omfånget får +1T6 Självkontroll vid Skräck. Härden " +
				"ger dessutom +1T6 på alla slag för att laga mat eller ägna " +
				"sig åt hantverk eller spådom med hjälp av dess lågor."
			);
		}
	},
	{
		name: 'Övertändning',
		aspect:'pyrotropi',
		scope: {
			type: 'target',
			name: 0
		},
		duration: 'koncentration',
		description: function(filament, scope, duration) {
			return (
				`Ökar eldkänsligheten med ${toObT6(Math.floor(filament/2))}.`
			);
		}
	},
	{
		name: 'Avkilja skugga',
		aspect:'skototropi',
		scopes: [{
			type: 'target',
			name: (f, count) => `${count} ${(count === 1 ? 'skugga' : 'skuggor')}`
		}, {
			type: 'area'
		}],
		duration: 'scen',
		description: function(filament, scope, duration) {
			return (
				"Effekten kopplar loss mag­ikerns skugga, som blir kvar på " +
				"platsen där effekten vävdes, låst i den pose magikern hade " +
				"i vävningsögonblicket. Skuggan i sig är kusligt orörlig om " +
				"effekten inte kombineras med andra effekter, frånsett att " +
				"den subtilt drar sig undan direkta ljuskällor. Magikern " +
				"själv saknar skugga under varaktigheten. Effekten kan " +
				"bland mycket annat användas för att lämna meddelanden i " +
				"form av gester och dylikt, och kan te sig extremt " +
				"besvärande för utomstående betraktare."
			);
		}
	},
	{
		name: 'Bränna',
		aspect:'termotropi',
		scope: {
			type: 'area'
		},
		description: function(filament, scope, duration) {
			return (
				`Orsakar Eldskada ${toObT6(filament + 4)}/0.`
			);
		}
	}
].map(autofillSpell);

export default effects;