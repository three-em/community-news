import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import useArconnect from 'use-arconnect';
import Router, { useRouter } from 'next/router';
import { useGettUser } from '../hooks/useGetUser';
import { PermissionType } from 'arconnect';
import { UserProps } from '../types';
import styled from 'styled-components';
import { useGetAllData } from '../hooks/useGetAllData';

interface ContainerProps {
  path: string;
}

enum NavItemsProps {
  NEW = 'new',
  PAST = 'past',
  COMMENTS = 'threads',
  ASK = 'ask',
  SUBMIT = 'submit',
}

const NavWrapper = styled.nav`
  background-color: #662eff;

  @media (min-width: 1100px) {
    width: 80%;
    margin: auto;
    margin-top: 1rem;
  }
`;

const NavContainer = styled.div<ContainerProps>`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: ${(props) =>
    props.path === '/submit' ? 'flex-start' : 'space-between'};
  padding: 0.2rem;

  > a {
    color: #fff;
    font-size: 1.2rem;
    font-weight: 800;
    text-decoration: none;
    font-family: Monoton, Courier;
  }

  @media (min-width: 1100px) {
    flex-direction: row;
  }
`;

const SubmitNav = styled.div`
  p {
    font-size: 1.2rem;
    color: #fff;
    font-weight: 800;
    margin: 0;
    margin-top: 0.5rem;
    padding-left: 0.5rem;
  }

  @media (min-width: 1100px) {
    p {
      font-size: 1.35rem;
      margin-top: 0;
    }
  }
`;

const NavItems = styled.div`
  color: #fff;

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
        font-size: 1.05rem;
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
  justify-self: flex-end;
  margin-top: 1rem;

  a {
    font-size: 14px;
    color: #fff;
  }

  @media (min-width: 760px) {
    margin: 0;
    display: flex;
    margin-top: 1rem;
    align-items: center;
    justify-content: center;

    a {
      margin-left: 0.5rem;
      cursor: pointer;
    }
  }

  @media (min-width: 1100px) {
    margin-top: 0;
  }
`;

const NavUsername = styled.a`
  margin: 0;
  color: #fff;
  font-size: 15px;
  font-weight: 550;
  cursor: pointer;
  text-decoration: none;
`;

const Nav = () => {
  const router = useRouter(),
    arconnect = useArconnect(),
    [isNotConnected, setIsNotConnected] = useState(false),
    [connecting, setConnecting] = useState(false),
    { currentUser } = useGettUser(),
    navItems = Object.values(NavItemsProps),
    { users } = useGetAllData();

  const handleConnect = async () => {
    setConnecting(true);
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
      setConnecting(false);
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

  useEffect(() => {
    setIsNotConnected(!currentUser.userName && !currentUser.walletAddress);
  });

  return (
    <>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Monoton&family=Poppins:wght@600&display=swap'
          rel='stylesheet'
        />
      </Head>
      <NavWrapper>
        <NavContainer path={router.pathname}>
          <Link href='/'>Community News</Link>
          {router.pathname === '/submit' ? (
            <SubmitNav>
              <p>/Submit</p>
            </SubmitNav>
          ) : router.pathname === '/reply' ? (
            <SubmitNav>
              <p>/ Reply</p>
            </SubmitNav>
          ) : (
            <>
              <NavItems>
                <ul>
                  {navItems.map((item: string, index) => (
                    <div key={index}>
                      <li>
                        <Link href={`/${item}`}>{item}</Link>
                        <span>|</span>
                      </li>
                    </div>
                  ))}
                </ul>
              </NavItems>
              <NavConnect>
                {isNotConnected ? null : (
                  <>
                    <NavUsername href={`/user/${currentUser.userName}`}>
                      {currentUser.userName}
                    </NavUsername>
                  </>
                )}

                {arconnect === undefined ? (
                  <a onClick={() => window.open('https://arconnect.io')}>
                    install arConnect
                  </a>
                ) : isNotConnected ? (
                  <a onClick={handleConnect}>
                    {connecting ? 'connecting' : 'connect'}
                  </a>
                ) : (
                  <a onClick={signOut}>| signout</a>
                )}
              </NavConnect>
            </>
          )}
        </NavContainer>
      </NavWrapper>
    </>
  );
};

export default Nav;
