import React from 'react';
import useArconnect from 'use-arconnect';
import Link from 'next/link';
import Router from 'next/router';
import useGetUser from '../hooks/useGetUser';

const Nav = () => {
  const arconnect = useArconnect(),
    { currentUser } = useGetUser();

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

        {arconnect === undefined ? (
          <button onClick={() => window.open('https://arconnect.io')}>
            Install ArConnect
          </button>
        ) : currentUser.userName && currentUser.walletAddress ? null : (
          <button onClick={() => Router.push('/connect')}>Connect</button>
        )}
      </div>
    </>
  );
};

export default Nav;
