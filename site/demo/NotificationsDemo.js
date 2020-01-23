import React from 'react';
import Observer from 'react-tweenful/Observer';
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

const Notification = ({ notification, onClick }) => {
  const { id, message, type } = notification;

  return (
    <div onClick={() => onClick(id)} className={`notification-item notification-${type}`}>
      <div className="notification-content">
        <div className="notification-close"></div>
        <p className="notification-message">{message}</p>
      </div>
    </div>
  );
};

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: new Array(5).fill(0).map(() => ({
        id: number(1100, 9900),
        message: messages[number(0, messages.length)],
        type: types[number(0, types.length)]
      }))
    };

    this.removeNotification = this.removeNotification.bind(this);
    this.appendNotification = this.appendNotification.bind(this);
  }

  appendNotification() {
    this.setState(prevState => ({
      notifications: [
        ...prevState.notifications,
        {
          id: number(1100, 9900),
          message: messages[number(0, messages.length - 1)],
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
          <ObserverGroup skipInitial={true}>
            {this.state.notifications.map(notification => (
              <Observer.div
                duration={500}
                style={{ opacity: 0 }}
                onMount={{ opacity: 1 }}
                onUnmount={{ opacity: 0, height: '0px' }}
                easing="easeInOutCubic"
                key={notification.id}
              >
                <Notification notification={notification} onClick={this.removeNotification} />
              </Observer.div>
            ))}
          </ObserverGroup>
        </div>
      </div>
    );
  }
}

export default Notifications;
