import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone, Plus, Trash2, X, Star } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  photo?: string;
  isPriority?: boolean;
}

export function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showPriorityConfirm, setShowPriorityConfirm] = useState(false);
  const [pendingPriorityContact, setPendingPriorityContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('alzheimer-contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    } else {
      const defaultContacts: Contact[] = [
        { id: '1', name: 'Maria Silva', relationship: 'Esposa', phone: '(11) 98765-4321', isPriority: true },
        { id: '2', name: 'João Silva', relationship: 'Filho', phone: '(11) 98765-1234' },
        { id: '3', name: 'Ana Silva', relationship: 'Filha', phone: '(11) 98765-5678' },
        { id: '4', name: 'Dr. Carlos', relationship: 'Médico', phone: '(11) 3456-7890' },
        { id: '5', name: 'Emergência', relationship: 'SAMU', phone: '192' },
      ];
      setContacts(defaultContacts);
      localStorage.setItem('alzheimer-contacts', JSON.stringify(defaultContacts));
    }
  }, []);

  const makeCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const deleteContact = (id: string) => {
    if (confirm('Tem certeza que deseja remover este contato?')) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      localStorage.setItem('alzheimer-contacts', JSON.stringify(updated));
    }
  };

  const handlePriorityClick = (contact: Contact) => {
    setPendingPriorityContact(contact);
    setShowPriorityConfirm(true);
  };

  const confirmPriorityChange = () => {
    if (!pendingPriorityContact) return;

    const priorityContacts = contacts.filter(c => c.isPriority);
    const isCurrentlyPriority = pendingPriorityContact.isPriority;

    // If trying to add and already have 3 priority contacts
    if (!isCurrentlyPriority && priorityContacts.length >= 3) {
      alert('Você já definiu 3 contatos de emergência. Para adicionar um novo, remova um dos contatos atuais primeiro.');
      setShowPriorityConfirm(false);
      setPendingPriorityContact(null);
      return;
    }

    // Toggle priority status
    const updated = contacts.map(c => ({
      ...c,
      isPriority: c.id === pendingPriorityContact.id ? !c.isPriority : c.isPriority
    }));

    setContacts(updated);
    localStorage.setItem('alzheimer-contacts', JSON.stringify(updated));
    setShowPriorityConfirm(false);
    setPendingPriorityContact(null);
  };

  const addContact = () => {
    if (!newContact.name || !newContact.relationship || !newContact.phone) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone
    };

    const updated = [...contacts, contact];
    setContacts(updated);
    localStorage.setItem('alzheimer-contacts', JSON.stringify(updated));
    
    setNewContact({ name: '', relationship: '', phone: '' });
    setShowModal(false);
  };

  const priorityContacts = contacts.filter(c => c.isPriority);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-purple-600 ml-4">Contatos</h1>
        </div>

        <p className="text-gray-600 mb-2">Pessoas importantes para você 📞</p>
        <p className="text-sm text-gray-500 mb-6">
          ⭐ Defina até 3 contatos de emergência ({priorityContacts.length}/3)
        </p>

        {/* Contacts List */}
        <div className="space-y-3 mb-6">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all ${
                contact.isPriority ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0 relative">
                  {contact.photo ? (
                    <img src={contact.photo} alt={contact.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    '👤'
                  )}
                  {contact.isPriority && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg mb-1 truncate">{contact.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">{contact.relationship}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                  {contact.isPriority && (
                    <p className="text-xs text-yellow-600 mt-1 font-medium">Contato de Emergência</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handlePriorityClick(contact)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                      contact.isPriority 
                        ? 'bg-yellow-400 text-white' 
                        : 'bg-gray-200 text-gray-500 hover:bg-yellow-100'
                    }`}
                    title={contact.isPriority ? "Remover da emergência" : "Definir como emergência"}
                  >
                    <Star className={`w-5 h-5 ${contact.isPriority ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    onClick={() => makeCall(contact.phone)}
                    className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-lg"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Contact Button */}
        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-purple-500 text-white py-4 rounded-full text-lg shadow-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Adicionar Contato
        </button>

        {/* Priority Confirmation Modal */}
        {showPriorityConfirm && pendingPriorityContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
                <h2 className="text-2xl mb-2">Tem certeza?</h2>
                {pendingPriorityContact.isPriority ? (
                  <p className="text-gray-600">
                    Deseja remover <strong>{pendingPriorityContact.name}</strong> dos contatos de emergência?
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Deseja adicionar <strong>{pendingPriorityContact.name}</strong> como contato de emergência?
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmPriorityChange}
                  className="w-full bg-yellow-500 text-white py-3 rounded-full text-lg hover:bg-yellow-600 transition-colors"
                >
                  Sim, Confirmar
                </button>
                <button
                  onClick={() => {
                    setShowPriorityConfirm(false);
                    setPendingPriorityContact(null);
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-full text-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Contact Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-purple-600">Novo Contato</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Parentesco/Relação</label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="Ex: Filha, Médico, Amigo"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="Ex: (11) 98765-4321"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none text-lg"
                  />
                </div>

                <button
                  onClick={addContact}
                  className="w-full bg-purple-500 text-white py-3 rounded-full text-lg hover:bg-purple-600 transition-colors"
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