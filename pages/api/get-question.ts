import type { NextApiRequest, NextApiResponse } from 'next';
import { Question, Session } from '@/lib/types';
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
	const { sessionId } = JSON.parse(req.body);
	if (!sessionId) {
		return res.status(400).json({ error: 'sessionId is required' });
	}
	const [dbSession] = await sql<[Session]>`
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
	// todo: check that the user has not seen the question
	const [dbQuestion] =
		await sql`SELECT q.id as questionId, q.englishname, q.spanishname,
		t.id as tenseId, t.yo, t.tu, t.el, t.nosotros, t.vosotros, t.ellos, t.tense, t.mood, t.translation
		FROM questions q
		JOIN tenses t ON q.id = t.questionId
		WHERE ARRAY['${sql.unsafe(dbSession.tenses.join("', '"))}'] @> ARRAY[t.tense]
		ORDER BY RANDOM() LIMIT 1`;
	if (!dbQuestion) {
		return res.status(500).json({ error: 'Failed to get question' });
	}
	const question: Question = {
		id: dbQuestion.id,
		englishName: dbQuestion.englishName,
		spanishName: dbQuestion.spanishName,
		tenseData: {
			[dbQuestion.tense]: {
				id: dbQuestion.tenseId,
				translation: dbQuestion.translation,
				mood: dbQuestion.mood,
				tense: dbQuestion.tense,
				yo: dbQuestion.yo,
				tu: dbQuestion.tu,
				el: dbQuestion.el,
				nosotros: dbQuestion.nosotros,
				vosotros: dbQuestion.vosotros,
				ellos: dbQuestion.ellos,
			},
		},
	};
	res.status(200).json({ question });
}
