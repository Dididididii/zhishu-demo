import request from "@/utils/request";

/**
 * 获取一体杆列表
 * @param {*} params OBJECT
 * @returns
 */
export const getpoleInfoListAPI = (params) => {
  return request({
    url: "/pole/info/list",
    params,
  });
};

/**
 * 添加一体杆
 * @param {*} data object
 */
export const addPoleInfoAPI = (data) => {
  return request({
    url: "/pole/info",
    method: "post",
    data,
  });
};

/**
 * 编辑一体杆
 * @param {*} data object
 * @returns
 */
export const updatePoleInfoAPI = (data) => {
  return request({
    url: "/pole/info",
    method: "put",
    data,
  });
};

/**
 * 删除一体杆
 * @param {*} id number
 * @returns
 */
export const removePoleInfoAPI = (id) => {
  return request.delete(`/pole/info/${id}`);
};
