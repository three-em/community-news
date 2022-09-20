import React, { createContext, useContext } from 'react';

interface ActionProps {
  type: 'add function id';
  id: string;
}

type Dispatch = (action: ActionProps) => void;

interface StateProps {
  functionID: string;
}

interface ProviderProps {
  children: React.ReactNode;
}

const FunctionIDContext = createContext<
  | {
      state: StateProps;
      dispatch: Dispatch;
    }
  | undefined
>(undefined);

const functionIdReducer = (state: StateProps, action: ActionProps) => {
  if (action.type === 'add function id') {
    return { functionID: action.id };
  } else {
    throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const FunctionIDProvider = ({ children }: ProviderProps) => {
  const [state, dispatch] = React.useReducer(functionIdReducer, {
    functionID: '',
  });

  const value = { state, dispatch };
  return (
    <FunctionIDContext.Provider value={value}>
      {children}
    </FunctionIDContext.Provider>
  );
};

const useFunctionID = () => {
  const context = useContext(FunctionIDContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

export { FunctionIDProvider, useFunctionID };
