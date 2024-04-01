import React from 'react';
import { useFindMatchesByPlayerQuery } from '../features/matches/matchesApi';

// Define the props type
interface DisplayMatchesProps {
    playerId: string | null; // Allow playerId to be null
}

interface Match {
  _id?: string;
  name: string;
  place: string;
  date: Date;
}

const DisplayMatches: React.FC<DisplayMatchesProps> = ({ playerId }) => {
  const { data: matches } = useFindMatchesByPlayerQuery(playerId || '', { skip: !playerId }); // Skip the query if playerId is null

  // If playerId is null, return a message
  if (!playerId) {
    return <div>No matches available because no user ID is provided.</div>;
  }

  if (!matches) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
   
  {matches.data.map((match: Match) => {
      const date = match.date instanceof Date ? match.date : new Date(match.date);
      return (
        <div key={match._id || ''} className="w-full flex justify-center cursor-pointer">
          <div className="w-4/5 border border-gray-300 p-4 m-2">
            <h2 className="text-xl font-semibold">{match.name}</h2>
            <p className="text-gray-900">{match.place}</p>
            <p className="text-gray-900">{date.toLocaleDateString()}</p>
          </div>
        </div>
        );
  })}
    </div>
  );
};

export default DisplayMatches;