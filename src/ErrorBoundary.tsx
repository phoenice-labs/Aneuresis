import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0f2044', color: 'white', flexDirection: 'column', gap: 16, padding: 32,
          fontFamily: 'monospace',
        }}>
          <h2 style={{ color: '#f59e0b' }}>⚠ Runtime Error</h2>
          <pre style={{
            background: 'rgba(255,255,255,0.08)', padding: 20, borderRadius: 8,
            maxWidth: 800, overflow: 'auto', fontSize: '0.85rem', color: '#fca5a5',
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
