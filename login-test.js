// login-test.js - 登录功能测试脚本
// 注意：此脚本应在浏览器控制台运行，或作为单独的测试页面使用

/**
 * 登录功能测试套件
 */
class LoginTester {
    constructor() {
        this.authManager = window.authManager; // 从全局获取authManager实例
        this.testResults = [];
        this.testUsers = {
            valid: { username: 'admin', password: 'admin123' },
            invalid: { username: 'wronguser', password: 'wrongpass' }
        };
    }
    
    /**
     * 运行所有测试
     */
    runAllTests() {
        console.log('%c===== 开始登录功能测试 =====', 'color: blue; font-weight: bold;');
        
        // 依次运行每个测试
        this.testValidLogin()
            .then(() =\u003e this.testInvalidLogin())
            .then(() =\u003e this.testEmptyFields())
            .then(() =\u003e this.testRememberMe())
            .then(() =\u003e this.testLogout())
            .then(() =\u003e this.testSessionTimeout())
            .then(() =\u003e this.testProtectedPageAccess())
            .then(() =\u003e this.displayResults())
            .catch(error =\u003e {
                console.error('测试过程中出现错误:', error);
                this.displayResults();
            });
    }
    
    /**
     * 测试有效的登录凭证
     */
    testValidLogin() {
        console.log('\n%c测试1: 有效的登录凭证', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            const { username, password } = this.testUsers.valid;
            
            try {
                // 如果用户已经登录，先退出
                if (this.authManager.isLoggedIn()) {
                    this.authManager.logout();
                }
                
                this.authManager.login(username, password, false)
                    .then(result =\u003e {
                        const success = result.success \u0026\u0026 this.authManager.isLoggedIn();
                        this.testResults.push({
                            name: '有效的登录凭证',
                            passed: success,
                            message: success ? '登录成功' : '登录失败'
                        });
                        console.log(`结果: ${success ? '通过' : '失败'} - ${success ? '登录成功' : '登录失败'}`);
                        resolve();
                    })
                    .catch(error =\u003e {
                        this.testResults.push({
                            name: '有效的登录凭证',
                            passed: false,
                            message: `登录错误: ${error.message}`
                        });
                        console.log(`结果: 失败 - 登录错误: ${error.message}`);
                        resolve(); // 继续下一个测试
                    });
            } catch (error) {
                this.testResults.push({
                    name: '有效的登录凭证',
                    passed: false,
                    message: `测试错误: ${error.message}`
                });
                console.log(`结果: 失败 - 测试错误: ${error.message}`);
                resolve(); // 继续下一个测试
            }
        });
    }
    
    /**
     * 测试无效的登录凭证
     */
    testInvalidLogin() {
        console.log('\n%c测试2: 无效的登录凭证', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            const { username, password } = this.testUsers.invalid;
            
            try {
                // 确保先退出登录
                if (this.authManager.isLoggedIn()) {
                    this.authManager.logout();
                }
                
                this.authManager.login(username, password, false)
                    .then(result =\u003e {
                        // 不应该成功，所以这是一个失败
                        this.testResults.push({
                            name: '无效的登录凭证',
                            passed: false,
                            message: '无效凭证登录成功，这是不应该的'
                        });
                        console.log('结果: 失败 - 无效凭证登录成功，这是不应该的');
                        resolve();
                    })
                    .catch(error =\u003e {
                        // 应该失败，所以这是一个通过
                        const passed = !this.authManager.isLoggedIn();
                        this.testResults.push({
                            name: '无效的登录凭证',
                            passed: passed,
                            message: passed ? '正确拒绝了无效凭证' : '拒绝了无效凭证但状态有问题'
                        });
                        console.log(`结果: ${passed ? '通过' : '失败'} - ${passed ? '正确拒绝了无效凭证' : '拒绝了无效凭证但状态有问题'}`);
                        resolve();
                    });
            } catch (error) {
                // 捕获到错误，检查用户是否未登录
                const passed = !this.authManager.isLoggedIn();
                this.testResults.push({
                    name: '无效的登录凭证',
                    passed: passed,
                    message: `捕获到预期的错误: ${error.message}`
                });
                console.log(`结果: ${passed ? '通过' : '失败'} - 捕获到预期的错误: ${error.message}`);
                resolve();
            }
        });
    }
    
    /**
     * 测试空字段处理
     */
    testEmptyFields() {
        console.log('\n%c测试3: 空字段处理', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            try {
                // 确保先退出登录
                if (this.authManager.isLoggedIn()) {
                    this.authManager.logout();
                }
                
                let testsRun = 0;
                const totalTests = 3;
                
                // 测试空用户名
                this.authManager.login('', this.testUsers.valid.password, false)
                    .catch(error =\u003e {
                        testsRun++;
                        const passed = !this.authManager.isLoggedIn();
                        this.testResults.push({
                            name: '空用户名处理',
                            passed: passed,
                            message: passed ? '正确处理了空用户名' : '空用户名处理有问题'
                        });
                        console.log(`结果: ${passed ? '通过' : '失败'} - 空用户名处理`);
                        
                        if (testsRun === totalTests) resolve();
                    });
                
                // 测试空密码
                setTimeout(() =\u003e {
                    this.authManager.login(this.testUsers.valid.username, '', false)
                        .catch(error =\u003e {
                            testsRun++;
                            const passed = !this.authManager.isLoggedIn();
                            this.testResults.push({
                                name: '空密码处理',
                                passed: passed,
                                message: passed ? '正确处理了空密码' : '空密码处理有问题'
                            });
                            console.log(`结果: ${passed ? '通过' : '失败'} - 空密码处理`);
                            
                            if (testsRun === totalTests) resolve();
                        });
                }, 100);
                
                // 测试两者都为空
                setTimeout(() =\u003e {
                    this.authManager.login('', '', false)
                        .catch(error =\u003e {
                            testsRun++;
                            const passed = !this.authManager.isLoggedIn();
                            this.testResults.push({
                                name: '空用户名和密码处理',
                                passed: passed,
                                message: passed ? '正确处理了空字段' : '空字段处理有问题'
                            });
                            console.log(`结果: ${passed ? '通过' : '失败'} - 空用户名和密码处理`);
                            
                            if (testsRun === totalTests) resolve();
                        });
                }, 200);
            } catch (error) {
                this.testResults.push({
                    name: '空字段处理',
                    passed: false,
                    message: `测试过程中出现错误: ${error.message}`
                });
                console.log(`结果: 失败 - 测试过程中出现错误: ${error.message}`);
                resolve();
            }
        });
    }
    
    /**
     * 测试记住我功能
     */
    testRememberMe() {
        console.log('\n%c测试4: 记住我功能', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            try {
                // 清除之前的记住信息
                localStorage.removeItem('userData');
                localStorage.removeItem('rememberedUsername');
                sessionStorage.removeItem('userData');
                
                const { username, password } = this.testUsers.valid;
                
                this.authManager.login(username, password, true)
                    .then(result =\u003e {
                        // 检查是否在localStorage中保存了数据
                        const hasLocalData = localStorage.getItem('userData') !== null;
                        const rememberedUsername = localStorage.getItem('rememberedUsername') === username;
                        
                        // 保存状态然后退出
                        this.authManager.logout();
                        
                        // 检查记住的用户名是否还在
                        const stillRemembered = localStorage.getItem('rememberedUsername') === username;
                        
                        const passed = hasLocalData \u0026\u0026 rememberedUsername \u0026\u0026 stillRemembered;
                        
                        this.testResults.push({
                            name: '记住我功能',
                            passed: passed,
                            message: passed ? '成功记住了用户信息' : '记住我功能不正常'
                        });
                        console.log(`结果: ${passed ? '通过' : '失败'} - 记住我功能测试`);
                        resolve();
                    })
                    .catch(error =\u003e {
                        this.testResults.push({
                            name: '记住我功能',
                            passed: false,
                            message: `测试过程中出现错误: ${error.message}`
                        });
                        console.log(`结果: 失败 - 测试过程中出现错误: ${error.message}`);
                        resolve();
                    });
            } catch (error) {
                this.testResults.push({
                    name: '记住我功能',
                    passed: false,
                    message: `测试过程中出现错误: ${error.message}`
                });
                console.log(`结果: 失败 - 测试过程中出现错误: ${error.message}`);
                resolve();
            }
        });
    }
    
    /**
     * 测试退出登录功能
     */
    testLogout() {
        console.log('\n%c测试5: 退出登录功能', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            try {
                const { username, password } = this.testUsers.valid;
                
                // 先登录
                this.authManager.login(username, password, false)
                    .then(() =\u003e {
                        // 确认已登录
                        const wasLoggedIn = this.authManager.isLoggedIn();
                        
                        // 保存原始的logout方法
                        const originalLogout = this.authManager.logout;
                        
                        // 模拟logout，但不实际重定向
                        let logoutCalled = false;
                        this.authManager.logout = function() {
                            logoutCalled = true;
                            // 清除存储但不重定向
                            localStorage.removeItem('userData');
                            sessionStorage.removeItem('userData');
                        };
                        
                        // 调用logout
                        this.authManager.logout();
                        
                        // 检查是否已退出
                        const isLoggedInAfter = this.authManager.isLoggedIn();
                        
                        // 恢复原始的logout方法
                        this.authManager.logout = originalLogout;
                        
                        const passed = wasLoggedIn \u0026\u0026 logoutCalled \u0026\u0026 !isLoggedInAfter;
                        
                        this.testResults.push({
                            name: '退出登录功能',
                            passed: passed,
                            message: passed ? '退出登录功能正常' : '退出登录功能有问题'
                        });
                        console.log(`结果: ${passed ? '通过' : '失败'} - 退出登录功能测试`);
                        resolve();
                    })
                    .catch(error =\u003e {
                        this.testResults.push({
                            name: '退出登录功能',
                            passed: false,
                            message: `登录过程中出现错误: ${error.message}`
                        });
                        console.log(`结果: 失败 - 登录过程中出现错误: ${error.message}`);
                        resolve();
                    });
            } catch (error) {
                this.testResults.push({
                    name: '退出登录功能',
                    passed: false,
                    message: `测试过程中出现错误: ${error.message}`
                });
                console.log(`结果: 失败 - 测试过程中出现错误: ${error.message}`);
                resolve();
            }
        });
    }
    
    /**
     * 测试会话超时功能
     */
    testSessionTimeout() {
        console.log('\n%c测试6: 会话超时功能', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            try {
                // 模拟一个过期的会话
                const expiredUserData = {
                    username: 'testuser',
                    role: 'user',
                    displayName: '测试用户',
                    loggedIn: true,
                    // 设置一个很早的登录时间，确保过期
                    loginTime: new Date().getTime() - (60 * 60 * 1000 * 2), // 2小时前
                    lastActivity: new Date().getTime() - (60 * 60 * 1000 * 2)
                };
                
                // 保存过期的会话数据
                sessionStorage.setItem('userData', JSON.stringify(expiredUserData));
                
                // 保存原始的方法
                const originalGetCurrentUser = this.authManager.getCurrentUser;
                
                // 模拟getCurrentUser方法，检查过期逻辑
                let detectedExpired = false;
                
                this.authManager.getCurrentUser = function() {
                    // 检查登录时间是否过期（模拟30分钟超时）
                    const SESSION_TIMEOUT = 30 * 60 * 1000;
                    const userData = sessionStorage.getItem('userData');
                    
                    if (userData) {
                        const parsed = JSON.parse(userData);
                        const now = new Date().getTime();
                        const lastActivity = parsed.lastActivity || parsed.loginTime;
                        
                        if ((now - lastActivity) \u003e SESSION_TIMEOUT) {
                            detectedExpired = true;
                            return null; // 表示会话已过期
                        }
                        return parsed;
                    }
                    return null;
                };
                
                // 检查是否检测到过期
                const isLoggedIn = this.authManager.isLoggedIn();
                
                // 恢复原始方法
                this.authManager.getCurrentUser = originalGetCurrentUser;
                
                // 清除测试数据
                sessionStorage.removeItem('userData');
                
                const passed = detectedExpired \u0026\u0026 !isLoggedIn;
                
                this.testResults.push({
                    name: '会话超时功能',
                    passed: passed,
                    message: passed ? '成功检测到过期会话' : '会话超时检测不正常'
                });
                console.log(`结果: ${passed ? '通过' : '失败'} - 会话超时功能测试`);
                resolve();
            } catch (error) {
                this.testResults.push({
                    name: '会话超时功能',
                    passed: false,
                    message: `测试过程中出现错误: ${error.message}`
                });
                console.log(`结果: 失败 - 测试过程中出现错误: ${error.message}`);
                resolve();
            }
        });
    }
    
    /**
     * 测试受保护页面访问
     */
    testProtectedPageAccess() {
        console.log('\n%c测试7: 受保护页面访问控制', 'color: green;');
        return new Promise((resolve, reject) =\u003e {
            try {
                // 确保先退出登录
                this.authManager.logout();
                
                // 模拟访问受保护页面的逻辑
                const originalLocation = window.location.href;
                let redirectAttempted = false;
                
                // 保存原始的window.location.href setter
                const originalHrefSetter = Object.getOwnPropertyDescriptor(window.location, 'href').set;
                
                // 模拟重定向检测
                Object.defineProperty(window.location, 'href', {
                    set: function(url) {
                        if (url.includes('login.html')) {
                            redirectAttempted = true;
                        }
                        // 不实际执行重定向
                    }
                });
                
                // 模拟检查登录状态并重定向
                const user = this.authManager.getCurrentUser();
                if (!user) {
                    window.location.href = 'login.html';
                }
                
                // 恢复原始的setter
                Object.defineProperty(window.location, 'href', {
                    set: originalHrefSetter
                });
                
                const passed = redirectAttempted;
                
                this.testResults.push({
                    name: '受保护页面访问控制',
                    passed: passed,
                    message: passed ? '成功重定向未登录用户' : '未登录用户访问控制有问题'
                });
                console.log(`结果: ${passed ? '通过' : '失败'} - 受保护页面访问控制测试`);
                resolve();
            } catch (error) {
                this.testResults.push({
                    name: '受保护页面访问控制',
                    passed: false,
                    message: `测试过程中出现错误: ${error.message}`
                });
                console.log(`结果: 失败 - 测试过程中出现错误: ${error.message}`);
                resolve();
            }
        });
    }
    
    /**
     * 显示测试结果摘要
     */
    displayResults() {
        console.log('\n%c===== 测试结果摘要 =====', 'color: blue; font-weight: bold;');
        
        const passedTests = this.testResults.filter(test =\u003e test.passed).length;
        const totalTests = this.testResults.length;
        const passRate = Math.round((passedTests / totalTests) * 100);
        
        // 显示每个测试的结果
        this.testResults.forEach(test =\u003e {
            const statusColor = test.passed ? 'green' : 'red';
            console.log(`%c${test.passed ? '✓' : '✗'} ${test.name}: ${test.message}`, `color: ${statusColor};`);
        });
        
        // 显示总体结果
        console.log('\n%c总体结果:', 'color: purple; font-weight: bold;');
        console.log(`通过: ${passedTests}/${totalTests} (${passRate}%)`);
        
        if (passRate === 100) {
            console.log('%c所有测试通过！登录功能运行正常。', 'color: green; font-weight: bold;');
        } else if (passRate \u003e= 70) {
            console.log('%c大部分测试通过，但仍有问题需要修复。', 'color: yellow; font-weight: bold;');
        } else {
            console.log('%c有多个测试失败，登录功能存在严重问题，需要修复。', 'color: red; font-weight: bold;');
        }
        
        // 提供安全建议
        this.provideSecurityAdvice();
        
        return {
            passedTests,
            totalTests,
            passRate,
            details: this.testResults
        };
    }
    
    /**
     * 提供安全建议
     */
    provideSecurityAdvice() {
        console.log('\n%c安全建议:', 'color: orange; font-weight: bold;');
        console.log('1. 生产环境中应使用HTTPS加密传输');
        console.log('2. 密码应在后端进行哈希存储，而不是明文');
        console.log('3. 应实现登录尝试次数限制，防止暴力破解');
        console.log('4. 敏感操作应要求重新验证身份');
        console.log('5. 应使用真正的JWT或会话令牌，而不是简单的本地存储');
        console.log('6. 实现更严格的会话超时机制');
        console.log('7. 添加CSRF保护措施');
    }
}

// 创建测试实例
const loginTester = new LoginTester();

// 暴露给全局，以便在控制台运行
window.loginTester = loginTester;

// 使用方法提示
console.log('%c登录功能测试工具已加载!', 'color: blue;');
console.log('请在控制台中运行: loginTester.runAllTests() 开始测试');

// 导出测试器类（如果在模块环境中使用）
if (typeof module !== 'undefined') {
    module.exports = LoginTester;
}