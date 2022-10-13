import axios from 'axios'
import store from '../store/index.js'
import { Message } from 'element-ui';
import router from '@/router'

const service = axios.create({
    baseURL: process.env.VUE_APP_API, 
    timeout: 5000000 // request timeout
})

let messageInstance = null;
 
const resetMessage = (options)=>{
//关闭上一个弹窗，继续下一个弹窗
  if(messageInstance){
    messageInstance.close()
  }
  messageInstance = Message(options)
}

/*
 *请求前拦截
 *用于处理需要请求前的操作
 */
service.interceptors.request.use(config => {
	// store.commit('loadingData/showLoading', true);
	const token = store.state.userData.token || localStorage.getItem('token')
	const user = store.state.userData.userInfo || JSON.parse(localStorage.getItem('userInfo'))
	// const token = localStorage.getItem('token')
	// const user = JSON.parse(localStorage.getItem('userInfo'))
	
	config.headers['x-token'] = token
	config.headers['x-user-id'] = user.id
	
	config.headers = {
	    'Content-Type': 'multipart/form-data',
	    'x-token': token,
	    'x-user-id': user.id
	}
	
    return config
}, error => {
    // Do something with request error
    // console.log(error) // for debug
    // return Promise.reject(error)
	Message.error(error)
	return error
})

/*
 *请求响应拦截
 *用于处理数据返回后的操作
 */
service.interceptors.response.use(
    response => {
		if (response.headers['new-token']) {
            store.commit('userData/setToken', response.headers['new-token'])
			localStorage.setItem('token', response.headers['new-token']);
        }
		if (!response.headers['content-disposition']) {
			// excel导出错误提示
			// if (response.data.size) {
			// 	return 	response
			// }

			if (response.data.code === 0 || response.headers.success === 'true') {
				if (response.headers.msg) {
					response.data.msg = decodeURI(response.headers.msg)
				}
				return response.data
			} else {
				// Message({
				// 	showClose: true,
				// 	message: response.data.msg,
				// 	// message: response.data.msg||decodeURI(response.headers.msg),
				// 	type: 'error'
				// })
				resetMessage({
					showClose: true,
					message: response.data.msg,
					type: 'error'
				})
				if (response.data.data && response.data.data.reload) {
					if (localStorage.getItem('token')) {
						store.commit('userData/userToIndex');
						if (response.data.data.reload) {
							store.commit('userData/userLogout', '');
						}
					} else {
						store.commit('userData/userLogout', '');
					}
				}
				return response.data.msg ? response.data : response
			}
		}

		if (response.headers['content-disposition']) {
			//当存在content-disposition这个字段时，return出来的数据
			// const temp = {}
			// temp.data = response.data
			// temp.filename = response.headers['content-disposition']
			return response	
		}
    },
    error => {
		//断网处理或者请求超时
		// store.commit('loadingData/showLoading', false);
		if (!error.response) {
		    //请求超时
		    // if (error.message.includes("timeout")) {
			// 	console.log("超时了");
		    //     Message.error("请求超时，请检查互联网连接");
		    // } else {
		    //     //断网，可以展示断网组件
		    //     // console.log("断网了");
		    //     Message.error("请检查网络是否已连接");
		    // }
		    return;
		}
		const status = error.response.status
		switch (status) {
		    case 500:
		        // Message.error("服务器内部错误");
				resetMessage({
					showClose: true,
					message: '服务器内部错误',
					type: 'error'
				})
		        break;
		    case 404:
				resetMessage({
					showClose: true,
					message: '未找到远程服务器',
					type: 'error'
				})
		        // Message.error("未找到远程服务器");
		        break;
		    case 401:
		        // Message.warn("用户登陆过期，请重新登陆");
				resetMessage({
					showClose: true,
					message: '用户登陆过期，请重新登陆',
					type: 'warning'
				})
		        localStorage.removeItem("token");
				localStorage.removeItem('userInfo');
				store.state.userData.token = ''
				store.state.userData.userInfo = {}
		        setTimeout(() => {
					router.replace({
						path: "/login",
						query: {
							redirect: router.currentRoute.fullPath,
						},
					});
		        }, 1000);
		        break;
		    case 400:
		        // Message.error("数据异常");
				resetMessage({
					showClose: true,
					message: '数据异常',
					type: 'error'
				})
		        break;
		    default:
				if (error && error.response && error.response.msg) {
					resetMessage({
						showClose: true,
						message: error.response.msg,
						type: 'error'
					})
				}
		        // Message.error(error.response.msg);
		}
        // return Promise.reject(error)
		return error
    })

export default service