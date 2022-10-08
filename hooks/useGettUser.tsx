import { useEffect, useState } from 'react';
import { UserProps } from '../types';

const useGettUser = () => {
  const userState: UserProps = {
    userName: '',
    walletAddress: '',
    favorites: [],
    upvotedPosts: [],
    bio: '',
  };
  const [currentUser, setCurrentUser] = useState(userState);

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
