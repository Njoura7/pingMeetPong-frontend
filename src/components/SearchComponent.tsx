import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchUsersQuery } from '../features/search/searchApi';
import { setSearchUsers } from '../features/search/searchSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: fetchedUsers, isFetching } = useSearchUsersQuery(searchTerm, {
        skip: !searchTerm,
      });


    useEffect(() => {
        if (fetchedUsers && !isFetching) {
            dispatch(setSearchUsers(fetchedUsers));
        } else if (!searchTerm) {
            // Clear search results if searchTerm is empty
            dispatch(setSearchUsers([]));
        }
    }, [fetchedUsers, searchTerm, dispatch, isFetching]);

    const handleUserClick = (userId: string) => {
        navigate(`/profile/${userId}`);
    };
    const users = useSelector((state: RootState) => state.search.users); // Use RootState here

    return (
        <form className="max-w-lg mx-8" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-200 sr-only dark:text-white">Search</label>
        <div className="flex relative w-full">
            {/* implement search SVG in the future */}
            <input
                type="search"
                id="default-search"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search users..."
                required
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="mt-4 w-full max-h-60 overflow-auto">
          {users.map((user) => (
            <div key={user._id} onClick={() => handleUserClick(user._id)} className="cursor-pointer flex justify-evenly items-center p-2 bg-gray-800 hover:bg-gray-500">
              <h2>{user.username}</h2>
              <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
            </div>
          ))}
        </div>
      </form>
    );
};

export default SearchComponent;