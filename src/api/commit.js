import request from "@/utils/request";

// 上传接口
export const uploadAPI = (data) => {
  return request({
    url: "/upload",
    method: "POST",
    data,
  });
};
