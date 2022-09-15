import { Exm, ContractType } from '@execution-machine/sdk';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

const exm = new Exm({ token: `${process.env.EXM_TOKEN}` });
const contractSource = readFileSync('exm/contract.js');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const deploymentResponse = await exm.functions.deploy(
      contractSource,
      { posts: [] },
      ContractType.JS
    );

    res.status(200).json({ message: 'success', data: deploymentResponse });
  } catch (error) {
    res.status(400).json({ error });
  }
}
