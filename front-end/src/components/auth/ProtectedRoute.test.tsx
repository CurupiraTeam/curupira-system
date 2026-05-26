import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { storeToken } from '../../utils/tokenStorage';

/**
 * TESTES DE INTEGRAÇÃO 1 e 2 (Frontend)
 * Integra ProtectedRoute + AuthProvider + React Router + tokenStorage.
 */
function renderRoutes() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/privado" element={<div>Conteúdo Protegido</div>} />
          </Route>
          <Route path="/login" element={<div>Tela de Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('ProtectedRoute (integração)', () => {
  beforeEach(() => window.localStorage.clear());

  it('redireciona para /login quando não há token', () => {
    renderRoutes();
    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo Protegido')).not.toBeInTheDocument();
  });

  it('renderiza o conteúdo protegido quando há token armazenado', () => {
    // token JWT fake com payload {"sub":"u1"}
    storeToken('header.eyJzdWIiOiJ1MSJ9.sig');
    renderRoutes();
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });
});
