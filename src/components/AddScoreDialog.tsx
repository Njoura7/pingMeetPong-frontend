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
          <div className="text-sm text-muted-foreground">
            <p>Match Code: {match.code}</p>
            <p>Location: {match.place}</p>
            <p>Date: {new Date(match.date).toLocaleDateString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 