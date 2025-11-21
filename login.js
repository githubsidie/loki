// 模拟用户数据库（在实际应用中应连接后端API）
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user1', password: 'password123', role: 'user' }
];

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
    
    // 验证用户（在实际应用中应发送到后端验证）
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // 登录成功，保存用户信息到本地存储
        const userData = {
            username: user.username,
            role: user.role,
            loggedIn: true,
            loginTime: new Date().getTime()
        };
        
        // 如果选中了记住我，使用localStorage，否则使用sessionStorage
        if (rememberMe) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // 重定向到主页
        window.location.href = 'index.html';
    } else {
        // 登录失败
        showError('用户名或密码错误');
    }
}

// 检查用户是否已登录
function checkLoggedIn() {
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    
    if (userData) {
        try {
            const parsedData = JSON.parse(userData);
            if (parsedData.loggedIn) {
                // 用户已登录，重定向到主页
                window.location.href = 'index.html';
                return true;
            }
        } catch (error) {
            console.error('解析用户数据失败:', error);
        }
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
        showError('注册功能正在开发中，请使用测试账号登录');
    });
    
    // 如果有保存的用户名，自动填充
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('rememberMe').checked = true;
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