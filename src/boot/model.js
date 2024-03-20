const dmOPTS = {
    acctStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
    orgStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
    roleStatus: [{ label: '启用', value: 1 }, { label: '停用', value: 0 },],
}

const modelBase = {
    id: { label: 'ID' },
    upd_dt: { label: '更新时间' },
    upd_name: { label: '更新人' },
    upd_nick_name: { label: '更新人昵称' },
    upd_real_name: { label: '更新人实名' },
}

const modelUser = {
    acct: { label: '账号' },
    passwd: { label: '密码' },
    phone: { label: '手机号' },
    nick_name: { label: '用户昵称' },
    real_name: { label: '用户实名' },
    status: { label: '状态', options: dmOPTS.acctStatus },
}


const modelAppServices = {
    name: { label: '应用名称' },
}

export { modelBase, modelUser }