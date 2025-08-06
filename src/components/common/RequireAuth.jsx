import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Navigate, Outlet } from 'react-router-dom'

export const RequireAuth = ({ children }) => {
    const { user } = useContext(AuthContext)

    if (!user) {
        return <Navigate to="/account/login" />
    }

    // Jika ada children (cara lama), gunakan children
    // Jika tidak ada children (nested routes), gunakan Outlet
    return children || <Outlet />
}