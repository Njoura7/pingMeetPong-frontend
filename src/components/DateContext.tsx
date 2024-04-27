import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define an interface for the context value
interface DateContextType {
  date: Date;
  setDate: (date: Date) => void;
}

// Create the context with an initial undefined value
const DateContext = createContext<DateContextType | undefined>(undefined);

export const useDate = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};

type DateProviderProps = {
  children: ReactNode;
};

export const DateProvider: React.FC<DateProviderProps> = ({ children }) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};