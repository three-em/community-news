import { v4 as uuid } from 'uuid';
import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import useGetUser from '../hooks/useGetUser';

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
    user = useGetUser();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      event?.preventDefault();
      if (user.userName && user.walletAddress) {
        const { userName } = user;
        await axios.post('/api/post', {
          input: {
            functionRole: 'createPost',
            postID: uuid(),
            author: {
              userName,
            },
            timeCreated: new Date().getTime(),
            title: formData.title,
            url: formData.url,
            description: formData.description,
            upvotes: 0,
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

  return (
    <main>
      <br />
      {(user.userName && user.walletAddress && (
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
      )) || (
        <>
          <p>Connect wallet to submit post</p>
          <button onClick={() => Router.push('/connect')}>Connect</button>
        </>
      )}
    </main>
  );
};

export default Submit;
