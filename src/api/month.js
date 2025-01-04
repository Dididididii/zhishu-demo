// 导入request
import request from "@/utils/request";

// 获取月卡信息列表
export function getMonthListAPI(params) {
  return request({
    url: "/parking/card/list",
    params,
  });
}
