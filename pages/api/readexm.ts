import { Exm } from '@execution-machine/sdk';
import type, { NextApiRequest, NextApiResponse } from 'next';

const exm = new Exm({ token: `${process.env.EXM_TOKEN}` }),
  functionID = `${process.env.FUNCTION_ID}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allPosts = await exm.functions.read(functionID);
    res.status(200).json({ data: allPosts });
  } catch (error) {
    res.json({ error });
  }
}
