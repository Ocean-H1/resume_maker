import { uuid } from 'vue-uuid';

// 生成uuid
export const getUuid = (): string => {
  return uuid.v4().split('-').join('');
};
