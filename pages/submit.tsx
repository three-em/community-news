import React, { useState } from 'react';
import axios from 'axios';
import { Exm, ContractType } from '@execution-machine/sdk';

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
    exm = new Exm({ token: `${process.env.EXM_TOKEN}` });

  const handleSubmit = (event: React.SyntheticEvent) => event?.preventDefault();

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const submitForm = async () => {
    axios
      .post('https://api.exm.dev/api/transactions', formData)
      .then((response) => {
        console.log('RESPONSE', response.data);
      });
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
        <button onClick={() => submitForm()}>sumbit</button>
      </form>
    </main>
  );
};

export default Submit;
