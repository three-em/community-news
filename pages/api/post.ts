import { Exm } from '@execution-machine/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const exm = new Exm({ token: `${process.env.EXM_TOKEN}` });
    const functionID: string = `${process.env.FUNCTION_ID}`;

    const input = {
      function: 'createPost',
      title: 'Adobe buys Figma',
      url: 'https://adobebuysfigma.com',
      description: 'This is certainly unreal',
      upvotes: '0',
    };

    const writeExm = await exm.functions.write(functionID, input);
    res.status(2002).json({
      messgae: 'success',
      data: writeExm,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'ERROR', error });
  }
}
