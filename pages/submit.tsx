import { v4 as uuid } from 'uuid';
import React, { useState } from 'react';
import Router from 'next/router';
import { useGetAllData } from '../hooks/useGetAllData';
import { useGetUser } from '../reducers/userContext';
import short from 'short-uuid';

interface StateProps {
  title: string;
  url: string;
  description: string;
}

const Submit = () => {
  const initialState: StateProps = {
      title: '',
      url: '',
      description: '',
    },
    [formData, setFormData] = useState(initialState),
    { users } = useGetAllData(),
    { user: currentUser, dispatch } = useGetUser();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      event?.preventDefault();
      if (currentUser.userName && currentUser.walletAddress) {
        const { userName } = currentUser;
        await fetch('/api/addPost', {
          method: 'POST',
          body: JSON.stringify({
            input: {
              functionRole: 'createPost',
              postID: uuid(),
              author: {
                userName,
              },
              timeCreated: new Date().getTime(),
              title: formData.title,
              url: new URL(formData.url),
              description: formData.description,
              upvotes: 0,
            },
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
        setFormData({
          ...formData,
          title: '',
          url: '',
          description: '',
        });
        Router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleConnect = async () => {
    await window.arweaveWallet.connect(
      ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION'],
      {
        name: 'CommunityLabs News',
      }
    );
    const address = await window.arweaveWallet.getActiveAddress();

    const findUser = users.find((user) => user.walletAddress === address);
    if (findUser) {
      const { userName, walletAddress } = findUser;
      dispatch({
        type: 'updateUser',
        userName,
        walletAddress,
      });
    } else {
      Router.push('/connect');
    }
  };

  return (
    <main>
      <br />

      {currentUser.userName && currentUser.walletAddress ? (
        <form action='' onSubmit={handleSubmit}>
          <label htmlFor='title'>title</label>
          <input
            type='text'
            name='title'
            onChange={handleChange}
            value={formData.title}
          />
          <br />
          <label htmlFor='url'>url</label>
          <input
            type='text'
            name='url'
            value={formData.url}
            onChange={handleChange}
          />
          <br />
          <label htmlFor='description'>description</label>
          <textarea
            name='description'
            cols={35}
            rows={8}
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setFormData({
                ...formData,
                description: e.target.value,
              });
            }}
          />
          <br />
          <button>Sumbit</button>
        </form>
      ) : (
        <>
          <p>Connect wallet to submit post</p>
          <button onClick={handleConnect}>Connect</button>
        </>
      )}
    </main>
  );
};

export default Submit;

// TODO - VALIDATE URL
// TODO - USE SHORT-UUID
