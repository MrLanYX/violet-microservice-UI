import request from '@/utils/request'

// 查询用户文件树
export function flieList() {
    return request({
        url: '/system/file/list',
        method: 'get',
        // params: query
    })
}
// 上传文件或者新建文件夹
export function newFiles(query) {
    return request({
        url: '/system/file/add',
        method: 'post',
        data: query
    })
}
// 编辑
export function edit(query) {
    return request({
        url: '/system/file/edit',
        method: 'put',
        data: query
    })
}

// 编辑
export function getFilesByParentId(query) {
    return request({
        url: '/system/file/getFilesByParentId/' + query,
        method: 'get',
        // data: query
    })
}
// 下载文件
export function download(data) {
    return request({
        url: '/system/file/filedownload/' + data.id,
        method: 'post',
        // data: data.id,
        responseType: 'blob'
    }).then(async (response) => { // 处理返回的文件流
        const blob = new Blob([response], { type: 'application/' + data.fileType })
        const filename = data.sourceName
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        document.body.appendChild(link)
        link.click()
        await

        function() {
            URL.revokeObjectURL(blob)
            document.body.removeChild(link)
        }
    })
}

// 分享列表
export function getShareList(query) {
    return request({
        url: '/system/share/list',
        method: 'get',
        // data: query
    })
}

// 分享生成
export function shareAdd(query) {
    return request({
        url: '/system/share',
        method: 'post',
        data: query
    })
}

// 分享提取
export function getShare(query) {
    return request({
        url: '/system/share/detail',
        method: 'get',
        params: query
    })
}

// 删除分享
export function delShare(id) {
    return request({
        url: '/system/share/' + id,
        method: 'delete',
        // params: query
    })
}