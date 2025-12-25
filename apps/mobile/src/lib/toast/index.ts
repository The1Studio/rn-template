import Toast, { ToastShowParams } from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

interface ShowToastOptions {
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
  onHide?: () => void;
}

const showToast = (type: ToastType, options: ShowToastOptions) => {
  const params: ToastShowParams = {
    type,
    text1: options.title,
    visibilityTime: options.duration ?? 3000,
    props: {
      hidePress: () => Toast.hide(),
    },
    autoHide: true,
    position: options.position ?? 'top',
  };

  Toast.show(params);
};

export const toast = {
  success: (options: ShowToastOptions) => showToast('success', options),
  error: (options: ShowToastOptions) => showToast('error', options),
  info: (options: ShowToastOptions) => showToast('info', options),
  hide: () => Toast.hide(),
};
