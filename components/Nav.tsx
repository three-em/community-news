import React from 'react';
import useArconnect from 'use-arconnect';
import Link from 'next/link';
import Router from 'next/router';
import useGetUser from '../hooks/useGetUser';
import useWalletAddress from '../hooks/useWalletAddress';

const Nav = () => {
  const arconnect = useArconnect(),
    currentUser = useGetUser();

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
        {currentUser.userName ? (
          <p style={{ marginLeft: '1rem' }}>{currentUser.userName}</p>
        ) : null}

        {currentUser && arconnect && !currentUser.walletAddress ? (
          <button onClick={() => Router.push('/connect')}>Connect</button>
        ) : currentUser && currentUser.walletAddress ? null : (
          <button onClick={() => window.open('https://arconnect.io')}>
            Install ArConnect
          </button>
        )}
      </div>
    </>
  );
};

export default Nav;
