import React from 'react';
import Link from 'next/link';
import useArconnect from 'use-arconnect';
import Router, { useRouter } from 'next/router';
import { useGettUser } from '../hooks/useGetUser';
import { PermissionType } from 'arconnect';
import { UserProps } from '../types';
import styled from 'styled-components';
import { useGetAllData } from '../hooks/useGetAllData';
import { fetchData } from '../utils/getData';

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
`;

const SubmitNav = styled.div`
  p {
    font-size: 1rem;
    color: #fff;
    font-weight: 800;
    margin: 0;
    padding-left: 0.1rem;
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
  justify-self: flex-end;
  a {
    font-size: 14px;
    color: #fff;
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
  color: #fff;
  font-size: 15px;
  font-weight: 550;
  cursor: pointer;
  text-decoration: none;
`;

export async function getServerSideProps() {
  const { users } = await fetchData();

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
      <NavContainer path={router.pathname}>
        <Link href='/'>Community News</Link>
        {router.pathname === '/submit' ? (
          <SubmitNav>
            <p>/ Submit</p>
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
      </NavContainer>
    </NavWrapper>
  );
};

export default Nav;
