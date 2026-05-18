import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button, FieldWrapper, TextInput } from '../../components/ui/FormControls';
import { ErrorState, SuccessState } from '../../components/ui/StateView';
import { publicRoutePaths } from '../../constants/navigation';
import { useAuth } from '../../hooks/useAuth';

export function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await register({ nome, email, senha });
      setSuccess(true);
      
      // Tenta fazer login automático com as credenciais fornecidas
      window.setTimeout(async () => {
        try {
          await login({ email, senha });
          navigate('/dashboard', { replace: true });
        } catch {
          // Se falhar, redireciona para login
          navigate(publicRoutePaths.login, { replace: true });
        }
      }, 900);
    } catch (err) {
      // Erro já é capturado pelo estado de erro do hook
    }
  }

  return (
    <section className="px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-glow">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <UserPlus size={28} aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-black">Criar acesso</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            O cadastro usa apenas os campos já previstos pela API: nome, e-mail e senha. Dados sensíveis e perfil completo ficam fora deste escopo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl sm:p-6">
          <div className="grid gap-4">
            {success && <SuccessState compact title="Cadastro criado com sucesso!" description="Fazendo login e redirecionando para o sistema." />}
            {error && <ErrorState compact title="Não foi possível cadastrar" description={error.message || 'Revise os dados e tente novamente.'} />}
            <FieldWrapper label="Nome">
              <TextInput autoComplete="name" value={nome} onChange={(event) => setNome(event.target.value)} required placeholder="Seu nome" />
            </FieldWrapper>
            <FieldWrapper label="E-mail">
              <TextInput type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="voce@email.com" />
            </FieldWrapper>
            <FieldWrapper label="Senha">
              <TextInput type="password" autoComplete="new-password" value={senha} onChange={(event) => setSenha(event.target.value)} required minLength={6} placeholder="Mínimo de 6 caracteres" />
            </FieldWrapper>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar cadastro'}
            </Button>
            <p className="text-sm text-slate-300">
              Já tem cadastro?{' '}
              <Link className="font-black text-emerald-300 underline-offset-4 hover:underline" to={publicRoutePaths.login}>
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
