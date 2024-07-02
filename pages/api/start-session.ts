import type { NextApiRequest, NextApiResponse } from 'next';
import sql from '@/lib/db';

type Data = {
	sessionId: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const sessionId = Math.random().toString(36).substring(2, 8);
	await sql`INSERT INTO sessions (id) VALUES (${sessionId})`;
	res.status(200).json({ sessionId });
}
