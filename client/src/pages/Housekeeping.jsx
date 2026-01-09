import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Loader, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]); // For assigning staff
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Confirmation Modal State
  const [confirmation, setConfirmation] = useState({
      isOpen: false,
      type: 'info',
      title: '',
      message: '',
      onConfirm: () => {}
  });

  const [newTask, setNewTask] = useState({
    roomId: '',
    description: '',
    type: 'Cleaning',
    priority: 'Medium',
    assignedTo: ''
  });

  const fetchData = async () => {
    try {
      const [tasksRes, roomsRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/rooms'),
        api.get('/users')
      ]);
      setTasks(tasksRes.data);
      setRooms(roomsRes.data);
      // Filter users to only show housekeeping or hotel staff as requested
      setUsers(usersRes.data.filter(user => user.role === 'housekeeping' || user.role === 'hotel_staff'));
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        room: newTask.roomId,
        description: newTask.description,
        type: newTask.type,
        priority: newTask.priority,
        assignedTo: newTask.assignedTo || null
      });
      setIsModalOpen(false);
      setNewTask({ roomId: '', description: '', type: 'Cleaning', priority: 'Medium', assignedTo: '' });
      fetchData();
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleClearCompleted = () => {
      setConfirmation({
          isOpen: true,
          type: 'danger',
          title: 'Clear Completed Tasks',
          message: 'This will permanently delete all housekeeping tasks marked as "Completed". This action cannot be undone.',
          confirmText: 'Delete All',
          onConfirm: async () => {
              try {
                  await api.delete('/tasks/completed');
                  fetchData();
                  setConfirmation(prev => ({ ...prev, isOpen: false }));
              } catch (err) {
                  console.error('Failed to clear tasks', err);
                  alert('Failed to clear tasks');
              }
          }
      });
  };

  const handleDeleteTask = (id) => {
      setConfirmation({
          isOpen: true,
          type: 'danger',
          title: 'Delete Task',
          message: 'Are you sure you want to delete this task?',
          confirmText: 'Delete',
          onConfirm: async () => {
              try {
                  await api.delete(`/tasks/${id}`);
                  fetchData();
                  setConfirmation(prev => ({ ...prev, isOpen: false }));
              } catch (err) {
                  console.error('Failed to delete task', err);
                  alert('Failed to delete task');
              }
          }
      });
  };

  if (loading) return <div className="p-6"><Loader className="animate-spin" /></div>;

  const getPriorityColor = (p) => {
    switch(p) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-white">Housekeeping & Maintenance</h2>
        <div className="flex gap-2">
            <button 
              onClick={handleClearCompleted}
              className="btn-secondary flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={18} /> Clear Tasks
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> New Task
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
           <div key={task._id} className="card border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs font-medium ${
                    task.status === 'Completed' ? 'text-green-600' : 
                    task.status === 'In Progress' ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <button 
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Delete Task"
                >
                  <Trash2 size={16} />
                </button>
             </div>
             
             <h3 className="font-bold text-slate-800">Room {task.room?.roomNumber}</h3>
             <p className="text-sm text-slate-600 mt-1 mb-3">{task.description}</p>
             
             <div className="flex items-center gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
               <span className="font-medium">{task.type}</span>
               <span className="text-slate-300">•</span>
               <span className="text-primary-600 font-medium">
                 Assigned to: {task.assignedTo?.username || 'Unassigned'}
               </span>
             </div>
           </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">New Task</h3>
             <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
                   <select 
                      value={newTask.roomId}
                      onChange={(e) => setNewTask({...newTask, roomId: e.target.value})}
                      className="input-field"
                      required
                   >
                      <option value="">Select Room</option>
                      {rooms.map(room => (
                        <option key={room._id} value={room._id}>Room {room.roomNumber}</option>
                      ))}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                   <input 
                      type="text"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      className="input-field"
                      required
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                     <select 
                        value={newTask.type}
                        onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                        className="input-field"
                     >
                        <option value="Cleaning">Cleaning</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Inspection">Inspection</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                     <select 
                        value={newTask.priority}
                        onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                        className="input-field"
                     >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                     </select>
                   </div>
                </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To</label>
                   <select 
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                      className="input-field"
                   >
                      <option value="">Unassigned</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.username} ({user.role})</option>
                      ))}
                   </select>
                </div>
                <div className="pt-2 flex gap-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                   <button type="submit" className="flex-1 btn-primary">Create Task</button>
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

export default Housekeeping;
