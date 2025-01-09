import request from "@/utils/request";

// 上传接口
export const uploadImageAPI = (data) => {
  return request({
    url: "/upload",
    method: "POST",
    data,
  });
};
