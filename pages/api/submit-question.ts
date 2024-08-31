import sql from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data =
	| {
			incorrectFields: {
				field: string;
				correctValue: string;
			}[];
	  }
	| {
			error: string;
	  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { sessionId, answers } = JSON.parse(req.body);
	if (!sessionId || !answers) {
		return res
			.status(400)
			.json({ error: 'sessionId and answers are required' });
	}
	const [session] = await sql`
	SELECT id
	FROM sessions
	WHERE id = ${sessionId}`;
	if (!session) {
		return res.status(400).json({ error: 'Invalid session id' });
	}
	const [dbQuestion] = await sql`
	SELECT q.id as questionId, q.englishname, q.spanishname,
		t.id as tenseId, t.yo, t.tu, t.el, t.nosotros, t.vosotros, t.ellos, t.tense, t.mood, t.translation
		FROM questions q
		JOIN tenses t ON q.id = t.questionId
		WHERE q.id = (SELECT activeQuestionId FROM sessions WHERE id = ${sessionId})
		`;
	const incorrectFields = [];
	if (answers.yo !== dbQuestion.yo) {
		incorrectFields.push({ field: 'yo', correctValue: dbQuestion.yo });
	}
	if (answers.tu !== dbQuestion.tu) {
		incorrectFields.push({ field: 'tu', correctValue: dbQuestion.tu });
	}
	if (answers.el !== dbQuestion.el) {
		incorrectFields.push({ field: 'el', correctValue: dbQuestion.el });
	}
	if (answers.nosotros !== dbQuestion.nosotros) {
		incorrectFields.push({
			field: 'nosotros',
			correctValue: dbQuestion.nosotros,
		});
	}
	if (answers.vosotros !== dbQuestion.vosotros) {
		incorrectFields.push({
			field: 'vosotros',
			correctValue: dbQuestion.vosotros,
		});
	}
	if (answers.ellos !== dbQuestion.ellos) {
		incorrectFields.push({
			field: 'ellos',
			correctValue: dbQuestion.ellos,
		});
	}
	if (incorrectFields.length === 0) {
		await sql`
	UPDATE sessions
	SET activeQuestionId = NULL
	WHERE id = ${sessionId}`;
	}
	console.log(incorrectFields, dbQuestion);

	await sql`
	INSERT INTO sessionlogs (sessionId, questionId, incorrectData, type)
	VALUES (${sessionId}, ${dbQuestion.questionid}, ${incorrectFields}, 'questionSubmit')`;
	console.log(incorrectFields);
	res.status(200).json({
		incorrectFields,
	});
}
