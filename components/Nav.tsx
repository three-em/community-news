import React from 'react';
import useArconnect from 'use-arconnect';
import Link from 'next/link';
import { PermissionType } from 'arconnect';

const Nav = () => {
  const arconnect = useArconnect();

  const arConnectPermissions: PermissionType[] = [
    'ACCESS_ADDRESS',
    'ACCESS_ALL_ADDRESSES',
    'SIGN_TRANSACTION',
  ];

  async function login() {
    await window.arweaveWallet.connect(arConnectPermissions, {
      name: 'CommunityLabs News',
    });
  }

  return (
    <>
      <ul>
        <li>
          <Link href='/new'>new</Link>
        </li>
        <li>
          <Link href='/threads'>threads</Link>
        </li>
        <li>
          <Link href='/comments'>comments</Link>
        </li>
        <li>
          <Link href='/submit'>submit</Link>
        </li>
      </ul>

      <div>
        <h3>codingknite</h3>
        {(arconnect && <button onClick={login}>Connect</button>) || (
          <button onClick={() => window.open('https://arconnect.io')}>
            Install ArConnect
          </button>
        )}
      </div>
    </>
  );
};

export default Nav;
