import axios from 'axios';
import Router from 'next/router';
import { v4 as uuid } from 'uuid';
import React, { useState } from 'react';

interface StateProps {
  title: string;
  url: string;
  description: string;
  upvotes: number;
}

const Submit = () => {
  const initialState: StateProps = {
      title: '',
      url: '',
      description: '',
      upvotes: 0,
    },
    [formData, setFormData] = useState(initialState);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    try {
      const date = new Date();
      event?.preventDefault();
      await axios.post('/api/post', {
        input: {
          functionRole: 'createPost',
          postID: uuid(),
          author: 'codingknite', // todo - after connecting with ArConnect
          timeCreated: [date.getHours(), date.getMinutes()],
          title: formData.title,
          url: formData.url,
          description: formData.description,
          upvotes: formData.upvotes,
        },
      });
      setFormData({
        ...formData,
        title: '',
        url: '',
        description: '',
      });
      Router.push('/');
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
    </main>
  );
};

export default Submit;
