



const dmSTYLE = {
    enable: "color:#25c25b;font-weight:800",
    disable: "color:#ef4864;font-weight:800",
}

const dmOPTS = {
    acctStatus: [{ label: '启用', value: 1, style: dmSTYLE.enable }, { label: '停用', value: 0, style: dmSTYLE.disable },],
    orgStatus: [{ label: '启用', value: 1, style: dmSTYLE.enable }, { label: '停用', value: 0, style: dmSTYLE.disable },],
    roleStatus: [{ label: '启用', value: 1, style: dmSTYLE.enable }, { label: '停用', value: 0, style: dmSTYLE.disable },],
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


const modelOrg = {
    name: { label: '组织名称' },
    owner_id: { label: '组织管理者ID' },
    owner_name: { label: '组织管理员' },
    status: { label: '状态', options: dmOPTS.orgStatus },
    remark: { label: '备注' },
}

const modelRole = {
    name: { label: '角色名称' },
    status: { label: '状态', options: dmOPTS.roleStatus },
    remark: { label: '备注' },
}


const modelAppServices = {
    name: { label: '应用名称' },
}

export { dmOPTS, modelBase, modelUser, modelOrg, modelRole }