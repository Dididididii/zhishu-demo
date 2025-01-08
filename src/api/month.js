// 导入request
import request from "@/utils/request";

// 获取月卡信息列表
export function getMonthListAPI(params) {
  return request({
    url: "/parking/card/list",
    params,
  });
}

// 添加月卡
export const addMonthCardAPI = (data) => {
  return request({
    url: "/parking/card",
    method: "post",
    data,
  });
};

// 删除月卡
export const delMonthCardAPI = (id) => {
  return request.delete(`/parking/card/${id}`);
};

// 获取编辑月卡详情
export const getMonthItemAPI = (id) => {
  return request.get(`/parking/card/detail/${id}`);
};

// 编辑月卡信息
export const editMonthItemAPI = (data) => {
  return request({
    url: "/parking/card/edit",
    method: "put",
    data,
  });
};

// 月卡续费
export const renewMonthItemAPI = (data) => {
  return request({
    url: "/parking/card/recharge",
    method: "post",
    data,
  });
};

// 查看月卡详情
export const checkMonthItemAPI = (id) => {
  return request.get(`/parking/card/${id}`);
};
