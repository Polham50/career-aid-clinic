
import React from 'react';
import { Notification } from '../../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 animate-fade-in-down">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white">Notifications</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={`p-4 flex items-start space-x-3 transition-colors ${notification.read ? 'hover:bg-gray-700/50' : 'bg-cyan-900/40 hover:bg-cyan-900/60'}`}>
              <div className="flex-shrink-0 text-cyan-400 mt-1">{notification.icon}</div>
              <div>
                <h4 className="font-semibold text-sm text-white">{notification.title}</h4>
                <p className="text-xs text-gray-300">{notification.description}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-sm text-gray-400">No new notifications.</p>
        )}
      </div>
      <div className="p-2 bg-gray-900/50 text-center border-t border-gray-700">
        <button className="text-sm text-cyan-500 hover:underline">View all notifications</button>
      </div>
    </div>
  );
};

export default NotificationPanel;