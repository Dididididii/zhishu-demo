import request from "@/utils/request";

/**
 * 获取所有楼宇列表
 * @param {*} params Object
 * @returns
 */
export const getBuilingListAPI = (params) => {
  return request({
    url: "/park/building",
    params,
  });
};

/**
 * 添加楼宇
 * @param {*} data object
 */
export const addBuildingAPI = (data) => {
  return request({
    url: "/park/building",
    method: "post",
    data,
  });
};

/**
 * 获取楼宇详情
 * @param {*} id number
 * @returns
 */
export const getBuilingItemAPI = (id) => {
  return request({
    url: `/park/building/${id}`,
  });
};

/**
 *  修改楼宇
 * @param {*} data Object
 * @returns
 */
export const updateBuildingItemAPI = (data) => {
  return request({
    url: "/park/building",
    method: "put",
    data,
  });
};

/**
 * 删除楼宇
 * @param {*} id number
 * @returns
 */
export const delBuildingItemAPI = (id) => {
  return request.delete(`/park/building/${id}`);
};
