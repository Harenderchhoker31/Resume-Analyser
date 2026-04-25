import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import React from 'react'

const Protected = ({children}) => {
    const { loading, initializing, user } = useAuth()

    if (initializing) {
        return (
            <main className='loading-screen'>
                <div className='loading-spinner' />
                <h1 className='loading-title'>Logging in...</h1>
                <p className='loading-tip'>Verifying your credentials, <span>just a moment.</span></p>
                <div className='loading-dots'><span/><span/><span/></div>
            </main>
        )
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='loading-spinner' />
                <h1 className='loading-title'>Logging in...</h1>
                <p className='loading-tip'>Verifying your credentials, <span>just a moment.</span></p>
                <div className='loading-dots'><span/><span/><span/></div>
            </main>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return children
}

export default Protected