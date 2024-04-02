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
    <ScrollArea className="h-80 w-full rounded-md border">
    <div className="p-4">
      <Table>
        <TableCaption>Your Matches</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMatches.map((match: Match) => {
            const date = match.date instanceof Date ? match.date : new Date(match.date);
            return (
              <TableRow key={match._id || ''}>
                <TableCell className="font-medium">{match.name}</TableCell>
                <TableCell>{match.code}</TableCell>
                <TableCell>{match.place}</TableCell>
                <TableCell className="text-right">{date.toLocaleDateString()}</TableCell>
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