import { useEffect, useState } from 'react';
import useArConnect from 'use-arconnect';
import useWalletAddress from './useWalletAddress';

interface UserProps {
  userName: string;
  walletAddress: string;
}

const useGetUser = () => {
  const [allUsers, setAllUsers] = useState<UserProps[]>([]),
    [loading, setLoading] = useState(false),
    address = useWalletAddress(),
    arconnect = useArConnect();

  let currentUser: UserProps = { userName: '', walletAddress: '' };

  useEffect(() => {
    if (arconnect) {
      const getAllUsers = async () => {
        try {
          setLoading(true);
          const fetchUsers = await fetch('/api/allPosts');
          if (fetchUsers.ok) {
            const res = await fetchUsers.json();
            const { users } = res.data;
            setAllUsers(users);
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
        }
      };

      getAllUsers();
    }
  }, [arconnect]);

  allUsers.map((user) => {
    if (user.walletAddress === address) currentUser = user;
  });

  return { currentUser, loading };
};

export default useGetUser;
