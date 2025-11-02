import { useState } from 'react'
import { Cigarette, Wind, Target, TrendingDown } from 'lucide-react'

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    cigarettesPerWeek: '',
    vapesPerWeek: '',
    planSpeed: 'medium',
    reductionFrequency: 'weekly', // 'weekly' or 'daily'
    reductionMethod: 'compound', // 'compound' (% of current) or 'linear' (% of original)
    adaptiveMode: true, // Enable adaptive plan by default
    currency: 'USD', // 'USD' or 'EUR'
    cigarettePrice: '8.00',
    vapePrice: '15.00'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      onComplete({
        name: formData.name.trim(),
        cigarettesPerWeek: parseInt(formData.cigarettesPerWeek) || 0,
        vapesPerWeek: parseInt(formData.vapesPerWeek) || 0,
        planSpeed: formData.planSpeed,
        reductionFrequency: formData.reductionFrequency,
        reductionMethod: formData.reductionMethod,
        adaptiveMode: formData.adaptiveMode,
        currency: formData.currency,
        cigarettePrice: parseFloat(formData.cigarettePrice) || 8,
        vapePrice: parseFloat(formData.vapePrice) || 15,
        startDate: Date.now()
      })
    }
  }

  const canProceed = () => {
    switch(step) {
      case 0:
        return formData.name.trim().length > 0
      case 1:
        return (parseInt(formData.cigarettesPerWeek) > 0 || parseInt(formData.vapesPerWeek) > 0)
      case 2:
        return formData.planSpeed !== ''
      case 3:
        const hasValidCigPrice = parseInt(formData.cigarettesPerWeek) > 0 ? parseFloat(formData.cigarettePrice) > 0 : true
        const hasValidVapePrice = parseInt(formData.vapesPerWeek) > 0 ? parseFloat(formData.vapePrice) > 0 : true
        return hasValidCigPrice && hasValidVapePrice
      case 4:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4 text-center">
              <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-primary-600" />
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
                {formData.name.trim() ? `Great to meet you, ${formData.name.trim()}!` : 'Let\'s personalize your journey'}
              </h1>
              <p className="text-gray-600 text-lg">
                Let's create a personalized plan to help you gradually reduce and eventually quit smoking and vaping.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border-2 border-primary-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="onboarding-name">
                What's your name?
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field text-lg"
                placeholder="e.g., Alex"
              />
              <p className="text-xs text-gray-500 mt-2">
                We use your name to personalize your journey and celebrations.
              </p>
            </div>

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

            {/* Adaptive Mode Toggle */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.adaptiveMode}
                  onChange={(e) => handleInputChange('adaptiveMode', e.target.checked)}
                  className="w-5 h-5 text-purple-600 mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-900 mb-1">🧠 Smart Adaptive Plan (Recommended)</p>
                  <p className="text-xs text-purple-700">
                    Your plan adjusts based on your actual behavior. Includes minimum wait rules to build better habits and rewards for staying on track!
                  </p>
                </div>
              </div>
            </div>

            {/* Reduction Frequency */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-3">Reduction Frequency</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reductionFrequency"
                    value="weekly"
                    checked={formData.reductionFrequency === 'weekly'}
                    onChange={(e) => handleInputChange('reductionFrequency', e.target.value)}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span className="text-gray-800">Reduce gradually each week</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reductionFrequency"
                    value="daily"
                    checked={formData.reductionFrequency === 'daily'}
                    onChange={(e) => handleInputChange('reductionFrequency', e.target.value)}
                    className="w-5 h-5 text-primary-600"
                  />
                  <span className="text-gray-800">Reduce gradually each day</span>
                </label>
              </div>
            </div>

            {/* Reduction Method (only for daily) */}
            {formData.reductionFrequency === 'daily' && (
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-3">📊 Daily Reduction Method</p>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer bg-white p-3 rounded-lg border-2 transition-all hover:border-blue-300">
                    <input
                      type="radio"
                      name="reductionMethod"
                      value="compound"
                      checked={formData.reductionMethod === 'compound'}
                      onChange={(e) => handleInputChange('reductionMethod', e.target.value)}
                      className="w-5 h-5 text-primary-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-gray-800 font-semibold block">Compound (Faster)</span>
                      <span className="text-xs text-gray-600">Reduce by % of current amount each day</span>
                      <div className="mt-1 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        Example: 200 → 180 (-10%) → 162 (-10%) → 146 (-10%)
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer bg-white p-3 rounded-lg border-2 transition-all hover:border-blue-300">
                    <input
                      type="radio"
                      name="reductionMethod"
                      value="linear"
                      checked={formData.reductionMethod === 'linear'}
                      onChange={(e) => handleInputChange('reductionMethod', e.target.value)}
                      className="w-5 h-5 text-primary-600 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-gray-800 font-semibold block">Linear (Steady)</span>
                      <span className="text-xs text-gray-600">Reduce by % of original amount each day</span>
                      <div className="mt-1 text-xs text-blue-700 bg-blue-50 p-2 rounded">
                        Example: 200 → 180 (-10%) → 160 (-10%) → 140 (-10%)
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Reduction Speed */}
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
                      Reduce by 5% each {formData.reductionFrequency === 'daily' ? 'day' : 'week'} - gentle approach
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
                      Reduce by 10% each {formData.reductionFrequency === 'daily' ? 'day' : 'week'} - balanced approach
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
                      Reduce by 15% each {formData.reductionFrequency === 'daily' ? 'day' : 'week'} - faster results
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
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Cost Information
            </h2>
            <p className="text-gray-600 text-center">
              Help us calculate your savings
            </p>

            {/* Currency Selection */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-3">Currency</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleInputChange('currency', 'USD')}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.currency === 'USD'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">$</div>
                  <div className="font-semibold text-gray-800">USD</div>
                  <div className="text-xs text-gray-600">US Dollar</div>
                </button>
                <button
                  onClick={() => handleInputChange('currency', 'EUR')}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    formData.currency === 'EUR'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-1">€</div>
                  <div className="font-semibold text-gray-800">EUR</div>
                  <div className="text-xs text-gray-600">Euro</div>
                </button>
              </div>
            </div>

            {/* Cigarette Price */}
            {parseInt(formData.cigarettesPerWeek) > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  🚬 Cigarette Pack Price ({formData.currency === 'USD' ? '$' : '€'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cigarettePrice}
                  onChange={(e) => handleInputChange('cigarettePrice', e.target.value)}
                  className="input-field text-lg"
                  placeholder="8.00"
                />
                <p className="text-xs text-gray-600">
                  Price per pack of 20 cigarettes
                </p>
              </div>
            )}

            {/* Vape Price */}
            {parseInt(formData.vapesPerWeek) > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  💨 Vape/Pod Price ({formData.currency === 'USD' ? '$' : '€'})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.vapePrice}
                  onChange={(e) => handleInputChange('vapePrice', e.target.value)}
                  className="input-field text-lg"
                  placeholder="15.00"
                />
                <p className="text-xs text-gray-600">
                  Price per vape device or pod refill
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💰 <strong>Note:</strong> This helps us calculate your savings accurately as you reduce your consumption.
              </p>
            </div>
          </div>
        )

      case 4:
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
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Cigarettes:</span>
                    <span className="font-bold text-orange-600">{formData.cigarettesPerWeek} per week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Pack price:</span>
                    <span className="font-bold text-gray-900">{formData.currency === 'USD' ? '$' : '€'}{parseFloat(formData.cigarettePrice).toFixed(2)}</span>
                  </div>
                </>
              )}
              {parseInt(formData.vapesPerWeek) > 0 && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Vapes:</span>
                    <span className="font-bold text-blue-600">{formData.vapesPerWeek} per week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Vape price:</span>
                    <span className="font-bold text-gray-900">{formData.currency === 'USD' ? '$' : '€'}{parseFloat(formData.vapePrice).toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Reduction pace:</span>
                <span className="font-bold text-primary-600 capitalize">{formData.planSpeed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Currency:</span>
                <span className="font-bold text-gray-900">{formData.currency}</span>
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
            {[0, 1, 2, 3, 4].map((i) => (
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
