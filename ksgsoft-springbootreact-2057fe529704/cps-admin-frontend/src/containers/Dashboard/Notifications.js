import React from 'react';
import withCard from '../../components/HOC/withCard';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        Notifications
      </div>
    );
  }
}

export default withCard('Latest Notifications', Notifications);
