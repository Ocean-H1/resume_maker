import appStore from '@/store';
import { uuid } from 'vue-uuid';

// 生成uuid
export const getUuid = (): string => {
  return uuid.v4().split('-').join('');
};

// 开启全局等待层
export const openGlobalLoading = () => {
  const {changeLoading} = appStore.useLoadingStore
  changeLoading(true)
}
// 关闭全局等待层
export const closeGlobalLoading = () => {
  const {changeLoading} = appStore.useLoadingStore
  changeLoading(false)
}