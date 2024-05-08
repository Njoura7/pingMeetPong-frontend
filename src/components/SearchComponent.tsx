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
        <div className="flex relative w-full rounded-lg  overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50" style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
            <path d="M 21 3 C 11.6 3 4 10.6 4 20 C 4 29.4 11.6 37 21 37 C 24.354553 37 27.47104 36.01984 30.103516 34.347656 L 42.378906 46.621094 L 46.621094 42.378906 L 34.523438 30.279297 C 36.695733 27.423994 38 23.870646 38 20 C 38 10.6 30.4 3 21 3 z M 21 7 C 28.2 7 34 12.8 34 20 C 34 27.2 28.2 33 21 33 C 13.8 33 8 27.2 8 20 C 8 12.8 13.8 7 21 7 z" />
          </svg>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search users..."
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{paddingLeft: '2.5rem'}} // Adjust this value as needed to fit the SVG icon
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