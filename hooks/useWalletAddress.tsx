import { useState } from 'react';

const useWalletAddress = () => {
  const [address, setAddress] = useState('');

  const getWalletAddress = async () => {
    try {
      const address = await window.arweaveWallet.getActiveAddress();
      setAddress(address);
    } catch (error) {
      console.error(error);
    }
  };

  getWalletAddress();
  return address;
};

export default useWalletAddress;
