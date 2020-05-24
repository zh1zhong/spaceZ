import * as React from 'react';
// import classNames from 'classnames';
import Notification from 'rc-notification';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import CloseCircleFilled from '@ant-design/icons/CloseCircleFilled';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import InfoCircleFilled from '@ant-design/icons/InfoCircleFilled';

let defaultDuration = 3;
let defaultTop: number;
let messageInstance: any; // message实例
let key = 1;
let prefixCls = 'uih-advice';
let transitionName = 'move-up';
let getContainer: () => HTMLElement;
let maxCount: number;
let rtl = false;

function getMessageInstance(callback: (i: any) => void) {
  console.log('getMessageInstance', messageInstance);
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance(
    {
      prefixCls,
      transitionName,
      style: { top: defaultTop }, // 覆盖原来的样式
      getContainer,
      maxCount,
    },
    (instance: any) => {
      if (messageInstance) {
        callback(messageInstance);
        return;
      }
      console.log(instance);
      messageInstance = instance;
      callback(instance);
    },
  );
}

type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface ThenableArgument {
  (val: any): void;
}

// 定义可调用的方法？？？定义其所包含的内容
export interface MessageType {
  (): void;
  then: (fill: ThenableArgument, reject: ThenableArgument) => Promise<void>;
  promise: Promise<void>;
}

export interface ArgsProps {
  content: React.ReactNode; // 一个可以被react渲染的值（组件可返回的所有可能值）
  duration: number | null; // 间隔多久关闭，类型为数字或者空
  type: NoticeType; // 提示类型，必须为定义的类型之一
  onClose?: () => void; // 关闭回调，如果没有则赋一个空函数
  icon?: React.ReactNode; // 同上
  key?: string | number; // 字符串或者数字
}

// 可以自定义的iconMap
const iconMap = {
  info: InfoCircleFilled,
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  loading: LoadingOutlined,
};

// 传入的参数必须是ArgsProps类型
function notice(args: ArgsProps): MessageType {
  // 关闭间隔没有值则赋默认值
  const duration =
    args.duration !== undefined ? args.duration : defaultDuration;
  // 根据type在iconMap中找对应的图标
  const IconComponent = iconMap[args.type];

  // const messageClass = classNames(`${prefixCls}-custom-content`, {
  //   [`${prefixCls}-${args.type}`]: args.type,
  //   [`${prefixCls}-rtl`]: rtl === true,
  // });

  const messageClass = '';

  const target = args.key || key++;
  const closePromise = new Promise(resolve => {
    console.log('closePromise');
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(instance => {
      instance.notice({
        key: target,
        duration,
        style: {},
        content: (
          <div className={messageClass}>
            {args.icon || (IconComponent && <IconComponent />)}
            <span>{args.content}</span>
          </div>
        ),
        onClose: callback,
      });
    });
  });
  // 分别给MessageType中定义的三个属性赋值
  const result: any = () => {
    debugger;
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled: ThenableArgument, rejected: ThenableArgument) =>
    closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

type ConfigContent = React.ReactNode | string;
type ConfigDuration = number | (() => void);
type JointContent = ConfigContent | ArgsProps;
export type ConfigOnClose = () => void;

function isArgsProps(content: JointContent): content is ArgsProps {
  return (
    // typeof只会返回number,string,undefine等初步类型
    // Object.prototype.toString.call()能判断具体类型， 此处content如果是字符串则会返回"[object String]"
    // 如果content并不是字符串而是参数对象
    Object.prototype.toString.call(content) === '[object Object]' &&
    // 并且，参数对象的content不为空
    !!(content as ArgsProps).content
  );
}

export interface ConfigOptions {
  top?: number; //
  duration?: number; // 关闭间隔
  prefixCls?: string;
  getContainer?: () => HTMLElement;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
}

const api: any = {
  open: notice,
  config(options: ConfigOptions) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
    if (options.transitionName !== undefined) {
      transitionName = options.transitionName;
      messageInstance = null; // delete messageInstance for new transitionName
    }
    if (options.maxCount !== undefined) {
      maxCount = options.maxCount;
      messageInstance = null;
    }
    if (options.rtl !== undefined) {
      rtl = options.rtl;
    }
  },
  destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
};

// ???
['success', 'info', 'warning', 'error', 'loading'].forEach(type => {
  console.log(type);
  api[type] = (
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ) => {
    // debugger
    // 判断传入的是否是参数对象
    if (isArgsProps(content)) {
      return api.open({ ...content, type });
    }
    // 判断第二个参数是否为函数类型，如果是则把第二个参数写为关闭回调
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }
    // 组装参数，调用api的open方法
    return api.open({ content, duration, type, onClose });
  };
});

api.warn = api.warning;

export interface MessageApi {
  info(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  success(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  error(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  warn(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  warning(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  loading(
    content: JointContent,
    duration?: ConfigDuration,
    onClose?: ConfigOnClose,
  ): MessageType;
  open(args: ArgsProps): MessageType;
  config(options: ConfigOptions): void;
  destroy(): void;
}

export default api as MessageApi;
