import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Check, Clock, Trash2, X, Bell, BellOff } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  type: 'medication' | 'task';
}

export function Reminders() {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotificationConfirm, setShowNotificationConfirm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    type: 'task' as 'medication' | 'task'
  });

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-reminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      const defaultReminders: Reminder[] = [
        { id: '1', title: 'Tomar remédio da pressão', time: '08:00', completed: false, type: 'medication' },
        { id: '2', title: 'Café da manhã', time: '08:30', completed: false, type: 'task' },
        { id: '3', title: 'Tomar vitamina', time: '12:00', completed: false, type: 'medication' },
        { id: '4', title: 'Almoço', time: '12:30', completed: false, type: 'task' },
        { id: '5', title: 'Caminhada', time: '16:00', completed: false, type: 'task' },
        { id: '6', title: 'Tomar remédio da noite', time: '20:00', completed: false, type: 'medication' },
      ];
      setReminders(defaultReminders);
      localStorage.setItem('alzheimer-reminders', JSON.stringify(defaultReminders));
    }

    const savedNotifSetting = localStorage.getItem('reminders-notifications-enabled');
    if (savedNotifSetting !== null) {
      setNotificationsEnabled(JSON.parse(savedNotifSetting));
    }
  }, []);

  useEffect(() => {
    if (!notificationsEnabled) return;

    // Check reminders every minute
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      reminders.forEach(reminder => {
        if (reminder.time === currentTime && !reminder.completed) {
          // Play notification sound
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZRQ0PVqzn77BdGQpDl9vwwHkuBSh+zPLaizsIGGS56eeiUhYLSpzi8K9hGwY7ltjxy4IzBx1rwO7mnEoODlOp5O+uXhsKQ5nZ8L19MwYrhM3y2Ig0Bxplu+vooVIVDEma3/KyZSEHNI7T8c6CNwcdbbzu5aFODg5TqOPwsGIZCkOZ2u+8fisFKn/M8diJNQcXZbvq5p9QFAxJmt/yuGYeBzSO0/HOgjkGHGq77OShUA8PUajj8LFiFApDmdrvu30sBCqAzPDUiTYHF2W76uahUBQMSJrf8rhlHgc0jtPx0IQ4BRpqu+zlmE8PDlCo4+6xYhYKQ5fZ8L1+NgUrf83w1Ik1BxhkvOroqFETDEia4PGzZiAGNY7T8c6DNwYcarvs5Z5OEA5PqOPusWIXCkKY2fC9fjYEK4DN8NSJNQcZZLzq6KZSEw1Imdzws2YYBTOR0/HQhDYGGmy86eabThIOU6jj7bJiGAtDl9nwvn0zBSl/zPDTiTUHGGS87OqnUxINSJrd8LJmHQc1jtPxzoU4BxpruuzkpU8NDlCp4+6yYRkKRJjZ7r19MwYqf8zw04k1Bxdlu+rmplMTDEia3fGzZh0HNI/T8c+FNwYbbLrr5KVPEAxPqOTusWAaBEOY2O69fjQFKn/M8NWJNgcYZLvp6aZSFAhJmt3wr2YdBzWO0/HPhDcGGmu67OSkTxENT6jk77FhGQtDl9juu30zBSl/zPDViTcGF2S76eimUhQNSZrd8bJmHAc1jtTxz4U2BxtruuzloU8QDE+o5O+yYRoLQ5fY7r19MwUpf8zw1Yo3BhdkuunonlMUDUmZ3vGzZhkHNY3U8c+FNwYba7rt5aFPEAxPqeXvsmEaCkOY2O69fTMGKX/M8NSKNgYXZbrq6J5SEw1Jmd3xs2YaBzWN0/HPhTYGG2y67OShThAMUKnl77FgGgtEltju'
);
          audio.volume = 0.3;
          audio.play().catch(() => {});

          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🔔 Lembrete - Viver é Lembrar', {
              body: `${reminder.title} - ${reminder.time}`,
              icon: '🔔',
              tag: reminder.id
            });
          }

          // Voice announcement
          const message = `Atenção! ${reminder.title}`;
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.lang = 'pt-BR';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [reminders, notificationsEnabled]);

  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const toggleReminder = (id: string) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(updated);
    localStorage.setItem('alzheimer-reminders', JSON.stringify(updated));
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('alzheimer-reminders', JSON.stringify(updated));
  };

  const addReminder = () => {
    if (!newReminder.title || !newReminder.time) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      time: newReminder.time,
      completed: false,
      type: newReminder.type
    };

    const updated = [...reminders, reminder].sort((a, b) => a.time.localeCompare(b.time));
    setReminders(updated);
    localStorage.setItem('alzheimer-reminders', JSON.stringify(updated));
    
    setNewReminder({ title: '', time: '', type: 'task' });
    setShowModal(false);
  };

  const handleNotificationToggle = () => {
    setShowNotificationConfirm(true);
  };

  const confirmNotificationToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('reminders-notifications-enabled', JSON.stringify(newValue));
    setShowNotificationConfirm(false);

    // Voice feedback
    const message = newValue 
      ? 'Notificações de lembretes ativadas' 
      : 'Notificações de lembretes desativadas';
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-green-600 ml-4">Lembretes</h1>
        </div>

        <p className="text-gray-600 mb-4">Suas atividades de hoje 📋</p>

        {/* Notification Toggle */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className="w-6 h-6 text-green-600" />
            ) : (
              <BellOff className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <h3 className="text-lg">Notificações e Sons</h3>
              <p className="text-sm text-gray-500">
                {notificationsEnabled ? 'Ativadas' : 'Desativadas'}
              </p>
            </div>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                notificationsEnabled ? 'transform translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-3 mb-6">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white rounded-2xl p-4 shadow-md transition-all ${
                reminder.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {reminder.completed && <Check className="w-5 h-5 text-white" />}
                </button>
                
                <div className="flex-1">
                  <h3 className={`text-lg mb-1 ${reminder.completed ? 'line-through' : ''}`}>
                    {reminder.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{reminder.time}</span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {reminder.type === 'medication' ? '💊 Medicamento' : '✅ Tarefa'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Reminder Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-green-500 text-white py-4 rounded-full text-lg shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Adicionar Lembrete
        </button>

        {/* Notification Confirmation Modal */}
        {showNotificationConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  notificationsEnabled ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {notificationsEnabled ? (
                    <BellOff className="w-8 h-8 text-red-500" />
                  ) : (
                    <Bell className="w-8 h-8 text-green-500" />
                  )}
                </div>
                <h2 className="text-2xl mb-2">Tem certeza?</h2>
                <p className="text-gray-600">
                  {notificationsEnabled 
                    ? 'Deseja desativar as notificações e sons dos lembretes?'
                    : 'Deseja ativar as notificações e sons dos lembretes?'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmNotificationToggle}
                  className={`w-full text-white py-3 rounded-full text-lg transition-colors ${
                    notificationsEnabled 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  Sim, Confirmar
                </button>
                <button
                  onClick={() => setShowNotificationConfirm(false)}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-full text-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Reminder Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-green-600">Novo Lembrete</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Descrição</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    placeholder="Ex: Tomar remédio"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Horário</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Tipo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewReminder({ ...newReminder, type: 'task' })}
                      className={`py-3 px-4 rounded-xl transition-all ${
                        newReminder.type === 'task'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      ✅ Tarefa
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewReminder({ ...newReminder, type: 'medication' })}
                      className={`py-3 px-4 rounded-xl transition-all ${
                        newReminder.type === 'medication'
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      💊 Remédio
                    </button>
                  </div>
                </div>

                <button
                  onClick={addReminder}
                  className="w-full bg-green-500 text-white py-3 rounded-full text-lg hover:bg-green-600 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}