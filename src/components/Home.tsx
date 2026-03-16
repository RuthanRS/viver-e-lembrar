import { useNavigate } from 'react-router';
import { Calendar, Users, Image, Bell, Brain, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPriority?: boolean;
}

export function Home() {
  const navigate = useNavigate();
  const [priorityContacts, setPriorityContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-contacts');
    if (saved) {
      const contacts: Contact[] = JSON.parse(saved);
      const priorities = contacts.filter(c => c.isPriority);
      setPriorityContacts(priorities);
    }
  }, []);

  const handleEmergency = () => {
    if (priorityContacts.length > 0) {
      // Create message with all priority contacts
      let message = '';
      if (priorityContacts.length === 1) {
        message = `Ligando para ${priorityContacts[0].name}, seu contato de emergência`;
      } else {
        const names = priorityContacts.map(c => c.name).join(', ');
        message = `Você tem ${priorityContacts.length} contatos de emergência: ${names}. Ligando para ${priorityContacts[0].name}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);

      // Make the call to the first priority contact
      setTimeout(() => {
        window.location.href = `tel:${priorityContacts[0].phone}`;
      }, 2500);
    } else {
      // If no priority contact, inform user
      const message = 'Você ainda não definiu um contato de emergência. Por favor, vá em Contatos e defina até três contatos prioritários.';
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      
      alert('Você ainda não definiu um contato de emergência. Por favor, vá em Contatos e defina até 3 contatos prioritários clicando na estrela ⭐');
    }
  };

  const features = [
    {
      icon: Image,
      title: 'Álbum de Fotos',
      description: 'Veja fotos da família',
      color: 'bg-blue-100 text-blue-600',
      path: '/album'
    },
    {
      icon: Bell,
      title: 'Lembretes',
      description: 'Medicamentos e tarefas',
      color: 'bg-green-100 text-green-600',
      path: '/lembretes'
    },
    {
      icon: Users,
      title: 'Contatos',
      description: 'Pessoas importantes',
      color: 'bg-purple-100 text-purple-600',
      path: '/contatos'
    },
    {
      icon: Calendar,
      title: 'Rotina Diária',
      description: 'Atividades do dia',
      color: 'bg-orange-100 text-orange-600',
      path: '/rotina'
    },
    {
      icon: Brain,
      title: 'Jogo da Memória',
      description: 'Exercite a mente',
      color: 'bg-pink-100 text-pink-600',
      path: '/jogo'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-blue-600 mb-2">Olá! 👋</h1>
          <p className="text-gray-600">O que você gostaria de fazer hoje?</p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={() => navigate(feature.path)}
              className="w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center gap-4 text-left"
            >
              <div className={`p-4 rounded-xl ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Emergency Button */}
        <div className="mt-8">
          <button 
            onClick={handleEmergency}
            className="w-full bg-red-500 text-white py-4 rounded-full text-xl shadow-lg hover:bg-red-600 transition-colors"
          >
            🆘 Preciso de Ajuda
          </button>
          {priorityContacts.length > 0 && (
            <div className="text-center text-sm text-gray-500 mt-2">
              <p>Contatos de emergência:</p>
              <p className="font-medium">{priorityContacts.map(c => c.name).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}