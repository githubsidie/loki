// 使用数据管理器进行数据操作
// 确保dataManager已经加载
if (typeof dataManager === 'undefined') {
    console.error('数据管理器未加载，请确保在register.js之前加载dataManager.js');
}

// 显示错误消息
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    const successElement = document.getElementById('successMessage');
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    
    // 隐藏成功消息（如果显示）
    successElement.classList.remove('show');
    
    // 3秒后自动隐藏错误消息
    setTimeout(() => {
        errorElement.classList.remove('show');
    }, 3000);
}

// 显示成功消息
function showSuccess(message) {
    const successElement = document.getElementById('successMessage');
    const errorElement = document.getElementById('errorMessage');
    
    successElement.textContent = message;
    successElement.classList.add('show');
    
    // 隐藏错误消息（如果显示）
    errorElement.classList.remove('show');
    
    // 3秒后自动隐藏成功消息
    setTimeout(() => {
        successElement.classList.remove('show');
    }, 3000);
}

// 检查用户名是否已存在
function isUsernameExists(username) {
    return dataManager.isUsernameExists(username);
}

// 验证用户名格式
function validateUsername(username) {
    // 只允许字母、数字和下划线
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    
    if (!usernamePattern.test(username)) {
        return '用户名只能包含字母、数字和下划线';
    }
    
    if (username.length < 4 || username.length > 20) {
        return '用户名长度必须在4-20个字符之间';
    }
    
    return null; // 验证通过
}

// 检查密码强度
function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '请输入密码';
    
    if (!password) {
        return { strength: 0, feedback: feedback, className: '' };
    }
    
    // 长度检查
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength++;
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength++;
    
    // 包含数字
    if (/\d/.test(password)) strength++;
    
    // 包含特殊字符
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // 反馈消息
    if (strength <= 2) {
        feedback = '密码强度：弱';
        className = 'weak';
    } else if (strength <= 4) {
        feedback = '密码强度：中等';
        className = 'medium';
    } else {
        feedback = '密码强度：强';
        className = 'strong';
    }
    
    return { strength: strength, feedback: feedback, className: className };
}

// 处理密码强度显示
function handlePasswordInput() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('passwordStrength');
    
    passwordInput.addEventListener('input', function() {
        const { feedback, className } = checkPasswordStrength(this.value);
        
        strengthIndicator.textContent = feedback;
        strengthIndicator.className = 'password-strength';
        if (className) {
            strengthIndicator.classList.add(className);
        }
    });
}

// 处理注册表单提交
function handleRegister(event) {
    event.preventDefault();
    
    // 获取表单数据
    const displayName = document.getElementById('displayName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 验证显示名称
    if (!displayName) {
        showError('请输入显示名称');
        return;
    }
    
    // 验证用户名
    const usernameError = validateUsername(username);
    if (usernameError) {
        showError(usernameError);
        return;
    }
    
    // 检查用户名是否已存在
    if (isUsernameExists(username)) {
        showError('该用户名已被注册，请选择其他用户名');
        return;
    }
    
    // 验证密码强度
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength.strength <= 2) {
        showError('密码强度太弱，请使用更强的密码（至少包含大小写字母、数字或特殊字符）');
        return;
    }
    
    // 验证密码一致性
    if (password !== confirmPassword) {
        showError('两次输入的密码不一致');
        return;
    }
    
    // 注册新用户
    try {
        // 创建新用户对象
        const newUser = {
            displayName: displayName,
            username: username,
            password: password, // 在实际应用中，应该对密码进行哈希处理
            role: 'user',       // 新注册用户默认为普通用户
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        // 使用dataManager添加用户
        const success = dataManager.addUser(newUser);
        
        if (success) {
            // 显示成功消息
            showSuccess('注册成功！正在跳转到主页...');
            
            // 2秒后跳转到主页
            setTimeout(() => {
                window.location.href = 'simple-index.html';
            }, 2000);
        } else {
            showError('注册失败，请稍后再试');
        }
    } catch (error) {
        console.error('注册失败:', error);
        showError('注册过程中发生错误，请稍后再试');
    }
}

// 检查用户是否已登录，如果已登录则重定向
function checkLoggedIn() {
    try {
        // 使用dataManager检查当前用户
        const currentUser = dataManager.getCurrentUser();
        
        if (currentUser && currentUser.loggedIn) {
            // 用户已登录，重定向到主页
            window.location.href = 'simple-index.html';
            return true;
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
    }
    
    return false;

// 初始化注册页面
function initRegisterPage() {
    // 检查是否已登录，如果已登录则重定向
    if (checkLoggedIn()) {
        return;
    }
    
    // 初始化密码强度检测
    handlePasswordInput();
    
    // 为用户名输入添加实时验证
    const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('blur', function() {
        const username = this.value.trim();
        if (username && validateUsername(username) === null && isUsernameExists(username)) {
            showError('该用户名已被注册，请选择其他用户名');
        }
    });
    
    // 为密码确认添加实时验证
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', function() {
        const password = document.getElementById('password').value;
        if (this.value && password !== this.value) {
            showError('两次输入的密码不一致');
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initRegisterPage);

// 导出函数供其他文件使用
window.showError = showError;
window.showSuccess = showSuccess;
window.handleRegister = handleRegister;
window.checkLoggedIn = checkLoggedIn;