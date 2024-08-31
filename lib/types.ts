export interface Question {
	id: number;
	englishName: string;
	spanishName: string;
	tenseData: {
		[key: string]: Tense;
	};
}

export type MoodOptions =
	| 'Indicativo'
	| 'Subjuntivo'
	| 'Imperativo Affirmativo'
	| 'Imperativo Negativo';
export type TenseOptions =
	| 'Presente'
	| 'Pretérito'
	| 'Imperfecto'
	| 'Futuro'
	| 'Condicional'
	| 'Presente Perfecto'
	| 'Futuro Perfecto'
	| 'Pluscamperfecto'
	| 'Condicional perfecto';

export const moods: MoodOptions[] = [
	'Indicativo',
	'Subjuntivo',
	'Imperativo Affirmativo',
	'Imperativo Negativo',
];

export const tenses: TenseOptions[] = [
	'Presente',
	'Pretérito',
	'Imperfecto',
	'Futuro',
	'Condicional',
	'Presente Perfecto',
	'Futuro Perfecto',
	'Pluscamperfecto',
	'Condicional perfecto',
];

export interface Tense {
	id: number;
	translation: string;
	mood: MoodOptions;
	tense: TenseOptions;
	yo: string;
	tu: string;
	el: string;
	nosotros: string;
	vosotros: string;
	ellos: string;
}

export interface Session {
	id: number;
	activeQuestionId: number;
	startedAt: string;
	endedAt: string;
	length: number;
	tenses: string[];
}

export interface SessionLog {
	id: number;
	sessionId: string;
	questionId: number;
	timeSpent: number;
	incorrectData: {
		[key: string]: string;
	};
}

/*
CREATE TABLE IF NOT EXISTS questions (
	id SERIAL PRIMARY KEY,
	englishName TEXT NOT NULL,
	spanishName TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tenses (
	id SERIAL PRIMARY KEY,
	questionId INTEGER REFERENCES questions(id),
	yo TEXT NOT NULL,
	tu TEXT NOT NULL,
	el TEXT NOT NULL,
	nosotros TEXT NOT NULL,
	vosotros TEXT NOT NULL,
	ellos TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
	id SERIAL PRIMARY KEY,
	startedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	endedAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessionLogs (
	id SERIAL PRIMARY KEY,
	sessionId INTEGER REFERENCES sessions(id),
	questionId INTEGER REFERENCES questions(id),
	timeSpent INTEGER NOT NULL,
	incorrectData JSONB
);

ALTER TABLE tenses ADD COLUMN tense TEXT;

ALTER TABLE sessions ADD COLUMN length INTEGER;
ALTER TABLE sessions ADD COLUMN tenses TEXT[];

ALTER TABLE tenses ADD COLUMN mood TEXT;
ALTER TABLE tenses ADD COLUMN translation TEXT;

ALTER TABLE sessions ADD COLUMN activeQuestionId INTEGER REFERENCES questions(id);

ALTER TABLE sessionLogs DROP COLUMN timeSpent;
ALTER TABLE sessionLogs ADD COLUMN createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
*/
