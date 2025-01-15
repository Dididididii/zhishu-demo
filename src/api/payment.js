import request from "@/utils/request";

/**
 * 获取停车缴费列表
 * @param {*} params object
 */
export const getPaymentListAPI = (params) => {
  return request({
    url: "/parking/payment/list",
    params,
  });
};
