import Link from 'next/link'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-20 pb-16 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl tracking-tight font-black text-gray-900 sm:text-6xl md:text-7xl">
              <span className="block transform hover:scale-105 transition-transform duration-200">
                Smart Expense
              </span>
              <span className="block text-yellow-600 transform hover:scale-105 transition-transform duration-200">
                Tracking Revolution
              </span>
            </h1>
            <p className="mt-6 max-w-md mx-auto text-xl text-gray-700 sm:text-2xl md:mt-8 md:max-w-3xl">
              Transform your financial future with cutting-edge expense tracking. 
              <span className="block mt-2 font-semibold">Built for modern professionals.</span>
            </p>
          </div>

          <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 gap-4">
            <Link
              href="/auth/signin"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-600 text-lg font-bold rounded-lg text-white bg-yellow-600 hover:bg-yellow-700 hover:border-yellow-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started →
            </Link>
            <Link
              href="/auth/signup"
              className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-600 text-lg font-bold rounded-lg text-yellow-600 bg-transparent hover:bg-yellow-50 transform hover:scale-105 transition-all duration-200"
            >
              Sign Up Free
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900">Smart Analytics</h3>
              <p className="mt-2 text-gray-600">AI-powered insights to optimize your spending</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900">Real-time Tracking</h3>
              <p className="mt-2 text-gray-600">Monitor expenses as they happen</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900">Smart Budgeting</h3>
              <p className="mt-2 text-gray-600">Automated budget recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

