import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchUsersQuery } from '@/features/search/searchApi';
import { setSearchUsers } from '@/features/search/searchSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/app/store';
import { SearchIconSvg } from '@/svgs/SearchIconSvg';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debounce searchTerm updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Adjust debounce delay as needed
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: fetchedUsers, isFetching } = useSearchUsersQuery(debouncedSearchTerm, {
    skip: !debouncedSearchTerm,
  });

  useEffect(() => {
    if (fetchedUsers && !isFetching) {
      dispatch(setSearchUsers(fetchedUsers));
    } else if (!debouncedSearchTerm) {
      // Clear search results if searchTerm is empty
      dispatch(setSearchUsers([]));
    }
  }, [fetchedUsers, debouncedSearchTerm, dispatch, isFetching]);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const users = useSelector((state: RootState) => state.search.users);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        {/* Search Input with Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ">
          <SearchIconSvg />
        </div>
        <input
          type="search"
          autoComplete="off"
          placeholder="Search players, tournaments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 pl-20 pr-4 py-2 text-sm bg-background border border-input rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
                     placeholder:text-muted-foreground"
        />
      </div>

      {/* Search Results Dropdown */}
      {users.length > 0 && searchTerm && (
        <div className="absolute mt-2 w-full bg-background border border-border rounded-md shadow-lg overflow-hidden z-50">
          <div className="max-h-[300px] overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.username}</span>
                  {/* Add additional user info if needed */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
