import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, RefreshCw, MessageCircle } from 'lucide-react'
import quotesData from '../utils/quotes.json'
import { storage } from '../utils/storage'

const CravingHelp = ({ onBack }) => {
  const [currentQuote, setCurrentQuote] = useState('')
  const [responses, setResponses] = useState({})
  const [showQuestions, setShowQuestions] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {
    // Load saved responses
    const savedResponses = storage.getCravingResponses()
    setResponses(savedResponses)
    
    // Get a random quote
    getRandomQuote()
  }, [])

  const getRandomQuote = () => {
    const quotes = quotesData.motivational_quotes
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setCurrentQuote(quotes[randomIndex])
  }

  const handleResponseChange = (questionIndex, answer) => {
    const updatedResponses = {
      ...responses,
      [questionIndex]: answer
    }
    setResponses(updatedResponses)
    storage.saveCravingResponses(updatedResponses)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quotesData.questions_with_facts.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowQuestions(false)
      setCurrentQuestion(0)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-blue-500 to-purple-600 pb-20">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg p-4 text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Craving Help</h1>
              <p className="text-sm text-white/80">Stay strong, you got this!</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Motivational Quote */}
        {!showQuestions && (
          <>
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  You're Stronger Than Your Craving
                </h2>
              </div>
              
              <div className="bg-white p-6 rounded-xl mb-4">
                <p className="text-gray-800 text-lg italic text-center leading-relaxed">
                  "{currentQuote}"
                </p>
              </div>

              <button
                onClick={getRandomQuote}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Get Another Quote
              </button>
            </div>

            {/* Quick Tips */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-3">Quick Tips to Beat Cravings</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">💧 Drink Water</p>
                  <p className="text-xs text-blue-700">Hydration can reduce cravings significantly</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-green-800">🚶 Take a Walk</p>
                  <p className="text-xs text-green-700">5 minutes of movement can distract your mind</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-purple-800">🧘 Deep Breathing</p>
                  <p className="text-xs text-purple-700">Breathe in for 4, hold for 4, out for 4</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-800">📱 Call Someone</p>
                  <p className="text-xs text-yellow-700">Talk to a friend or family member</p>
                </div>
              </div>
            </div>

            {/* Reflection Questions Button */}
            <button
              onClick={() => setShowQuestions(true)}
              className="card hover:shadow-2xl transition-all active:scale-95 border-2 border-primary-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-800">Reflection Questions</h3>
                  <p className="text-sm text-gray-600">Answer questions about your journey</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                </div>
              </div>
            </button>
          </>
        )}

        {/* Questions Section */}
        {showQuestions && (
          <div className="card">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  Question {currentQuestion + 1} of {quotesData.questions_with_facts.length}
                </span>
                <button
                  onClick={() => setShowQuestions(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{ width: `${((currentQuestion + 1) / quotesData.questions_with_facts.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">
                {quotesData.questions_with_facts[currentQuestion].question}
              </h3>

              <textarea
                value={responses[currentQuestion] || ''}
                onChange={(e) => handleResponseChange(currentQuestion, e.target.value)}
                placeholder="Type your answer here..."
                className="input-field min-h-[120px] resize-none"
              />

              {quotesData.questions_with_facts[currentQuestion].fun_fact && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-1">💡 Did you know?</p>
                  <p className="text-sm text-blue-700">
                    {quotesData.questions_with_facts[currentQuestion].fun_fact}
                  </p>
                </div>
              )}

              {quotesData.questions_with_facts[currentQuestion].explanation && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-purple-800 mb-1">ℹ️ Info</p>
                  <p className="text-sm text-purple-700">
                    {quotesData.questions_with_facts[currentQuestion].explanation}
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {currentQuestion > 0 && (
                  <button
                    onClick={handlePrevQuestion}
                    className="btn-secondary flex-1"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  className="btn-primary flex-1"
                >
                  {currentQuestion < quotesData.questions_with_facts.length - 1 ? 'Next' : 'Finish'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Help */}
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
          <h3 className="font-bold text-gray-800 mb-3">⚠️ Struggling?</h3>
          <p className="text-gray-700 mb-3">
            Remember: A craving typically lasts only 5-10 minutes. You can ride it out!
          </p>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              If you're experiencing severe withdrawal symptoms, please consult a healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CravingHelp
