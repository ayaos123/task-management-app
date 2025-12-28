import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const TaskList = () => {
  const [perPage, setPerPage] = useState(() => {
    const savedPerPage = localStorage.getItem('tasksPerPage');
    return savedPerPage ? parseInt(savedPerPage) : 10;
  });
  
  const [pagination, setPagination] = useState({
    data: [],
    meta: null,
    links: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTasks = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/tasks?page=${page}&per_page=${perPage}`);
      setPagination({
        data: response.data.data,
        meta: response.data.meta,
        links: response.data.links
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, []); 

  useEffect(() => {
    localStorage.setItem('tasksPerPage', perPage.toString());
    fetchTasks(currentPage);
  }, [perPage]); 
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTasks(page);
  };

  const handlePerPageChange = (value) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  const handleTaskCreated = (newTask) => {
    fetchTasks(1);
    setCurrentPage(1);
    setShowForm(false);
  };

  const handleTaskUpdated = (updatedTask) => {
    setPagination(prev => ({
      ...prev,
      data: prev.data.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    }));
  };

  const handleTaskDeleted = (taskId) => {
    setPagination(prev => ({
      ...prev,
      data: prev.data.filter(task => task.id !== taskId)
    }));
    fetchTasks(currentPage);
  };

  const PaginationControls = () => {
    if (!pagination.meta) return null;

    const { meta, links } = pagination;
    
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <div className="mb-4 sm:mb-0">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Show:</label>
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">per page</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Showing {meta.from} to {meta.to} of {meta.total} tasks
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => links.prev && handlePageChange(currentPage - 1)}
            disabled={!links.prev}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              links.prev 
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          <div className="hidden md:flex space-x-1">
            {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
              let pageNum;
              if (meta.last_page <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= meta.last_page - 2) {
                pageNum = meta.last_page - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 rounded-md text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {meta.last_page > 5 && currentPage < meta.last_page - 2 && (
              <>
                <span className="px-2 py-1">...</span>
                <button
                  onClick={() => handlePageChange(meta.last_page)}
                  className={`w-8 h-8 rounded-md text-sm font-medium ${
                    currentPage === meta.last_page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {meta.last_page}
                </button>
              </>
            )}
          </div>

          <div className="md:hidden text-sm text-gray-600">
            Page {currentPage} of {meta.last_page}
          </div>

          <button
            onClick={() => links.next && handlePageChange(currentPage + 1)}
            disabled={!links.next}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              links.next 
                ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50' 
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (loading && pagination.data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <div className="w-28 h-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          {pagination.meta && (
            <p className="text-sm text-gray-600 mt-1">
              Total: {pagination.meta.total} tasks
            </p>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-all duration-200"
        >
          {showForm ? (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6 animate-fadeIn">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-0.5 shadow-sm">
            <div className="bg-white rounded-xl p-6">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
          </div>
        </div>
      )}

      {pagination.data.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            Get started by creating your first task. Organize your work and track progress efficiently.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {pagination.data.map(task => (
              <div key={task.id} className="animate-slideUp">
                <TaskItem
                  task={task}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                />
              </div>
            ))}
          </div>
          
          <PaginationControls />
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TaskList;