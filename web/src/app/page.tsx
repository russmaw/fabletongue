export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to FableTongue</h1>
      <p className="text-xl text-gray-600 mb-8">Learn languages through stories</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Story cards will go here */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Sample Story</h2>
          <p className="text-gray-600">Start your language learning journey with our engaging stories.</p>
        </div>
      </div>
    </div>
  )
} 