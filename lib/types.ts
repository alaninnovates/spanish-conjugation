export interface Question {
	id: number;
	englishName: string;
	spanishName: string;
	tenseData: {
		[key: string]: Tense;
	};
}

export interface Tense {
	yo: string;
	tu: string;
	el: string;
	nosotros: string;
	vosotros: string;
	ellos: string;
}
