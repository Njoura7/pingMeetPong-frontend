export interface Match {
    _id: string;
    code: string;
    name: string;
    place: string;
    date: Date;
    score?: string;
    owner: string;
    players: string[];
  }

  export interface User {
    _id: string;
    username: string;
    avatar: string;
    friends?: string[];
  }
