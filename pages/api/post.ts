import { Exm } from '@execution-machine/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const functionID = `${process.env.FUNCTION_ID}`,
      exm = new Exm({
        token: `${process.env.EXM_TOKEN}`,
      });

    const { input } = req.body;
    const writeExm = await exm.functions.write(functionID, input);

    res.status(200).json({
      data: writeExm,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
}
