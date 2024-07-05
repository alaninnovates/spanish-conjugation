import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '@/lib/db';

type Data =
	| {
			sessionId: string;
	  }
	| {
			error: string;
	  };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { length, tenses } = req.body;
	if (!length || !tenses) {
		return res
			.status(400)
			.json({ error: 'length and tenses are required' });
	}
	const sessionId = Math.random().toString(36).substring(2, 8);
	await sql`
		INSERT INTO sessions (id, length, tenses)
		VALUES (${sessionId}, ${length}, ${tenses})
	`;
	res.status(200).json({ sessionId });
}
