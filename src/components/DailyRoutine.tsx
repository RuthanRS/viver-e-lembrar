import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sun, Cloud, Moon, Plus, Trash2, X, Bell, BellOff } from 'lucide-react';

interface RoutineItem {
  id: string;
  time: string;
  activity: string;
  period: 'morning' | 'afternoon' | 'evening';
}

export function DailyRoutine() {
  const navigate = useNavigate();
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotificationConfirm, setShowNotificationConfirm] = useState(false);
  const [newRoutine, setNewRoutine] = useState({
    time: '',
    activity: '',
    period: 'morning' as 'morning' | 'afternoon' | 'evening'
  });

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-routine');
    if (saved) {
      setRoutineItems(JSON.parse(saved));
    } else {
      const defaultRoutine: RoutineItem[] = [
        { id: '1', time: '07:00', activity: 'Acordar e tomar água', period: 'morning' },
        { id: '2', time: '07:30', activity: 'Tomar banho', period: 'morning' },
        { id: '3', time: '08:00', activity: 'Tomar café da manhã', period: 'morning' },
        { id: '4', time: '09:00', activity: 'Ler jornal ou assistir TV', period: 'morning' },
        { id: '5', time: '12:00', activity: 'Almoço', period: 'afternoon' },
        { id: '6', time: '13:00', activity: 'Descanso', period: 'afternoon' },
        { id: '7', time: '15:00', activity: 'Lanche da tarde', period: 'afternoon' },
        { id: '8', time: '16:00', activity: 'Caminhada leve', period: 'afternoon' },
        { id: '9', time: '19:00', activity: 'Jantar', period: 'evening' },
        { id: '10', time: '20:00', activity: 'Tempo com família', period: 'evening' },
        { id: '11', time: '21:30', activity: 'Preparar para dormir', period: 'evening' },
      ];
      setRoutineItems(defaultRoutine);
      localStorage.setItem('alzheimer-routine', JSON.stringify(defaultRoutine));
    }

    const savedNotifSetting = localStorage.getItem('routine-notifications-enabled');
    if (savedNotifSetting !== null) {
      setNotificationsEnabled(JSON.parse(savedNotifSetting));
    }
  }, []);

  useEffect(() => {
    if (!notificationsEnabled) return;

    // Check routine every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      routineItems.forEach(item => {
        if (item.time === currentTime) {
          // Play notification sound
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGQpDl9vwwHkuBSh+zPLaizsIGGS56eeiUhYLSpzi8K9hGwY7ltjxy4IzBx1rwO7mnEoODlOp5O+uXhsKQ5nZ8L19MwYrhM3y2Ig0Bxplu+vooVIVDEma3/KyZSEHNI7T8c6CNwcdbbzu5aFODg5TqOPwsGIZCkOZ2u+8fisFKn/M8diJNQcXZbvq5p9QFAxJmt/yuGYeBzSO0/HOgjkGHGq77OShUA8PUajj8LFiFApDmdrvu30sBCqAzPDUiTYHF2W76uahUBQMSJrf8rhlHgc0jtPx0IQ4BRpqu+zlmE8PDlCo4+6xYhYKQ5fZ8L1+NgUrf83w1Ik1BxhkvOroqFETDEia4PGzZiAGNY7T8c6DNwYcarvs5Z5OEA5PqOPusWIXCkKY2fC9fjYEK4DN8NSJNQcZZLzq6KZSEw1Imdzws2YYBTOR0/HQhDYGGmy86eabThIOU6jj7bJiGAtDl9nwvn0zBSl/zPDTiTUHGGS87OqnUxINSJrd8LJmHQc1jtPxzoU4BxpruuzkpU8NDlCp4+6yYRkKRJjZ7r19MwYqf8zw04k1Bxdlu+rmplMTDEia3fGzZh0HNI/T8c+FNwYbbLrr5KVPEAxPqOTusWAaBEOY2O69fjQFKn/M8NWJNgcYZLvp6aZSFAhJmt3wr2YdBzWO0/HPhDcGGmu67OSkTxENT6jk77FhGQtDl9juu30zBSl/zPDViTcGF2S76eimUhQNSZrd8bJmHAc1jtTxz4U2BxtruuzloU8QDE+o5O+yYRoLQ5fY7r19MwUpf8zw1Yo3BhdkuunonlMUDUmZ3vGzZhkHNY3U8c+FNwYba7rt5aFPEAxPqeXvsmEaCkOY2O69fTMGKX/M8NSKNgYXZbrq6J5SEw1Jmd3xs2YaBzWN0/HPhTYGG2y67OShThAMUKnl77FgGgtEltju'
);
          audio.volume = 0.3;
          audio.play().catch(() => {});

          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('📅 Rotina Diária - Viver é Lembrar', {
              body: `${item.activity} - ${item.time}`,
              icon: '📅',
              tag: item.id
            });
          }

          // Voice announcement
          const message = `Atenção! ${item.activity}`;
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = 'pt-BR';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [routineItems, notificationsEnabled]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const deleteRoutineItem = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta atividade?')) {
      const updated = routineItems.filter(r => r.id !== id);
      setRoutineItems(updated);
      localStorage.setItem('alzheimer-routine', JSON.stringify(updated));
    }
  };

  const addRoutineItem = () => {
    if (!newRoutine.time || !newRoutine.activity) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const item: RoutineItem = {
      id: Date.now().toString(),
      time: newRoutine.time,
      activity: newRoutine.activity,
      period: newRoutine.period
    };

    const updated = [...routineItems, item].sort((a, b) => a.time.localeCompare(b.time));
    setRoutineItems(updated);
    localStorage.setItem('alzheimer-routine', JSON.stringify(updated));
    
    setNewRoutine({ time: '', activity: '', period: 'morning' });
    setShowModal(false);
  };

  const handleNotificationToggle = () => {
    setShowNotificationConfirm(true);
  };

  const confirmNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('routine-notifications-enabled', JSON.stringify(newValue));
    setShowNotificationConfirm(false);

    // Voice feedback
    const message = newValue 
      ? 'Notificações da rotina diária ativadas' 
      : 'Notificações da rotina diária desativadas';
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case 'morning':
        return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'afternoon':
        return <Cloud className="w-6 h-6 text-blue-400" />;
      case 'evening':
        return <Moon className="w-6 h-6 text-indigo-500" />;
      default:
        return null;
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'morning':
        return 'Manhã';
      case 'afternoon':
        return 'Tarde';
      case 'evening':
        return 'Noite';
      default:
        return '';
    }
  };

  const groupedRoutine = {
    morning: routineItems.filter(item => item.period === 'morning'),
    afternoon: routineItems.filter(item => item.period === 'afternoon'),
    evening: routineItems.filter(item => item.period === 'evening'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-orange-600 ml-4">Rotina Diária</h1>
        </div>

        <p className="text-gray-600 mb-6">Suas atividades do dia 🌅</p>

        {/* Morning */}
        {groupedRoutine.morning.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sun className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl text-gray-700">Manhã</h2>
            </div>
            <div className="space-y-2">
              {groupedRoutine.morning.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="text-2xl bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.time.split(':')[0]}
                    <span className="text-sm">h</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-lg">{item.activity}</p>
                  </div>
                  <button
                    onClick={() => deleteRoutineItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Afternoon */}
        {groupedRoutine.afternoon.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl text-gray-700">Tarde</h2>
            </div>
            <div className="space-y-2">
              {groupedRoutine.afternoon.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="text-2xl bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.time.split(':')[0]}
                    <span className="text-sm">h</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-lg">{item.activity}</p>
                  </div>
                  <button
                    onClick={() => deleteRoutineItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evening */}
        {groupedRoutine.evening.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-6 h-6 text-indigo-500" />
              <h2 className="text-xl text-gray-700">Noite</h2>
            </div>
            <div className="space-y-2">
              {groupedRoutine.evening.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="text-2xl bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.time.split(':')[0]}
                    <span className="text-sm">h</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.time}</p>
                    <p className="text-lg">{item.activity}</p>
                  </div>
                  <button
                    onClick={() => deleteRoutineItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Routine Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-orange-500 text-white py-4 rounded-full text-lg shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Adicionar Atividade
        </button>

        {/* Add Routine Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-orange-600">Nova Atividade</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Atividade</label>
                  <input
                    type="text"
                    value={newRoutine.activity}
                    onChange={(e) => setNewRoutine({ ...newRoutine, activity: e.target.value })}
                    placeholder="Ex: Tomar café da manhã"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Horário</label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={(e) => setNewRoutine({ ...newRoutine, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Período do Dia</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRoutine({ ...newRoutine, period: 'morning' })}
                      className={`py-3 px-2 rounded-xl text-sm transition-all ${
                        newRoutine.period === 'morning'
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      🌅 Manhã
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRoutine({ ...newRoutine, period: 'afternoon' })}
                      className={`py-3 px-2 rounded-xl text-sm transition-all ${
                        newRoutine.period === 'afternoon'
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      ☀️ Tarde
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRoutine({ ...newRoutine, period: 'evening' })}
                      className={`py-3 px-2 rounded-xl text-sm transition-all ${
                        newRoutine.period === 'evening'
                          ? 'bg-indigo-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      🌙 Noite
                    </button>
                  </div>
                </div>

                <button
                  onClick={addRoutineItem}
                  className="w-full bg-orange-500 text-white py-3 rounded-full text-lg hover:bg-orange-600 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Toggle */}
        <div className="mt-6">
          <button
            onClick={handleNotificationToggle}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-full text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
            {notificationsEnabled ? 'Desativar Notificações' : 'Ativar Notificações'}
          </button>
        </div>

        {/* Notification Confirm Modal */}
        {showNotificationConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-orange-600">Confirmar</h2>
                <button
                  onClick={() => setShowNotificationConfirm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  {notificationsEnabled ? 'Deseja desativar as notificações da rotina diária?' : 'Deseja ativar as notificações da rotina diária?'}
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowNotificationConfirm(false)}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-full text-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmNotificationToggle}
                    className="bg-orange-500 text-white py-3 px-4 rounded-full text-lg hover:bg-orange-600 transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}