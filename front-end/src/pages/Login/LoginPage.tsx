import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button, FieldWrapper, TextInput } from '../../components/ui/FormControls';
import { ErrorState } from '../../components/ui/StateView';
import { publicRoutePaths } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';

type RedirectState = {
  from?: { pathname?: string };
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loginAsDemo, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as RedirectState | null)?.from?.pathname || '/dashboard';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log('[LoginPage] Submitting login form para:', redirectTo);
    try {
      console.log('[LoginPage] Chamando login...');
      await login({ email, senha });
      console.log('[LoginPage] Login bem-sucedido, redirecionando para:', redirectTo);
      // Se chegou aqui, login foi bem-sucedido
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Erro já é capturado e exibido pelo estado de error do hook
      console.error('[LoginPage] Erro durante o submit:', err);
    }
  }

  function handleDemoLogin() {
    console.log('[LoginPage] Iniciando demo login, redirecionando para:', redirectTo);
    try {
      loginAsDemo();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('[LoginPage] Erro ao fazer login de demonstração:', err);
    }
  }

  return (
    <section className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-glow">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <Leaf size={28} aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-black">Entrar no Curupira</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Use uma conta para acessar rotas protegidas da API, enviar relatos e manter os dados da interface sincronizados com o backend.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl sm:p-6">
          <div className="grid gap-4">
            {error && <ErrorState compact title="Não foi possível entrar" description={error.message || 'Confira e-mail e senha e tente novamente.'} />}
            <FieldWrapper label="E-mail">
              <TextInput type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="voce@email.com" />
            </FieldWrapper>
            <FieldWrapper label="Senha">
              <TextInput type="password" autoComplete="current-password" value={senha} onChange={(event) => setSenha(event.target.value)} required placeholder="Sua senha" />
            </FieldWrapper>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button type="button" onClick={handleDemoLogin} className="bg-white text-slate-950 hover:bg-emerald-100">
              Entrar em modo demonstração
            </Button>
            <p className="text-xs leading-5 text-slate-400">
              O modo demonstração cria uma sessão local para revisar as telas sem depender da API. Chamadas protegidas continuam usando fallback local.
            </p>
            <p className="text-sm text-slate-300">
              Ainda não tem conta?{' '}
              <Link className="font-black text-emerald-300 underline-offset-4 hover:underline" to={publicRoutePaths.register}>
                Criar cadastro
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
