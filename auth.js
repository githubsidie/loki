// auth.js - 用户认证模块

/**
 * 用户认证类
 * 处理用户登录、注销、会话管理等功能
 */
class AuthManager {
    constructor() {
        // 模拟用户数据库（从localStorage读取，如果不存在则使用默认数据）
        this.users = this.getUsersFromStorage();
        
        this.storageKeys = {
            USER_DATA: 'userData',
            REMEMBERED_USERNAME: 'rememberedUsername',
            USERS_DB: 'users'
        };
    }
    
    /**
     * 从localStorage获取用户数据
     */
    getUsersFromStorage() {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            try {
                return JSON.parse(storedUsers);
            } catch (error) {
                console.error('解析用户数据失败:', error);
                // 返回默认用户数据
                return this.getDefaultUsers();
            }
        }
        // 首次使用，返回默认用户数据并保存到localStorage
        const defaultUsers = this.getDefaultUsers();
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    
    /**
     * 获取默认用户数据
     */
    getDefaultUsers() {
        return [
            { username: 'admin', password: 'admin123', role: 'admin', displayName: '管理员' },
            { username: 'user1', password: 'password123', role: 'user', displayName: '测试用户' }
        ];
    }
    
    /**
     * 用户登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {boolean} rememberMe - 是否记住用户
     * @returns {Promise<Object>} 登录结果
     */
    login(username, password, rememberMe = false) {
        return new Promise((resolve, reject) => {
            // 模拟API请求延迟
            setTimeout(() => {
                try {
                    // 验证输入
                    if (!username || !password) {
                        throw new Error('请输入用户名和密码');
                    }
                    
                    // 查找用户（从本地存储更新用户列表后查找）
                    this.users = this.getUsersFromStorage();
                    const user = this.users.find(u => u.username === username && u.password === password);
                    
                    if (!user) {
                        throw new Error('用户名或密码错误');
                    }
                    
                    // 创建用户数据对象
                    const userData = {
                        username: user.username,
                        role: user.role,
                        displayName: user.displayName,
                        loggedIn: true,
                        loginTime: new Date().getTime(),
                        token: this.generateToken(user.username)
                    };
                    
                    // 存储用户数据
                    if (rememberMe) {
                        localStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
                        localStorage.setItem(this.storageKeys.REMEMBERED_USERNAME, username);
                    } else {
                        sessionStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
                        // 如果之前记住了用户，清除它
                        localStorage.removeItem(this.storageKeys.REMEMBERED_USERNAME);
                    }
                    
                    // 记录登录日志
                    this.logLoginActivity(user.username, true);
                    
                    resolve({ success: true, user: userData });
                } catch (error) {
                    // 记录失败的登录尝试
                    this.logLoginActivity(username, false, error.message);
                    reject(error);
                }
            }, 500); // 模拟网络延迟
        });
    }
    
    /**
     * 用户注销
     */
    logout() {
        // 清除用户数据
        localStorage.removeItem(this.storageKeys.USER_DATA);
        sessionStorage.removeItem(this.storageKeys.USER_DATA);
        
        // 可选：保留记住的用户名
        // localStorage.removeItem(this.storageKeys.REMEMBERED_USERNAME);
        
        // 重定向到登录页面
        window.location.href = 'login.html';
    }
    
    /**
     * 检查用户是否已登录
     * @returns {Object|null} 用户数据对象或null
     */
    getCurrentUser() {
        // 先检查localStorage（记住我）
        let userData = localStorage.getItem(this.storageKeys.USER_DATA);
        
        // 如果没有，检查sessionStorage
        if (!userData) {
            userData = sessionStorage.getItem(this.storageKeys.USER_DATA);
        }
        
        if (userData) {
            try {
                const parsedData = JSON.parse(userData);
                
                // 验证登录状态
                if (parsedData.loggedIn) {
                    // 检查登录是否过期（可选：设置会话超时）
                    if (this.isSessionExpired(parsedData)) {
                        this.logout();
                        return null;
                    }
                    
                    // 更新最后活动时间
                    parsedData.lastActivity = new Date().getTime();
                    
                    // 重新保存更新后的数据
                    if (localStorage.getItem(this.storageKeys.USER_DATA)) {
                        localStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(parsedData));
                    } else if (sessionStorage.getItem(this.storageKeys.USER_DATA)) {
                        sessionStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(parsedData));
                    }
                    
                    return parsedData;
                }
            } catch (error) {
                console.error('解析用户数据失败:', error);
                return null;
            }
        }
        
        return null;
    }
    
    /**
     * 检查用户是否已登录
     * @returns {boolean} 是否已登录
     */
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }
    
    /**
     * 检查用户是否有指定角色
     * @param {string} role - 角色名称
     * @returns {boolean} 是否有该角色
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user ? user.role === role : false;
    }
    
    /**
     * 获取记住的用户名
     * @returns {string|null} 记住的用户名
     */
    getRememberedUsername() {
        return localStorage.getItem(this.storageKeys.REMEMBERED_USERNAME);
    }
    
    /**
     * 检查会话是否过期
     * @param {Object} userData - 用户数据
     * @returns {boolean} 是否已过期
     */
    isSessionExpired(userData) {
        // 会话超时设置（例如：30分钟）
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分钟
        const lastActivity = userData.lastActivity || userData.loginTime;
        const now = new Date().getTime();
        
        return (now - lastActivity) > SESSION_TIMEOUT;
    }
    
    /**
     * 生成模拟token（实际应用中应由后端生成）
     * @param {string} username - 用户名
     * @returns {string} 生成的token
     */
    generateToken(username) {
        // 简单的token生成，实际应用中应使用更安全的方法
        const timestamp = new Date().getTime();
        const random = Math.random().toString(36).substring(2, 15);
        return `${username}-${timestamp}-${random}`;
    }
    
    /**
     * 记录登录活动（实际应用中应发送到后端）
     * @param {string} username - 用户名
     * @param {boolean} success - 是否成功
     * @param {string} errorMessage - 错误信息（如果有）
     */
    logLoginActivity(username, success, errorMessage = '') {
        const activity = {
            username,
            success,
            timestamp: new Date().toISOString(),
            ip: this.getClientIP(), // 模拟获取IP
            userAgent: navigator.userAgent,
            errorMessage
        };
        
        console.log('登录活动:', activity);
        
        // 实际应用中，这里应该发送到后端API
        // logService.sendLoginActivity(activity);
    }
    
    /**
     * 模拟获取客户端IP（实际应用中应由后端获取）
     * @returns {string} IP地址
     */
    getClientIP() {
        // 模拟IP地址
        return '192.168.1.1';
    }
    
    /**
     * 检查访问权限
     * @param {string|Array} requiredRoles - 所需角色
     * @returns {boolean} 是否有权限
     */
    checkPermission(requiredRoles) {
        const user = this.getCurrentUser();
        
        if (!user) {
            return false;
        }
        
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(user.role);
        }
        
        return user.role === requiredRoles;
    }
}

// 创建单例实例
const authManager = new AuthManager();

// 导出认证管理器
export default authManager;

// 导出工具函数供直接使用
export const {
    login,
    logout,
    getCurrentUser,
    isLoggedIn,
    hasRole,
    getRememberedUsername,
    checkPermission
} = {
    login: (username, password, rememberMe) => authManager.login(username, password, rememberMe),
    logout: () => authManager.logout(),
    getCurrentUser: () => authManager.getCurrentUser(),
    isLoggedIn: () => authManager.isLoggedIn(),
    hasRole: (role) => authManager.hasRole(role),
    getRememberedUsername: () => authManager.getRememberedUsername(),
    checkPermission: (roles) => authManager.checkPermission(roles)
};

// 如果在浏览器环境中，将authManager挂载到window对象
if (typeof window !== 'undefined') {
    window.authManager = authManager;
}