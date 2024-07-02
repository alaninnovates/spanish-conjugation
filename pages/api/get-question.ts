import type { NextApiRequest, NextApiResponse } from 'next';
import { Question } from '@/lib/types';

type Data =
	| {
			question: Question;
	  }
	| {
			error: string;
	  };

export default function handler(
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
	res.status(200).json({
		question: {
			id: 1,
			englishName: 'To speak',
			spanishName: 'hablar',
			tenseData: {
				present: {
					yo: 'hablo',
					tu: 'hablas',
					el: 'habla',
					nosotros: 'hablamos',
					vosotros: 'habláis',
					ellos: 'hablan',
				},
			},
		},
	});
}
