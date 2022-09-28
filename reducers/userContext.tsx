import { createContext, useReducer, useContext } from 'react';

type Action = { type: 'updateUser'; userName: string; walletAddress: string };
type Dispatch = (action: Action) => void;
type User = { userName: string; walletAddress: string };
type UserProviderProps = { children: React.ReactNode };

const UserStateContext = createContext<
  { user: User; dispatch: Dispatch } | undefined
>(undefined);

const userReducer = (user: User, action: Action) => {
  switch (action.type) {
    case 'updateUser': {
      return { userName: action.userName, walletAddress: action.walletAddress };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const CurrentUserProvider = ({ children }: UserProviderProps) => {
  const [user, dispatch] = useReducer(userReducer, {
    userName: '',
    walletAddress: '',
  });
  const value = { user, dispatch };
  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
};

const useGetUser = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useGetUser must be used within a CurrentUserProvider');
  }
  return context;
};

export { CurrentUserProvider, useGetUser };
