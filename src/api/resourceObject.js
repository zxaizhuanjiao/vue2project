import service from '@/utils/request'

/* *
 * 
 * 应用
 * 
 * */
// 预定义--列表
export const getPredefinedAppList = (data) => {
	return service({
		url: '/resourceObj/resourceApp/predefined/pageQuery',
		method: 'post',
		data
	})
}

// 预定义--更新状态
export const changePredefinedAppStatus = (data) => {
	return service({
		url: '/resourceObj/resourceApp/predefined/statusChange',
		method: 'put',
		data
	})
}

// 自定义--列表
export const getCustomAppList = (data) => {
	return service({
		url: '/resourceObj/resourceApp/custom/pageQuery',
		method: 'post',
		data
	})
}

// 自定义--新增
export const addCustomApp = (data) => {
	return service({
		url: '/resourceObj/resourceApp/custom/add',
		method: 'post',
		data
	})
}

// 自定义--详情
export const getCustomAppDetail = (data) => {
	return service({
		url: '/resourceObj/resourceApp/custom/detailQuery?appCustomId=' + data,
		method: 'get'
	})
}

// 自定义--编辑
export const updateCustomApp = (data) => {
	return service({
		url: '/resourceObj/resourceApp/custom/update',
		method: 'put',
		data
	})
}

// 自定义--启用、禁用
export const changeCustomAppStatus = (data) => {
	return service({
		url: '/resourceObj/resourceApp/custom/statusChange',
		method: 'put',
		data
	})
}

// 自定义--删除
export const deleteCustomApp = (data) => {
	return service({
		url: '/resourceObj/resourceApp/custom/delete',
		method: 'delete',
		data
	})
}

/* *
 * 
 * 时间
 * 
 * */
// 时间--列表
export const getTimeList = (data) => {
	return service({
		url: '/resourceObj/resourceTime/time/pageQuery',
		method: 'post',
		data
	})
}

// 时间--无分页列表
export const getAllTimeList = (data) => {
	return service({
		url: '/resourceObj/resourceTime/time/listQuery?name=' + data,
		method: 'get'
	})
}

// 时间--新增
export const addTime = (data) => {
	return service({
		url: '/resourceObj/resourceTime/time/add',
		method: 'post',
		data
	})
}

// 时间--删除
export const deleteTime = (data) => {
	return service({
		url: '/resourceObj/resourceTime/time/delete',
		method: 'delete',
		data
	})
}

// 时间--id查询
export const getTimeDetail = (data) => {
	return service({
		url: '/resourceObj/resourceTime/time/detailQuery?timeId=' + data,
		method: 'get'
	})
}

// 时间--编辑
export const updateTime = (data) => {
	return service({
		url: '/resourceObj/resourceTime/time/update',
		method: 'put',
		data
	})
}

// 时间组--列表
export const getTimeGroupList = (data) => {
	return service({
		url: '/resourceObj/resourceTime/timeGroup/pageQuery',
		method: 'post',
		data
	})
}

// 时间组--新增
export const addTimeGroup = (data) => {
	return service({
		url: '/resourceObj/resourceTime/timeGroup/add',
		method: 'post',
		data
	})
}

// 时间组--删除
export const deleteTimeGroup = (data) => {
	return service({
		url: '/resourceObj/resourceTime/timeGroup/delete',
		method: 'delete',
		data
	})
}

// 时间组--id查询
export const getTimeGroupDetail = (data) => {
	return service({
		url: '/resourceObj/resourceTime/timeGroup/detailQuery?timeGroupId=' + data,
		method: 'get'
	})
}

// 时间组--编辑
export const updateTimeGroup = (data) => {
	return service({
		url: '/resourceObj/resourceTime/timeGroup/update',
		method: 'put',
		data
	})
}

/* *
 * 
 * 地址
 * 
 * */
// 地址--列表
export const getAddressList = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/address/pageQuery',
		method: 'post',
		data
	})
}

// 地址--新增
export const addAddress = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/address/add',
		method: 'post',
		data
	})
}

// 地址--更新
export const updateAddress = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/address/update',
		method: 'put',
		data
	})
}

// 地址--删除
export const deleteAddress = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/address/delete',
		method: 'delete',
		data
	})
}

// 地址--详情
export const getAddressDetail = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/address/detailQuery?id=' + data,
		method: 'get'
	})
}

// 地址--无分页列表
export const getAllAddressList = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/address/listQuery',
		method: 'post',
		data
	})
}

// 地址组--列表
export const getAddressGroupList = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/addressGroup/pageQuery',
		method: 'post',
		data
	})
}

// 地址组--新增
export const addAddressGroup = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/addressGroup/add',
		method: 'post',
		data
	})
}

// 地址组--详情
export const getAddressGroupDetail = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/addressGroup/detailQuery?id=' + data,
		method: 'get'
	})
}

// 地址组--更新
export const updateAddressGroup = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/addressGroup/update',
		method: 'put',
		data
	})
}

// 地址组--删除
export const deleteAddressGroup = (data) => {
	return service({
		url: '/resourceObj/resourceAddress/addressGroup/delete',
		method: 'delete',
		data
	})
}


/* *
 * 
 * 安全域
 * 
 * */
// 列表
export const getSafeZoneList = (data) => {
	return service({
		url: '/resourceObj/safeZone/pageQuery',
		method: 'post',
		data
	})
}

// 获取网卡下拉列表
export const getEthList = (data) => {
	return service({
		url: '/resourceObj/safeZone/networkInterface/listQuery',
		method: 'post',
		data
	})
}

// 新增
export const addSafeZone = (data) => {
	return service({
		url: '/resourceObj/safeZone/add',
		method: 'post',
		data
	})
}

// 删除
export const deleteSafeZone = (data) => {
	return service({
		url: '/resourceObj/safeZone/delete',
		method: 'delete',
		data
	})
}

// 详情
export const getSafeZoneDetail = (data) => {
	return service({
		url: '/resourceObj/safeZone/detailQuery?id=' + data,
		method: 'get'
	})
}

// 更新
export const updateSafeZone = (data) => {
	return service({
		url: '/resourceObj/safeZone/update',
		method: 'put',
		data
	})
}

// 安全域所有列表
export const getSafeZoneAllList = (data) => {
	return service({
		url: '/resourceObj/safeZone/listQuery',
		method: 'post',
		data
	})
}

// 地址地址组所有列表
export const getAddressAllList = (data) => {
	return service({
		url: '/resourceObj/address/listQuery',
		method: 'post',
		data
	})
}

// 应用所有列表
export const getAppAllList = () => {
	return service({
		url: '/resourceObj/resourceApp/listQuery',
		method: 'get'
	})
}

// 时间时间组所有列表
export const getTimeAllList = () => {
	return service({
		url: '/resourceObj/resourceTime/listQuery',
		method: 'get'
	})
}

// 获取协议
export const getProtocolDictionaryList = () => {
	return service({
		url: '/baseBusiness/protocolDictionary/listQuery',
		method: 'get'
	})
}
