import request from '@/utils/request'

// 查询用户文件树 server:cloud:fileslist
export function flieList() {
    return request({
        url: '/system/file/list',
        method: 'get',
        // params: query
    })
}
// 上传文件或者新建文件夹 server:cloud:filesadd
export function newFiles(query) {
    return request({
        url: '/system/file/add',
        method: 'post',
        data: query,
        timeout: 1*60*1000
    })
}
// 编辑 server:cloud:filesedit
export function edit(query) {
    return request({
        url: '/system/file/edit',
        method: 'put',
        data: query
    })
}

// 获取节点数据 server:cloud:filessearch
export function getFilesByParentId(query) {
    return request({
        url: '/system/file/getFilesByParentId/' + query,
        method: 'get',
        // data: query
    })
}
// 下载文件 server:cloud:filesupload
export function download(data) {
    return request({
        url: '/system/file/filedownload/' + data.id,
        method: 'post',
        // data: data.id,
        responseType: 'blob',
    }).then(async (response) => { // 处理返回的文件流
        const blob = new Blob([response], { type: 'application/' + data.fileType })
        const filename = data.sourceName
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        await function() {
            URL.revokeObjectURL(blob)
            document.body.removeChild(link)
        }
    })
}

// 分享列表 server:cloud:sharelist
export function getShareList(query) {
    return request({
        url: '/system/share/list',
        method: 'get',
        // data: query
    })
}

// 分享生成 server:cloud:shareadd
export function shareAdd(query) {
    return request({
        url: '/system/share/add',
        method: 'post',
        data: query
    })
}

// 分享保存到自己身上 server:cloud:sharecopy
export function shareCopy(query) {
    return request({
        url: '/system/file/fileCollect',
        method: 'post',
        data: query
    })
}

// 分享提取 server:cloud:shareget
export function getShare(query) {
    return request({
        url: '/system/share/detail',
        method: 'get',
        params: query
    })
}

// 删除分享 server:cloud:sharedel
export function delShare(id) {
    return request({
        url: '/system/share/' + id,
        method: 'delete',
        // params: query
    })
}

// 删除文件或者文件夹 server:cloud:filesdel
export function delFile(query) {
    return request({
        url: '/system/file/deleteFile',
        method: 'post',
        params: query
    })
}

// 获取删除列表 server:cloud:dellist
export function getDelFileLists(query) {
    return request({
        url: '/system/bin/list',
        method: 'get',
        // params: query
    })
}

// 对单文件恢复删除的文件 server:cloud:delrestort
export function Undelete(query) {
    return request({
        url: '/system/bin/recoverCloudRecycleBin',
        method: 'post',
        params: query
    })
}

// 删除一条删除记录 server:cloud:deldel
export function delRecord(query) {
    return request({
        url: '/system/bin/deleteCloudRecycleBins',
        method: 'post',
        data: query
    })
}

// 合并请求 server:cloud:filemerge
export function mergeFile(query) {
    return request({
        url: '/system/file/mergeFile',
        method: 'post',
        data: query
    })
}