import { api } from "./axios"

const MSG_BASE_OPTS = { timeout: 1500, position: 'top' }
const MSG_OK_OPTS = { ...MSG_BASE_OPTS, type: 'positive' }
const MSG_NG_OPTS = { ...MSG_BASE_OPTS, type: 'negative' }

class DMOBJ {
    constructor(quasarObj, routerObj) {
        this.obj = quasarObj
        this.router = routerObj
    }

    logout() {
        // 通用退出操作
        localStorage.removeItem('jwt')
        this.router.push('/login')
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
                this.logout()
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
            return this.apiNG(err)
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


function showOptLabel(value, opts) {
    for (let obj of opts) {
        if (obj.value === value) {
            return obj.label
        }
    }
    return ''
}

// dmTbl控件的一些公共参数
function setTblCol(field, label, options = null, name = '', align = 'left') {
    let format = val => { return val }
    if (!name) {
        name = field
    }

    if (options) {
        format = val => {
            return showOptLabel(val, options)
        }
    }
    return { field: field, name: name, label: label, align: align, format: format }
}

const DMTBL = {
    col: setTblCol,
    btn: (field = 'id', label = '操作', align = 'right') => {
        return setTblCol(field, label, null, 'btns', align)
    },
}


const DMBTN = {
    delete: { id: 0, label: '删除', color: 'negative' },
    create: { id: 1, label: '新增', color: 'primary' },
    edit: { id: 2, label: '修改', color: 'primary' },
    confrim: { id: 3, label: '确认', color: 'primary' },
}

const DMINPUT = {
    query: (params) => {
        let base = { filled: true, debounce: 500, dense: true, clearable: true }
        return { ...base, ...params }
    },
    input: (params) => {
        let base = { filled: true, "lazy-rules": true, hint: '', dense: true }
        return { ...base, ...params }
    },
}


const DMOPTS = {
    userStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
}




export { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS }