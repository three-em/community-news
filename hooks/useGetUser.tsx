import { useEffect, useState } from 'react';
import useWalletAddress from './useWalletAddress';

interface UserProps {
  userName: string;
  walletAddress: string;
}

const useGetUser = () => {
  const [allUsers, setAllUsers] = useState<UserProps[]>([]);
  const address = useWalletAddress();

  useEffect(() => {
    if (address) {
      const getAllUsers = async () => {
        try {
          const fetchUsers = await fetch('/api/allPosts');
          if (fetchUsers.ok) {
            const res = await fetchUsers.json();
            const { users } = res.data;
            setAllUsers(users);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getAllUsers();
    }
  }, [address]);

  let currentUser: UserProps = { userName: '', walletAddress: '' };

  allUsers.map((user) => {
    if (user.walletAddress === address) currentUser = user;
  });

  return currentUser;
};

export default useGetUser;
