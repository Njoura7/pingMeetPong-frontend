import { useFindMatchesByPlayerQuery } from '../features/matches/matchesApi';
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

// Define the props type
interface DisplayMatchesProps {
  //todo to be reviewed 
  playerId: string; 
}



const DisplayMatches = ({ playerId }: DisplayMatchesProps) => {
  const { data: matches } = useFindMatchesByPlayerQuery(playerId || '');

  if (!matches) {
    return <div>Loading...</div>;
  }

// Create a copy of matches.data and sort it
  const sortedMatches = [...matches.data].sort((a: Match, b: Match) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <ScrollArea className="h-[25rem] w-full rounded-md border">
    <div className="p-4">
      <Table>
        <TableCaption>Your Matches</TableCaption>
        <TableHeader>
          <TableRow className='flex'>
            <TableHead className="text-left w-1/4">Name</TableHead>
            <TableHead className='w-1/4'>Code</TableHead>
            <TableHead className='w-1/4'>Place</TableHead>
            <TableHead className="text-right w-1/4">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMatches.map((match: Match) => {
            const date = match.date instanceof Date ? match.date : new Date(match.date);
            return (
              <TableRow key={match._id || ''} className='flex'>
                <TableCell className='text-left w-1/4'>{match.name}</TableCell>
                <TableCell className='text-left w-1/4'>{match.code}</TableCell>
                <TableCell className='text-left w-1/4'>{match.place}</TableCell>
                <TableCell className="text-right w-1/4">{date.toLocaleDateString()}</TableCell>
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