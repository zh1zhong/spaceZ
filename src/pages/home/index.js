import React, { Component } from 'react';

import Advice from '@/components/Advice/index.tsx';

class Home extends Component {
  componentDidMount() {
    Advice.info({
      content: 'dasd',
      duration: 0,
    });
    // Advice.info(<div>ddd</div>);
    // Advice.info({}); // 页面崩溃
    // Advice.info({content:''}); // 页面崩溃
  }

  render() {
    return <div></div>;
  }
}

export default Home;
