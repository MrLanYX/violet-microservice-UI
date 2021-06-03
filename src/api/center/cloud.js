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
        url: '/system/file',
        method: 'post',
        data: query
    })
}