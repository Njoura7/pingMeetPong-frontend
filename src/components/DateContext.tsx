import React, { createContext, useContext, useState, ReactNode } from 'react';

const DateContext = createContext({
  date: new Date(),
  setDate: (date: Date) => {},
});

export const useDate = () => useContext(DateContext);

// Define a type for the props expected by DateProvider
type DateProviderProps = {
  children: ReactNode; // This tells TypeScript that children can be any valid React node
};

export const DateProvider: React.FC<DateProviderProps> = ({ children }) => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};