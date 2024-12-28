import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  Bell,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Notification, NotificationType } from '../../../types/client';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const notificationIcons: Record<NotificationType, React.FC<{ className?: string }>> = {
  message: MessageSquare,
  response: FileText,
  update: Info,
  system: Bell,
};

const notificationColors: Record<NotificationType, string> = {
  message: 'bg-blue-100 text-blue-600',
  response: 'bg-green-100 text-green-600',
  update: 'bg-yellow-100 text-yellow-600',
  system: 'bg-purple-100 text-purple-600',
};

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type];
          const colorClass = notificationColors[notification.type];

          return (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm p-4 flex items-start space-x-4 ${
                !notification.read ? 'border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {notification.related_entity_id && (
                  <div className="mt-2">
                    {notification.type === 'message' && (
                      <Link
                        to={`/client/chats/${notification.related_entity_id}`}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        View Chat
                      </Link>
                    )}
                    {notification.type === 'response' && (
                      <Link
                        to={`/client/requirements/${notification.related_entity_id}`}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Requirement
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
