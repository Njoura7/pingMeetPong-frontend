
//axios kinda alternative
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import{setCredentials,logOut} from '../../features/auth/authSlice'

//? In TypeScript, an interface is a way to define a contract for a certain structure of an object. 
//? It can be used to describe the shape of an object, function, class, or even primitive types.



const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    credentials: 'include',
    prepareHeaders:(headers,{getState})=>{
        const token = getState().auth.token
        if(token){
            headers.set("authorization",'Bearer ${token}')
        }
        return headers
    }
})

const baseQueryWithReauth = async (args:any,api:any,extraOptions:any)=>{
    let result = await baseQuery(args,api,extraOptions)

    if(result?.error?.originalStatus === 403){
        console.log('Reauthenticating-refresh token')
        //send refresh token to get new access token

        const refreshResult = await baseQuery('/refresh',api,extraOptions) //todo '/refresh' coming from the 
        console.log('Refresh result:',refreshResult)
        if(refreshResult?.data){
            const user = api.getState().auth.user
            // store the new token in the store
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            //retry the original query with new access token
            result = await baseQuery(args,api,extraOptions)    
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})