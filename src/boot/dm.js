import { ref } from 'vue';
import { api } from "./axios"

const MSG_BASE_OPTS = { timeout: 2000, position: 'top', progress: true, classes: 'glossy' }
const MSG_OK_OPTS = { ...MSG_BASE_OPTS, type: 'positive' }
const MSG_NG_OPTS = { ...MSG_BASE_OPTS, type: 'negative' }


class DataModel {
    constructor(label, type, maxlength, options,) {
        this.label = label
        this.type = type
        this.maxlength = maxlength
        this.options = options
    }
}



class DMACTPNL {
    constructor(show = false, title = '', data = null, loading = true) {
        // show:是否显示弹窗
        this.show = show
        // title:显示弹窗标题
        this.title = title
        // data:弹窗处理数据
        this.data = data
        // loading:弹窗加载动效
        this.loading = loading
    }
}


class DMOBJ {
    constructor(quasarObj, routerObj) {
        this.obj = quasarObj
        this.router = routerObj
        this.actPnl = new DMACTPNL()
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

    apiOK(rsp, cb_func) {
        // api请求成功,200的处理
        if (rsp.data.code == 0) {
            if (cb_func != null) {
                cb_func(rsp.data)
            }
        } else {
            // 业务处理失败,通知提醒
            this.msgNG({ message: rsp.data.message })
        }

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
            case 403:
                this.msgNG({ message: '无操作权限', caption: err.message })
                break;
            default:
                this.msgNG({ message: '请求服务失败,请稍后重试', caption: err.message })
                break;
        }
    }

    async httpReq(url, data, actLoading, callbackFn, errCallbackFn, method = 'get') {
        if (actLoading != null) {
            actLoading.loading = true
        }

        try {
            let rsp
            if (method == 'get') {
                rsp = await api.get(url, { params: data })
            } else {
                rsp = await api.post(url, data)
            }
            this.apiOK(rsp, callbackFn)
        } catch (err) {
            this.apiNG(err)
        }

        if (actLoading != null) {
            actLoading.loading = false
        }
    }


    async post(url, data, actLoading = null, callbackFn = null, errCallbackFn = null) {
        await this.httpReq(url, data, actLoading, callbackFn, errCallbackFn, 'post')
    }

    async get(url, params, actLoading = null, callbackFn = null, errCallbackFn = null) {
        await this.httpReq(url, params, actLoading, callbackFn, errCallbackFn)
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
    delete: { id: 0, label: '删除', color: 'primary' },
    create: { id: 1, label: '新增', color: 'primary' },
    update: { id: 2, label: '修改', color: 'primary' },
    confrim: { id: 3, label: '确认', color: 'primary' },
    org: { id: 4, label: '组织', color: 'primary' },
    role: { id: 5, label: '角色', color: 'primary' },
    dept: { id: 6, label: '部门', color: 'primary' },
    detail: { id: 7, label: '详情', color: 'primary' },
}


const DMINPUT = {
    query: (qProps, value = null) => {
        let params = { filled: false, debounce: 500, dense: true, clearable: true, style: 'width:300px;', outlined: true, ...qProps }
        return ref({ dmType: 'query', qProps: params, value: value })
    },
    querySelect: (qProps, value = null) => {
        let params = { filled: false, debounce: 500, dense: true, clearable: true, style: 'width:300px;', outlined: true, ...qProps }
        return ref({ dmType: 'select', qProps: params, value: value })
    },
    input: (qProps, value = null) => {
        let params = { filled: true, "lazy-rules": true, hint: '', dense: false, ...qProps }
        return ref({ dmType: 'text', qProps: params, value: value })
    },
    required: (qProps, value = null) => {
        let params = { filled: true, "lazy-rules": true, hint: '', dense: false, ...qProps }
        return ref({ dmType: 'required', qProps: params, value: value })
    },
    select: (qProps, value = null) => {
        let params = { filled: true, "lazy-rules": true, hint: '', dense: false, ...qProps }
        return ref({ dmType: 'select', qProps: params, value: value })
    },
    selectFilter: (qProps, value = null) => {
        let params = { filled: true, "lazy-rules": true, hint: '', dense: false, ...qProps }
        return ref({ dmType: 'selectFilter', qProps: params, value: value })
    },
}


const DMOPTS = {
    userStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
    orgStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
    roleStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
}




export { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS }