import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Match } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetUserByIdQuery } from '@/features/users/usersApi';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PlayerBadgeProps {
  playerId: string;
  matchOwnerId: string;
}

const PlayerBadge = ({ playerId, matchOwnerId }: PlayerBadgeProps) => {
  const { data: user } = useGetUserByIdQuery(playerId);
  const isOwner = playerId === matchOwnerId;
  
  return (
    <Badge 
      variant={isOwner ? "default" : "secondary"}
      className="flex items-center gap-2 py-1 px-2"
    >
      <Avatar className="h-6 w-6">
        <AvatarImage src={user?.avatar || undefined} alt={user?.username} />
        <AvatarFallback className="text-xs">
          {user?.username?.charAt(0).toUpperCase() || 'X'}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm">{user?.username || 'Loading...'}</span>
      {isOwner && (
        <span className="text-xs opacity-75">(Organizer)</span>
      )}
    </Badge>
  );
};

interface AddScoreDialogProps {
  match: Match;
  onScoreSubmit: (matchId: string, score: string) => Promise<void>;
  isParticipant: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddScoreDialog({ match, onScoreSubmit, isParticipant, open, onOpenChange }: AddScoreDialogProps) {
  const [scoreValue, setScoreValue] = useState('');

  const validateScore = (score: string): boolean => {
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

  const handleSubmit = async () => {
    if (!scoreValue.trim()) {
      toast.error("Score cannot be empty", {
        theme: "colored"
      });
      return;
    }

    if (!validateScore(scoreValue)) {
      return;
    }

    try {
      await onScoreSubmit(match._id, scoreValue);
      setScoreValue('');
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  if (!isParticipant) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Match Score</DialogTitle>
          <DialogDescription>
            Enter the final score for match: {match.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="21-19"
                  value={scoreValue}
                  onChange={(e) => setScoreValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />
                <Button onClick={handleSubmit}>
                  Save Score
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-sm font-medium">Players:</div>
            <div className="flex flex-wrap gap-2">
              {match.players.map((playerId) => (
                <PlayerBadge 
                  key={playerId} 
                  playerId={playerId}
                  matchOwnerId={match.owner}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-4">
              <p>Match Code: {match.code}</p>
              <p>Location: {match.place}</p>
              <p>Date: {new Date(match.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 