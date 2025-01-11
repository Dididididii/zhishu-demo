import request from "@/utils/request";

// 查看计费规则列表
export const getbillingRuleListAPI = (params) => {
  return request({
    url: "/parking/rule/list",
    params,
  });
};

/**
 * 添加计费规则
 * @param {Object} data 对象
 */
export const addBillingRuleListAPI = (data) => {
  return request({
    url: "/parking/rule",
    method: "post",
    data,
  });
};

/**
 * 删除计费规则
 * @param {number} id
 */
export const delBillingRuleListAPI = (id) => {
  return request.delete(`/parking/rule/${id}`);
};

/**
 * 查看计费规则详情
 * @param {number} id
 */
export const searchBillingRuleItemAPI = (id) => {
  return request.get(`/parking/rule/${id}`);
};

/**
 * 编辑计费规则
 *@data {object} 规则对象
 */
export const updateBillingRuleAPI = (data) => {
  return request({
    url: "/parking/rule",
    method: "put",
    data,
  });
};
