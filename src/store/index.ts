import { useRefreshStore } from './refresh';
import { useTokenStore } from './token';
import { useUserInfoStore } from './user';

export interface IAppStore {
  useUserInfoStore: ReturnType<typeof useUserInfoStore>;
  useTokenStore: ReturnType<typeof useTokenStore>;
  useRefreshStore: ReturnType<typeof useRefreshStore>;
}
const appStore: IAppStore = {} as IAppStore;
/**
 * @description 注册app状态库
 * @author Ocean
 * @date 2023/03/16 20:50:52
 */
export const registerStore = () => {
  appStore.useUserInfoStore = useUserInfoStore();
  appStore.useTokenStore = useTokenStore();
  appStore.useRefreshStore = useRefreshStore();
};

export default appStore;
