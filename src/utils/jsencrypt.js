import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9LDZdyHC1cfcd6ZfUzW1pNQN7\n' +
    'C9vadVnkMd4FsN3XAzW4YWu57D3wrOlclcSl7GBLEyGvqnS+LwWXnp4oIC+QN6DZ\n' +
    'tb6QtY1OVtEuS4Dyo9x4Vw++goTaTSK67kq3M3eRLPpt5BKROPRdmmYbcK4/zJ7s\n' +
    'o2um/cAP7p6t1naeHwIDAQAB'

const privateKey =
    'MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBAL0sNl3IcLVx9x3p\n' +
    'l9TNbWk1A3sL29p1WeQx3gWw3dcDNbhha7nsPfCs6VyVxKXsYEsTIa+qdL4vBZee\n' +
    'niggL5A3oNm1vpC1jU5W0S5LgPKj3HhXD76ChNpNIrruSrczd5Es+m3kEpE49F2a\n' +
    'Zhtwrj/Mnuyja6b9wA/unq3Wdp4fAgMBAAECgYEAnJ/ff3R2RPRPytdd21YecU3w\n' +
    'TM87vzsMKxBSp9mRQvUoZDlczPnZKsyvBfYGc+4qp932NRBnShN6iNdOUSCc31Y4\n' +
    'hZH3HKZhpfIrgt4jJBG4KAjMSr6ffbiWx6VVgNPYM0YVLc8sZMsZLFs8IhmjXqzo\n' +
    'uJ8Qhg39K4Kja+qqsikCQQD8GKCNoFQJQ3wBOzTwuYNpuqjqJitT6UR7bcFkEaf7\n' +
    'bG6H/l/zOSJ/n/UvXryCQsdIbD+pwIBBfyU/f/5VUrPlAkEAwBoj/8pqTD+l8Hul\n' +
    '1HRhAgQPYwDRUVSmQFmByx4O1JWjpoGf3qMcP1LyqUGOOZpGpErOMMhm5tAjBZhj\n' +
    'CSQxswJBAI/t25Sgifoz/lORoxshP4cY3CG7IxeoYcH6muRwNDEW6lBYih2KbEjj\n' +
    'YY/nDcdtKuwNaZeYYWGDnxePEv1R14UCQQCrzDT5oxphSmKqqMnrMJE47kyca7TG\n' +
    'mX98+Q88iYsVzyVl2XMR9qlicFoXyErbdP9MGqI/ullcfjNz445eNIJFAkEA4sGK\n' +
    'zVTT+WLSbqGehnCD3MJgVzPBYB4mgpT6mDnEEKM6qZLxh5fR82EYJdRvLhR8jTjB\n' +
    'TXl2Ssr3HR6Lh44J+Q=='

// 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey) // 设置私钥
    return encryptor.decrypt(txt) // 对数据进行解密
}