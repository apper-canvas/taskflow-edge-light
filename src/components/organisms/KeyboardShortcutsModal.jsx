import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'N'], action: 'Add new task' },
    { keys: ['Ctrl', '/'], action: 'Focus search' },
    { keys: ['Space'], action: 'Toggle task completion' },
    { keys: ['Ctrl', '?'], action: 'Show shortcuts' },
    { keys: ['Esc'], action: 'Close dialogs' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
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
              <Button onClick={onClose} variant="ghost" className="p-2">
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map(({ keys, action }, index) => (
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
    </AnimatePresence>
  );
};

KeyboardShortcutsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default KeyboardShortcutsModal;