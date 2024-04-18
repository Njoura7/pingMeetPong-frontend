import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchUsersQuery } from '../features/search/searchApi';
import { setSearchUsers } from '../features/search/searchSlice';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Use the useSearchUsersQuery hook with the searchTerm as the argument.
    // The skip option is removed to allow the query to run whenever searchTerm changes.
    const { data: fetchedUsers, isFetching } = useSearchUsersQuery(searchTerm);

    // Effect to dispatch setSearchUsers action whenever fetchedUsers changes.
    // This includes when searchTerm changes or when the component mounts.
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

    return (
        <div className="flex flex-col items-center w-full"> 
            <form className='w-full px-6' onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="p-2 border border-gray-300 rounded-md text-black w-full" 
                />
            </form>
            <div className="mt-4 w-full max-h-60 overflow-auto"> 
                {useSelector((state: any) => state.search.users).map((user: any) => (
                    <div key={user._id} onClick={() => handleUserClick(user._id)} className="cursor-pointer flex justify-evenly items-center p-2 bg-gray-800 hover:bg-gray-500">
                        <h2>{user.username}</h2>
                        <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchComponent;