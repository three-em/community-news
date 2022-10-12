import Router from 'next/router';
import * as Styled from '../styles/connect';
import React, { useState, useEffect } from 'react';
import { UserProps } from '../types';
import { useGettUser } from '../hooks/useGettUser';
import { fetchData } from '../utils/getData';

export async function getServerSideProps() {
  const { users } = await fetchData();

  return {
    props: {
      users,
    },
  };
}

const Connect = ({ users }: { users: UserProps[] }) => {
  const [userExists, setUserExists] = useState(false),
    [userName, setUserName] = useState(''),
    [userNames, setUserNames] = useState<string[]>([]),
    { currentUser } = useGettUser();

  useEffect(() => {
    (async () => {
      try {
        const allUserNames = users.map((user: UserProps) => user.userName);
        setUserNames(allUserNames);
        const doesUserExist = users.some(
          (user) => user.walletAddress === currentUser.walletAddress
        );
        setUserExists(doesUserExist);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [users, currentUser.walletAddress]);

  const validateUserNameLength = () => userName.length > 3;
  const validateUserNameFormat = () => /^[a-z0-9_]+$/i.test(userName);
  const validateUsername = () => !userName || userNames.includes(userName);

  const formValidation = () => {
    if (validateUsername()) {
      return 'username not available';
    } else if (!validateUserNameFormat()) {
      return 'wrong format. use digits, numbers or underscore';
    } else if (!validateUserNameLength()) {
      return 'username must have atleast 4 characters';
    } else {
      return 'username available';
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const postUser = async () => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        await fetch('/api/write-exm', {
          method: 'POST',
          body: JSON.stringify({
            input: {
              functionRole: 'addUser',
              walletAddress: address,
              userName: userName.toLowerCase(),
              upvotedPosts: [],
              favorites: [],
              bio: '',
            },
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        localStorage.setItem(
          'user',
          JSON.stringify({ userName, walletAddress: address })
        );
      } catch (error) {
        console.error(error);
      }
    };

    if (!currentUser.userName && !currentUser.walletAddress) {
      await postUser();
      Router.push('/');
    }
  };

  return (
    <>
      {userName.length === 0 ? null : <p>{formValidation()}</p>}
      {currentUser.userName && currentUser.walletAddress ? (
        <Styled.ConnectHeader>
          your arconnect wallet is already connected to community news
        </Styled.ConnectHeader>
      ) : (
        <form action='' onSubmit={handleSubmit}>
          <label>
            username:
            <input
              value={userName}
              onChange={handleChange}
              style={{
                border: `${
                  userNames.includes(userName) ||
                  (userName.length > 0 && !validateUserNameLength())
                    ? '1.5px solid red'
                    : '1.5px solid gray'
                }`,
                outline: 'none',
              }}
            />
          </label>

          <button disabled={validateUsername()}>Connect</button>
        </form>
      )}
    </>
  );
};

export default Connect;
