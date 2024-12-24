import { useFindMatchesByPlayerQuery, useAddMatchScoreMutation } from '@/features/matches/matchesApi';
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
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import { CalendarDays } from "lucide-react";
import { AddScoreDialog } from './AddScoreDialog';

interface UpcomingMatchesProps {
  playerId: string | null | undefined;
}

const UpcomingMatches = ({ playerId }: UpcomingMatchesProps) => {
  const { data: matches } = useFindMatchesByPlayerQuery(playerId || '', {
    skip: !playerId
  });
  const [addMatchScore] = useAddMatchScoreMutation();
  const { user: currentUserId } = useSelector(selectCurrentUser);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  if (!matches) {
    return <div>Loading...</div>;
  }

  // Filter out matches that already have scores and sort by date
  const upcomingMatches = [...matches.data]
    .filter((match: Match) => !match.score)
    .sort((a: Match, b: Match) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  const canEditScore = (match: Match) => {
    if (currentUserId) {
      return match.players.includes(currentUserId) || match.owner === currentUserId;
    }
    return false;
  };

  const handleScoreSubmit = async (matchId: string, score: string) => {
    try {
      const result = await addMatchScore({ matchId, score }).unwrap();
      toast.success(result.message, {
        theme: "colored"
      });
      setSelectedMatch(null);
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
    <>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        Upcoming Matches
      </h2>
      <ScrollArea className="h-[calc(100vh-15rem)] sm:h-[25rem] md:h-[30rem] lg:h-[35rem] w-full rounded-md border">
        <div className="p-4">
          <Table>
            <TableCaption className="mt-4">
              {upcomingMatches.length === 0 ? "No upcoming matches" : "Your upcoming matches"}
            </TableCaption>
            <TableHeader>
              <TableRow className='flex'>
                <TableHead className="text-left w-1/3 sm:w-1/4">Name</TableHead>
                <TableHead className='hidden sm:table-cell w-1/4'>Code</TableHead>
                <TableHead className='hidden md:table-cell w-1/4'>Place</TableHead>
                <TableHead className="text-right w-2/3 sm:w-1/4">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMatches.map((match: Match) => {
                const date = match.date instanceof Date ? match.date : new Date(match.date);
                const isParticipant = canEditScore(match);
                
                return (
                  <TableRow 
                    key={match._id} 
                    className={`flex hover:bg-accent/50 transition-colors ${isParticipant ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                      if (isParticipant) {
                        setSelectedMatch(match);
                      }
                    }}
                  >
                    <TableCell className='text-left w-1/3 sm:w-1/4'>{match.name}</TableCell>
                    <TableCell className='hidden sm:table-cell w-1/4'>{match.code}</TableCell>
                    <TableCell className='hidden md:table-cell w-1/4'>{match.place}</TableCell>
                    <TableCell className="text-right w-2/3 sm:w-1/4">
                      {date.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      {selectedMatch && (
        <AddScoreDialog
          match={selectedMatch}
          onScoreSubmit={handleScoreSubmit}
          isParticipant={canEditScore(selectedMatch)}
          open={!!selectedMatch}
          onOpenChange={(open) => {
            if (!open) setSelectedMatch(null);
          }}
        />
      )}
    </>
  );
};

export default UpcomingMatches;