import React, { FC } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from './components/layout/Layout'
import styles from './index.module.scss'
import { CompGraphDataProvider } from './providers/CompGraphDataProvider'

const App: FC = () => {
  return (
    <CompGraphDataProvider>
      <div className={styles.root}>
        <Layout />
      </div>
    </CompGraphDataProvider>
  )
}

const app = document.getElementById('app')
if (app !== null) {
  const root = createRoot(app)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
