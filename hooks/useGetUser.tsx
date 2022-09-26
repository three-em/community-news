import { useEffect, useState } from 'react';
import useArConnect from 'use-arconnect';
import { useGetAllData } from './useGetAllData';
import { useWalletAddress } from './useWalletAddress';
import { UserProps } from '../types';

export const useGetUser = () => {
  const [allUsers, setAllUsers] = useState<UserProps[]>([]),
    [loading, setLoading] = useState(false),
    address = useWalletAddress(),
    arconnect = useArConnect(),
    { users } = useGetAllData();

  const getAllUsers = async () => {
    try {
      setLoading(true);
      setAllUsers(users);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (arconnect) {
      getAllUsers();
    }
  });

  const currentUser = allUsers.find(
    (user) => user.walletAddress === address
  ) || { userName: '', walletAddress: '' };

  return { currentUser, loading };
};
