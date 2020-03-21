
import {toast} from 'react-toastify'

const Type = {
  INFO : toast.TYPE.INFO,
  SUCCESS : toast.TYPE.SUCCESS,
  WARNING : toast.TYPE.WARNING,
  ERROR : toast.TYPE.ERROR,
  DEFAULT : toast.TYPE.DEFAULT
};

const Position = {
  TOP_RIGHT : toast.POSITION.TOP_RIGHT,
  TOP_CENTER : toast.POSITION.TOP_CENTER,
  TOP_LEFT : toast.POSITION.TOP_LEFT,
  BOTTOM_RIGHT : toast.POSITION.BOTTOM_RIGHT,
  BOTTOM_CENTER : toast.POSITION.BOTTOM_CENTER,
  BOTTOM_LEFT : toast.POSITION.BOTTOM_LEFT
};

export {
  Type,
  Position
}
