import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>Unbroken</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            This is a barebones React app ready for your custom component.
          </p>
        </div>
        <p className="read-the-docs">
          Ready to be deployed on Cloudflare Pages
        </p>
      </div>
    </>
  )
}

export default App