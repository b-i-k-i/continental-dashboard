// import { useState } from 'react'
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import '@/styles/main.scss'

import { Loading } from './components/Loading/Loading'
import { GuestList } from './components/GuestList/GuestList';
import { GuestStatusChart } from './components/GuestStatusChart/GuestStatusChart';
import { HotelList } from './components/HotelList/HotelList';
import { ErrorFallback } from './components/ErrorFallback/ErrorFallback';

function App() {
  return (
    <main className="continental-app">
      <header className="app-header">
        <div className="logo-group">
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src="/react.svg" className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Continental Manager</h1>
      </header>

      <section className="content-section">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading message="Loading analytics..." />}>
            <GuestStatusChart />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section className="content-section">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
        >
          <Suspense fallback={<Loading message="Loading guests..." fullScreen={false} />}>
            <GuestList />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section className="content-section">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
        >
          <Suspense fallback={<Loading message="Loading hotels..." fullScreen={false} />}>
            <HotelList />
          </Suspense>
        </ErrorBoundary>
      </section>

    </main>
  );
}

export default App;
