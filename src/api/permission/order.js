import request from '@/utils/request'

// 获取订单列表
export const getOrderList = (data) => {
  return request({
    url: `/api/project/SaleOrder/selectList`,
    method: 'post',
    data
  })
}
