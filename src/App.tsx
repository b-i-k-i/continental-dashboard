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
        <h1>High Table Guest Insights</h1>

        <ul>
          <li>
            <a href="#hotel-list">Jump to Global Hotels</a>
          </li>
        </ul>
      </header>

     

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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading message="Loading analytics..." />}>
            <GuestStatusChart onStatusClick={(status) => console.log(status)}/>
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
