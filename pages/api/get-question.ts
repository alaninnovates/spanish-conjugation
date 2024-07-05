import type { NextApiRequest, NextApiResponse } from 'next';
import { Question, Tense } from '@/lib/types';
import sql from '@/lib/db';

type Data =
	| {
			question: Question;
	  }
	| {
			sessionCompleted: boolean;
	  }
	| {
			error: string;
	  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	const { sessionId } = req.body;
	if (!sessionId) {
		return res.status(400).json({ error: 'sessionId is required' });
	}
	const [dbSession] = await sql`
		SELECT * FROM sessions WHERE id = ${sessionId}
	`;
	if (!dbSession) {
		return res.status(404).json({ error: 'Session not found' });
	}
	if (
		new Date(dbSession.startedAt).getTime() + dbSession.length * 1000 <
		Date.now()
	) {
		await sql`
			UPDATE sessions
			SET endedAt = CURRENT_TIMESTAMP
			WHERE id = ${sessionId}
		`;
		return res.status(200).json({ sessionCompleted: true });
	}
	const [dbQuestion] = await sql`
		SELECT * FROM questions ORDER BY RANDOM() LIMIT 1
		JOIN tenses ON questions.id = tenses.questionId
		`;
	if (!dbQuestion) {
		return res.status(500).json({ error: 'Failed to get question' });
	}
	const question: Question = {
		id: dbQuestion.id,
		englishName: dbQuestion.englishName,
		spanishName: dbQuestion.spanishName,
		tenseData: {},
	};
	const randomTense =
		dbSession.tenses[Math.floor(Math.random() * dbSession.tenses.length)];
	question.tenseData[randomTense] = dbQuestion.tenses.find(
		(tense: Tense) => tense.tense === randomTense
	);
	res.status(200).json({ question });
}
