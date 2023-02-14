import React from 'react'

function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Welcome!</h1>
      <p className="py-6">This is a smart irrigation system</p>
      <button className="btn btn-primary" onClick={()=> window.location.href = "dashboard"}>Get Started</button>
    </div>
  </div>
</div>
  )
}

export default Home