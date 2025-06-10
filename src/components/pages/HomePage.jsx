import React, { useState, useEffect } from 'react';
import TaskDashboard from '@/components/organisms/TaskDashboard';
import KeyboardShortcutsModal from '@/components/organisms/KeyboardShortcutsModal';

const HomePage = () => {
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
      <TaskDashboard />
      
      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcutsModal isOpen={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
    </div>
  );
};

export default HomePage;