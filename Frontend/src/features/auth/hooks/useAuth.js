import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

export const useAuth = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true })
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/register`, { username, email, password }, { withCredentials: true })
            return res.data
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed')
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, handleLogin, handleRegister }
}
