const constants = {
	types: [
		{
			name: 'besvärjelse'
		},
		{
			name: 'ritual',
			cost: cost => Math.ceil(cost / 2)
		},
		{
			name: 'extemporering'
		},
	],
	scope: {
		target: {
			cost: [
				(f, i) => (i - 1) * 4,
				(f, i) => (i - 1) * 4,
				(f, i) => (i - 1) * 8
			],
			value: 1,
			names: [
				(f, i) => `mål`,
				(f, i) => `objekt`,
				(f, i) => `varelse${i !== 1 ? 'r' : ''}`,
				(f, i) => `individ${i !== 1 ? 'er' : ''}`,
				(f, i) => `effekt${i !== 1 ? 'er' : ''}`
			]
		},
		area: {
			cost: [
				(f, i) => i * 4,
				(f, i) => i * 4,
				(f, i) => i * 8
			],
			value: 0,
			entries: [
				{ name: "extremt litet" },
				{ name: "mycket litet" },
				{ name: "litet litet" },
				{ name: "medelstort" },
				{ name: "stort" },
				{ name: "mycket stort" },
				{ name: (f, i) => `${i - 5} km stort` },
			]
		}
	},
	range: {
		cost: [
			(f, i) => (i <= 0 ? 0 : 2 + i * 2),
			(f, i) => (i <= 0 ? 0 : 2 + i * 2),
			(f, i) => (i <= 0 ? 0 : 2 + i * 2)
		],
		value: 0,
		entries: [
			{ name: "intill" },
			{ name: "kort" },
			{ name: "medellångt" },
			{ name: "långt" },
			{ name: "mycket långt" }
		]
	},
	duration: {
		cost: [
			(f, i) => (Math.ceil((Math.min(Math.max(0, i - 1), 2) * f) / 2) + (Math.max(0, (i - 2)) * 2)),
			(f, i) => (Math.ceil((Math.min(Math.max(0, i - 1), 2) * f) / 2) + (Math.max(0, (i - 2)) * 2)),
			(f, i) => ((Math.min(Math.max(0, i - 1), 2) * f) + (Math.max(0, (i - 2)) * 4))
		],
		value: 0,
		entries: [
			{ name: "momentan", locked: true },
			{ name: "koncentration" },
			{ name: "scen" },
			{ name: "1 dygn" },
			{ name: "3 dygn" },
			{ name: "1 vecka" },
			{ name: "2 veckor" },
			{ name: "1 månad" },
			{ name: "2 månader" },
			{ name: "4 månader" },
			{ name: "6 månader" },
			{ name: (f, i) => `${i - 10} år` },
		]
	},
	aspects: [
		"ataxotropi",
		"nomotropi",
		"kronotropi",
		"topotropi",
		"termotropi",
		"kryotropi",
		"fototropi",
		"skototropi",
		"pyrotropi",
		"pneumotropi",
		"hydrotropi",
		"geotropi",
		"heliotropi",
		"astrotropi",
		"selenotropi",
		"kosmotropi",
		"biotropi",
		"nekrotropi",
		"ikonotropi",
		"semotropi"
	],
	transformation: [
		[0,0,4,0,4,0,8,0,4,4,0,0,8,8,8,0,8,0,8,0],
		[0,0,0,4,0,4,0,8,0,0,4,4,0,8,8,8,0,8,0,8],
		[4,0,0,2,8,8,8,8,8,8,8,4,8,8,8,8,8,8,0,8],
		[0,4,2,0,8,8,8,8,8,4,8,8,8,8,8,8,8,8,8,0],
		[2,0,0,8,0,0,4,8,2,4,8,8,4,8,0,0,4,0,0,0],
		[0,2,8,0,0,0,8,4,0,8,4,2,0,0,8,4,0,4,0,0],
		[4,8,0,0,4,8,0,0,4,4,0,0,2,4,8,0,4,0,0,0],
		[8,4,0,0,8,4,0,0,0,0,4,4,0,8,4,2,0,4,0,0],
		[2,0,0,4,2,0,2,0,0,4,0,8,4,0,0,0,8,0,8,0],
		[4,0,0,2,4,8,4,8,4,0,8,0,0,0,0,8,8,8,0,0],
		[0,4,2,0,4,4,4,4,0,4,0,8,0,0,0,0,8,8,8,0],
		[0,2,4,0,8,4,8,4,8,0,8,0,0,0,0,0,8,8,0,8],
		[4,0,4,0,2,0,2,0,4,8,0,0,0,4,8,0,0,0,0,4],
		[4,4,8,8,4,8,4,8,8,0,0,8,2,0,4,4,0,0,4,0],
		[8,8,4,4,8,4,8,4,0,0,8,4,4,4,0,2,4,0,0,0],
		[0,4,0,4,0,2,0,2,0,0,0,0,0,4,4,0,0,8,0,0],
		[4,8,8,4,4,0,8,0,0,0,8,8,8,8,0,0,0,8,0,0],
		[8,4,4,8,0,4,0,4,0,0,8,8,0,0,8,8,4,0,0,0],
		[4,4,4,4,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,2],
		[4,4,4,4,8,8,8,8,8,8,8,8,8,8,8,8,8,8,2,0]
	]
}

export default constants;