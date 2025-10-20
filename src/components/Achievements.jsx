import { ArrowLeft, Trophy, Lock } from 'lucide-react'
import { ACHIEVEMENTS } from '../utils/achievements'

const Achievements = ({ unlockedAchievements, onBack }) => {
  const unlockedIds = unlockedAchievements.map(a => a.id)

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
              <h1 className="text-2xl font-bold">Achievements</h1>
              <p className="text-sm text-white/80">
                {unlockedAchievements.length} of {ACHIEVEMENTS.length} unlocked
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-3">
        {/* Progress Bar */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-primary-600">
              {Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id)
          const unlockedData = unlockedAchievements.find(a => a.id === achievement.id)

          return (
            <div
              key={achievement.id}
              className={`card transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300'
                  : 'bg-white/50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-yellow-100'
                      : 'bg-gray-200'
                  }`}
                >
                  {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  {isUnlocked && unlockedData && (
                    <p className="text-xs text-yellow-700 mt-2">
                      Unlocked {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Achievements
