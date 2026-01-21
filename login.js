// 使用数据管理器进行数据操作
// 确保dataManager已经加载
if (typeof dataManager === 'undefined') {
    console.error('数据管理器未加载，请确保在login.js之前加载dataManager.js');
}

// 显示错误消息
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // 3秒后自动隐藏错误消息
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

// 处理登录表单提交
function handleLogin(event) {
    event.preventDefault();
    
    // 获取表单数据
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 验证输入
    if (!username || !password) {
        showError('请输入用户名和密码');
        return;
    }
    
    try {
        // 使用dataManager验证用户并获取用户信息
        const user = dataManager.findUserByUsername(username);
        
        if (user && user.password === password) {
            // 登录成功，更新最后登录时间
            const users = dataManager.getUsers();
            const userIndex = users.findIndex(u => u.username === username);
            if (userIndex !== -1) {
                users[userIndex].lastLogin = new Date().toISOString();
                dataManager.saveUsers(users);
            }
            
            // 构建用户数据
            const userData = {
                username: user.username,
                displayName: user.displayName || user.username,
                role: user.role || 'user',
                loggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            // 保存当前用户信息
            dataManager.saveCurrentUser(userData, rememberMe);
        
            // 登录成功，重定向到主页
            window.location.href = 'simple-index.html';
        } else {
        // 登录失败
        showError('用户名或密码错误');
        }
    } catch (error) {
        console.error('登录处理失败:', error);
        showError('登录过程中发生错误，请稍后再试');
        return;
    }

// 检查用户是否已登录
function checkLoggedIn() {
    try {
        // 使用dataManager检查当前用户
        const currentUser = dataManager.getCurrentUser();
        
        if (currentUser && currentUser.loggedIn) {
            // 用户已登录，重定向到主页
            window.location.href = 'index.html';
            return true;
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
    }
    
    return false;
}

// 初始化登录页面
function initLoginPage() {
    // 检查是否已登录，如果已登录则重定向
    if (checkLoggedIn()) {
        return;
    }
    
    // 为忘记密码链接添加点击事件
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        showError('此功能暂未实现，请联系管理员重置密码');
    });
    
    // 为注册链接添加点击事件
    const registerLink = document.getElementById('registerLink');
    registerLink.addEventListener('click', function(event) {
        event.preventDefault();
        // 跳转到注册页面
        window.location.href = 'register.html';
    });
    
    // 如果有保存的用户名，自动填充
    try {
        const savedUsername = dataManager.getRememberedUsername();
        if (savedUsername) {
            document.getElementById('username').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    } catch (error) {
        console.error('获取记住的用户名失败:', error);
    }
    
    // 添加表单验证
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    usernameInput.addEventListener('focus', function() {
        const errorElement = document.getElementById('errorMessage');
        errorElement.classList.remove('show');
    });
    
    passwordInput.addEventListener('focus', function() {
        const errorElement = document.getElementById('errorMessage');
        errorElement.classList.remove('show');
    });
    
    // 添加回车键登录功能
    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleLogin(event);
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initLoginPage);

// 导出函数供其他文件使用（如果需要）
window.showError = showError;
window.handleLogin = handleLogin;
window.checkLoggedIn = checkLoggedIn;