import React, { Component } from 'react';
import { Table } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

let dragingIndex = -1;

import styles from './styles.less';

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />,
      ),
    );
  }
}

class headerColumn extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveColumn,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <th {...restProps} className={className} style={style} />,
      ),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const columnSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const columnTarget = {
  drop(props, monitor) {
    // debugger
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveColumn(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

const DragableHeaderColumn = DropTarget(
  'cell',
  columnTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }),
)(
  DragSource('cell', columnSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(headerColumn),
);

class index extends Component {
  state = {
    columns: [
      {
        index: 0,
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        onHeaderCell: column => ({
          index: column.index,
          title: column.title,
          moveColumn: this.moveColumn,
        }),
      },
      {
        index: 1,
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        onHeaderCell: column => ({
          index: column.index,
          title: column.title,
          moveColumn: this.moveColumn,
        }),
      },
      {
        index: 2,
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        onHeaderCell: column => ({
          index: column.index,
          title: column.title,
          moveColumn: this.moveColumn,
        }),
      },
    ],
    data: [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ],
  };

  components = {
    header: {
      cell: DragableHeaderColumn,
    },
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    this.setState(
      update(this.state, {
        data: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        },
      }),
    );
  };

  moveColumn = (dragIndex, hoverIndex) => {
    const { columns } = this.state;
    const dragColumn = columns[dragIndex];
    const newColumns = [...columns];
    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, dragColumn);
    newColumns.forEach((item, index) => {
      item.index = index;
    });
    this.setState({ columns: newColumns });
    // this.setState(
    //   update(this.state, {
    //     columns: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragColumn]],
    //     },
    //   }),
    // );
  };

  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this.moveRow,
          })}
        />
      </DndProvider>
    );
  }
}

export default index;
