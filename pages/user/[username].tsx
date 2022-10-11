import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useGettUser } from '../../hooks/useGettUser';

const UserProfile = () => {
  const router = useRouter();
  const { username: reqUser } = router.query;
  const [bio, setBio] = useState('');
  const { userName, bio: currentBio } = useGettUser().currentUser;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const submitBioUpdate = async () => {
    try {
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({
          functionRole: 'updateBio',
          userName,
          bio,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {reqUser === userName ? (
        <>
          <p>
            user: <span>codingknite</span>
          </p>

          <p>
            created: <span>date</span>
          </p>

          <p>
            about:{' '}
            <span>
              <textarea
                name=''
                id=''
                cols={30}
                rows={10}
                value={currentBio ? currentBio : bio}
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

          <button disabled={!bio} onClick={submitBioUpdate}>
            update
          </button>
        </>
      ) : (
        <>
          <p>
            user: <span>codingknite</span>
          </p>

          <p>
            created: <span>date</span>
          </p>

          <p>
            about: <span>yolo</span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={`/submissions/${userName}`}>submissions</a>
            <a href='/favorites'>favorites</a>
          </div>
        </>
      )}
    </>
  );
};

export default UserProfile;

// todo - TEST UPDATING BIO
