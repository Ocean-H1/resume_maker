import { Router } from 'vue-router';
import { commentType } from '@/dictionary/commentType';

// 跳转至评论详情
export const toCommentDetail = (item: any, router: Router) => {
  const path = commentType[item.comment_type].path;
  if (item.comment_type === 'resumeOnline') {
    router.push({
      path: path,
      query: {
        id: item.comment_type_id
      }
    });
  } else if (item.comment_type === 'resumeTemplate') {
    router.push({
      path: path,
      query: {
        id: item.comment_type_id
      }
    });
  } else if (item.comment_type === 'soft') {
    router.push({
      path: path,
      query: {
        sourceId: item.comment_type_id
      }
    });
  } else if (item.comment_type === 'pptTemplate') {
    router.push({
      path: path,
      query: {
        id: item.comment_type_id
      }
    });
  } else if (item.comment_type === 'article') {
    router.push({
      path: path,
      query: {
        articleId: item.comment_type_id
      }
    });
  }
};
