import request from "@/utils/request";

// 获取企业管理列表
export const getEnterpriseListAPI = (params) => {
  return request({
    url: "/park/enterprise",
    params,
  });
};

// 查询企业所属行业列表
export const searchEnterPriseIndustryAPI = () => {
  return request({
    url: "/park/industry",
  });
};

// 添加企业
export const addEnterpriseAPI = (data) => {
  return request({
    url: "/park/enterprise",
    method: "post",
    data,
  });
};
