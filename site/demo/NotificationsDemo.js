import React from 'react';
import ObserverGroup from 'react-tweenful/ObserverGroup';

const messages = [
  'All your data has been successfully updated',
  'Your meeting has been successfully attended',
  'Document has been successfully updated',
  'You have no access rights',
  'An error occurred while saving',
  'Document has been permanently removed'
];

const types = ['default', 'success', 'danger'];
const number = (start, end) => Math.floor(Math.random() * end) + start;

const Notification = ({ notification, onClick, style }) => {
  const { id, message, type } = notification;

  return (
    <div className="observer-element" style={style}>
      <div
        onClick={() => onClick(id)}
        className={`notification-item notification-${type}`}
      >
        <div className="notification-content">
          <div className="notification-close"></div>
          <p className="notification-message">{message}</p>
        </div>
      </div>
    </div>
  );
};

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: new Array(5).fill(0).map(() => {
        const id = number(1100, 9900);
        return {
          id,
          message: `${id} ${messages[number(0, messages.length)]}`,
          type: types[number(0, types.length)]
        };
      })
    };

    this.removeNotification = this.removeNotification.bind(this);
    this.appendNotification = this.appendNotification.bind(this);
  }

  appendNotification() {
    const id = number(1100, 9900);
    this.setState(prevState => ({
      notifications: [
        ...prevState.notifications,
        {
          id,
          message: `${id} ${messages[number(0, messages.length - 1)]}`,
          type: types[number(0, types.length - 1)]
        }
      ]
    }));
  }

  removeNotification(id) {
    this.setState(prevState => ({
      notifications: prevState.notifications.filter(notif => notif.id !== id)
    }));
  }

  render() {
    return (
      <div className="notifications-demo">
        <div className="actions">
          <a className="button primary" onClick={this.appendNotification}>
            Add
          </a>
        </div>
        <div className="list">
          <ObserverGroup
            config={{
              duration: 800,
              style: { overflow: 'hidden' },
              mount: { opacity: [0, 1], height: ['0px', 'auto'] },
              unmount: { opacity: [1, 0], height: ['auto', '0px'] },
              easing: 'easeInOutCubic'
            }}
            skipInitial={true}
          >
            {this.state.notifications.map(notification => (
              <Notification
                key={notification.id}
                notification={notification}
                onClick={this.removeNotification}
              />
            ))}
          </ObserverGroup>
        </div>
      </div>
    );
  }
}

export default Notifications;
