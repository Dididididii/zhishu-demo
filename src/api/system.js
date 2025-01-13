import request from "@/utils/request";

/**
 * 查询所有权限列表
 */
export const getSysRoleListAPI = () => {
  return request.get("/park/sys/role");
};

// 查询所有功能权限
export const getSysRoleTreeAPI = () => {
  return request.get("/park/sys/permision/all/tree");
};

/**
 * 获取当前角色权限点列表
 * @returns
 */
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`,
  });
}

// 角色管理-角色关联的用户列表
export const getRoleUserAPI = (roleId, params) => {
  return request({
    url: `/park/sys/roleUser/${roleId}`,
    params,
  });
};

// 添加角色
export const addRoleUserAPI = (data) => {
  return request({
    url: "/park/sys/role",
    method: "post",
    data,
  });
};

// 查询当前角色所有权限
export const getRoleDetailItemAPI = (roleId) => {
  return request({
    url: `/park/sys/role/${roleId}`,
  });
};

// 修改角色
export const updateRoleUserAPI = (data) => {
  return request({
    url: "/park/sys/role",
    method: "put",
    data,
  });
};

// 删除角色
export const delRoleUserAPI = (id) => {
  return request.delete(`/park/sys/role/${id}`);
};
