import { useState } from 'react'
import { Cigarette, Wind, Target, TrendingDown } from 'lucide-react'

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    cigarettesPerWeek: '',
    vapesPerWeek: '',
    planSpeed: 'medium',
    cigarettePrice: '8',
    vapePrice: '15'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      onComplete({
        cigarettesPerWeek: parseInt(formData.cigarettesPerWeek) || 0,
        vapesPerWeek: parseInt(formData.vapesPerWeek) || 0,
        planSpeed: formData.planSpeed,
        cigarettePrice: parseFloat(formData.cigarettePrice) || 8,
        vapePrice: parseFloat(formData.vapePrice) || 15,
        startDate: Date.now()
      })
    }
  }

  const canProceed = () => {
    switch(step) {
      case 0:
        return true
      case 1:
        return (parseInt(formData.cigarettesPerWeek) > 0 || parseInt(formData.vapesPerWeek) > 0)
      case 2:
        return formData.planSpeed !== ''
      case 3:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-6 text-center">
            <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to Your Quitting Journey
            </h1>
            <p className="text-gray-600 text-lg">
              Let's create a personalized plan to help you gradually reduce and eventually quit smoking and vaping.
            </p>
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-sm text-primary-800">
                ✨ This app will help you reduce consumption gradually, send you notifications when you're allowed to smoke, and track your progress with achievements!
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Current Consumption
            </h2>
            <p className="text-gray-600 text-center">
              How much do you currently smoke or vape per week?
            </p>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Cigarette className="w-5 h-5 text-orange-600" />
                  </div>
                  <label className="font-semibold text-gray-800">Cigarettes per week</label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.cigarettesPerWeek}
                  onChange={(e) => handleInputChange('cigarettesPerWeek', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 70 (about 10 per day)"
                />
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wind className="w-5 h-5 text-blue-600" />
                  </div>
                  <label className="font-semibold text-gray-800">Vape sessions per week</label>
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.vapesPerWeek}
                  onChange={(e) => handleInputChange('vapesPerWeek', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 140 (about 20 per day)"
                />
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 Be honest! The more accurate you are, the better your personalized plan will be.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Choose Your Pace
            </h2>
            <p className="text-gray-600 text-center">
              How quickly would you like to reduce?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleInputChange('planSpeed', 'slow')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  formData.planSpeed === 'slow' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">🐌 Slow & Steady</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Reduce by 5% each week - gentle approach
                    </div>
                  </div>
                  {formData.planSpeed === 'slow' && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleInputChange('planSpeed', 'medium')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  formData.planSpeed === 'medium' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">⚡ Medium Pace</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Reduce by 10% each week - balanced approach
                    </div>
                  </div>
                  {formData.planSpeed === 'medium' && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleInputChange('planSpeed', 'quick')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  formData.planSpeed === 'quick' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">🚀 Quick Track</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Reduce by 15% each week - faster results
                    </div>
                  </div>
                  {formData.planSpeed === 'quick' && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                You're All Set!
              </h2>
              <p className="text-gray-600 mt-2">
                Your personalized quitting plan is ready
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Starting consumption:</span>
                <span className="font-bold text-gray-900">
                  {(parseInt(formData.cigarettesPerWeek) || 0) + (parseInt(formData.vapesPerWeek) || 0)} per week
                </span>
              </div>
              {parseInt(formData.cigarettesPerWeek) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cigarettes:</span>
                  <span className="font-bold text-orange-600">{formData.cigarettesPerWeek} per week</span>
                </div>
              )}
              {parseInt(formData.vapesPerWeek) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Vapes:</span>
                  <span className="font-bold text-blue-600">{formData.vapesPerWeek} per week</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Reduction pace:</span>
                <span className="font-bold text-primary-600 capitalize">{formData.planSpeed}</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                📱 <strong>Important:</strong> We'll ask for notification permission on the next screen so we can remind you when you're allowed to smoke!
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-blue-500 to-purple-600 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="card">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`btn-primary flex-1 ${
                !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {step === 3 ? 'Start My Journey' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
