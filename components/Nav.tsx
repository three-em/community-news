import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import useArconnect from 'use-arconnect';
import { useGetUser } from '../reducers/userContext';
import { useGetAllData } from '../hooks/useGetAllData';
import styled from 'styled-components';
import { PermissionType } from 'arconnect';

enum NavItemsProps {
  NEW = 'new',
  THREADS = 'threads',
  COMMENTS = 'comments',
  SUBMIT = 'submit',
}

const NavWrapper = styled.nav`
  background: #662eff;
  display: flex;
  padding: 0.7rem;
  justify-content: space-between;
`;

const NavItems = styled.div`
  > a {
    color: #000;
    font-size: 1.1rem;
    font-weight: 800;
    text-decoration: none;
  }

  > ul {
    list-style: none;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    margin: 0;
    margin-top: 0.4rem;
    padding: 0;

    li {
      a {
        color: #000;
        font-size: 15px;
        text-decoration: none;
      }
    }
  }
`;

const NavConnect = styled.div`
  p {
    margin: 0;
    font-size: 15px;
    font-weight: 550;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.35rem;
    border-radius: 1px;
  }
`;

const Nav = () => {
  const arconnect = useArconnect(),
    { user: currentUser, dispatch } = useGetUser(),
    { users } = useGetAllData(),
    navItems = Object.values(NavItemsProps);

  const handleConnect = async () => {
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'],
      {
        name: 'CommunityLabs News',
      }
    );
    const address = await window.arweaveWallet.getActiveAddress();
    const user = users.find((user) => user.walletAddress === address);

    if (user) {
      const { userName, walletAddress } = user;
      dispatch({
        type: 'updateUser',
        userName,
        walletAddress,
      });
    } else {
      Router.push('/connect');
    }
  };

  const signOut = async () => {
    await window.arweaveWallet.disconnect();
    dispatch({
      type: 'updateUser',
      userName: '',
      walletAddress: '',
    });
  };

  return (
    <NavWrapper>
      <NavItems>
        <Link href='/'>Community News</Link>
        <ul>
          {navItems.map((item: string, index) => (
            <>
              <li key={index}>
                <Link href={`/${item}`}>{item}</Link>
              </li>
              <span>|</span>
            </>
          ))}
        </ul>
      </NavItems>

      <NavConnect>
        {currentUser.userName ? <p>{currentUser.userName}</p> : null}

        {arconnect === undefined ? (
          <button onClick={() => window.open('https://arconnect.io')}>
            install arConnect
          </button>
        ) : currentUser.userName && currentUser.walletAddress ? (
          <button onClick={signOut}>disconnect</button>
        ) : (
          <button onClick={handleConnect}>connect</button>
        )}
      </NavConnect>
    </NavWrapper>
  );
};

export default Nav;
