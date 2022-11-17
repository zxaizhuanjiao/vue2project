import service from '@/utils/request'

/* *
 * 
 * 基础防火墙
 * 
 * */
// 列表
export const getPolicyManagerList = (data) => {
	return service({
		url: '/securityPolicy/policyManager/pageQuery',
		method: 'post',
		data
	})
}

// 获取所有列表
export const getPolicyManagerAllList = () => {
	return service({
		url: '/securityPolicy/policyManager/listQuery',
		method: 'get'
	})
}

// 新增
export const addPolicyManager = (data) => {
	return service({
		url: '/securityPolicy/policyManager/add',
		method: 'post',
		data
	})
}

// 删除
export const deletePolicyManager = (data) => {
	return service({
		url: '/securityPolicy/policyManager/delete',
		method: 'delete',
		data
	})
}

// id查询详情
export const getPolicyManagerDetail = (data) => {
	return service({
		url: '/securityPolicy/policyManager/detailQuery?policyManagerId=' + data,
		method: 'get'
	})
}

// 移动策略优先级
export const movePolicyManagerPriority = (data) => {
	return service({
		url: '/securityPolicy/policyManager/priorityMove',
		method: 'put',
		data
	})
}

// 更新状态
export const changePolicyManagerStatus = (data) => {
	return service({
		url: '/securityPolicy/policyManager/statusChange',
		method: 'put',
		data
	})
}

// 更新
export const updatePolicyManager = (data) => {
    console.log(data)
	return service({
		url: '/securityPolicy/policyManager/update',
		method: 'put',
		data
	})
}

// 清除命中数
export const clearPolicyManagerHits = (data) => {
	return service({
		url: '/securityPolicy/policyManager/hitsClear',
		method: 'put',
		data
	})
}

/* *
 * 
 * 协议深度解析
 * 
 * */
// 列表
export const getDeepPacketInspectionList = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/pageQuery',
		method: 'post',
		data
	})
}

// 所有列表
export const getDeepPacketInspectionAllList = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/listQuery',
		method: 'post',
		data
	})
}

// 新增
export const addDeepPacketInspection = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/add',
		method: 'post',
		data
	})
}

// id查询详情
export const getDeepPacketInspectionDetail = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/detailQuery?id=' + data,
		method: 'get'
	})
}

// 更新
export const updateDeepPacketInspection = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/update',
		method: 'put',
		data
	})
}

// 删除
export const deleteDeepPacketInspection = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/delete',
		method: 'delete',
		data
	})
}

// 移动顺序
export const moveDeepPacketInspection = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/priorityMove',
		method: 'put',
		data
	})
}

// 启用禁用
export const changeDeepPacketInspectionStatus = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/statusChange',
		method: 'put',
		data
	})
}

// 批量动作修改
export const modifyDeepPacketInspectionAction = (data) => {
	return service({
		url: '/securityPolicy/deepPacketInspection/actionChange',
		method: 'put',
		data
	})
}

/* *
 * 
 * 白名单策略组
 * 
 * */
// 列表
export const getWhiteList = (data) => {
	return service({
		url: '/securityPolicy/whitelist/pageQuery',
		method: 'post',
		data
	})
}

// 新增
export const addWhiteList = (data) => {
	return service({
		url: '/securityPolicy/whitelist/add',
		method: 'post',
		data
	})
}

// 获取自定义白名单
export const getCustomizeWhiteList = () => {
	return service({
		url: '/securityPolicy/whitelist/listQuery',
		method: 'get'
	})
}

// 更新
export const updateWhiteList = (data) => {
	return service({
		url: '/securityPolicy/whitelist/update',
		method: 'put',
        data
	})
}

// 修改状态
export const changeWhiteListStatus = (data) => {
	return service({
		url: '/securityPolicy/whitelist/statusChange',
		method: 'put',
        data
	})
}

// 删除
export const deleteWhiteList = (data) => {
	return service({
		url: '/securityPolicy/whitelist/delete',
		method: 'delete',
        data
	})
}

// 导入
export const importWhiteList = (data) => {
	return service({
		url: '/securityPolicy/whitelist/import',
		method: 'post',
        data
	})
}

// 导出
export const exportWhiteList = () => {
    return service({
        url: '/securityPolicy/whitelist/export',
        method: 'get',
        responseType: 'blob'
    })
}

// 查询白名单外动作
export const getWhiteListActionQuery = () => {
    return service({
        url: '/securityPolicy/whitelist/actionQuery',
        method: 'get'
    })
}

// 修改白名单外动作
export const updateWhiteListActionQuery = (data) => {
    return service({
        url: '/securityPolicy/whitelist/actionUpdate',
        method: 'put',
        data
    })
}

// 获取学习模式字段
export const getStudyInfo = () => {
    return service({
        url: '/securityPolicy/whitelist/studyQuery',
        method: 'get'
    })
}

// 获取学习模式状态
export const getStudyStatus = () => {
    return service({
        url: '/securityPolicy/whitelist/studyStatusQuery',
        method: 'get'
    })
}

// 开启/停止学习模式
export const changeStudyStatus = (data) => {
    return service({
        url: '/securityPolicy/whitelist/studyUpdate',
        method: 'put',
        data
    })
}

// modbus--列表
export const getModbusList = (data) => {
    return service({
        url: '/securityPolicy/whitelistProto/modbus/pageQuery',
        method: 'post',
        data
    })
}

// modbus--删除
export const deleteModbus = (data) => {
    return service({
        url: '/securityPolicy/whitelistProto/modbus/delete',
        method: 'delete',
        data
    })
}

// modbus--新增
export const addModbus = (data) => {
    return service({
        url: '/securityPolicy/whitelistProto/modbus/add',
        method: 'post',
        data
    })
}

// modbus--更新
export const updateModbus = (data) => {
    return service({
        url: '/securityPolicy/whitelistProto/modbus/update',
        method: 'put',
        data
    })
}

/* *
 * 
 * 行为深度检测
 * 
 * */
// 预定义--列表
export const getbehaviorPredefinedList = (data) => {
    return service({
        url: '/securityPolicy/behaviorPredefined/pageQuery',
        method: 'post',
        data
    })
}

// 预定义--批量更新动作
export const updateBehaviorPredefinedAction = (data) => {
    return service({
        url: '/securityPolicy/behaviorPredefined/actionChange',
        method: 'put',
        data
    })
}

// 预定义--批量更新状态
export const changeBehaviorPredefinedStatus = (data) => {
    return service({
        url: '/securityPolicy/behaviorPredefined/statusChange',
        method: 'put',
        data
    })
}

// 预定义--更新
export const updateBehaviorPredefined = (data) => {
    return service({
        url: '/securityPolicy/behaviorPredefined/update',
        method: 'put',
        data
    })
}

// 自定义--列表
export const getBehaviorCustomList = (data) => {
    return service({
        url: '/securityPolicy/behaviorCustom/pageQuery',
        method: 'post',
        data
    })
}

// 自定义--详情
export const getBehaviorCustomDetail = (data) => {
    return service({
        url: '/securityPolicy/behaviorCustom/detailQuery?id=' + data,
        method: 'get'
    })
}

// 自定义--新增
export const addBehaviorCustom = (data) => {
    return service({
        url: '/securityPolicy/behaviorCustom/add',
        method: 'post',
        data
    })
}

// 自定义--更新
export const updateBehaviorCustom = (data) => {
    return service({
        url: '/securityPolicy/behaviorCustom/update',
        method: 'put',
        data
    })
}

// 自定义--删除
export const deleteBehaviorCustom = (data) => {
    return service({
        url: '/securityPolicy/behaviorCustom/delete',
        method: 'delete',
        data
    })
}

// 自定义--更新状态
export const changeBehaviorCustomStatus = (data) => {
    return service({
        url: '/securityPolicy/behaviorCustom/statusChange',
        method: 'put',
        data
    })
}

/* *
 * 
 * 网络攻击
 * 
 * */
export const getNetworkAttack = () => {
    return service({
        url: '/securityPolicy/networkAttack/query',
        method: 'get'
    })
}

export const updateNetworkAttack = (data) => {
    return service({
        url: '/securityPolicy/networkAttack/update',
        method: 'put',
        data
    })
}

/* *
 * 
 * 黑名单
 * 
 * */
// 漏洞库--列表
export const getBlackListVulnerabilityList = (data) => {
    return service({
        url: '/securityPolicy/blackListVulnerability/pageQuery',
        method: 'post',
        data
    })
}

// 漏洞库--详情
export const getBlackListVulnerabilityDetail = (data) => {
    return service({
        url: '/securityPolicy/blackListVulnerability/detailQuery?id=' + data,
        method: 'get'
    })
}

// 漏洞库--更新状态
export const changeBlackListVulnerabilityStatus = (data) => {
    return service({
        url: '/securityPolicy/blackListVulnerability/statusChange',
        method: 'put',
        data
    })
}

// 漏洞库--修改动作
export const updateBlackListVulnerability = (data) => {
    return service({
        url: '/securityPolicy/blackListVulnerability/update',
        method: 'put',
        data
    })
}

// 地址黑名单--列表
export const getAddressBlackList = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/pageQuery',
        method: 'post',
        data
    })
}

// 地址黑名单--新增
export const addAddressBlack = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/add',
        method: 'post',
        data
    })
}

// 地址黑名单--删除
export const deleteAddressBlack = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/delete',
        method: 'delete',
        data
    })
}

// 地址黑名单--详情
export const getAddressBlackDetail = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/detailQuery?id=' + data,
        method: 'get'
    })
}

// 地址黑名单--编辑
export const updateAddressBlack = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/update',
        method: 'put',
        data
    })
}

// 地址黑名单--启用禁用
export const changeAddressBlackStatus = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/statusChange',
        method: 'put',
        data
    })
}

// 地址黑名单--清除命中数
export const clearAddressBlack = (data) => {
    return service({
        url: '/securityPolicy/addressBlacklist/hitsClear',
        method: 'put',
        data
    })
}




