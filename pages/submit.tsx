import Router from 'next/router';
import { v4 as uuid } from 'uuid';
import React, { useState } from 'react';
import { useGetAllData } from '../hooks/useGetAllData';
import { useGettUser } from '../hooks/useGettUser';
import * as Styled from '../styles/submit';
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
    { users } = useGetAllData(),
    [formData, setFormData] = useState(initialState),
    { currentUser } = useGettUser(),
    { userName, walletAddress } = useGettUser().currentUser;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      event?.preventDefault();
      if (userName && walletAddress) {
        await fetch('/api/write-exm', {
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
      localStorage.setItem('user', JSON.stringify({ userName, walletAddress }));
      location.reload();
    } else {
      Router.push('/connect');
    }
  };

  return (
    <Styled.Container>
      <br />
      {currentUser.userName && currentUser.walletAddress ? (
        <form action='' onSubmit={handleSubmit}>
          <Styled.FormItem>
            <label htmlFor='title'>title</label>
            <input
              type='text'
              name='title'
              onChange={handleChange}
              value={formData.title}
            />
          </Styled.FormItem>

          <Styled.FormItem>
            <label htmlFor='url'>link</label>
            <input
              type='text'
              name='url'
              value={formData.url}
              onChange={handleChange}
            />
          </Styled.FormItem>

          <Styled.FormItem>
            <label htmlFor='description'>text</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormData({
                  ...formData,
                  description: e.target.value,
                });
              }}
            />
          </Styled.FormItem>
          <Styled.SubmitButton>Sumbit</Styled.SubmitButton>

          <p>
            Leave url blank to submit a question for discussion. If there is no
            url, text will appear at the top of the thread. If there is a url,
            text is optional.
          </p>
        </form>
      ) : (
        <>
          <p>Connect wallet to submit post</p>
          <button onClick={handleConnect}>Connect</button>
        </>
      )}
    </Styled.Container>
  );
};

export default Submit;
