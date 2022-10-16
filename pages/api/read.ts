import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const functionId = process.env.FUNCTION_ID;
  const url = `https://api.exm.dev/read/${functionId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const returnData = await response.json();

    res.status(200).json({
      data: returnData,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
