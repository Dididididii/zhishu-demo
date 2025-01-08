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
