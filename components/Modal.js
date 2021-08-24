import { useState, useEffect, useCallback } from 'react'

export default function Modal({ showing, children }) {
  const [isShowing, setIsShowing] = useState(showing || false)

  const escFunction = useCallback(event => {
    if (event.keyCode === 27) {
      setIsShowing(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)
    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [])

  return (
    <div
      onClick={event => {
        if (event.target === event.currentTarget) setIsShowing(false)
      }}
      className={`z-40 bg-black bg-opacity-50 px-2 pt-10 ${
        isShowing ? 'fixed' : 'hidden'
      } top-0 left-0 right-0 bottom-0`}
    >
      <div
        role="dialog"
        className="bg-white rounded max-w-xl mx-auto px-6 py-4 relative"
      >
        {children}
        <button
          onClick={() => setIsShowing(false)}
          className="py-1 px-2 absolute top-2 right-3 text-xs text-gray-500 flex place-items-center"
        >
          close&nbsp;
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}