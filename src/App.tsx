import { About } from './components/About'
import { Book } from './components/Book'
import { Collabs } from './components/Collabs'
import { Gigs } from './components/Gigs'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { Sets } from './components/Sets'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main>
        <Hero />
        <About />
        <Sets />
        <Collabs />
        <Gigs />
        <Book />
      </main>
    </div>
  )
}
