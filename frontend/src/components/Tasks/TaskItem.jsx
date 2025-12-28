import React, { useState } from 'react';
import api from '../../services/api';
import { FaEdit, FaTrash, FaCheck, FaSpinner, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted, currentPage, setCurrentPage, totalItems }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${task.id}`, { status: newStatus });
      setStatus(newStatus);
      onTaskUpdated(response.data.task);
      showNotification(`Task marked as ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      showNotification('Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put(`/tasks/${task.id}`, {
        title,
        description,
        status,
      });
      onTaskUpdated(response.data.task);
      setIsEditing(false);
      showNotification('Task updated successfully');
    } catch (err) {
      showNotification('Failed to update task', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${task.id}`);
      setShowDeleteConfirm(false);
      
      // Check if this was the last item on the current page
      const isLastItemOnPage = totalItems === 1;
      const shouldGoToPreviousPage = isLastItemOnPage && currentPage > 1;
      
      if (shouldGoToPreviousPage) {
        // Go back to previous page
        setCurrentPage(currentPage - 1);
      }
      
      // Call the parent deletion handler
      onTaskDeleted(task.id, shouldGoToPreviousPage ? currentPage - 1 : currentPage);
      showNotification('Task deleted successfully');
    } catch (err) {
      showNotification('Failed to delete task', 'error');
      setShowDeleteConfirm(false);
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Notification Toast Component
  const NotificationToast = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'success' 
      ? 'bg-green-50 border-green-200' 
      : 'bg-red-50 border-red-200';
    
    const textColor = notification.type === 'success' 
      ? 'text-green-800' 
      : 'text-red-800';
    
    const iconColor = notification.type === 'success' 
      ? 'text-green-500' 
      : 'text-red-500';

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div className={`${bgColor} border ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}>
          {notification.type === 'success' ? (
            <FaCheck className={iconColor} />
          ) : (
            <FaExclamationCircle className={iconColor} />
          )}
          <span className="font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className={`ml-2 ${textColor} hover:opacity-80`}
          >
            <FaTimes />
          </button>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
            <button
              onClick={handleDeleteCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the task "<span className="font-medium">{task.title}</span>"? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleDeleteCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add CSS animation (moved to useEffect to prevent multiple style tag creation)
  React.useEffect(() => {
    // Only add the style once
    if (!document.querySelector('#task-item-styles')) {
      const style = document.createElement('style');
      style.id = 'task-item-styles';
      style.textContent = `
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (isEditing) {
    return (
      <>
        <NotificationToast />
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task title"
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
                rows="2"
              />
            </div>
            <div className="flex justify-between items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <NotificationToast />
      <DeleteConfirmationModal />
      
      <div className="bg-white rounded-lg shadow p-4 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 mb-2">{task.description}</p>
            )}
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {status.replace('_', ' ')}
              </span>
              <span className="text-sm text-gray-500">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {loading ? (
              <FaSpinner className="animate-spin text-gray-400" />
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors relative group"
                  title="Edit"
                >
                  <FaEdit />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Edit Task
                  </span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors relative group"
                  title="Delete"
                >
                  <FaTrash />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Delete Task
                  </span>
                </button>
                {status !== 'done' && (
                  <button
                    onClick={() => handleStatusChange('done')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors relative group"
                    title="Mark as done"
                  >
                    <FaCheck />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Mark as Done
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskItem;