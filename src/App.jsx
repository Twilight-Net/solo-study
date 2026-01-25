import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Target, Clock, Book, Zap, Star, ChevronUp, Plus, Play, Pause, RotateCcw, Flame, Sword } from 'lucide-react';

const SoloStudySystem = () => {
  const [user, setUser] = useState({
    name: "Hunter",
    rank: "E-Rank",
    level: 1,
    xp: 0,
    xpToNext: 100,
    totalStudyTime: 0
  });

  const [targets, setTargets] = useState([]);
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [showRankUp, setShowRankUp] = useState(false);
  const [showPowerAwakening, setShowPowerAwakening] = useState(false);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const [newTarget, setNewTarget] = useState({ subject: '', chapter: '', deadline: '' });
  const [activeTab, setActiveTab] = useState('overview');
  
  const timerRef = useRef(null);

  const ranks = [
    { name: "E-Rank", level: 1, color: "from-slate-400 to-slate-600", glow: "shadow-slate-500/50", icon: "⚔️" },
    { name: "D-Rank", level: 5, color: "from-emerald-400 to-emerald-600", glow: "shadow-emerald-500/50", icon: "🗡️" },
    { name: "C-Rank", level: 10, color: "from-cyan-400 to-blue-600", glow: "shadow-cyan-500/50", icon: "⚡" },
    { name: "B-Rank", level: 20, color: "from-violet-400 to-purple-600", glow: "shadow-violet-500/50", icon: "🔮" },
    { name: "A-Rank", level: 35, color: "from-amber-400 to-orange-600", glow: "shadow-amber-500/50", icon: "👑" },
    { name: "S-Rank", level: 50, color: "from-red-500 to-rose-700", glow: "shadow-red-500/50", icon: "🔥" },
    { name: "National Level", level: 75, color: "from-orange-500 via-red-600 to-rose-700", glow: "shadow-orange-500/70", icon: "⭐" },
    { name: "Shadow Monarch", level: 100, color: "from-purple-600 via-indigo-800 to-black", glow: "shadow-purple-700/90", icon: "👁️" }
  ];

  const subjects = {
    Physics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"],
    Chemistry: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Analytical Chemistry"],
    Biology: ["Cell Biology", "Genetics", "Evolution", "Ecology", "Human Physiology", "Plant Physiology"]
  };

  const calculateDifficulty = (chapter, timeLimit) => {
    const baseXP = 50;
    const chapterMultiplier = 1.5;
    const timeBonus = Math.max(1, 5 - (timeLimit / 7));
    return Math.floor(baseXP * chapterMultiplier * timeBonus);
  };

  const getCurrentRank = () => {
    let currentRank = ranks[0];
    for (let rank of ranks) {
      if (user.level >= rank.level) {
        currentRank = rank;
      }
    }
    return currentRank;
  };

  const addTarget = (target) => {
    if (!target.subject || !target.chapter || !target.deadline) return;
    const xpReward = calculateDifficulty(target.chapter, target.daysToComplete);
    setTargets([...targets, { ...target, id: Date.now(), completed: false, xpReward }]);
    setShowAddTarget(false);
    setNewTarget({ subject: '', chapter: '', deadline: '' });
  };

  const completeTarget = (targetId) => {
    const target = targets.find(t => t.id === targetId);
    if (!target || target.completed) return;

    const newXP = user.xp + target.xpReward;
    const currentRank = getCurrentRank();
    const nextRank = ranks[ranks.findIndex(r => r.name === currentRank.name) + 1];

    setTargets(targets.map(t => t.id === targetId ? { ...t, completed: true } : t));

    if (nextRank && user.level + 1 >= nextRank.level) {
      setTimeout(() => {
        setShowRankUp(true);
        setTimeout(() => {
          setShowPowerAwakening(true);
          setTimeout(() => {
            setShowPowerAwakening(false);
            setShowRankUp(false);
          }, 3000);
        }, 2000);
      }, 500);
    }

    setUser({
      ...user,
      xp: newXP >= user.xpToNext ? newXP - user.xpToNext : newXP,
      level: newXP >= user.xpToNext ? user.level + 1 : user.level,
      xpToNext: newXP >= user.xpToNext ? Math.floor(user.xpToNext * 1.5) : user.xpToNext
    });
  };

  useEffect(() => {
    if (pomodoroActive && pomodoroTime > 0) {
      timerRef.current = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setPomodoroActive(false);
      if (pomodoroMode === 'work') {
        setUser(prev => ({ ...prev, totalStudyTime: prev.totalStudyTime + 25 }));
      }
      setPomodoroMode(pomodoroMode === 'work' ? 'break' : 'work');
      setPomodoroTime(pomodoroMode === 'work' ? 5 * 60 : 25 * 60);
    }
    return () => clearInterval(timerRef.current);
  }, [pomodoroActive, pomodoroTime, pomodoroMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentRank = getCurrentRank();
  const xpPercentage = (user.xp / user.xpToNext) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Rank Up Animation */}
      {showRankUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          <div className="relative">
            {/* Shadow Circles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-4 rounded-full animate-ping"
                style={{
                  borderColor: i % 2 === 0 ? '#a855f7' : '#ec4899',
                  width: `${(i + 1) * 80}px`,
                  height: `${(i + 1) * 80}px`,
                  margin: 'auto',
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '2.5s'
                }}
              />
            ))}
            
            {/* Energy Particles */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  background: `hsl(${Math.random() * 360}, 100%, 60%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 2 + 1}s`
                }}
              />
            ))}
            
            <div className="relative z-10 text-center">
              <div className="text-9xl mb-4 animate-bounce" style={{ animationDuration: '0.6s' }}>
                {currentRank.icon}
              </div>
              <h1 className="text-8xl font-black mb-6 tracking-wider" style={{
                background: `linear-gradient(to right, #fbbf24, #f59e0b, #f97316)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 80px rgba(251, 191, 36, 0.8)',
                animation: 'pulse 1s ease-in-out infinite'
              }}>
                LEVEL UP!
              </h1>
              
              <ChevronUp className="w-40 h-40 mx-auto text-yellow-400 animate-bounce mb-6" style={{ 
                animationDuration: '0.4s',
                filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.9))'
              }} />
              
              <p className="text-7xl font-black tracking-widest" style={{
                background: `linear-gradient(to right, #a855f7, #ec4899)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                LVL {user.level}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Power Awakening Animation */}
      {showPowerAwakening && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative">
            {/* Massive Aura Rings */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border-8 animate-ping"
                style={{
                  borderColor: i % 2 === 0 ? '#8b5cf6' : '#d946ef',
                  width: `${(i + 1) * 150}px`,
                  height: `${(i + 1) * 150}px`,
                  margin: 'auto',
                  inset: 0,
                  animationDelay: `${i * 0.25}s`,
                  animationDuration: '3s',
                  boxShadow: `0 0 60px ${i % 2 === 0 ? '#8b5cf6' : '#d946ef'}`
                }}
              />
            ))}
            
            {/* Lightning Particles */}
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full animate-ping"
                style={{
                  background: `hsl(${270 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 1.5 + 0.5}s`,
                  boxShadow: `0 0 20px currentColor`
                }}
              />
            ))}
            
            <div className="relative z-10 text-center">
              <Zap className="w-52 h-52 mx-auto mb-8 animate-pulse" style={{
                color: '#a855f7',
                filter: 'drop-shadow(0 0 80px #a855f7) drop-shadow(0 0 120px #d946ef)',
                animation: 'pulse 0.8s ease-in-out infinite'
              }} />
              
              <div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '0.5s' }}>
                {currentRank.icon}
              </div>
              
              <h2 className={`text-8xl font-black tracking-wider mb-6 bg-gradient-to-r ${currentRank.color} bg-clip-text text-transparent`}
                  style={{ 
                    textShadow: '0 0 60px rgba(168, 85, 247, 0.8)',
                    animation: 'pulse 1s ease-in-out infinite'
                  }}>
                {currentRank.name}
              </h2>
              
              <p className="text-5xl font-bold tracking-widest" style={{
                background: 'linear-gradient(to right, #a855f7, #ec4899, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'pulse 1.2s ease-in-out infinite'
              }}>
                ⚡ POWER AWAKENED ⚡
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Horizontal Layout */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="mb-6">
          <div className={`bg-gradient-to-r ${currentRank.color} p-1 rounded-3xl shadow-2xl ${currentRank.glow} animate-gradient`}>
            <div className="bg-slate-950 bg-opacity-95 backdrop-blur-xl rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-8xl animate-float">{currentRank.icon}</div>
                  <div>
                    <h1 className="text-5xl font-black tracking-wide bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      {user.name}
                    </h1>
                    <div className={`text-3xl font-bold mt-1 bg-gradient-to-r ${currentRank.color} bg-clip-text text-transparent`}>
                      {currentRank.name}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {user.level}
                  </div>
                  <div className="text-lg text-purple-300 font-semibold">LEVEL</div>
                  <div className="text-sm text-gray-400 mt-1">⏱️ {user.totalStudyTime}min studied</div>
                </div>
              </div>
              
              {/* XP Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-purple-300">XP: {user.xp} / {user.xpToNext}</span>
                  <span className="text-pink-300">{Math.floor(xpPercentage)}%</span>
                </div>
                <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-purple-500 shadow-inner">
                  <div 
                    className={`h-full bg-gradient-to-r ${currentRank.color} relative transition-all duration-700 ease-out`}
                    style={{ width: `${xpPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Tabs Navigation */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          {[
            { id: 'overview', icon: Trophy, label: 'Overview' },
            { id: 'pomodoro', icon: Clock, label: 'Pomodoro' },
            { id: 'targets', icon: Target, label: 'Targets' },
            { id: 'ranks', icon: Star, label: 'Ranks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-105'
                  : 'bg-slate-800 bg-opacity-50 hover:bg-opacity-70'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="relative">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 bg-opacity-50 backdrop-blur-xl rounded-3xl p-8 border border-purple-500 shadow-2xl shadow-purple-500/30">
                <Flame className="w-16 h-16 text-orange-400 mb-4 animate-pulse" />
                <div className="text-5xl font-black text-white mb-2">{targets.filter(t => t.completed).length}</div>
                <div className="text-xl text-purple-200">Completed Quests</div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-900 to-pink-950 bg-opacity-50 backdrop-blur-xl rounded-3xl p-8 border border-pink-500 shadow-2xl shadow-pink-500/30">
                <Target className="w-16 h-16 text-pink-400 mb-4 animate-pulse" />
                <div className="text-5xl font-black text-white mb-2">{targets.filter(t => !t.completed).length}</div>
                <div className="text-xl text-pink-200">Active Quests</div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-900 to-cyan-950 bg-opacity-50 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500 shadow-2xl shadow-cyan-500/30">
                <Clock className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
                <div className="text-5xl font-black text-white mb-2">{user.totalStudyTime}</div>
                <div className="text-xl text-cyan-200">Minutes Trained</div>
              </div>
            </div>
          )}

          {/* Pomodoro Tab */}
          {activeTab === 'pomodoro' && (
            <div className="animate-fadeIn">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 bg-opacity-70 backdrop-blur-xl rounded-3xl p-12 border border-purple-500 shadow-2xl text-center">
                <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {pomodoroMode === 'work' ? '⚔️ BATTLE MODE' : '☕ REST PHASE'}
                </h2>
                
                <div className="relative inline-block mb-8">
                  <div className={`text-9xl font-black font-mono tabular-nums ${
                    pomodoroMode === 'work' ? 'text-purple-400' : 'text-green-400'
                  }`} style={{ textShadow: '0 0 40px currentColor' }}>
                    {formatTime(pomodoroTime)}
                  </div>
                  {pomodoroActive && (
                    <div className="absolute -inset-8 border-4 border-purple-500 rounded-full animate-ping opacity-50"></div>
                  )}
                </div>
                
                <div className="flex gap-6 justify-center">
                  <button
                    onClick={() => setPomodoroActive(!pomodoroActive)}
                    className={`px-12 py-6 rounded-2xl font-black text-2xl flex items-center gap-4 transition-all transform hover:scale-110 shadow-2xl ${
                      pomodoroActive
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-500/50'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/50'
                    }`}
                  >
                    {pomodoroActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    {pomodoroActive ? 'PAUSE' : 'START'}
                  </button>
                  <button
                    onClick={() => {
                      setPomodoroActive(false);
                      setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
                    }}
                    className="bg-slate-700 hover:bg-slate-600 px-12 py-6 rounded-2xl font-black text-2xl flex items-center gap-4 transition-all transform hover:scale-110 shadow-2xl shadow-slate-500/30"
                  >
                    <RotateCcw className="w-8 h-8" />
                    RESET
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Targets Tab */}
          {activeTab === 'targets' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ACTIVE QUESTS
                </h2>
                <button
                  onClick={() => setShowAddTarget(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all transform hover:scale-110 shadow-lg shadow-purple-500/50"
                >
                  <Plus className="w-6 h-6" />
                  NEW QUEST
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {targets.map(target => (
                  <div
                    key={target.id}
                    className={`rounded-3xl border-2 p-6 transition-all transform hover:scale-105 ${
                      target.completed
                        ? 'bg-gradient-to-br from-green-900 to-emerald-950 border-green-500 shadow-xl shadow-green-500/30'
                        : 'bg-gradient-to-br from-slate-900 to-slate-950 border-purple-500 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-sm text-purple-300 mb-1 font-semibold">{target.subject}</div>
                        <h3 className="text-2xl font-black text-white">{target.chapter}</h3>
                        <p className="text-sm text-gray-400 mt-2">
                          📅 {new Date(target.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-lg">
                        <Star className="w-5 h-5" />
                        {target.xpReward}
                      </div>
                    </div>
                    
                    {!target.completed && (
                      <button
                        onClick={() => completeTarget(target.id)}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        ✓ COMPLETE QUEST
                      </button>
                    )}
                    {target.completed && (
                      <div className="w-full bg-green-800 bg-opacity-50 py-3 rounded-xl font-bold text-lg text-center">
                        ✓ QUEST CLEARED
                      </div>
                    )}
                  </div>
                ))}
                
                {targets.length === 0 && (
                  <div className="col-span-2 text-center py-16 bg-slate-900 bg-opacity-50 rounded-3xl border-2 border-dashed border-gray-600">
                    <Sword className="w-24 h-24 mx-auto mb-4 text-gray-600" />
                    <p className="text-2xl text-gray-400 font-semibold">No active quests. Begin your journey!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ranks Tab */}
          {activeTab === 'ranks' && (
            <div className="animate-fadeIn">
              <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                HUNTER RANKS
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {ranks.map((rank, idx) => {
                  const isUnlocked = user.level >= rank.level;
                  const isCurrent = currentRank.name === rank.name;
                  
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-6 border-4 transition-all ${
                        isCurrent
                          ? `bg-gradient-to-br ${rank.color} border-white shadow-2xl ${rank.glow} scale-110 animate-pulse`
                          : isUnlocked
                          ? `bg-gradient-to-br ${rank.color} opacity-70 border-gray-500 shadow-lg`
                          : 'bg-slate-900 opacity-30 border-gray-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-3 animate-float">{rank.icon}</div>
                        <div className="text-sm font-bold text-gray-300 mb-1">LVL {rank.level}</div>
                        <div className="font-black text-lg">{rank.name}</div>
                        {isCurrent && (
                          <div className="mt-3">
                            <Star className="w-8 h-8 mx-auto text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Target Modal */}
      {showAddTarget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80 p-6 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 to-purple-950 rounded-3xl p-8 max-w-2xl w-full border-4 border-purple-500 shadow-2xl shadow-purple-500/50 animate-fadeIn">
            <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CREATE NEW QUEST
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xl font-bold mb-3 text-purple-200">Subject</label>
                <select 
                  value={newTarget.subject}
                  onChange={(e) => setNewTarget({...newTarget, subject: e.target.value})}
                  className="w-full bg-slate-800 border-2 border-purple-500 rounded-xl p-4 text-lg font-semibold focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition-all"
                >
                  <option value="">⚔️ Select Subject</option>
                  {Object.keys(subjects).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xl font-bold mb-3 text-purple-200">Chapter</label>
                <input
                  type="text"
                  value={newTarget.chapter}
                  onChange={(e) => setNewTarget({...newTarget, chapter: e.target.value})}
                  placeholder="Enter chapter name"
                  className="w-full bg-slate-800 border-2 border-purple-500 rounded-xl p-4 text-lg font-semibold focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xl font-bold mb-3 text-purple-200">Deadline</label>
                <input
                  type="date"
                  value={newTarget.deadline}
                  onChange={(e) => setNewTarget({...newTarget, deadline: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-800 border-2 border-purple-500 rounded-xl p-4 text-lg font-semibold focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  const daysToComplete = Math.ceil((new Date(newTarget.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                  addTarget({ ...newTarget, daysToComplete });
                }}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-2xl font-black text-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
              >
                ⚡ CREATE QUEST
              </button>
              <button
                onClick={() => {
                  setShowAddTarget(false);
                  setNewTarget({ subject: '', chapter: '', deadline: '' });
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-4 rounded-2xl font-black text-xl transition-all transform hover:scale-105"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SoloStudySystem;
