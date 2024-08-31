import type { NextApiRequest, NextApiResponse } from 'next';
import { Question, Session } from '@/lib/types';
import sql from '@/lib/db';

type Data =
	| {}
	| {
			error: string;
	  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { sessionId } = JSON.parse(req.body);
	if (!sessionId) {
		return res.status(400).json({ error: 'sessionId is required' });
	}
	const dbSession = await sql`
		SELECT * FROM sessions s 
JOIN sessionlogs sl ON s.id = sl.sessionId
WHERE s.id = ${sessionId}
	`;
	if (!dbSession) {
		return res.status(404).json({ error: 'Session not found' });
	}
	console.log(dbSession);
	const session: Session = {
		id: dbSession[0].id,
		activeQuestionId: dbSession[0].activequestionid,
		startedAt: dbSession[0].startedat,
		endedAt: dbSession[0].endedat,
		length: dbSession[0].length,
		tenses: dbSession[0].tenses,
	};
	const sessionLogs = dbSession.map((log) => ({
		id: log.id,
		sessionId: log.sessionid,
		type: log.type,
		questionId: log.questionid,
		incorrectData: log.incorrectdata,
		createdAt: log.createdat,
	}));
	console.log(session, sessionLogs);
	return res.status(200).json({ session, sessionLogs });
}
