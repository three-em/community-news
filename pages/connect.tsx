import { PermissionType } from 'arconnect';
import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import useGetUser from '../hooks/useGetUser';

const Connect = () => {
  const [userName, setUserName] = useState(''),
    [allUserNames, setAllUserNames] = useState<string[]>([]),
    { currentUser } = useGetUser();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch('/api/getAllPosts');
        const getPosts = await response.json();
        const { users } = getPosts.data;

        users.map((user: { walletAddress: string; userName: string }) => {
          setAllUserNames(() => [...allUserNames, user.userName]);
        });
      } catch (error) {
        console.error(error);
      }
    };

    getAllUsers();
  });

  const validateUserNameFormat = () => /^[a-z0-9_]+$/i.test(userName);
  const validateUserNameLength = () => userName.length > 3;
  const validateUsername = () => !userName || allUserNames.includes(userName);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  };

  const login = async () => {
    try {
      const arConnectPermissions: PermissionType[] = [
        'ACCESS_ADDRESS',
        'ACCESS_ALL_ADDRESSES',
        'SIGN_TRANSACTION',
      ];
      await window.arweaveWallet.connect(arConnectPermissions, {
        name: 'CommunityLabs News',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const connectWallet = async () => {
      try {
        await login();
      } catch (error) {
        console.error(error);
      }
    };

    const postUser = async () => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        await fetch('/api/connect', {
          method: 'POST',
          body: JSON.stringify({
            input: {
              functionRole: 'addUser',
              walletAddress: address,
              userName: userName.toLowerCase(),
            },
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    // todo - do not post new user if walletAddress already exists 🤦‍♂️

    if (!currentUser.userName && !currentUser.walletAddress) {
      await connectWallet();
      await postUser();
      Router.push('/');
    }
  };

  return (
    <>
      <h1>Connect your ArConnect Wallet</h1>

      {userName.length === 0 ? null : validateUsername() ? (
        <p>username not available</p>
      ) : !validateUserNameFormat() ? (
        <p>wrong format. use digits, numbers or underscore</p>
      ) : !validateUserNameLength() ? (
        <p>Username must have atleast 4 character</p>
      ) : (
        <p>username available</p>
      )}

      {currentUser.userName && currentUser.walletAddress ? (
        <h4>your Arconnect wallet is already connected to Community News</h4>
      ) : (
        <form action='' onSubmit={handleSubmit}>
          <label>
            username:
            <input
              value={userName}
              onChange={handleChange}
              style={{
                border: `${
                  allUserNames.includes(userName) ||
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
