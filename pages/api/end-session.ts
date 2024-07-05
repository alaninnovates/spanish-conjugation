import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	error: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {}
