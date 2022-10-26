import React, { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useGettUser } from '../../../hooks/useGetUser';
import { useGetAllData } from '../../../hooks/useGetAllData';
import { Wrapper } from '../../../styles/common';
import styled from 'styled-components';

const CustomWrapper = styled(Wrapper)`
  padding: 1rem;
  p {
    font-size: 1.08rem;
  }
`;

const UserProfile = () => {
  const router = useRouter(),
    { username: queriedUser } = router.query,
    [bio, setBio] = useState(''),
    [updatedBio, setUpdatedBio] = useState(''),
    [updating, setUpdating] = useState(false),
    { userName } = useGettUser().currentUser,
    { users } = useGetAllData();

  const queryUser = users.find((user) => user.userName === queriedUser);
  const connectedUser = users.find((user) => user.userName === userName);

  console.log('USER', connectedUser);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const submitBioUpdate = async () => {
    try {
      setUpdating(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            functionRole: 'updateBio',
            userName,
            bio,
          },
        }),
      })
        .then(async (res) => {
          const response = await res.json();
          const { data } = response.data;
          const { users } = data.execution.state;
          const leUser = users.find((user) => user.userName === userName);
          setUpdating(false);
          setBio('');
          setUpdatedBio(leUser.bio);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error(error);
    }
  };

  if (!connectedUser || !queryUser)
    return (
      <Wrapper>
        <p>Loading</p>
      </Wrapper>
    );

  return (
    <CustomWrapper>
      {queriedUser === userName ? (
        <>
          <p>
            user: <span>{connectedUser.userName}</span>
          </p>

          <p>
            created:{' '}
            <span>
              {moment(connectedUser.creationDate).format('MMMM, DD, YYYY')}
            </span>
          </p>

          <p>current bio: {!updatedBio ? connectedUser.bio : updatedBio}</p>
          <p>
            about:{' '}
            <span>
              <textarea
                name=''
                id=''
                cols={30}
                rows={10}
                value={bio}
                onChange={handleChange}
                style={{ outline: 'none', display: 'block' }}
              ></textarea>
            </span>
          </p>

          <button
            style={{ marginTop: '1rem' }}
            disabled={!bio || bio === connectedUser.bio}
            onClick={submitBioUpdate}
          >
            {updating ? 'updating...' : 'update'}
          </button>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <a style={{ color: 'blue' }} href={`/user/${userName}/submissions`}>
              submissions
            </a>
            <a style={{ color: 'blue' }} href={`/user/${userName}/hidden`}>
              hidden
            </a>
            <a style={{ color: 'blue' }} href={`/user/${userName}/upvoted`}>
              upvoted submissions
            </a>
            <a style={{ color: 'blue' }} href={`/user/${userName}/favorites`}>
              favorite submissions
            </a>
          </div>
        </>
      ) : (
        <>
          <p>
            user: <span>{queriedUser}</span>
          </p>

          <p>
            created:{' '}
            <span>
              {moment(queryUser.creationDate).format('MMMM, DD, YYYY')}
            </span>
          </p>

          <p>
            about: <span>{queryUser.bio}</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={`/user/${queriedUser}/submissions`}>submissions</a>
            <a href={`/user/${queriedUser}/favorites`}>favorites</a>
          </div>
        </>
      )}
    </CustomWrapper>
  );
};

export default UserProfile;
