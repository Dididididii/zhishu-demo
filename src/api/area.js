import request from "@/utils/request";

/**
 * 获取所有区域列表
 * @param {*} params Object
 * @returns
 */
export const getAreaListAPI = (params) => {
  return request({
    url: "/parking/area/list",
    params,
  });
};

/**
 * 添加区域
 * @param {*} data object
 */
export const addAreaAPI = (data) => {
  return request({
    url: "/parking/area",
    method: "post",
    data,
  });
};

// 获取关联区域下拉列表
export const getAreaDropListAPI = () => {
  return request({
    url: "/parking/area/dropList",
  });
};

/**
 * 编辑区域
 * @param {*} data Object
 * @returns
 */
export const updateAreaDropAPI = (data) => {
  return request({
    url: "/parking/area",
    method: "put",
    data,
  });
};

/**
 * 删除区域
 * @param {*} id number
 * @returns
 */
export const delAreaAPI = (id) => {
  return request.delete(`/parking/area/${id}`);
};
