'use client'

import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

export class BoardErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[LessonBoard]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-red-50 p-4 text-center text-sm text-red-800">
          <p className="font-medium">Ошибка доски</p>
          <p className="max-w-md break-words">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-2 rounded bg-red-200 px-3 py-1 hover:bg-red-300"
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
