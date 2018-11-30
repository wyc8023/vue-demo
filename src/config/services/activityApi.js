import host from '../host'
let activityApi = {
  host: host.ecommerceOA,
  getNewsList: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/getList'
  },
  deleteNews: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/delete'
  },
  verifyNews: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/verify'
  },
  setTopNews: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/setTop'
  },
  recommendNews: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/setRecommend'
  },
  addNews: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/add'
  },
  updateNews: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/news/update'
  },
  getAdvColumnsList: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/adv/getColumnList'
  },
  getAdvsList: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/adv/getList'
  },
  deleteAdvs: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/adv/delete'
  },
  updateAdvs: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/adv/update'
  },
  addAdvs: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/adv/add'
  },
  deleteSupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/content/delete'
  },
  addSupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/band/add'
  },
  updateSupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/band/update'
  },
  recommendSupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/band/setRecommend'
  },
  setTopSupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/band/setTop'
  },
  veriftySupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/band/verify'
  },
  getListSupport: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/band/getList'
  },
  deleteCategory: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/category/delete'
  },
  addCategory: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/category/add'
  },
  updateCategory: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/category/update'
  },
  getListCategory: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/category/getList'
  },
  getFeedbackTypeList: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/feedback/getTypeList'
  },
  getFeedbackList: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/feedback/getList'
  },
  updateFeedback: {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/feedback/updateFeedback'
  }
}
export default activityApi
