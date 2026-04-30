import MusicPanel from './components/music/music-panel'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Ω-SONATA</h1>
        <p className="app-subtitle">Generative Music Engine</p>
      </header>
      <main className="app-main">
        <MusicPanel />
      </main>
    </div>
  )
}

export default App
