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

/**
 * 获取员工详情
 * @param {*} id number
 * @returns
 */
export const getEmployeeAPI = (id) => {
  return request.get(`/park/sys/user/${id}`);
};

/**
 * 编辑员工
 * @param {*} data object
 * @returns
 */
export const updateEmployeeAPI = (data) => {
  return request.put(`/park/sys/user`, data);
};

/**
 * 重置密码
 * @param {*} id number
 * @returns
 */
export const resetPwdAPI = (id) => {
  return request({
    url: "/park/sys/user/resetPwd",
    method: "post",
    data: {
      id,
    },
  });
};

/**
 * 删除员工
 * @param {*} id number
 * @returns
 */
export const delEmployeeAPI = (id) => {
  return request.delete(`/park/sys/user/${id}`);
};
