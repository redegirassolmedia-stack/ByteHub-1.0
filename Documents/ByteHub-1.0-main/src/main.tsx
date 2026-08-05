import {StrictMode, Component, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState { hasError: boolean; error: Error | null; }
class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: {componentStack: string}) {
    console.error('=== ERRO DE RENDERIZAÇÃO (TELA BRANCA) ===');
    console.error('Erro:', error);
    console.error('Stack do Componente:', info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:'2rem',fontFamily:'monospace',background:'#0f172a',color:'#f87171',minHeight:'100vh'}}>
          <h1 style={{color:'#fbbf24',fontSize:'1.5rem',marginBottom:'1rem'}}>⚠️ Erro de Renderização Detectado</h1>
          <p style={{color:'#94a3b8',marginBottom:'0.5rem'}}>Abra o Console do browser (F12) para ver o detalhe completo.</p>
          <pre style={{background:'#1e293b',padding:'1rem',borderRadius:'0.5rem',overflow:'auto',fontSize:'0.8rem',color:'#f87171'}}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
