import Dialog from './Dialog.vue'
import DialogConfirm from './DialogConfirm.vue'

export type TDialogRef = InstanceType<typeof Dialog> | null
export enum DIALOG_VALUES {
  CONFIRM = 'confirm',
  CANCEL = 'cancel'
}

export {
  Dialog,
  DialogConfirm
}
