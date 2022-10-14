import React from 'react';
import Link from 'next/link';
import useArconnect from 'use-arconnect';
import Router, { useRouter } from 'next/router';
import { useGettUser } from '../hooks/useGetUser';
import { PermissionType } from 'arconnect';
import { UserProps } from '../types';
import styled from 'styled-components';
import { useGetAllData } from '../hooks/useGetAllData';

enum NavItemsProps {
  NEW = 'new',
  PAST = 'past',
  COMMENTS = 'comments',
  ASK = 'ask',
  SUBMIT = 'submit',
}

const NavWrapper = styled.nav`
  background-color: #662eff;
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;

  @media (min-width: 1100px) {
    width: 80%;
    margin: auto;
    margin-top: 1rem;
  }
`;

const SubmitNav = styled.div`
  display: flex;
  gap: 1rem;

  .cnews {
    cursor: pointer;
  }

  p {
    font-weight: 800;
    margin: 0;
  }
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
        font-size: 13px;
        text-decoration: none;
      }
    }
  }

  @media (min-width: 760px) {
    margin: 0;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
`;

const NavConnect = styled.div`
  a {
    font-size: 14px;
  }

  @media (min-width: 760px) {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    a {
      margin-left: 0.5rem;
      cursor: pointer;
    }
  }
`;

const NavUsername = styled.a`
  margin: 0;
  color: #000;
  font-size: 15px;
  font-weight: 550;
  cursor: pointer;
  text-decoration: none;
`;

export async function getServerSideProps() {
  const url = `https://api.exm.dev/read/${process.env.TEST_FUNCTION_ID}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accepts: 'application/json',
    },
  });
  const data = await res.json();
  const { users } = data;

  return {
    props: {
      users,
    },
  };
}

const Nav = () => {
  const router = useRouter(),
    arconnect = useArconnect(),
    { currentUser } = useGettUser(),
    navItems = Object.values(NavItemsProps),
    { users } = useGetAllData();

  const handleConnect = async () => {
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'],
      {
        name: 'CommunityLabs News',
      }
    );

    const address = await window.arweaveWallet.getActiveAddress();
    const user = users.find(
      (user: UserProps) => user.walletAddress === address
    );

    if (user) {
      const { userName, walletAddress } = user;
      localStorage.setItem('user', JSON.stringify({ userName, walletAddress }));
      location.reload();
    } else {
      Router.push('/connect');
    }
  };

  const signOut = async () => {
    await window.arweaveWallet.disconnect();
    localStorage.setItem(
      'user',
      JSON.stringify({ userName: '', walletAddress: '' })
    );
    location.reload();
    Router.push('/');
  };

  return (
    <NavWrapper>
      {router.pathname === '/submit' ? (
        <SubmitNav>
          <p onClick={() => Router.push('/')} className='cnews'>
            Community News /
          </p>
          <p>Submit</p>
        </SubmitNav>
      ) : (
        <>
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
            {currentUser.userName && currentUser.walletAddress ? (
              <>
                <NavUsername href={`/user/${currentUser.userName}`}>
                  {currentUser.userName}
                </NavUsername>
              </>
            ) : null}

            {arconnect === undefined ? (
              <a onClick={() => window.open('https://arconnect.io')}>
                install arConnect
              </a>
            ) : currentUser.userName && currentUser.walletAddress ? (
              <a onClick={signOut}>| signout</a>
            ) : (
              <a onClick={handleConnect}>connect</a>
            )}
          </NavConnect>
        </>
      )}
    </NavWrapper>
  );
};

export default Nav;
