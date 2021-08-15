import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import 'animate.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

import styles from './styles.less';

const AnimationPage = () => {
  const newGroup = {
    id: new Date().getTime(),
    added: true,
    name: '新分组',
    members: [
      { id: '9789', name: 'dasdsad' },
      { id: '31298793123', name: 'dasdas' },
      { id: '11198791123', name: 'dasddd' },
      { id: '222399992132', name: 'dddddd' },
    ],
  };

  const initGroups = [
    {
      id: '1111',
      name: '分组1',
      members: [
        { id: '321333', name: 'dasdsad' },
        { id: '3123123', name: 'dasdas' },
        { id: '1111123', name: 'dasddd' },
        { id: '22232132', name: 'dddddd' },
      ],
    },
    {
      id: '2222',
      name: '分组2',
      members: [
        { id: '31333', name: 'dasdsad' },
        { id: '33313', name: 'dasdas' },
        { id: '11331', name: 'dasddd' },
        { id: '3333', name: 'dddddd' },
      ],
    },
    {
      id: '3333',
      name: '分组3',
      members: [
        { id: '33321', name: 'dasdsad' },
        { id: '33312', name: 'dasdas' },
        { id: '313123', name: 'dasddd' },
        { id: '231232122', name: 'dddddd' },
      ],
    },
    {
      id: '4444',
      name: '分组4',
      members: [
        { id: '2432513', name: 'dasdsad' },
        { id: '1765723', name: 'dasdas' },
        { id: '1176571', name: 'dasddd' },
        { id: '276576522', name: 'dddddd' },
      ],
    },
  ];

  const [animate, setAnimate] = useState('fadeInDown');
  const [groups, setGroups] = useState(initGroups);

  const addGroup = () => {
    // setAnimate('fadeInDown');
    setGroups([newGroup, ...groups]);
  };

  const deleteGroup = ({ id, name }) => {
    // setAnimate('backOutRight');
    // setGroups(groups.filter(group => group.name !== name));
    document.getElementById(id).className = `${
      document.getElementById(id).className
    } animate__backOutRight`;
    setGroups(groups.filter(group => group.id !== id));
  };

  // animate__fadeInDown animate__backOutRight

  const onAnimationEnd = (e, { id, name }) => {
    console.log('end', e.target);
    e.target.className = e.target.className.replace('animate__fadeInDown', '');
  };

  return (
    <div>
      <Button onClick={() => addGroup()}>增加分组</Button>
      <ReactCSSTransitionGroup
        transitionEnter={true}
        transitionLeave={true}
        transitionEnterTimeout={2500}
        transitionLeaveTimeout={600}
        transitionName={'animated'}
      >
        {groups.map(group => (
          <div
            key={group.id}
            id={group.id}
            className={`${styles.group} animate__animated ${
              group.added ? 'animate__fadeInDown' : ''
            }`}
            onAnimationEnd={e => onAnimationEnd(e, group)}
          >
            <div className={styles.header}>
              <span>{group.name}</span>
              <span>
                <Button onClick={() => deleteGroup(group)}>删除</Button>
              </span>
            </div>
            <div className={styles.memebers}>
              {group.members.map(member => (
                <div className={styles.member} key={member.id}>
                  <span>{member.name}</span>
                  <span>
                    <Button>删除</Button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </ReactCSSTransitionGroup>
    </div>
  );
};

export default AnimationPage;
