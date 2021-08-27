import postal from 'postal';

const EventBus = {
  publish: (topic, data, options = {}) => {
    postal.publish({ topic, data, ...options });
  },
  subscribe: (topic, callback, options = {}) => {
    postal.subscribe({ topic, callback, ...options });
  }
};

export default EventBus;
