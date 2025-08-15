import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
          Unbroken
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-600 dark:text-gray-300">
            This is a barebones React app ready for your custom component.
          </p>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Ready to be deployed on Cloudflare Pages
        </p>
      </div>
    </div>
  )
}

export default App