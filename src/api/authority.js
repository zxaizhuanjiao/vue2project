import service from '@/utils/request'

export const getAuthorityList = (data) => {
  return service({
    url: '/authority/getAuthorityList',
    method: 'post',
    data
  })
}

// 创建角色
export const createAuthority = (data) => {
  return service({
    url: '/authority/createAuthority',
    method: 'post',
    data
  })
}

// 修改角色
export const updateAuthority = (data) => {
  return service({
    url: '/authority/updateAuthority',
    method: 'put',
    data
  })
}

// 删除角色
export const deleteAuthority = (data) => {
  return service({
    url: '/authority/deleteAuthority',
    method: 'post',
    data
  })
}

// 角色菜单
export const getBaseMenuTree = () => {
  return service({
    url: '/menu/getBaseMenuTree',
    method: 'post'
  })
}

// 获取用户menu关联关系
export const getMenuAuthority = (data) => {
  return service({
    url: '/menu/getMenuAuthority',
    method: 'post',
    data
  })
}

// 添加用户menu关联关系
export const addMenuAuthority = (data) => {
  return service({
    url: '/menu/addMenuAuthority',
    method: 'post',
    data
  })
}

// 获取api列表
export const getAllApis = (data) => {
  return service({
    url: '/api/getAllApis',
    method: 'post',
    data
  })
}

// 更改角色api权限
export const UpdateCasbin = (data) => {
  return service({
    url: '/casbin/updateCasbin',
    method: 'post',
    data
  })
}

// 获取权限列表
export const getPolicyPathByAuthorityId = (data) => {
  return service({
    url: '/casbin/getPolicyPathByAuthorityId',
    method: 'post',
    data
  })
}