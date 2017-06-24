import _ from 'lodash';

export default {
  WORK_START: { mode: 'work', status: 'init' },
  WORK: { mode: 'work', status: 'active' },
  WORK_PAUSED: { mode: 'work', status: 'inactive' },
  BREAK_START: { mode: 'break', status: 'init' },
  BREAK: { mode: 'break', status: 'active' },
  BREAK_PAUSED: { mode: 'break', status: 'inactive' },
  GET_MODE: inputState => inputState.mode,
  GET_STATUS: inputState => inputState.status,
  START: (inputState) => {
    const temp = _.clone(inputState);
    temp.status = 'active';
    return temp;
  },
  PAUSE: (inputState) => {
    const temp = _.clone(inputState);
    temp.status = 'inactive';
    return temp;
  },
  RESET: (inputState) => {
    const temp = _.clone(inputState);
    temp.status = 'init';
    return temp;
  },
  SWITCH: (inputState) => {
    const temp = _.clone(inputState);
    temp.mode = (temp.mode === 'break') ? 'work' : 'break';
    temp.status = 'init';
    return temp;
  },
};
