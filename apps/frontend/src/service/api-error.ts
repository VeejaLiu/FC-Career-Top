import axios from 'axios';
import { Toast } from '@douyinfe/semi-ui';

// Network failures have no response. Never dereference response in a catch block.
export function reportApiError(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    Toast.error('Please login first');
  }
}
