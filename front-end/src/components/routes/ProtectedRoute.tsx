import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component que verifica autenticação
 * Se não autenticado: redireciona para /login com o local atual como state
 * Se autenticado: renderiza o children
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log(`[ProtectedRoute] Renderizando ${location.pathname}, autenticado: ${isAuthenticated}`);

  if (!isAuthenticated) {
    console.log(`[ProtectedRoute] Acesso não autorizado a ${location.pathname}, redirecionando para login`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log(`[ProtectedRoute] Acesso autorizado a ${location.pathname}`);
  return children;
}
