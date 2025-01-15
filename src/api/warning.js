import request from "@/utils/request";

/**
 * 查看告警记录列表
 * @param {*} params object
 * @returns
 */
export const getWarningListAPI = (params) => {
  return request({
    url: "/pole/warning/list",
    params,
  });
};

/**
 * 查看警告详情
 * @param {*} id number
 * @returns
 */
export const getWarningAPI = (id) => {
  return request({
    url: `/pole/warning/${id}`,
  });
};

/**
 * 删除警告
 * @param {*} id number
 * @returns
 */
export const delWarningAPI = (id) => {
  return request.delete(`/pole/warning/${id}`);
};
