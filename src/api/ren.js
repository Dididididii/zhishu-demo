import request from "@/utils/request";

// 查询可租赁楼宇
export const searchBuildingAPI = () => {
  return request.get("/park/rent/building");
};
