import React, { useState } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useGettUser } from '../../../hooks/useGetUser';
import { useGetAllData } from '../../../hooks/useGetAllData';

const UserProfile = () => {
  const router = useRouter(),
    { username: queriedUser } = router.query,
    [bio, setBio] = useState(''),
    [updating, setUpdating] = useState(false),
    { userName } = useGettUser().currentUser,
    { users } = useGetAllData();

  const user = users.find((user) => (user.userName = queriedUser as string));

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
      });
      setUpdating(false);
      setBio('');
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

          <p>current bio: {user.bio ? user.bio : 'no bio yet'}</p>
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
              ></textarea>
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={`/user/${userName}/submissions`}>submissions</a>
            <a href={`/user/${userName}/hidden`}>hidden</a>
            <a href={`/user/${userName}/upvoted`}>upvoted submissions</a>
            <a href={`/user/${userName}/favorites`}>favorite submissions</a>
          </div>

          <button disabled={!bio || bio === user.bio} onClick={submitBioUpdate}>
            {updating ? 'updating...' : 'update'}
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
            <a href={`/user/${queriedUser}/submissions`}>submissions</a>
            <a href={`/user/${queriedUser}/favorites`}>favorites</a>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;
