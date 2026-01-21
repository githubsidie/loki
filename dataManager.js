/**
 * 数据管理器 - 负责处理所有与本地存储相关的操作
 */
class DataManager {
    constructor() {
        this.storageKeys = {
            USERS: 'users',
            USER_DATA: 'userData',
            REMEMBERED_USERNAME: 'rememberedUsername',
            APP_SETTINGS: 'appSettings'
        };
    }
    
    /**
     * 从本地存储获取数据
     * @param {string} key - 存储键名
     * @param {*} defaultValue - 默认值（如果数据不存在）
     * @returns {*} 解析后的数据或默认值
     */
    getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`获取数据失败 [${key}]:`, error);
            return defaultValue;
        }
    }
    
    /**
     * 保存数据到本地存储
     * @param {string} key - 存储键名
     * @param {*} value - 要保存的数据
     * @returns {boolean} 是否保存成功
     */
    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`保存数据失败 [${key}]:`, error);
            return false;
        }
    }
    
    /**
     * 删除本地存储中的数据
     * @param {string} key - 存储键名
     * @returns {boolean} 是否删除成功
     */
    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`删除数据失败 [${key}]:`, error);
            return false;
        }
    }
    
    /**
     * 清空所有本地存储数据
     * @returns {boolean} 是否清空成功
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清空本地存储失败:', error);
            return false;
        }
    }
    
    /**
     * 获取用户数据
     * @returns {Array} 用户数据数组
     */
    getUsers() {
        const users = this.getItem(this.storageKeys.USERS);
        if (users) {
            return users;
        }
        
        // 返回默认用户数据并保存
        const defaultUsers = this.getDefaultUsers();
        this.setItem(this.storageKeys.USERS, defaultUsers);
        return defaultUsers;
    }
    
    /**
     * 保存用户数据
     * @param {Array} users - 用户数据数组
     * @returns {boolean} 是否保存成功
     */
    saveUsers(users) {
        return this.setItem(this.storageKeys.USERS, users);
    }
    
    /**
     * 添加新用户
     * @param {Object} user - 用户对象
     * @returns {boolean} 是否添加成功
     */
    addUser(user) {
        try {
            const users = this.getUsers();
            users.push(user);
            return this.saveUsers(users);
        } catch (error) {
            console.error('添加用户失败:', error);
            return false;
        }
    }
    
    /**
     * 检查用户名是否已存在
     * @param {string} username - 用户名
     * @returns {boolean} 是否存在
     */
    isUsernameExists(username) {
        const users = this.getUsers();
        return users.some(u => u.username.toLowerCase() === username.toLowerCase());
    }
    
    /**
     * 根据用户名查找用户
     * @param {string} username - 用户名
     * @returns {Object|null} 用户对象或null（如果不存在）
     */
    findUserByUsername(username) {
        const users = this.getUsers();
        return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }
    
    /**
     * 保存当前登录用户信息
     * @param {Object} userData - 用户数据
     * @param {boolean} remember - 是否记住用户
     * @returns {boolean} 是否保存成功
     */
    saveCurrentUser(userData, remember = false) {
        try {
            // 根据是否记住用户选择存储方式
            if (remember) {
                localStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
                // 同时保存用户名，用于自动填充
                if (userData.username) {
                    localStorage.setItem(this.storageKeys.REMEMBERED_USERNAME, userData.username);
                }
            } else {
                sessionStorage.setItem(this.storageKeys.USER_DATA, JSON.stringify(userData));
            }
            return true;
        } catch (error) {
            console.error('保存当前用户信息失败:', error);
            return false;
        }
    }
    
    /**
     * 获取当前登录用户信息
     * @returns {Object|null} 用户数据或null（如果未登录）
     */
    getCurrentUser() {
        try {
            // 首先尝试从localStorage获取（记住用户的情况）
            const localStorageData = localStorage.getItem(this.storageKeys.USER_DATA);
            if (localStorageData) {
                return JSON.parse(localStorageData);
            }
            
            // 然后尝试从sessionStorage获取
            const sessionStorageData = sessionStorage.getItem(this.storageKeys.USER_DATA);
            if (sessionStorageData) {
                return JSON.parse(sessionStorageData);
            }
            
            return null;
        } catch (error) {
            console.error('获取当前用户信息失败:', error);
            return null;
        }
    }
    
    /**
     * 清除当前用户登录信息（登出）
     * @returns {boolean} 是否清除成功
     */
    clearCurrentUser() {
        try {
            localStorage.removeItem(this.storageKeys.USER_DATA);
            sessionStorage.removeItem(this.storageKeys.USER_DATA);
            return true;
        } catch (error) {
            console.error('清除用户登录信息失败:', error);
            return false;
        }
    }
    
    /**
     * 获取记住的用户名
     * @returns {string|null} 用户名或null
     */
    getRememberedUsername() {
        return localStorage.getItem(this.storageKeys.REMEMBERED_USERNAME);
    }
    
    /**
     * 保存应用设置
     * @param {Object} settings - 设置对象
     * @returns {boolean} 是否保存成功
     */
    saveSettings(settings) {
        return this.setItem(this.storageKeys.APP_SETTINGS, settings);
    }
    
    /**
     * 获取应用设置
     * @returns {Object} 设置对象
     */
    getSettings() {
        const defaultSettings = {
            theme: 'light',
            notifications: true,
            autoSave: true,
            language: 'zh-CN'
        };
        
        return {
            ...defaultSettings,
            ...this.getItem(this.storageKeys.APP_SETTINGS, {})
        };
    }
    
    /**
     * 获取默认用户数据
     * @private
     * @returns {Array} 默认用户数组
     */
    getDefaultUsers() {
        return [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                displayName: '管理员',
                createdAt: new Date().toISOString(),
                lastLogin: null
            },
            {
                username: 'user1',
                password: 'password123',
                role: 'user',
                displayName: '测试用户',
                createdAt: new Date().toISOString(),
                lastLogin: null
            }
        ];
    }
    
    /**
     * 导出所有数据（用于备份）
     * @returns {Object} 包含所有应用数据的对象
     */
    exportAllData() {
        return {
            users: this.getUsers(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }
    
    /**
     * 导入数据（用于恢复备份）
     * @param {Object} data - 要导入的数据对象
     * @returns {boolean} 是否导入成功
     */
    importData(data) {
        try {
            if (data.users && Array.isArray(data.users)) {
                this.saveUsers(data.users);
            }
            
            if (data.settings && typeof data.settings === 'object') {
                this.saveSettings(data.settings);
            }
            
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

// 创建单例实例
const dataManager = new DataManager();

// 导出实例和类
window.DataManager = DataManager;
window.dataManager = dataManager;
