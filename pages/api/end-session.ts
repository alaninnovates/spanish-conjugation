import sql from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
type Data =
	| {
			ok: boolean;
	  }
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
	const [session] = await sql`
	SELECT id
	FROM sessions
	WHERE id = ${sessionId}`;
	if (!session) {
		return res.status(400).json({ error: 'Invalid session id' });
	}
	await sql`
	UPDATE sessions
	SET endedAt = CURRENT_TIMESTAMP
	WHERE id = ${sessionId}`;
	await sql`
	INSERT INTO sessionLogs (sessionId, type)
	VALUES (${sessionId}, 'sessionEndEarly')`;
	res.status(200).json({ ok: true });
}
