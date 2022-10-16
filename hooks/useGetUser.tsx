import { useEffect, useState } from 'react';
import { UserProps } from '../types';

const useGettUser = () => {
  const initialUserState: UserProps = {
    userName: '',
    walletAddress: '',
    favorites: [],
    upvotedPosts: [],
    bio: '',
    creationDate: new Date(),
  };

  const [currentUser, setCurrentUser] = useState(initialUserState);

  useEffect(() => {
    try {
      const parseUser = JSON.parse(localStorage.getItem('user') || '');
      if (parseUser.userName) {
        setCurrentUser(parseUser);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { currentUser };
};

export { useGettUser };
