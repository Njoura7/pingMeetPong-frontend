import { useFindMatchesByPlayerQuery, useAddMatchScoreMutation } from '../features/matches/matchesApi';
import { Match } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

interface DisplayMatchesProps {
  playerId: string | null | undefined;
}

const DisplayMatches = ({ playerId }: DisplayMatchesProps) => {
  const { data: matches } = useFindMatchesByPlayerQuery(playerId || '', {
    skip: !playerId
  });
  const [addMatchScore] = useAddMatchScoreMutation();
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState('');
  const { user: currentUserId } = useSelector(selectCurrentUser);

  if (!matches) {
    return <div>Loading...</div>;
  }

  const sortedMatches = [...matches.data].sort((a: Match, b: Match) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const canEditScore = (match: Match) => {
    if(currentUserId){
      return match.players.includes(currentUserId) || match.owner === currentUserId;
    }
  };

  const validateScore = (score: string): boolean => {
    // Example: score should be in format "21-19" or similar
    const scorePattern = /^\d{1,2}-\d{1,2}$/;
    if (!scorePattern.test(score)) {
      toast.error("Score should be in format '21-19'", {
        theme: "colored"
      });
      return false;
    }
    
    const [score1, score2] = score.split('-').map(Number);
    if (score1 > 30 || score2 > 30) {
      toast.error("Individual scores should not exceed 30", {
        theme: "colored"
      });
      return false;
    }
    
    return true;
  };

  const handleScoreSubmit = async (matchId: string | undefined) => {
    if (!matchId) {
      toast.error("Invalid match ID", {
        theme: "colored"
      });
      return;
    }

    try {
      if (!scoreValue.trim()) {
        toast.error("Score cannot be empty", {
          theme: "colored"
        });
        return;
      }

      if (!validateScore(scoreValue)) {
        return;
      }

      const result = await addMatchScore({ matchId, score: scoreValue }).unwrap();
      setEditingScore(null);
      setScoreValue('');
      toast.success(result.message, {
        theme: "colored"
      });
    } catch (error: unknown) {
      console.error('Failed to update score:', error);
      if (typeof error === "object" && error !== null && 'data' in error) {
        const serverError = (error as { data: { message?: string } }).data;
        if (serverError.message) {
          toast.error(serverError.message, {
            theme: "colored"
          });
        }
      } else {
        toast.error("Failed to update score", {
          theme: "colored"
        });
      }
    }
  };

  return (
    <ScrollArea className="h-[25rem] w-full rounded-md border">
      <div className="p-4">
        <Table>
          <TableCaption>Your Matches</TableCaption>
          <TableHeader>
            <TableRow className='flex'>
              <TableHead className="text-left w-1/5">Name</TableHead>
              <TableHead className='w-1/5'>Code</TableHead>
              <TableHead className='w-1/5'>Place</TableHead>
              <TableHead className='w-1/5'>Score</TableHead>
              <TableHead className="text-right w-1/5">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMatches.map((match: Match) => {
              const date = match.date instanceof Date ? match.date : new Date(match.date);
              const isParticipant = canEditScore(match);
              
              return (
                <TableRow key={match._id} className='flex'>
                  <TableCell className='text-left w-1/5'>{match.name}</TableCell>
                  <TableCell className='text-left w-1/5'>{match.code}</TableCell>
                  <TableCell className='text-left w-1/5'>{match.place}</TableCell>
                  <TableCell className='text-left w-1/5'>
                    {editingScore === match._id ? (
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={scoreValue}
                          onChange={(e) => setScoreValue(e.target.value)}
                          placeholder="21-19"
                          className="w-20"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleScoreSubmit(match._id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleScoreSubmit(match._id)}
                          className="px-2 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`${isParticipant ? 'cursor-pointer hover:text-primary' : ''} ${!match.score ? 'text-muted-foreground' : ''}`}
                        onClick={() => {
                          if (isParticipant) {
                            setEditingScore(match._id);
                            setScoreValue(match.score || '');
                          }
                        }}
                      >
                        {match.score || (isParticipant ? 'Add score' : 'No score')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right w-1/5">{date.toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
};

export default DisplayMatches;