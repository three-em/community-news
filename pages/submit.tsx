import Head from 'next/head';
import Router from 'next/router';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useGettUser } from '../hooks/useGetUser';
import { UserProps } from '../types';
import { fetchData } from '../utils/getData';
import { isValidUrl } from '../utils/helpers';
import * as Styled from '../styles/submit';
interface StateProps {
  title: string;
  url: string;
  description: string;
}

export async function getServerSideProps() {
  const { users } = await fetchData();

  return {
    props: {
      users,
    },
  };
}

const Submit = ({ users }: { users: UserProps[] }) => {
  const initialState: StateProps = {
      title: '',
      url: '',
      description: '',
    },
    [submitting, setSubmitting] = useState(false),
    [formData, setFormData] = useState(initialState),
    { currentUser } = useGettUser(),
    { userName, walletAddress } = useGettUser().currentUser;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      const urlLink = isValidUrl(formData.url) ? new URL(formData.url) : '';
      event?.preventDefault();
      if (userName && walletAddress) {
        setSubmitting(true);
        await fetch('/api/write-exm', {
          method: 'POST',
          body: JSON.stringify({
            data: {
              functionRole: 'createPost',
              postID: uuid(),
              author: {
                userName,
              },
              timeCreated: new Date().getTime(),
              title: formData.title,
              url: urlLink,
              description: formData.description,
              upvotes: 0,
              comments: [],
            },
          }),
        })
          .then(async (res) => {
            const response = await res.json();
            const { data } = response.data;
            const { posts } = data.execution.state;
            setFormData({
              ...formData,
              title: '',
              url: '',
              description: '',
            });
            setSubmitting(false);
            Router.push(
              {
                pathname: '/',
                query: {
                  submitAllPosts: JSON.stringify([...posts]),
                },
              },
              '/'
            );
          })
          .catch((error) => {
            console.error(error);
          });
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
          <Styled.SubmitButton disabled={!formData.title}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Styled.SubmitButton>

          <p style={{ paddingBottom: '1rem' }}>
            Leave link blank to submit a question for discussion. If there is no
            link, post will appear at the top of the ask. If there is a link,
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
