import request from "@/utils/request";

/**
 * 获取员工列表
 * @param { page, pageSize, name} params
 * @returns
 */
export function getEmployeeListAPI(params) {
  return request({
    url: "/park/sys/user",
    params,
  });
}

// 添加用户
export const addEmployeeAPI = (data) => {
  return request({
    url: "/park/sys/user",
    method: "post",
    data,
  });
};