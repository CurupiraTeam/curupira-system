import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component que redireciona usuários autenticados
 * Se autenticado: redireciona para /dashboard
 * Se não autenticado: renderiza o children
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
