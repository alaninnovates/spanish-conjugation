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

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { data } = req.body;
	if (!data) {
		return res.status(400).json({ error: 'data is required' });
	}
	res.status(200).json({
		incorrectFields: [
			{
				field: 'present',
				correctValue: 'hablo',
			},
		],
	});
}
