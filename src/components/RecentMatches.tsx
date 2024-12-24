import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useFindMatchesByPlayerQuery, useAddMatchScoreMutation } from '../features/matches/matchesApi'
import { Match } from '@/types'
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { PencilIcon, TrophyIcon } from "lucide-react";

const RecentMatches = () => {
  const { user: userId } = useSelector(selectCurrentUser);
  const { data: matches } = useFindMatchesByPlayerQuery(userId || '');
  const [addMatchScore] = useAddMatchScoreMutation();
  const [editingScore, setEditingScore] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState('');

  // Get recent matches (last 5 matches with scores)
  const recentMatches = matches?.data
    ?.filter((match: Match) => match.score)
    ?.sort((a: Match, b: Match) => {
      const dateA = a.date instanceof Date ? a.date : new Date(a.date);
      const dateB = b.date instanceof Date ? b.date : new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    })
    ?.slice(0, 5);

  const canEditScore = (match: Match) => {
    if (userId) {
      return match.players.includes(userId) || match.owner === userId;
    }
    return false;
  };

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
    <div>
      <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
      <div className="space-y-4">
        {recentMatches?.length ? (
          recentMatches.map((match: Match) => {
            const isParticipant = canEditScore(match);

            return (
              <div key={match._id} className="flex items-center justify-between p-2 hover:bg-accent rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <TrophyIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{match.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(match.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                      <Button
                        onClick={() => handleScoreSubmit(match._id)}
                        size="sm"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-green-500">{match.score}</span>
                      {isParticipant && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setEditingScore(match._id);
                            setScoreValue(match.score || '');
                          }}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">No recent matches with scores</p>
        )}
      </div>
    </div>
  );
};

export default RecentMatches;