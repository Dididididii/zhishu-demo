import request from "@/utils/request";

// 上传接口
export const uploadAPI = (data) => {
  return request({
    url: "/upload",
    method: "POST",
    data,
  });
};

/**
 * 下载接口
 *
 */
export const downLoadAPI = (id) => {
  return request.post(`/download/${id}`);
};
