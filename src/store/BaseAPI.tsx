import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:8000/api/v1/";

export const BaseAPI = createApi({
    reducerPath: "BaseAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL, // 🌍 your backend
        credentials: "include", // 👈 send HttpOnly cookies automatically
    }),
    tagTypes: [],
    endpoints: () => ({}), // start empty, inject later
});
