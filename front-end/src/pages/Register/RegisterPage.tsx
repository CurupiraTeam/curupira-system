import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
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
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#07090d] px-4 py-12 md:px-6">
      {/* Ambient Forest Photo Background with Deep Emerald/Dark Slate Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(6, 78, 59, 0.82), rgba(2, 6, 23, 0.90)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80')"
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Glowing Ambient Forest Orbs */}
      <div className="absolute -top-48 -left-48 w-[40rem] h-[40rem] rounded-full bg-emerald-400/20 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-48 -right-48 w-[40rem] h-[40rem] rounded-full bg-teal-400/20 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-white hover:text-emerald-300 transition duration-300 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg shadow-black/35"
      >
        <ArrowLeft size={16} /> Voltar para a Home
      </Link>

      <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="rounded-[2.5rem] bg-slate-950/65 border border-white/20 backdrop-blur-xl p-8 text-white shadow-2xl flex flex-col justify-between min-h-[350px]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-emerald-300 border border-emerald-500/20 mb-6">
              🌿 Conecte-se ao Curupira
            </span>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition-transform duration-300 hover:rotate-6">
              <UserPlus size={28} aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Criar acesso
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              O cadastro usa apenas os campos necessários pela API: seu nome, e-mail de acesso e senha. Dados sensíveis e perfis adicionais não são armazenados.
            </p>
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 text-xs text-slate-400">
            Sua participação cidadã fortalece a rede de monitoramento.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2.5rem] bg-slate-950/65 border border-white/20 backdrop-blur-xl p-6 text-white shadow-2xl sm:p-8">
          <div className="grid gap-5">
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
            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 mt-2 rounded-2xl shadow-lg shadow-emerald-500/10 active:scale-95 transition-all">
              {isLoading ? 'Criando...' : 'Criar cadastro'}
            </Button>
            <div className="border-t border-white/5 pt-4 text-center">
              <p className="text-sm text-slate-300">
                Já tem cadastro?{' '}
                <Link className="font-black text-emerald-300 underline-offset-4 hover:underline hover:text-emerald-200 transition" to={publicRoutePaths.login}>
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
