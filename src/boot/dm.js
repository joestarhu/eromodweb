import { api } from "./axios"

const MSG_BASE_OPTS = { timeout: 1500, position: 'top' }
const MSG_OK_OPTS = { ...MSG_BASE_OPTS, type: 'positive' }
const MSG_NG_OPTS = { ...MSG_BASE_OPTS, type: 'negative' }

class DMOBJ {
    constructor(quasarObj) {
        this.obj = quasarObj
    }

    msgOK(opts) {
        // quasar正常系的通知提醒
        this.obj.notify({ ...MSG_OK_OPTS, ...opts })
    }

    msgNG(opts) {
        // quasar异常系的通知提醒
        this.obj.notify({ ...MSG_NG_OPTS, ...opts })
    }

    apiOK(rsp) {
        // api请求成功,200的处理
        if (rsp.data.code != 0) {
            // 业务处理失败,通知提醒
            this.msgNG({ message: rsp.data.message })
        }
        return rsp
    }

    apiNG(err) {
        // api请求失败,非200的处理
        if (err.code == 'ERR_NETWORK') {
            this.msgNG({ message: '请求后台服务失败' })
            return
        }

        switch (err.response.status) {
            case 401:
                this.msgNG({ message: '用户未授权认证,请重新登录' })
                break;
            default:
                this.msgNG({ message: '请求服务失败,请稍后重试', caption: err.message })
                break;
        }
    }

    async post(url, data, params = null) {
        try {
            let rsp = await api.post(url, data)
            return this.apiOK(rsp)
        } catch (err) {
            this.apiNG(err)
        }
    }

    async get(url, params) {
        try {
            let rsp = await api.get(url, { params: params })
            return this.apiOK(rsp)
        } catch (err) {
            this.apiNG(err)
        }
    }



}



export { DMOBJ }