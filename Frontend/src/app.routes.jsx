import {createBrowserRouter} from "react-router-dom";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";

export const router=createBrowserRouter([
     {
        path:'/',
        element:<h1>LoginPage</h1>     
    },
     {
        path:'/login',
        element:<Login/>
     },
     {
        path:'/register',
        element:<Register/>
     }
])