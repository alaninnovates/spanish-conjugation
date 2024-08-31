import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '@/lib/db';

type Data =
	| {
			sessionId: number;
	  }
	| {
			error: string;
	  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { length, tenses } = JSON.parse(req.body);
	if (!length || !tenses) {
		return res
			.status(400)
			.json({ error: 'length and tenses are required' });
	}
	const [session] = await sql<[{ id: number }]>`
		INSERT INTO sessions (length, tenses)
		VALUES (${length}, ${tenses})
		RETURNING id
	`;
	await sql`
		INSERT INTO sessionLogs (sessionId, type)
		VALUES (${session.id}, 'sessionStart')`;
	res.status(200).json({ sessionId: session.id });
}
