import React from 'react';
import withCard from '../../components/HOC/withCard';

class Versions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        Version
      </div>
      );
  }
}

export default withCard('Versions', Versions);
