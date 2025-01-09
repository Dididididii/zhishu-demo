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

// 查看企业
export const searchEnterpriseAPI = (id) => {
  return request.get(`/park/enterprise/${id}`);
};

// 编辑企业
export const updatEnterpriseAPI = (data) => {
  return request({
    url: "/park/enterprise",
    method: "put",
    data,
  });
};

// 删除企业
export const delEnterpriseAPI = (id) => {
  return request.delete(`/park/enterprise/${id}`);
};

// 添加/续租企业的租赁合同
export const addEnterpriseRentAPI = (data) => {
  return request({
    url: "/park/enterprise/rent",
    method: "post",
    data,
  });
};
