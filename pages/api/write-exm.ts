import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const functionId = process.env.FUNCTION_ID;
  const url = `https://api.exm.dev/api/transactions?token=${process.env.EXM_TOKEN}`;

  try {
    const { data } = JSON.parse(req.body);

    const body = {
      functionId,
      inputs: [
        {
          input: JSON.stringify(data),
          tags: [],
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
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
