import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AppContext)
  if (!user) return <Navigate to="/auth" replace />
  return children
}
