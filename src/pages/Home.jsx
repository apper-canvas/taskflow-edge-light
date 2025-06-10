import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';
import { taskService } from '../services';

const Home = () => {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault();
            document.dispatchEvent(new CustomEvent('openAddTask'));
            break;
          case '/':
            e.preventDefault();
            document.querySelector('#search-input')?.focus();
            break;
          case '?':
            e.preventDefault();
            setShowKeyboardHelp(true);
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowKeyboardHelp(false);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <MainFeature />
      
      {/* Keyboard Shortcuts Helper */}
      {showKeyboardHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setShowKeyboardHelp(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-gray-900">
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { keys: ['Ctrl', 'N'], action: 'Add new task' },
                { keys: ['Ctrl', '/'], action: 'Focus search' },
                { keys: ['Space'], action: 'Toggle task completion' },
                { keys: ['Ctrl', '?'], action: 'Show shortcuts' },
                { keys: ['Esc'], action: 'Close dialogs' }
              ].map(({ keys, action }, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{action}</span>
                  <div className="flex items-center space-x-1">
                    {keys.map((key, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded border">
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;