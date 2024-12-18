import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the types of data returned by the API
type IPost = {
    id: number;
    title: string;
    body: string;
};
type INewPost = {
    userId: number;
    title: string;
    body: string;
};

export const apiSlice = createApi({
    reducerPath: 'postsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
    tagTypes: ['Post'], // Define 'Post' as a valid tag type
    endpoints: (builder) => ({
        getPosts: builder.query<IPost[], void>({ // The query returns an array of IPost objects and void means no argument required
            query: () => 'posts', //  Specifies the endpoint to call (/posts).
            providesTags: (result) => //  Defines tags that this query "provides" to the cache. These tags allow for efficient cache invalidation.
                result
                    ? // Successful query: Provide a tag for each post and a "LIST" tag
                    [
                        ...result.map(({ id }) => ({ type: 'Post' as const, id })),
                        { type: 'Post', id: 'LIST' },
                    ]
                    :
                    [{ type: 'Post', id: 'LIST' }],
        }),
        postPost: builder.mutation<IPost, INewPost>({   //  The mutation returns a single IPost object. It takes an argument of type INewPost
            query: (newPost) => ({
                url: 'posts',
                method: 'POST',
                body: newPost,
            }),
            //  Tells RTK Query to invalidate the LIST tag for Post after the mutation.
            //  This triggers a refetch of any queries that use the LIST tag, ensuring the post list is updated.
            invalidatesTags: [{ type: 'Post', id: 'LIST' }], // Invalidate the "LIST" tag to refetch all posts
        }),
    }),
});

export const { useGetPostsQuery, usePostPostMutation } = apiSlice;
