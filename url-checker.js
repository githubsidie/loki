// URL检测工具的JavaScript逻辑

// DOM元素
const urlInput = document.getElementById('urlInput');
const checkButton = document.getElementById('checkButton');
const resultSection = document.getElementById('resultSection');
const resultTitle = document.getElementById('resultTitle');
const resultDetails = document.getElementById('resultDetails');
const historyList = document.getElementById('historyList');

// 批量检测相关DOM元素
const excelFileInput = document.getElementById('excelFile');
const importExcelButton = document.getElementById('importExcelButton');
const batchResultSection = document.getElementById('batchResultSection');
const batchResultTable = document.getElementById('batchResultTable');

// 进度条相关DOM元素
const progressText = document.getElementById('progressText');
const timeText = document.getElementById('timeText');
const progressFill = document.getElementById('progressFill');

// 历史记录存储键名
const HISTORY_KEY = 'url_checker_history';

// 初始化
function init() {
    // 绑定事件
    checkButton.addEventListener('click', checkURL);
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkURL();
        }
    });
    
    // 批量检测事件绑定
    importExcelButton.addEventListener('click', handleExcelImport);
    
    // 加载历史记录
    loadHistory();
}

// 检测URL
async function checkURL() {
    const url = urlInput.value.trim();
    
    // 验证URL格式
    if (!validateURL(url)) {
        showError('请输入有效的URL地址（例如：https://www.example.com）');
        return;
    }
    
    // 显示加载状态
    checkButton.disabled = true;
    checkButton.textContent = '检测中...';
    
    try {
        // 发送请求检测URL
        const response = await fetchURL(url);
        
        // 显示检测结果
        showResult(response, url);
        
        // 保存到历史记录
        saveToHistory(url, response.success, response.status, response.statusText);
        
    } catch (error) {
        showError(`检测失败：${error.message}`);
    } finally {
        // 恢复按钮状态
        checkButton.disabled = false;
        checkButton.textContent = '检测';
    }
}

// 验证URL格式，支持多种格式
function validateURL(url) {
    if (!url || typeof url !== 'string') {
        return false;
    }
    
    const trimmedUrl = url.trim();
    if (trimmedUrl === '') {
        return false;
    }
    
    try {
        // 尝试直接解析
        new URL(trimmedUrl);
        return true;
    } catch (error) {
        // 如果没有协议，尝试添加http://再解析
        try {
            new URL('http://' + trimmedUrl);
            return true;
        } catch (error2) {
            return false;
        }
    }
}

// 发送请求检测URL
async function fetchURL(url) {
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 增加超时时间到15秒
    
    try {
        const platform = detectPlatform(url);
        
        // 对于抖音等平台，使用特殊处理
        if (platform === 'douyin') {
            return await fetchDouyinURL(url, controller, timeoutId);
        }
        
        // 针对社交媒体平台，使用手机端User-Agent以获取更准确的内容
        const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
        
        // 首先尝试使用cors模式，获取完整响应
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'cors',
            headers: {
                'User-Agent': mobileUserAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'X-Requested-With': 'XMLHttpRequest' // 模拟AJAX请求
            },
            cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        // 获取响应文本
        let responseText = '';
        try {
            responseText = await response.text();
        } catch (e) {
            // 无法获取响应文本，可能是二进制数据
        }
        
        // 检测URL状态和帖子状态
        const urlStatus = checkURLStatus(response, responseText, url);
        
        return {
            success: urlStatus.isValid && !urlStatus.isDeleted,
            status: response.status,
            statusText: urlStatus.statusText,
            url: url,
            isDeleted: urlStatus.isDeleted,
            platform: urlStatus.platform,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || '无法获取',
                'Content-Length': response.headers.get('Content-Length') || '无法获取',
                'Server': response.headers.get('Server') || '无法获取',
                'Date': response.headers.get('Date') || '无法获取'
            }
        };
    } catch (error) {
        clearTimeout(timeoutId);
        
        // 如果cors模式失败，尝试no-cors模式
        if (error.name === 'TypeError' && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
            return fetchURLWithNoCors(url);
        }
        
        // 更详细的错误处理
        if (error.name === 'AbortError') {
            throw new Error('请求超时（超过15秒）');
        } else if (error.name === 'TypeError') {
            throw new Error('网络错误或URL无效');
        } else {
            throw error;
        }
    }
}

// 抖音URL特殊处理
async function fetchDouyinURL(url, controller, timeoutId) {
    try {
        // 抖音视频URL格式可能为：https://v.douyin.com/xxxx/ 或 https://www.douyin.com/video/xxxx
        // 针对抖音，使用手机端User-Agent以获取更准确的内容
        const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
        
        // 尝试使用GET请求而非HEAD请求，获取完整响应
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
            headers: {
                'User-Agent': mobileUserAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'X-Requested-With': 'XMLHttpRequest' // 模拟AJAX请求
            },
            cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        // 对于抖音，使用状态码和重定向来判断
        const isSuccess = response.type !== 'error' && response.status !== 404 && response.status !== 500;
        let isDeleted = !isSuccess;
        let statusText = 'OK';
        
        // 抖音的删除视频通常会返回404或重定向到首页
        if (response.status === 404) {
            isDeleted = true;
            statusText = '帖子已删除';
        } else if (response.status === 0 || response.status === 200) {
            // 对于no-cors请求，基础可访问即认为未失效
            statusText = 'OK (CORS限制，基础可访问)';
        } else {
            isSuccess = false;
            isDeleted = true;
            statusText = '帖子可能已删除或URL无效';
        }
        
        return {
            success: isSuccess && !isDeleted,
            status: response.status || (isSuccess ? 200 : 404),
            statusText: statusText,
            url: url,
            isDeleted: isDeleted,
            platform: 'douyin',
            headers: {
                'Content-Type': response.headers.get('Content-Type') || '无法获取（CORS限制）',
                'Content-Length': response.headers.get('Content-Length') || '无法获取（CORS限制）'
            }
        };
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('请求超时（超过15秒）');
        } else {
            // 抖音URL如果无效，可能会触发网络错误
            return {
                success: false,
                status: 404,
                statusText: '帖子可能已删除或URL无效',
                url: url,
                isDeleted: true,
                platform: 'douyin',
                headers: {}
            };
        }
    }
}

// 使用no-cors模式获取URL
async function fetchURLWithNoCors(url) {
    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 增加超时时间到15秒
    
    try {
        // 使用手机端User-Agent以获取更准确的内容
        const mobileUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
        
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors',
            headers: {
                'User-Agent': mobileUserAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'X-Requested-With': 'XMLHttpRequest' // 模拟AJAX请求
            },
            cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        
        // 对于no-cors请求，只能获取基本状态
        const isSuccess = response.type !== 'error' && response.status !== 404 && response.status !== 500;
        const platform = detectPlatform(url);
        let isDeleted = !isSuccess;
        let statusText = isSuccess ? `OK (CORS限制，${platform ? getPlatformName(platform) : '平台'}基础可访问)` : 'Network request completed but CORS restricted';
        
        if (!isSuccess) {
            isDeleted = true;
            statusText = '帖子可能已删除或URL无效';
        }
        
        return {
            success: isSuccess && !isDeleted,
            status: response.status || (isSuccess ? 200 : 404),
            statusText: statusText,
            url: url,
            isDeleted: isDeleted,
            platform: platform,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || '无法获取（CORS限制）',
                'Content-Length': response.headers.get('Content-Length') || '无法获取（CORS限制）',
                'Server': response.headers.get('Server') || '无法获取（CORS限制）',
                'Date': response.headers.get('Date') || '无法获取（CORS限制）'
            }
        };
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('请求超时（超过15秒）');
        } else {
            // 网络错误或URL无效，直接返回已失效
            const platform = detectPlatform(url);
            return {
                success: false,
                status: 404,
                statusText: '网络错误或URL无效',
                url: url,
                isDeleted: true,
                platform: platform,
                headers: {}
            };
        }
    }
}

// 检测URL状态和帖子状态，针对CORS限制优化
function checkURLStatus(response, responseText, url) {
    const platform = detectPlatform(url);
    let isDeleted = false;
    let statusText = response.statusText;
    
    // 检测帖子是否已删除
    if (responseText) {
        isDeleted = isPostDeleted(responseText, platform);
        if (isDeleted) {
            statusText = '帖子已删除';
        }
    } else {
        // CORS限制下无法获取响应体，使用其他方式检测
        // 对于社交媒体平台，CORS限制可能意味着我们无法准确检测，但可以基于状态码判断
        if (response.status === 404 || response.status === 500) {
            isDeleted = true;
            statusText = '帖子可能已删除或URL无效';
        } else if (response.status === 0 && platform) {
            // 对于no-cors请求，状态码为0，我们无法准确检测，但可以基于平台特性判断
            statusText = `${getPlatformName(platform)} URL (CORS限制，基础可访问)`;
        }
    }
    
    return {
        isValid: response.ok || response.status === 200 || response.status === 0, // 允许status 0（no-cors请求）
        isDeleted: isDeleted,
        platform: platform,
        statusText: statusText
    };
}

// 检测平台
function detectPlatform(url) {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('douyin.com') || lowerUrl.includes('tiktok.com')) {
        return 'douyin';
    } else if (lowerUrl.includes('kuaishou.com')) {
        return 'kuaishou';
    } else if (lowerUrl.includes('xiaohongshu.com')) {
        return 'xiaohongshu';
    } else if (lowerUrl.includes('weibo.com')) {
        return 'weibo';
    } else if (lowerUrl.includes('bilibili.com')) {
        return 'bilibili';
    }
    return null;
}

// 检测帖子是否已删除，优化特征词检测
function isPostDeleted(html, platform) {
    const lowerHtml = html.toLowerCase();
    
    // 快手链接特殊处理：直接检查是否包含快手特有的有效特征
    if (platform === 'kuaishou') {
        // 快手有效特征
        const kuaishouValidPatterns = [
            'short-video', '短视频', 'video', '播放',
            '暂未支持显示图片作品', '请在移动端查看', '请使用手机端访问',
            'kuaishou', '快手', 'user', 'profile',
            'view', 'watch', 'see', 'look',
            '@', '人生苦短', '及时行乐', // 添加快手视频页面常见特征
            '关注', '分享', '不感兴趣', '举报', '评论' // 添加交互元素作为有效特征
        ];
        
        // 快手失效特征
        const kuaishouInvalidPatterns = [
            '该作品已删除', '作品不存在', '视频已失效',
            '作品已被删除', '视频已被删除', '无法查看该作品',
            'not found', '404', 'content not found',
            'page not found', '内容不存在', '无法找到该作品'
        ];
        
        // 忽略的临时状态提示
        const ignorePatterns = [
            '无法连接网络', '请稍后再试', '网络连接失败',
            '加载中', '正在加载', 'loading', '请稍候'
        ];
        
        // 过滤掉忽略的临时状态提示
        let filteredHtml = lowerHtml;
        ignorePatterns.forEach(pattern => {
            filteredHtml = filteredHtml.replace(new RegExp(pattern, 'g'), '');
        });
        
        // 先检查有效特征，如果包含则返回false
        if (kuaishouValidPatterns.some(pattern => filteredHtml.includes(pattern))) {
            return false;
        }
        
        // 再检查失效特征
        return kuaishouInvalidPatterns.some(pattern => filteredHtml.includes(pattern));
    }
    
    // 排除特定的非失效情况
    const nonDeletedPatterns = [
        '暂未支持显示图片作品', '请在移动端查看', '请使用手机端访问',
        '视频播放', '正在播放', '播放视频', 'video', '播放',
        '图片加载', '图片查看', '查看图片', 'image', 'photo',
        '请下载', '请安装', '请打开', 'app', '客户端',
        'short-video', '短视频', 'kuaishou', '快手',
        'user', 'profile', 'view', 'watch', 'see', 'look'
    ];
    
    // 首先检查非失效特征，如果包含则直接返回false
    if (nonDeletedPatterns.some(pattern => lowerHtml.includes(pattern))) {
        return false;
    }
    
    // 增强的通用检测，优先使用通用特征
    const genericDeletedPatterns = [
        '已删除', '不存在', '已失效', '被删除', '无法访问',
        'content not found', 'page not found', '404', 'not found',
        '该内容已不存在', '该页面已不存在', '该帖子已不存在',
        '此内容已被删除', '此页面已被删除', '此帖子已被删除',
        '该作品已不存在', '该视频已不存在', '该笔记已不存在',
        '作品已下架', '视频已下架', '笔记已下架',
        '无法查看', '无法访问', '访问受限', '权限不足',
        '已被屏蔽', '已被隐藏', '已被关闭', '已被禁止'
    ];
    
    // 然后检查通用失效特征
    if (genericDeletedPatterns.some(pattern => lowerHtml.includes(pattern))) {
        return true;
    }
    
    // 根据不同平台的特定特征检测帖子是否已删除
    if (platform) {
        switch (platform) {
            case 'douyin':
                return lowerHtml.includes('该作品已删除') || 
                       lowerHtml.includes('作品不存在') ||
                       lowerHtml.includes('视频已失效') ||
                       lowerHtml.includes('此作品已下架') ||
                       lowerHtml.includes('无法查看此作品') ||
                       lowerHtml.includes('作品已被删除');
            case 'xiaohongshu':
                return lowerHtml.includes('该笔记已被删除') || 
                       lowerHtml.includes('笔记不存在') ||
                       lowerHtml.includes('内容已删除') ||
                       lowerHtml.includes('无法查看笔记') ||
                       lowerHtml.includes('笔记已被删除');
            case 'weibo':
                return lowerHtml.includes('该微博已被删除') || 
                       lowerHtml.includes('微博不存在') ||
                       lowerHtml.includes('内容已被删除') ||
                       lowerHtml.includes('无法查看此微博') ||
                       lowerHtml.includes('微博已被删除');
            case 'bilibili':
                return lowerHtml.includes('视频已失效') || 
                       lowerHtml.includes('视频不存在') ||
                       lowerHtml.includes('该稿件已被删除') ||
                       lowerHtml.includes('无法观看此视频') ||
                       lowerHtml.includes('稿件已被删除');
        }
    }
    
    // 默认返回false，避免误判
    return false;
}

// 显示检测结果
function showResult(response, originalUrl) {
    resultSection.classList.remove('success', 'error', 'show');
    
    if (response.success) {
        // URL有效且帖子未删除
        resultSection.classList.add('success', 'show');
        resultTitle.textContent = '✅ URL有效';
        resultDetails.innerHTML = `
            <div class="result-details">
                <div class="result-item"><span class="result-label">URL：</span>${response.url}</div>
                <div class="result-item"><span class="result-label">平台：</span>${getPlatformName(response.platform)}</div>
                <div class="result-item"><span class="result-label">状态码：</span>${response.status} ${response.statusText}</div>
                <div class="result-item"><span class="result-label">帖子状态：</span>✅ 正常</div>
                ${response.headers['Content-Type'] ? `<div class="result-item"><span class="result-label">内容类型：</span>${response.headers['Content-Type']}</div>` : ''}
                ${response.headers['Content-Length'] ? `<div class="result-item"><span class="result-label">内容长度：</span>${formatFileSize(parseInt(response.headers['Content-Length']))}</div>` : ''}
                ${response.headers['Server'] ? `<div class="result-item"><span class="result-label">服务器：</span>${response.headers['Server']}</div>` : ''}
                ${response.headers['Date'] ? `<div class="result-item"><span class="result-label">响应时间：</span>${new Date(response.headers['Date']).toLocaleString()}</div>` : ''}
            </div>
        `;
    } else {
        // URL无效或帖子已删除
        resultSection.classList.add('error', 'show');
        if (response.isDeleted) {
            resultTitle.textContent = '❌ 帖子已删除';
            resultDetails.innerHTML = `
                <div class="result-details">
                    <div class="result-item"><span class="result-label">URL：</span>${originalUrl}</div>
                    <div class="result-item"><span class="result-label">平台：</span>${getPlatformName(response.platform)}</div>
                    <div class="result-item"><span class="result-label">状态码：</span>${response.status} ${response.statusText}</div>
                    <div class="result-item"><span class="result-label">帖子状态：</span>❌ 已删除</div>
                    <div class="result-item"><span class="result-label">提示：</span>该URL对应的帖子已被删除或不存在</div>
                </div>
            `;
        } else {
            resultTitle.textContent = '❌ URL无效或不可访问';
            resultDetails.innerHTML = `
                <div class="result-details">
                    <div class="result-item"><span class="result-label">URL：</span>${originalUrl}</div>
                    <div class="result-item"><span class="result-label">平台：</span>${getPlatformName(response.platform)}</div>
                    <div class="result-item"><span class="result-label">状态码：</span>${response.status} ${response.statusText}</div>
                    <div class="result-item"><span class="result-label">提示：</span>该URL可能已失效、不存在或服务器拒绝访问</div>
                </div>
            `;
        }
    }
}

// 获取平台名称
function getPlatformName(platform) {
    const platformNames = {
        'douyin': '抖音/TikTok',
        'kuaishou': '快手',
        'xiaohongshu': '小红书',
        'weibo': '微博',
        'bilibili': '哔哩哔哩'
    };
    return platformNames[platform] || (platform ? platform : '未知');
}

// 显示错误信息
function showError(message) {
    resultSection.classList.remove('success', 'error', 'show');
    resultSection.classList.add('error', 'show');
    resultTitle.textContent = '❌ 检测失败';
    resultDetails.innerHTML = `
        <div class="result-details">
            <div class="result-item">${message}</div>
        </div>
    `;
}

// 保存到历史记录
function saveToHistory(url, success, status, statusText) {
    // 获取现有历史记录
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    // 创建新记录
    const record = {
        url: url,
        success: success,
        status: status,
        statusText: statusText,
        timestamp: new Date().toISOString()
    };
    
    // 添加到历史记录开头
    history.unshift(record);
    
    // 限制历史记录数量（最多保存20条）
    if (history.length > 20) {
        history.splice(20);
    }
    
    // 保存到localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    // 更新显示
    loadHistory();
}

// 加载历史记录
function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="history-item">暂无检测历史</li>';
        return;
    }
    
    // 渲染历史记录列表
    historyList.innerHTML = history.map(record => `
        <li class="history-item">
            <div class="history-url">${record.url}</div>
            <div class="history-status ${record.success ? 'valid' : 'invalid'}">
                ${record.success ? '✅ 有效' : '❌ 无效'}
            </div>
            <div class="history-time">${formatTime(record.timestamp)}</div>
        </li>
    `).join('');
}

// 格式化时间
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理Excel导入
async function handleExcelImport() {
    const file = excelFileInput.files[0];
    if (!file) {
        showError('请先选择Excel文件');
        return;
    }
    
    try {
        // 禁用按钮防止重复点击
        importExcelButton.disabled = true;
        importExcelButton.innerHTML = '<div class="loading-spinner"></div> 处理中...';
        
        // 读取Excel文件，保留原始数据
        const excelData = await readExcelFileWithOriginalData(file);
        
        if (excelData.urls.length === 0) {
            showError('未在Excel文件中找到有效的URL');
            return;
        }
        
        // 显示批量检测结果区域
        batchResultSection.classList.add('show');
        
        // 初始化进度条
        initializeProgress(excelData.urls.length);
        
        // 显示加载状态（隐藏表格）
        batchResultTable.innerHTML = `<table class="batch-result-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>URL</th>
                    <th>平台</th>
                    <th>URL状态</th>
                    <th>帖子状态</th>
                    <th>响应码</th>
                </tr>
            </thead>
            <tbody>
                ${excelData.urls.map((url, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${url}</td>
                        <td>-</td>
                        <td><div class="loading-spinner"></div> 检测中...</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
        
        // 批量检测URL，获取结果
        const startTime = Date.now();
        const timeInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timeText.textContent = `已用时间：${elapsedTime}秒`;
        }, 1000);
        
        const results = await batchCheckURLs(excelData.urls);
        
        // 清除时间定时器
        clearInterval(timeInterval);
        
        // 处理结果，生成导出数据
        const exportData = processResultsForExport(excelData.originalData, excelData.urlColumn, results);
        
        // 导出Excel文件
        exportResultsToExcel(exportData, 'URL检测结果.xlsx');
        
        // 更新进度为100%
        updateProgress(excelData.urls.length, excelData.urls.length, '检测完成！正在导出结果...');
        
        // 显示导出成功的提示
        progressText.textContent = '✅ 检测完成！结果已导出为Excel文件';
        
    } catch (error) {
        showError(`Excel处理失败：${error.message}`);
        // 更新进度为错误状态
        progressText.textContent = `❌ 检测失败：${error.message}`;
    } finally {
        // 恢复按钮状态
        importExcelButton.disabled = false;
        importExcelButton.innerHTML = '导入检测';
    }
}

// 初始化进度条
function initializeProgress(total) {
    progressFill.style.width = '0%';
    progressText.textContent = `准备开始检测 ${total} 个URL...`;
    timeText.textContent = '已用时间：0秒';
}

// 更新进度条
function updateProgress(current, total, statusText) {
    const percentage = Math.floor((current / total) * 100);
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${statusText} (${current}/${total})`;
}

// 读取Excel文件并保留原始数据，更灵活的处理逻辑
async function readExcelFileWithOriginalData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                // 解析Excel文件
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // 获取第一个工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // 将工作表转换为JSON格式
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    resolve({ urls: [], originalData: [], urlColumn: null });
                    return;
                }
                
                let urlColumn = null;
                let urls = [];
                
                // 第一步：尝试识别URL列
                urlColumn = identifyURLColumn(jsonData);
                
                // 第二步：如果无法识别URL列，尝试所有列
                if (!urlColumn) {
                    // 遍历所有列，查找包含URL的列
                    const columns = Object.keys(jsonData[0]);
                    for (const column of columns) {
                        const columnUrls = jsonData
                            .map(row => row[column])
                            .filter(value => value && typeof value === 'string' && 
                                      (validateURL(value.trim()) || 
                                       value.trim().includes('.com') || 
                                       value.trim().includes('.cn') ||
                                       value.trim().includes('http')))
                            .map(url => url.trim());
                            
                        if (columnUrls.length > 0) {
                            urlColumn = column;
                            urls = columnUrls;
                            break;
                        }
                    }
                } else {
                    // 提取URL并验证，放宽验证条件
                    urls = jsonData
                        .map(row => row[urlColumn])
                        .filter(value => {
                            if (!value || typeof value !== 'string') {
                                return false;
                            }
                            const trimmed = value.trim();
                            return trimmed !== '' && 
                                  (validateURL(trimmed) || 
                                   trimmed.includes('.com') || 
                                   trimmed.includes('.cn') ||
                                   trimmed.includes('http'));
                        })
                        .map(url => url.trim());
                }
                
                // 第三步：如果还是没有找到URL，尝试直接从所有单元格中提取
                if (urls.length === 0) {
                    // 遍历所有数据，查找URL
                    for (const row of jsonData) {
                        for (const key in row) {
                            const value = row[key];
                            if (value && typeof value === 'string') {
                                const trimmed = value.trim();
                                if (trimmed !== '' && 
                                    (validateURL(trimmed) || 
                                     trimmed.includes('.com') || 
                                     trimmed.includes('.cn') ||
                                     trimmed.includes('http'))) {
                                    urls.push(trimmed);
                                    if (!urlColumn) {
                                        urlColumn = key;
                                    }
                                }
                            }
                        }
                    }
                }
                
                // 第四步：如果URL没有协议，自动添加http://
                urls = urls.map(url => {
                    if (!url.startsWith('http://') && !url.startsWith('https://')) {
                        return 'http://' + url;
                    }
                    return url;
                });
                
                resolve({ urls: urls, originalData: jsonData, urlColumn: urlColumn });
            } catch (error) {
                reject(new Error('Excel文件解析失败：' + error.message));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };
        
        // 读取文件
        reader.readAsArrayBuffer(file);
    });
}

// 读取Excel文件并提取URL
async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                // 解析Excel文件
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // 获取第一个工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // 将工作表转换为JSON格式
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    resolve([]);
                    return;
                }
                
                // 识别URL列
                const urlColumn = identifyURLColumn(jsonData);
                if (!urlColumn) {
                    resolve([]);
                    return;
                }
                
                // 提取URL并验证
                const urls = jsonData
                    .map(row => row[urlColumn])
                    .filter(url => url && typeof url === 'string' && validateURL(url.trim()))
                    .map(url => url.trim());
                
                resolve(urls);
            } catch (error) {
                reject(new Error('Excel文件解析失败：' + error.message));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('文件读取失败'));
        };
        
        // 读取文件
        reader.readAsArrayBuffer(file);
    });
}

// 识别URL列
function identifyURLColumn(jsonData) {
    // 获取第一行数据的所有键
    const columns = Object.keys(jsonData[0]);
    
    // 关键词列表，用于匹配URL列
    const urlKeywords = ['url', '链接', '网址', 'link', 'web', 'website', 'site', '地址', 'url地址'];
    
    // 第一步：尝试通过列名识别
    for (const column of columns) {
        const lowerColumn = column.toLowerCase();
        // 检查列名是否包含任何URL相关关键词
        if (urlKeywords.some(keyword => lowerColumn.includes(keyword))) {
            return column;
        }
    }
    
    // 第二步：如果列名无法识别，检查数据内容
    for (const column of columns) {
        // 检查前10行数据，放宽检查条件
        const hasURL = jsonData.slice(0, 10).some(row => {
            const value = row[column];
            if (!value || typeof value !== 'string') {
                return false;
            }
            
            const trimmedValue = value.trim();
            // 检查是否包含URL特征
            return trimmedValue.includes('.com') || 
                   trimmedValue.includes('.cn') || 
                   trimmedValue.includes('.org') || 
                   trimmedValue.includes('.net') ||
                   trimmedValue.includes('http') ||
                   validateURL(trimmedValue);
        });
        
        if (hasURL) {
            return column;
        }
    }
    
    // 第三步：如果还是无法识别，返回第一列
    if (columns.length > 0) {
        return columns[0];
    }
    
    return null;
}

// 批量检测URL，优化并发控制和检测逻辑
async function batchCheckURLs(urls) {
    const results = [];
    let completedCount = 0;
    const totalCount = urls.length;
    
    // 降低并发数，避免浏览器限制，提高检测准确性
    const concurrencyLimit = 2; // 降低到2，更符合浏览器实际并发限制
    
    for (let i = 0; i < urls.length; i += concurrencyLimit) {
        const batch = urls.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(
            batch.map(async (url, index) => {
                const absoluteIndex = i + index;
                try {
                    // 真实检测URL，添加延迟确保准确性
                    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms延迟，避免请求过快
                    const result = await fetchURL(url);
                    results[absoluteIndex] = { url, result };
                    
                    // 更新表格中对应行的状态
                    updateBatchResultRow(absoluteIndex + 1, url, result);
                } catch (error) {
                    const errorResult = {
                        success: false,
                        status: 404, // 统一使用404表示错误
                        statusText: error.message,
                        url: url,
                        isDeleted: true,
                        platform: detectPlatform(url)
                    };
                    results[absoluteIndex] = { url, result: errorResult };
                    
                    // 更新表格中对应行的状态为错误
                    updateBatchResultRow(absoluteIndex + 1, url, errorResult);
                } finally {
                    // 更新进度
                    completedCount++;
                    updateProgress(completedCount, totalCount, `检测中...`);
                }
            })
        );
        
        // 批次之间添加延迟，避免服务器压力过大
        if (i + concurrencyLimit < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 500ms批次延迟
        }
    }
    
    return results;
}

// 处理结果用于导出
function processResultsForExport(originalData, urlColumn, results) {
    // 为原始数据添加检测结果
    return originalData.map((row, index) => {
        const url = row[urlColumn]?.trim();
        const resultItem = results.find(item => item.url === url);
        
        let status = '已失效'; // 默认标记为已失效
        if (resultItem) {
            // 只有成功且未删除的帖子才标记为未失效
            if (resultItem.result.success && !resultItem.result.isDeleted) {
                status = '未失效';
            }
        }
        
        // 添加检测状态列
        const newRow = { ...row };
        newRow['检测状态'] = status;
        newRow['平台'] = resultItem?.result.platform ? getPlatformName(resultItem.result.platform) : '未知';
        newRow['响应码'] = resultItem?.result.status || '';
        newRow['状态信息'] = resultItem?.result.statusText || '';
        
        return newRow;
    });
}

// 导出结果到Excel
function exportResultsToExcel(data, filename) {
    try {
        // 创建工作表
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // 创建工作簿
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '检测结果');
        
        // 导出文件
        XLSX.writeFile(workbook, filename);
    } catch (error) {
        console.error('Excel导出失败:', error);
        throw new Error('Excel导出失败：' + error.message);
    }
}

// 更新批量检测结果表格中的行
function updateBatchResultRow(rowIndex, url, result) {
    const rows = batchResultTable.querySelectorAll('tbody tr');
    const row = rows[rowIndex - 1];
    if (!row) return;
    
    const platformCell = row.cells[2];
    const statusCell = row.cells[3];
    const postStatusCell = row.cells[4];
    const codeCell = row.cells[5];
    
    // 设置平台信息
    platformCell.textContent = getPlatformName(result.platform);
    
    // 设置URL状态
    if (result.success) {
        statusCell.innerHTML = `<span class="status-valid">✅ 有效</span>`;
        postStatusCell.innerHTML = `<span class="status-valid">✅ 正常</span>`;
    } else {
        statusCell.innerHTML = `<span class="status-invalid">❌ 无效</span>`;
        if (result.isDeleted) {
            postStatusCell.innerHTML = `<span class="status-invalid">❌ 已删除</span>`;
        } else {
            postStatusCell.innerHTML = `<span class="status-invalid">❌ 异常</span>`;
        }
    }
    
    // 设置状态码
    codeCell.textContent = `${result.status} ${result.statusText}`;
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}