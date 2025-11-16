import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import AITrainingArena from './pages/games/AITrainingArena'
import ChemicalCompoundCrafting from './pages/games/ChemicalCompoundCrafting'
import EcosystemSimulator from './pages/games/EcosystemSimulator'
import EscapeRoomLabDisaster from './pages/games/EscapeRoomLabDisaster'
import GeneSplicerSimulator from './pages/games/GeneSplicerSimulator'
import MindReadersDuel from './pages/games/MindReadersDuel'
import NeuroNetwork from './pages/games/NeuroNetwork'
import ParticleColliderChallenge from './pages/games/ParticleColliderChallenge'
import PhysicsPuzzleRelay from './pages/games/PhysicsPuzzleRelay'
import QuantumChess from './pages/games/QuantumChess'
import ScienceCodenames from './pages/games/ScienceCodenames'
import ScienceQuizShowdown from './pages/games/ScienceQuizShowdown'
import TimeLoopStrategist from './pages/games/TimeLoopStrategist'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="games">
          <Route path="ai-training-arena" element={<AITrainingArena />} />
          <Route path="chemical-compound-crafting" element={<ChemicalCompoundCrafting />} />
          <Route path="ecosystem-simulator" element={<EcosystemSimulator />} />
          <Route path="escape-room-lab-disaster" element={<EscapeRoomLabDisaster />} />
          <Route path="gene-splicer-simulator" element={<GeneSplicerSimulator />} />
          <Route path="mind-readers-duel" element={<MindReadersDuel />} />
          <Route path="neuro-network" element={<NeuroNetwork />} />
          <Route path="particle-collider-challenge" element={<ParticleColliderChallenge />} />
          <Route path="physics-puzzle-relay" element={<PhysicsPuzzleRelay />} />
          <Route path="quantum-chess" element={<QuantumChess />} />
          <Route path="science-codenames" element={<ScienceCodenames />} />
          <Route path="science-quiz-showdown" element={<ScienceQuizShowdown />} />
          <Route path="time-loop-strategist" element={<TimeLoopStrategist />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
