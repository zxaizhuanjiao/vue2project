import service from '@/utils/request'

export const login = (data) => {
	return service({
		url: '/base/login',
		method: 'post',
		data
	})
}

export const getMenuList = (data) => {
	return service({
		url: '/menu/getMenu',
		method: 'post',
		data
	})
}

export const getUserInfo = () => {
	return service({
    	url: '/user/getUserInfo',
    	method: 'get'
  	})
}

// 获取验证码
export const captcha = (data) => {
	return service({
		url: '/base/captcha',
	  	method: 'post',
	  	data: data
	})
}
