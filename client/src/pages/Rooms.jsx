import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Loader, Trash2, Edit, X, Check } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { ROOM_IMAGES } from '../utils/constants';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState({
      isOpen: false,
      type: 'info',
      title: '',
      message: '',
      onConfirm: () => {}
  });

  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Double',
    pricePerNight: '',
    status: 'Available',
    description: '',
    images: []
  });
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms');
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageSelect = (url) => {
      setFormData(prev => ({
          ...prev,
          images: [url] // Allow single image selection for now
      }));
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      pricePerNight: room.pricePerNight,
      status: room.status,
      description: room.description || '',
      images: room.images || []
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, formData);
      } else {
        await api.post('/rooms', formData);
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({ roomNumber: '', type: 'Double', pricePerNight: '', status: 'Available', description: '', images: [] });
      fetchRooms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save room');
    }
  };

  const handleDelete = (id) => {
      setConfirmation({
          isOpen: true,
          type: 'danger',
          title: 'Delete Room',
          message: 'Are you sure you want to delete this room? This action cannot be undone.',
          confirmText: 'Delete',
          onConfirm: async () => {
              try {
                  await api.delete(`/rooms/${id}`);
                  fetchRooms();
                  setConfirmation(prev => ({ ...prev, isOpen: false }));
              } catch (err) {
                  console.error('Failed to delete room', err);
                  alert('Failed to delete room');
              }
          }
      });
  };

  if (loading) return <div className="p-6"><Loader className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-white">Room Management</h2>
        <button 
          onClick={() => {
            setEditingRoom(null);
            setFormData({ roomNumber: '', type: 'Double', pricePerNight: '', status: 'Available', description: '', images: [] });
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Room
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="card hover:shadow-md transition-shadow overflow-hidden p-0 flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
            {/* Room Image */}
            <div className="h-48 w-full bg-slate-200 relative">
               {room.images && room.images.length > 0 ? (
                 <img src={room.images[0]} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <span className="text-sm italic">No Image</span>
                 </div>
               )}
               <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                 room.status === 'Available' ? 'bg-green-500 text-white' : 
                 room.status === 'Occupied' ? 'bg-red-500 text-white' :
                 'bg-yellow-500 text-white'
               }`}>
                 {room.status}
               </span>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{room.type}</span>
                  <div className="flex justify-between items-start mt-1">
                      <h3 className="text-2xl font-bold font-serif text-slate-800 dark:text-white">Room {room.roomNumber}</h3>
                  </div>
                </div>
            
            <p className="text-slate-600 dark:text-slate-300 text-base mb-4 line-clamp-2">{room.description || 'No description available.'}</p>
            
              <div className="flex justify-between items-end border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Price per night</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">${room.pricePerNight}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(room)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(room._id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
              </button>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price / Night</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field min-h-[80px]"
                ></textarea>
              </div>

               {/* Image Selection */}
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Room Image</label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ROOM_IMAGES.map((img) => (
                        <div 
                            key={img.id}
                            onClick={() => handleImageSelect(img.url)}
                            className={`relative cursor-pointer rounded-lg overflow-hidden group aspect-video border-2 transition-all ${
                                formData.images.includes(img.url) 
                                ? 'border-primary-600 ring-2 ring-primary-100' 
                                : 'border-slate-100 dark:border-slate-700 hover:border-slate-300'
                            }`}
                        >
                            <img 
                                src={img.url} 
                                alt={img.label} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            
                            {formData.images.includes(img.url) && (
                                <div className="absolute inset-0 bg-primary-600/20 flex items-center justify-center">
                                    <div className="bg-primary-600 text-white p-1 rounded-full shadow-lg">
                                        <Check size={16} strokeWidth={3} />
                                    </div>
                                </div>
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <span className="text-white text-xs font-medium truncate block shadow-sm">{img.label}</span>
                            </div>
                        </div>
                    ))}
                 </div>
               </div>

              <div className="pt-2">
                <button type="submit" className="w-full btn-primary">
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW: Confirmation Modal */}
      <ConfirmationModal 
          isOpen={confirmation.isOpen}
          onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
          type={confirmation.type}
          confirmText={confirmation.confirmText}
      />
    </div>
  );
};
export default RoomManagement;
