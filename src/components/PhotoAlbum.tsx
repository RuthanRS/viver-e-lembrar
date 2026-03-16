import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, X, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Photo {
  id: string;
  url: string;
  name: string;
  relationship: string;
}

export function PhotoAlbum() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [newPhoto, setNewPhoto] = useState({
    name: '',
    relationship: '',
    url: ''
  });

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('alzheimer-photos');
    if (saved) {
      setPhotos(JSON.parse(saved));
    } else {
      // Default photos
      const defaultPhotos: Photo[] = [
        { id: '1', url: '', name: 'Maria Silva', relationship: 'Esposa' },
        { id: '2', url: '', name: 'João Silva', relationship: 'Filho' },
        { id: '3', url: '', name: 'Ana Silva', relationship: 'Filha' },
        { id: '4', url: '', name: 'Pedro Silva', relationship: 'Neto' },
      ];
      setPhotos(defaultPhotos);
      localStorage.setItem('alzheimer-photos', JSON.stringify(defaultPhotos));
    }
  }, []);

  const addPhoto = () => {
    if (!newPhoto.name || !newPhoto.relationship) {
      alert('Por favor, preencha pelo menos o nome e o relacionamento');
      return;
    }

    const photo: Photo = {
      id: Date.now().toString(),
      name: newPhoto.name,
      relationship: newPhoto.relationship,
      url: newPhoto.url
    };

    const updated = [...photos, photo];
    setPhotos(updated);
    localStorage.setItem('alzheimer-photos', JSON.stringify(updated));
    
    setNewPhoto({ name: '', relationship: '', url: '' });
    setShowAddModal(false);
  };

  const confirmDelete = (photo: Photo) => {
    setPhotoToDelete(photo);
    setShowDeleteConfirm(true);
    setSelectedPhoto(null);
  };

  const deletePhoto = () => {
    if (photoToDelete) {
      const updated = photos.filter(p => p.id !== photoToDelete.id);
      setPhotos(updated);
      localStorage.setItem('alzheimer-photos', JSON.stringify(updated));
      setShowDeleteConfirm(false);
      setPhotoToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl text-blue-600 ml-4">Álbum de Fotos</h1>
        </div>

        <p className="text-gray-600 mb-6">Pessoas que você ama ❤️</p>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <button
                onClick={() => setSelectedPhoto(photo)}
                className="w-full bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {photo.url ? (
                    <ImageWithFallback 
                      src={photo.url} 
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                <h3 className="text-lg mb-1">{photo.name}</h3>
                <p className="text-sm text-gray-500">{photo.relationship}</p>
              </button>
              
              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(photo);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Photo Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full bg-blue-400 text-white py-4 rounded-full text-lg shadow-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
          Adicionar Foto
        </button>

        {/* View Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="ml-auto block p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {selectedPhoto.url ? (
                  <ImageWithFallback 
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
              
              <h2 className="text-2xl mb-2 text-center">{selectedPhoto.name}</h2>
              <p className="text-gray-600 text-center mb-6">{selectedPhoto.relationship}</p>
              
              <button
                onClick={() => confirmDelete(selectedPhoto)}
                className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors"
              >
                Remover Foto
              </button>
            </div>
          </div>
        )}

        {/* Add Photo Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-blue-600">Adicionar Foto</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Nome da Pessoa</label>
                  <input
                    type="text"
                    value={newPhoto.name}
                    onChange={(e) => setNewPhoto({ ...newPhoto, name: e.target.value })}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Relacionamento</label>
                  <input
                    type="text"
                    value={newPhoto.relationship}
                    onChange={(e) => setNewPhoto({ ...newPhoto, relationship: e.target.value })}
                    placeholder="Ex: Esposa, Filho, Amigo"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">URL da Foto (opcional)</label>
                  <input
                    type="text"
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                    placeholder="Cole o link da imagem aqui"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">Se deixar em branco, será usado um avatar padrão</p>
                </div>

                <button
                  onClick={addPhoto}
                  className="w-full bg-blue-500 text-white py-3 rounded-full text-lg hover:bg-blue-600 transition-colors"
                >
                  Salvar Foto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && photoToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl mb-2">Tem certeza?</h2>
                <p className="text-gray-600">
                  Deseja realmente remover a foto de <strong>{photoToDelete.name}</strong>?
                </p>
                <p className="text-sm text-gray-500 mt-2">Esta ação não pode ser desfeita.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={deletePhoto}
                  className="w-full bg-red-500 text-white py-3 rounded-full text-lg hover:bg-red-600 transition-colors"
                >
                  Sim, Remover
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setPhotoToDelete(null);
                  }}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-full text-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}