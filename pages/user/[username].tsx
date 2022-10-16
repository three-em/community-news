import React, { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useGettUser } from '../../hooks/useGetUser';
import { useGetAllData } from '../../hooks/useGetAllData';

const UserProfile = () => {
  const router = useRouter(),
    { username: queriedUser } = router.query,
    [bio, setBio] = useState(''),
    { userName } = useGettUser().currentUser,
    { users } = useGetAllData();

  const user = users.find((user) => (user.userName = queriedUser as string));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const submitBioUpdate = async () => {
    try {
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            functionRole: 'updateBio',
            userName,
            bio,
          },
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <p>Loading</p>;

  return (
    <>
      {queriedUser === userName ? (
        <>
          <p>
            user: <span>{user.userName}</span>
          </p>

          <p>
            created:{' '}
            <span>{moment(user.creationDate).format('MMMM, DD, YYYY')}</span>
          </p>

          <p>
            about:{' '}
            <span>
              <textarea
                name=''
                id=''
                cols={30}
                rows={10}
                value={user.bio}
                onChange={handleChange}
              ></textarea>
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={`/submissions/${userName}`}>submissions</a>
            <a href='/hidden'>hidden</a>
            <a href={`/upvoted/${userName}`}>upvoted submissions</a>
            <a href={`/favorites/${userName}`}>favorite submissions</a>
          </div>

          <button disabled={!bio || bio === user.bio} onClick={submitBioUpdate}>
            update
          </button>
        </>
      ) : (
        <>
          <p>
            user: <span>{queriedUser}</span>
          </p>

          <p>
            created:{' '}
            <span>{moment(user.creationDate).format('MMMM, DD, YYYY')}</span>
          </p>

          <p>
            about: <span>{user.bio}</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={`/submissions/${queriedUser}`}>submissions</a>
            <a href={`/favorites/${queriedUser}`}>favorites</a>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
