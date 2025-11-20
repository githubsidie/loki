// 补全数据管理模块
const DataManager = {
    init() {
        // 初始化员工数据
        if (!localStorage.getItem('employees')) {
            const employees = [
                { id: '1001', name: '张三', role: '员工', phone: '13811111111', department: '应急部' },
                { id: '1002', name: '李四', role: '员工', phone: '13822222222', department: '有害部' },
                { id: '1003', name: '王二狗', role: '员工', phone: '13833333333', department: '网媒部' },
                { id: '2001', name: '李世民', role: '员工', phone: '13966666666', department: '应急部门' },
                { id: '2002', name: '刘彻', role: '员工', phone: '13977777777', department: '应急部门' },
                { id: '2003', name: '朱元璋', role: '员工', phone: '13988888888', department: '应急部门' },
                { id: '2004', name: '赵匡胤', role: '员工', phone: '13999999999', department: '应急部门' },
                { id: '2005', name: '嬴政', role: '员工', phone: '13955555555', department: '应急部门' }
            ];
            localStorage.setItem('employees', JSON.stringify(employees));
        }

        // 初始化任务数据
        if (!localStorage.getItem('tasks')) {
            const tasks = [
                { 
                    id: 't1', 
                    name: '整理会议纪要', 
                    assignee: '1001', 
                    startTime: '2025-11-18T09:00', 
                    endTime: '2025-11-18T12:00', 
                    status: 'doing',
                    priority: '中'
                },
                { 
                    id: 't2', 
                    name: '提交月度报告', 
                    assignee: '1002', 
                    startTime: '2025-11-17T14:00', 
                    endTime: '2025-11-18T17:00', 
                    status: 'pending',
                    priority: '高'
                },
                { 
                    id: 't1001', 
                    name: '前端页面开发', 
                    assignee: '1001', 
                    startTime: '2025-11-19T09:00', 
                    endTime: '2025-11-25T18:00', 
                    status: 'doing',
                    priority: '高',
                    points: 50
                },
                { 
                    id: 't1002', 
                    name: '数据库设计', 
                    assignee: '1001', 
                    startTime: '2025-11-20T10:00', 
                    endTime: '2025-11-28T17:00', 
                    status: 'pending',
                    priority: '中',
                    points: 35
                },
                // 李世民的任务 - 3个已完成，2个进行中，1个待接收
                { id: 't3', name: '制定贞观之治政策', assignee: '2001', startTime: '2025-11-01T09:00', endTime: '2025-11-05T17:00', status: 'done', priority: '高', points: 50 },
                { id: 't4', name: '完善科举制度', assignee: '2001', startTime: '2025-11-06T10:00', endTime: '2025-11-10T16:00', status: 'done', priority: '中', points: 40 },
                { id: 't5', name: '修订律法条文', assignee: '2001', startTime: '2025-11-11T08:00', endTime: '2025-11-15T18:00', status: 'done', priority: '高', points: 45 },
                { id: 't6', name: '处理边疆事务', assignee: '2001', startTime: '2025-11-16T09:00', endTime: '2025-11-20T17:00', status: 'doing', priority: '中', points: 35 },
                { id: 't7', name: '审查官员政绩', assignee: '2001', startTime: '2025-11-18T14:00', endTime: '2025-11-22T16:00', status: 'doing', priority: '高', points: 30 },
                { id: 't8', name: '筹备新年庆典', assignee: '2001', startTime: '2025-11-25T10:00', endTime: '2025-11-30T15:00', status: 'pending', priority: '低', points: 20 },

                // 刘彻的任务 - 3个已完成，2个进行中，1个待接收
                { id: 't9', name: '推行推恩令', assignee: '2002', startTime: '2025-10-20T08:00', endTime: '2025-10-25T18:00', status: 'done', priority: '高', points: 55 },
                { id: 't10', name: '开拓丝绸之路', assignee: '2002', startTime: '2025-10-26T09:00', endTime: '2025-11-01T17:00', status: 'done', priority: '高', points: 60 },
                { id: 't11', name: '加强中央集权', assignee: '2002', startTime: '2025-11-02T10:00', endTime: '2025-11-08T16:00', status: 'done', priority: '中', points: 40 },
                { id: 't12', name: '整顿吏治腐败', assignee: '2002', startTime: '2025-11-12T08:00', endTime: '2025-11-18T18:00', status: 'doing', priority: '高', points: 45 },
                { id: 't13', name: '修订军事制度', assignee: '2002', startTime: '2025-11-19T09:00', endTime: '2025-11-25T17:00', status: 'doing', priority: '中', points: 35 },
                { id: 't14', name: '准备封禅大典', assignee: '2002', startTime: '2025-11-28T10:00', endTime: '2025-12-05T15:00', status: 'pending', priority: '低', points: 25 },

                // 朱元璋的任务 - 3个已完成，2个进行中，1个待接收
                { id: 't15', name: '建立明朝制度', assignee: '2003', startTime: '2025-10-15T08:00', endTime: '2025-10-20T18:00', status: 'done', priority: '高', points: 50 },
                { id: 't16', name: '整顿官僚体系', assignee: '2003', startTime: '2025-10-21T09:00', endTime: '2025-10-28T17:00', status: 'done', priority: '高', points: 45 },
                { id: 't17', name: '发展农业生产', assignee: '2003', startTime: '2025-10-29T10:00', endTime: '2025-11-05T16:00', status: 'done', priority: '中', points: 40 },
                { id: 't18', name: '加强边防建设', assignee: '2003', startTime: '2025-11-15T08:00', endTime: '2025-11-22T18:00', status: 'doing', priority: '高', points: 40 },
                { id: 't19', name: '修订大明律法', assignee: '2003', startTime: '2025-11-20T09:00', endTime: '2025-11-28T17:00', status: 'doing', priority: '中', points: 35 },
                { id: 't20', name: '规划都城建设', assignee: '2003', startTime: '2025-12-01T10:00', endTime: '2025-12-10T15:00', status: 'pending', priority: '低', points: 30 },

                // 赵匡胤的任务 - 3个已完成，2个进行中，1个待接收
                { id: 't21', name: '陈桥兵变计划', assignee: '2004', startTime: '2025-10-10T08:00', endTime: '2025-10-15T18:00', status: 'done', priority: '高', points: 60 },
                { id: 't22', name: '杯酒释兵权', assignee: '2004', startTime: '2025-10-16T09:00', endTime: '2025-10-22T17:00', status: 'done', priority: '高', points: 55 },
                { id: 't23', name: '加强中央集权', assignee: '2004', startTime: '2025-10-23T10:00', endTime: '2025-10-30T16:00', status: 'done', priority: '中', points: 45 },
                { id: 't24', name: '整顿禁军体系', assignee: '2004', startTime: '2025-11-10T08:00', endTime: '2025-11-17T18:00', status: 'doing', priority: '高', points: 40 },
                { id: 't25', name: '完善文官制度', assignee: '2004', startTime: '2025-11-21T09:00', endTime: '2025-11-29T17:00', status: 'doing', priority: '中', points: 35 },
                { id: 't26', name: '筹备统一战争', assignee: '2004', startTime: '2025-12-03T10:00', endTime: '2025-12-12T15:00', status: 'pending', priority: '低', points: 25 },

                // 嬴政的任务 - 3个已完成，2个进行中，1个待接收
                { id: 't27', name: '统一六国战略', assignee: '2005', startTime: '2025-09-20T08:00', endTime: '2025-09-30T18:00', status: 'done', priority: '高', points: 70 },
                { id: 't28', name: '建立郡县制', assignee: '2005', startTime: '2025-10-01T09:00', endTime: '2025-10-08T17:00', status: 'done', priority: '高', points: 60 },
                { id: 't29', name: '统一文字货币', assignee: '2005', startTime: '2025-10-09T10:00', endTime: '2025-10-16T16:00', status: 'done', priority: '高', points: 55 },
                { id: 't30', name: '修建万里长城', assignee: '2005', startTime: '2025-11-01T08:00', endTime: '2025-11-15T18:00', status: 'doing', priority: '高', points: 50 },
                { id: 't31', name: '制定严苛律法', assignee: '2005', startTime: '2025-11-16T09:00', endTime: '2025-11-25T17:00', status: 'doing', priority: '中', points: 35 },
                { id: 't32', name: '筹备东巡计划', assignee: '2005', startTime: '2025-12-05T10:00', endTime: '2025-12-15T15:00', status: 'pending', priority: '低', points: 20 }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    },

    // 获取员工列表
    getEmployees() {
        return JSON.parse(localStorage.getItem('employees') || '[]');
    },

    // 获取任务列表
    getTasks() {
        return JSON.parse(localStorage.getItem('tasks') || '[]');
    },

    // 添加新员工
    addEmployee(employee) {
        const employees = this.getEmployees();
        employees.push(employee);
        localStorage.setItem('employees', JSON.stringify(employees));
    },

    // 删除员工
    deleteEmployee(employeeId) {
        let employees = this.getEmployees();
        employees = employees.filter(emp => emp.id !== employeeId);
        localStorage.setItem('employees', JSON.stringify(employees));
        
        // 同时删除该员工的任务
        let tasks = this.getTasks();
        tasks = tasks.filter(task => task.assignee !== employeeId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
};

// 页面渲染模块
const Renderer = {
    // 初始化页面
    init() {
        this.renderEmployeeOptions(); // 渲染员工下拉选项
        this.renderEmployeeCards(); // 渲染员工任务卡片
        this.renderTaskTable(); // 渲染任务列表
        this.renderEmployeeTable(); // 渲染员工管理表格
    },

    // 渲染员工下拉选项（分配任务、筛选等场景）
    renderEmployeeOptions() {
        const employees = DataManager.getEmployees();
        const assigneeSelect = document.getElementById('task-assignee');
        const filterSelect = document.getElementById('employee-filter');
        const statsEmployeeFilter = document.getElementById('stats-employee-filter');
        const pointsEmployeeFilter = document.getElementById('points-employee-filter');

        // 安全地更新下拉框，检查元素是否存在
        if (assigneeSelect) {
            assigneeSelect.innerHTML = '<option value="">请选择员工</option>';
        }
        if (filterSelect) {
            filterSelect.innerHTML = '<option value="">所有员工</option>';
        }
        if (statsEmployeeFilter) {
            statsEmployeeFilter.innerHTML = '<option value="">所有员工</option>';
        }
        if (pointsEmployeeFilter) {
            pointsEmployeeFilter.innerHTML = '<option value="">所有员工</option>';
        }

        employees.forEach(emp => {
            // 分配任务的下拉框
            if (assigneeSelect) {
                const option1 = document.createElement('option');
                option1.value = emp.id;
                option1.textContent = emp.name;
                assigneeSelect.appendChild(option1);
            }

            // 任务列表筛选的下拉框
            if (filterSelect) {
                const option2 = document.createElement('option');
                option2.value = emp.id;
                option2.textContent = emp.name;
                filterSelect.appendChild(option2);
            }

            // 统计模块员工筛选的下拉框
            if (statsEmployeeFilter) {
                const option3 = document.createElement('option');
                option3.value = emp.id;
                option3.textContent = emp.name;
                statsEmployeeFilter.appendChild(option3);
            }

            // 积分统计模块员工筛选的下拉框
            if (pointsEmployeeFilter) {
                const option4 = document.createElement('option');
                option4.value = emp.id;
                option4.textContent = emp.name;
                pointsEmployeeFilter.appendChild(option4);
            }
        });
    },

    // 渲染员工任务卡片（员工总览模块）
    renderEmployeeCards() {
        const container = document.getElementById('employees-container');
        const employees = DataManager.getEmployees();
        const tasks = DataManager.getTasks();

        // 检查容器是否存在
        if (!container) {
            return;
        }

        container.innerHTML = ''; // 清空容器

        employees.forEach(emp => {
            // 筛选该员工的任务
            const empTasks = tasks.filter(task => task.assignee === emp.id);
            const doing = empTasks.filter(t => t.status === 'doing').length;
            const done = empTasks.filter(t => t.status === 'done').length;
            const pending = empTasks.filter(t => t.status === 'pending').length;
            const totalTasks = empTasks.length;

            // 确定工作进度条的颜色
            let progressColor = '#10b981'; // 绿色 - 无任务
            let progressText = '工作负荷：空闲';
            
            if (totalTasks === 1) {
                progressColor = '#f59e0b'; // 橙色 - 1个任务
                progressText = '工作负荷：正常';
            } else if (totalTasks >= 3) {
                progressColor = '#ef4444'; // 红色 - 3个或更多任务
                progressText = '工作负荷：繁忙';
            } else if (totalTasks === 2) {
                progressColor = '#f59e0b'; // 橙色 - 2个任务也显示橙色
                progressText = '工作负荷：正常';
            }

            // 计算进度百分比（最大显示100%）
            const progressPercentage = Math.min((totalTasks / 5) * 100, 100); // 假设5个任务为100%负荷

            // 创建员工卡片
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div class="employee-header">
                    <div class="employee-name">${emp.name}</div>
                    <div class="task-stats">
                        <div class="stat-item stat-doing">进行中: ${doing}</div>
                        <div class="stat-item stat-done">已完成: ${done}</div>
                        <div class="stat-item stat-pending">待接收: ${pending}</div>
                    </div>
                </div>
                
                <!-- 工作进度条 -->
                <div class="work-progress-section">
                    <div class="progress-header">
                        <span class="progress-text">${progressText}</span>
                        <span class="progress-count">任务数: ${totalTasks}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%; background-color: ${progressColor};"></div>
                    </div>
                </div>

                <div class="task-details">
                    <div class="task-section-title">进行中任务</div>
                    ${this.renderTaskItems(empTasks.filter(t => t.status === 'doing'))}
                </div>
            `;
            
            // 添加点击事件，显示员工任务详情
            card.addEventListener('click', () => {
                this.showEmployeeTaskDetails(emp, empTasks);
            });
            
            container.appendChild(card);
        });
    },

    // 渲染任务项（通用）
    renderTaskItems(tasks) {
        if (tasks.length === 0) return '<div style="text-align:center; padding:10px;">无任务</div>';
        
        return tasks.map(task => {
            const emp = DataManager.getEmployees().find(e => e.id === task.assignee);
            return `
                <div class="task-item ${task.status}">
                    <div class="task-name">${task.name}</div>
                    <div class="task-time">
                        <span>开始: ${this.formatTime(task.startTime)}</span>
                        <span>结束: ${this.formatTime(task.endTime)}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    // 渲染任务列表表格
    renderTaskTable() {
        const tbody = document.getElementById('task-table-body');
        const tasks = DataManager.getTasks();
        
        // 检查表格是否存在
        if (!tbody) {
            return;
        }
        
        tbody.innerHTML = '';
        tasks.forEach(task => {
            const emp = DataManager.getEmployees().find(e => e.id === task.assignee);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td>${task.content || ''}</td>
                <td>${task.points || 0}分</td>
                <td>${emp ? emp.name : '未知'}</td>
                <td>${this.formatTime(task.startTime)}</td>
                <td>${this.formatTime(task.endTime)}</td>
                <td><span class="status-tag status-${task.status}">${this.getStatusText(task.status)}</span></td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">编辑</button>
                    <button class="btn btn-warning btn-sm revoke-task" data-id="${task.id}">撤回</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // 工具函数：格式化时间
    formatTime(timeStr) {
        const date = new Date(timeStr);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    },

    // 工具函数：状态文本转换
    getStatusText(status) {
        const map = { doing: '进行中', done: '已完成', pending: '待接收' };
        return map[status] || status;
    },

    // 渲染员工管理表格
    renderEmployeeTable() {
        const tbody = document.getElementById('employee-table-body');
        const employees = DataManager.getEmployees();
        
        // 检查表格是否存在
        if (!tbody) {
            return;
        }
        
        tbody.innerHTML = '';
        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.phone}</td>
                <td>${emp.role}</td>
                <td>${emp.department}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-employee" data-id="${emp.id}">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    // 显示员工任务详情
    showEmployeeTaskDetails(employee, tasks) {
        const modal = document.getElementById('employee-tasks-modal');
        const title = document.getElementById('employee-tasks-title');
        const content = document.getElementById('employee-tasks-content');
        
        // 设置标题
        title.textContent = `${employee.name} - 任务详情`;
        
        // 按状态分组任务
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        const doingTasks = tasks.filter(t => t.status === 'doing');
        const doneTasks = tasks.filter(t => t.status === 'done');
        
        // 生成内容
        content.innerHTML = `
            <div class="employee-info-section">
                <h4>员工信息</h4>
                <div class="employee-info-grid">
                    <div class="info-item">
                        <span class="info-label">员工ID：</span>
                        <span class="info-value">${employee.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">姓名：</span>
                        <span class="info-value">${employee.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">电话：</span>
                        <span class="info-value">${employee.phone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">角色：</span>
                        <span class="info-value">${employee.role}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">部门：</span>
                        <span class="info-value">${employee.department}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">总任务数：</span>
                        <span class="info-value">${tasks.length}</span>
                    </div>
                </div>
            </div>

            <div class="tasks-section">
                <h4>待接收任务 (${pendingTasks.length})</h4>
                ${this.renderDetailedTaskItems(pendingTasks)}
            </div>

            <div class="tasks-section">
                <h4>进行中任务 (${doingTasks.length})</h4>
                ${this.renderDetailedTaskItems(doingTasks)}
            </div>

            <div class="tasks-section">
                <h4>已完成任务 (${doneTasks.length})</h4>
                ${this.renderDetailedTaskItems(doneTasks)}
            </div>
        `;
        
        // 显示模态框
        modal.classList.add('active');
    },

    // 渲染详细的任务项（用于模态框）
    renderDetailedTaskItems(tasks) {
        if (tasks.length === 0) {
            return '<div class="no-tasks-message">暂无任务</div>';
        }
        
        return tasks.map(task => `
            <div class="detailed-task-item">
                <div class="task-header">
                    <div class="task-name">${task.name}</div>
                    <div class="task-status-badge status-${task.status}">${this.getStatusText(task.status)}</div>
                </div>
                <div class="task-content">${task.content || ''}</div>
                <div class="task-details-grid">
                    <div class="task-detail-item">
                        <span class="detail-label">任务积分：</span>
                        <span class="detail-value">${task.points || 0}分</span>
                    </div>
                    <div class="task-detail-item">
                        <span class="detail-label">开始时间：</span>
                        <span class="detail-value">${this.formatTime(task.startTime)}</span>
                    </div>
                    <div class="task-detail-item">
                        <span class="detail-label">结束时间：</span>
                        <span class="detail-value">${this.formatTime(task.endTime)}</span>
                    </div>
                    <div class="task-detail-item">
                        <span class="detail-label">优先级：</span>
                        <span class="detail-value priority-${task.priority}">${task.priority}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    // 渲染任务选项（用于任务提交）
    renderTaskOptions(tasks) {
        if (tasks.length === 0) {
            return '<option value="">暂无可提交任务</option>';
        }
        
        return tasks.map(task => `
            <option value="${task.id}">${task.name} (${task.points}分)</option>
        `).join('');
    },

    // 绑定任务提交事件
    bindTaskSubmissionEvents(employee) {
        const taskSelect = document.getElementById('task-select');
        const fileInput = document.getElementById('task-attachment');
        const submitBtn = document.getElementById('submit-task-btn');
        const resetBtn = document.getElementById('reset-submission-btn');
        const uploadedFiles = document.getElementById('uploaded-files');
        
        let uploadedFileList = [];
        
        // 文件上传处理
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            uploadedFileList = [...uploadedFileList, ...files];
            this.renderUploadedFiles(uploadedFileList, uploadedFiles);
        });
        
        // 提交任务
        submitBtn.addEventListener('click', () => {
            const taskId = taskSelect.value;
            const completionNote = document.getElementById('task-completion-note').value;
            
            if (!taskId) {
                this.showToast('请选择要提交的任务！', 'error');
                return;
            }
            
            if (!completionNote.trim()) {
                this.showToast('请输入完成说明！', 'error');
                return;
            }
            
            // 模拟文件上传（实际项目中应该上传到服务器）
            this.simulateFileUpload(uploadedFileList).then(fileUrls => {
                this.completeTask(taskId, completionNote, fileUrls, employee);
            });
        });
        
        // 重置表单
        resetBtn.addEventListener('click', () => {
            taskSelect.value = '';
            document.getElementById('task-completion-note').value = '';
            fileInput.value = '';
            uploadedFileList = [];
            uploadedFiles.innerHTML = '';
        });
    },

    // 渲染已上传文件列表
    renderUploadedFiles(files, container) {
        if (files.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = `
            <div class="uploaded-files-header">已上传文件 (${files.length}个)</div>
            ${files.map((file, index) => `
                <div class="uploaded-file-item">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                    <button class="btn-remove-file" data-index="${index}">删除</button>
                </div>
            `).join('')}
        `;
        
        // 绑定删除文件事件
        container.querySelectorAll('.btn-remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                files.splice(index, 1);
                this.renderUploadedFiles(files, container);
            });
        });
    },

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // 模拟文件上传
    simulateFileUpload(files) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 模拟上传成功，返回文件URL列表
                const fileUrls = files.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: `uploads/${Date.now()}_${file.name}`
                }));
                resolve(fileUrls);
            }, 1000);
        });
    },

    // 完成任务
    completeTask(taskId, completionNote, fileUrls, employee) {
        const tasks = DataManager.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) {
            this.showToast('任务不存在！', 'error');
            return;
        }
        
        // 更新任务状态
        tasks[taskIndex].status = 'done';
        tasks[taskIndex].completionNote = completionNote;
        tasks[taskIndex].attachments = fileUrls;
        tasks[taskIndex].completedAt = new Date().toISOString();
        
        // 保存到本地存储
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // 显示成功消息
        this.showToast('任务提交成功！', 'success');
        
        // 重新显示员工任务详情
        const updatedTasks = tasks.filter(t => t.assignee === employee.id);
        this.showEmployeeTaskDetails(employee, updatedTasks);
        
        // 重新渲染其他相关组件
        Renderer.renderEmployeeCards();
        Renderer.renderTaskTable();
    }
};

// 事件处理模块
const EventHandler = {
    init() {
        this.bindSidebarSwitch(); // 绑定侧边栏切换事件
        this.bindTaskFormSubmit(); // 绑定任务提交事件
        this.bindModalEvents(); // 绑定模态框事件
        this.bindAccountFormSubmit(); // 绑定账号管理表单事件
        this.bindEmployeeDeleteEvents(); // 绑定员工删除事件
    },

    // 侧边栏模块切换
    bindSidebarSwitch() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                // 切换激活状态
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // 切换显示模块
                const targetId = item.getAttribute('data-target');
                document.querySelectorAll('.page-module').forEach(module => {
                    module.classList.remove('active');
                });
                document.getElementById(targetId).classList.add('active');
            });
        });
    },

    // 任务表单提交
    bindTaskFormSubmit() {
        const form = document.getElementById('task-form');
        
        // 检查表单是否存在
        if (!form) {
            return;
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // 获取表单数据
            const task = {
                id: 't' + Date.now(), // 简单生成唯一ID
                name: document.getElementById('task-name').value,
                content: document.getElementById('task-content').value,
                points: document.getElementById('task-points').value,
                assignee: document.getElementById('task-assignee').value,
                startTime: document.getElementById('task-start-time').value,
                endTime: document.getElementById('task-end-time').value,
                status: document.getElementById('task-status').value,
                priority: document.getElementById('task-priority').value
            };

            // 保存到本地存储
            const tasks = DataManager.getTasks();
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));

            // 重新渲染并提示
            Renderer.renderEmployeeCards();
            Renderer.renderTaskTable();
            form.reset();
            this.showToast('任务分配成功！');
        });
    },

    // 模态框相关事件
    bindModalEvents() {
        // 安全地绑定事件，检查元素是否存在
        const closeTaskModal = document.getElementById('close-task-modal');
        const closeTaskBtn = document.getElementById('close-task-btn');
        const closeEmployeeTasksModal = document.getElementById('close-employee-tasks-modal');
        const closeEmployeeTasksBtn = document.getElementById('close-employee-tasks-btn');
        const employeeTasksModal = document.getElementById('employee-tasks-modal');
        const taskModal = document.getElementById('task-modal');

        // 关闭任务编辑模态框
        if (closeTaskModal && taskModal) {
            closeTaskModal.addEventListener('click', () => {
                taskModal.classList.remove('active');
            });
        }
        if (closeTaskBtn && taskModal) {
            closeTaskBtn.addEventListener('click', () => {
                taskModal.classList.remove('active');
            });
        }

        // 关闭员工任务详情模态框
        if (closeEmployeeTasksModal && employeeTasksModal) {
            closeEmployeeTasksModal.addEventListener('click', () => {
                employeeTasksModal.classList.remove('active');
            });
        }
        if (closeEmployeeTasksBtn && employeeTasksModal) {
            closeEmployeeTasksBtn.addEventListener('click', () => {
                employeeTasksModal.classList.remove('active');
            });
        }

        // 点击模态框背景关闭
        if (employeeTasksModal) {
            employeeTasksModal.addEventListener('click', (e) => {
                if (e.target.id === 'employee-tasks-modal') {
                    employeeTasksModal.classList.remove('active');
                }
            });
        }
    },

    // 显示任务编辑模态框
    showTaskEditModal(task) {
        const modal = document.getElementById('task-modal');
        const modalBody = modal.querySelector('.modal-body');
        const employees = DataManager.getEmployees();
        
        // 生成员工选项
        const employeeOptions = employees.map(emp => 
            `<option value="${emp.id}" ${emp.id === task.assignee ? 'selected' : ''}>${emp.name}</option>`
        ).join('');
        
        // 生成编辑表单
        modalBody.innerHTML = `
            <form id="edit-task-form" class="task-form">
                <div class="form-group">
                    <label for="edit-task-name">任务名称</label>
                    <input type="text" id="edit-task-name" class="form-input" value="${task.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-task-content">任务内容</label>
                    <textarea id="edit-task-content" class="form-textarea" rows="3" required>${task.content || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="edit-task-points">任务积分</label>
                    <input type="number" id="edit-task-points" class="form-input" value="${task.points || 0}" min="0" required>
                </div>
                <div class="form-group">
                    <label for="edit-task-assignee">负责人</label>
                    <select id="edit-task-assignee" class="form-select" required>
                        ${employeeOptions}
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-task-start-time">开始时间</label>
                        <input type="datetime-local" id="edit-task-start-time" class="form-input" value="${task.startTime}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-task-end-time">结束时间</label>
                        <input type="datetime-local" id="edit-task-end-time" class="form-input" value="${task.endTime}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="edit-task-status">状态</label>
                        <select id="edit-task-status" class="form-select" required>
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>待接收</option>
                            <option value="doing" ${task.status === 'doing' ? 'selected' : ''}>进行中</option>
                            <option value="done" ${task.status === 'done' ? 'selected' : ''}>已完成</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-task-priority">优先级</label>
                        <select id="edit-task-priority" class="form-select" required>
                            <option value="低" ${task.priority === '低' ? 'selected' : ''}>低</option>
                            <option value="中" ${task.priority === '中' ? 'selected' : ''}>中</option>
                            <option value="高" ${task.priority === '高' ? 'selected' : ''}>高</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">保存修改</button>
                    <button type="button" id="cancel-edit-btn" class="btn btn-secondary">取消</button>
                </div>
            </form>
        `;
        
        // 绑定表单提交事件
        document.getElementById('edit-task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskEdit(task.id);
        });
        
        // 绑定取消按钮事件
        document.getElementById('cancel-edit-btn').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        
        // 显示模态框
        modal.classList.add('active');
    },
    
    // 处理任务编辑提交
    handleTaskEdit(taskId) {
        // 获取表单数据
        const updatedTask = {
            id: taskId,
            name: document.getElementById('edit-task-name').value,
            content: document.getElementById('edit-task-content').value,
            points: document.getElementById('edit-task-points').value,
            assignee: document.getElementById('edit-task-assignee').value,
            startTime: document.getElementById('edit-task-start-time').value,
            endTime: document.getElementById('edit-task-end-time').value,
            status: document.getElementById('edit-task-status').value,
            priority: document.getElementById('edit-task-priority').value
        };
        
        // 更新任务数据
        const tasks = DataManager.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex] = updatedTask;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // 关闭模态框并重新渲染
            document.getElementById('task-modal').classList.remove('active');
            Renderer.renderTaskTable();
            this.showToast('任务修改成功！');
        }
    },
    
    // 显示提示消息
    showToast(message) {
        const toast = document.getElementById('toast-notification');
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2000);
    },

    // 账号管理表单提交
    bindAccountFormSubmit() {
        const form = document.getElementById('account-form');
        
        // 检查表单是否存在
        if (!form) {
            return;
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 检查员工ID是否已存在
            const employees = DataManager.getEmployees();
            const newId = document.getElementById('account-id').value;
            if (employees.find(emp => emp.id === newId)) {
                this.showToast('员工ID已存在！');
                return;
            }

            // 获取表单数据
            const employee = {
                id: newId,
                name: document.getElementById('account-name').value,
                role: document.getElementById('account-role').value,
                phone: document.getElementById('account-phone').value,
                department: document.getElementById('account-department').value
            };

            // 保存到本地存储
            DataManager.addEmployee(employee);

            // 重新渲染并提示
            Renderer.renderEmployeeOptions();
            Renderer.renderEmployeeCards();
            Renderer.renderEmployeeTable();
            form.reset();
            this.showToast('员工添加成功！');
        });
    },

    // 绑定员工删除事件
    bindEmployeeDeleteEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-employee')) {
                const employeeId = e.target.getAttribute('data-id');
                const employee = DataManager.getEmployees().find(emp => emp.id === employeeId);
                
                if (confirm(`确定要删除员工 ${employee.name} 吗？\n注意：这将同时删除该员工的所有任务！`)) {
                    DataManager.deleteEmployee(employeeId);
                    
                    // 重新渲染所有相关组件
                    Renderer.renderEmployeeOptions();
                    Renderer.renderEmployeeCards();
                    Renderer.renderTaskTable();
                    Renderer.renderEmployeeTable();
                    
                    this.showToast('员工删除成功！');
                }
            }
            
            // 绑定任务编辑事件
            if (e.target.classList.contains('edit-task')) {
                const taskId = e.target.getAttribute('data-id');
                const task = DataManager.getTasks().find(t => t.id === taskId);
                
                if (task) {
                    this.showTaskEditModal(task);
                }
            }
            
            // 绑定任务撤回事件
            if (e.target.classList.contains('revoke-task')) {
                const taskId = e.target.getAttribute('data-id');
                const task = DataManager.getTasks().find(t => t.id === taskId);
                
                if (task && task.status === 'pending') {
                    if (confirm(`确定要撤回任务 "${task.name}" 吗？`)) {
                        // 删除任务
                        const tasks = DataManager.getTasks();
                        const updatedTasks = tasks.filter(t => t.id !== taskId);
                        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                        
                        // 重新渲染任务列表
                        Renderer.renderTaskTable();
                        this.showToast('任务撤回成功！');
                    }
                } else {
                    this.showToast('只能撤回待接收状态的任务！');
                }
            }
        });
    }
};

// 统计模块
const Statistics = {
    // 初始化统计功能
    init() {
        this.bindFilterEvents();
        this.updateStatistics();
    },

    // 绑定筛选事件
    bindFilterEvents() {
        const employeeFilter = document.getElementById('stats-employee-filter');
        const timeRangeFilter = document.getElementById('stats-time-range');
        const departmentFilter = document.getElementById('stats-department-filter');

        if (employeeFilter) {
            employeeFilter.addEventListener('change', () => this.updateStatistics());
        }
        if (timeRangeFilter) {
            timeRangeFilter.addEventListener('change', () => this.updateStatistics());
        }
        if (departmentFilter) {
            departmentFilter.addEventListener('change', () => this.updateStatistics());
        }
        
        const pointsRangeFilter = document.getElementById('stats-points-range');
        if (pointsRangeFilter) {
            pointsRangeFilter.addEventListener('change', () => this.updateStatistics());
        }
    },

    // 获取筛选条件
    getFilterCriteria() {
        const employeeFilter = document.getElementById('stats-employee-filter');
        const timeRangeFilter = document.getElementById('stats-time-range');
        const departmentFilter = document.getElementById('stats-department-filter');
        const pointsRangeFilter = document.getElementById('stats-points-range');

        return {
            employeeId: employeeFilter ? employeeFilter.value : 'all',
            timeRange: timeRangeFilter ? timeRangeFilter.value : 'month',
            department: departmentFilter ? departmentFilter.value : 'all',
            pointsRange: pointsRangeFilter ? pointsRangeFilter.value : 'all'
        };
    },

    // 根据时间范围过滤任务
    filterTasksByTimeRange(tasks, timeRange) {
        const now = new Date();
        const startDate = new Date();

        switch (timeRange) {
            case 'day':
                startDate.setDate(now.getDate() - 1);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return tasks;
        }

        return tasks.filter(task => {
            const taskDate = new Date(task.startTime);
            return taskDate >= startDate && taskDate <= now;
        });
    },

    // 根据积分范围过滤任务
    filterTasksByPointsRange(tasks, pointsRange) {
        if (!pointsRange || pointsRange === 'all') {
            return tasks;
        }

        return tasks.filter(task => {
            const taskPoints = parseInt(task.points) || 0;
            
            switch (pointsRange) {
                case '1-5':
                    return taskPoints >= 1 && taskPoints <= 5;
                case '6-10':
                    return taskPoints >= 6 && taskPoints <= 10;
                case '11-20':
                    return taskPoints >= 11 && taskPoints <= 20;
                case '21-50':
                    return taskPoints >= 21 && taskPoints <= 50;
                case '51-100':
                    return taskPoints >= 51 && taskPoints <= 100;
                case '100+':
                    return taskPoints > 100;
                default:
                    return true;
            }
        });
    },

    // 更新统计信息
    updateStatistics() {
        const filters = this.getFilterCriteria();
        const allTasks = DataManager.getTasks();
        const allEmployees = DataManager.getEmployees();

        // 应用筛选条件
        let filteredTasks = allTasks;
        
        // 按员工筛选
        if (filters.employeeId !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.assignee === filters.employeeId);
        }

        // 按部门筛选
        if (filters.department !== 'all') {
            const employeesInDepartment = allEmployees.filter(emp => emp.department === filters.department);
            const employeeIdsInDepartment = employeesInDepartment.map(emp => emp.id);
            filteredTasks = filteredTasks.filter(task => employeeIdsInDepartment.includes(task.assignee));
        }

        // 按时间范围筛选
        filteredTasks = this.filterTasksByTimeRange(filteredTasks, filters.timeRange);

        // 按积分范围筛选
        filteredTasks = this.filterTasksByPointsRange(filteredTasks, filters.pointsRange);

        // 更新概览卡片
        this.updateOverviewCards(filteredTasks);

        // 更新图表
        this.updateCharts(filteredTasks, allEmployees);

        // 更新详细表格
        this.updateDetailedTable(filteredTasks, allEmployees);
    },

    // 更新概览卡片
    updateOverviewCards(tasks) {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'done').length;
        const inProgressTasks = tasks.filter(task => task.status === 'doing').length;
        const pendingTasks = tasks.filter(task => task.status === 'pending').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // 计算积分统计
        const totalPoints = tasks.reduce((sum, task) => sum + (parseInt(task.points) || 0), 0);
        const avgPoints = totalTasks > 0 ? Math.round(totalPoints / totalTasks) : 0;

        const totalEl = document.getElementById('total-tasks');
        const completedEl = document.getElementById('completed-tasks');
        const inProgressEl = document.getElementById('in-progress-tasks');
        const rateEl = document.getElementById('completion-rate');
        const totalPointsEl = document.getElementById('total-points');
        const avgPointsEl = document.getElementById('avg-points');

        if (totalEl) totalEl.textContent = totalTasks;
        if (completedEl) completedEl.textContent = completedTasks;
        if (inProgressEl) inProgressEl.textContent = inProgressTasks;
        if (rateEl) rateEl.textContent = completionRate + '%';
        if (totalPointsEl) totalPointsEl.textContent = totalPoints;
        if (avgPointsEl) avgPointsEl.textContent = avgPoints;
    },

    // 更新图表
    updateCharts(tasks, employees) {
        this.drawTaskStatusChart(tasks);
        this.drawDepartmentChart(tasks, employees);
        this.drawTaskTrendChart(tasks);
    },

    // 绘制任务状态饼图
    drawTaskStatusChart(tasks) {
        const canvas = document.getElementById('task-status-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const completed = tasks.filter(task => task.status === 'done').length;
        const inProgress = tasks.filter(task => task.status === 'doing').length;
        const pending = tasks.filter(task => task.status === 'pending').length;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const total = tasks.length;
        if (total === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', canvas.width / 2, canvas.height / 2);
            return;
        }

        // 简单的饼图实现
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        let currentAngle = -Math.PI / 2;
        const data = [
            { label: '已完成', value: completed, color: '#10b981' },
            { label: '进行中', value: inProgress, color: '#f59e0b' },
            { label: '待接收', value: pending, color: '#6b7280' }
        ];

        data.forEach(item => {
            if (item.value > 0) {
                const sliceAngle = (item.value / total) * 2 * Math.PI;
                
                // 绘制扇形
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = item.color;
                ctx.fill();

                // 绘制标签
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
                const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
                
                ctx.font = '12px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.fillText(`${item.label}: ${item.value}`, labelX, labelY);

                currentAngle += sliceAngle;
            }
        });
    },

    // 绘制部门对比柱状图
    drawDepartmentChart(tasks, employees) {
        const canvas = document.getElementById('department-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // 统计各部门任务数
        const departmentStats = {};
        const departments = ['应急部', '有害部', '网媒部'];
        
        departments.forEach(dept => {
            const employeesInDept = employees.filter(emp => emp.department === dept);
            const employeeIds = employeesInDept.map(emp => emp.id);
            const taskCount = tasks.filter(task => employeeIds.includes(task.assignee)).length;
            departmentStats[dept] = taskCount;
        });

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const maxValue = Math.max(...Object.values(departmentStats));
        if (maxValue === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', canvas.width / 2, canvas.height / 2);
            return;
        }

        // 绘制柱状图
        const barWidth = 60;
        const barSpacing = 40;
        const startX = 50;
        const startY = canvas.height - 50;
        const maxHeight = canvas.height - 100;

        Object.entries(departmentStats).forEach(([dept, count], index) => {
            const barHeight = (count / maxValue) * maxHeight;
            const x = startX + index * (barWidth + barSpacing);
            const y = startY - barHeight;

            // 绘制柱子
            ctx.fillStyle = ['#667eea', '#10b981', '#f59e0b'][index];
            ctx.fillRect(x, y, barWidth, barHeight);

            // 绘制数值
            ctx.font = '14px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.fillText(count.toString(), x + barWidth / 2, y - 10);

            // 绘制部门名称
            ctx.fillText(dept, x + barWidth / 2, startY + 20);
        });
    },

    // 绘制任务趋势曲线图
    drawTaskTrendChart(tasks) {
        const canvas = document.getElementById('task-trend-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // 按日期统计任务数
        const dateStats = {};
        tasks.forEach(task => {
            const date = task.startTime.split('T')[0]; // 获取日期部分
            dateStats[date] = (dateStats[date] || 0) + 1;
        });

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const dates = Object.keys(dateStats).sort();
        if (dates.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', canvas.width / 2, canvas.height / 2);
            return;
        }

        const maxValue = Math.max(...Object.values(dateStats));
        const padding = 50;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // 绘制坐标轴
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        // 绘制曲线
        if (dates.length > 1) {
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.beginPath();

            dates.forEach((date, index) => {
                const x = padding + (index / (dates.length - 1)) * chartWidth;
                const y = canvas.height - padding - (dateStats[date] / maxValue) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                // 绘制数据点
                ctx.fillStyle = '#667eea';
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();

                // 绘制日期标签（每隔几个显示一个）
                if (index % Math.ceil(dates.length / 5) === 0 || index === dates.length - 1) {
                    ctx.font = '10px Arial';
                    ctx.fillStyle = '#666';
                    ctx.textAlign = 'center';
                    ctx.fillText(date, x, canvas.height - padding + 20);
                }
            });

            ctx.stroke();
        }

        // 绘制Y轴标签
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.fillText(value.toString(), padding - 10, y + 4);
        }
    },

    // 更新详细统计表格
    updateDetailedTable(tasks, employees) {
        const tbody = document.querySelector('#detailed-stats-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        // 按员工分组统计工作量
        const employeeWorkload = {};
        tasks.forEach(task => {
            const employee = employees.find(emp => emp.id === task.assignee);
            if (!employee) return;

            if (!employeeWorkload[employee.id]) {
                employeeWorkload[employee.id] = {
                    employee: employee,
                    totalTasks: 0,
                    completedTasks: 0,
                    inProgressTasks: 0,
                    pendingTasks: 0,
                    totalPoints: 0,
                    avgDuration: 0,
                    tasks: []
                };
            }

            const workload = employeeWorkload[employee.id];
            workload.totalTasks++;
            workload.totalPoints += parseInt(task.points) || 0;
            workload.tasks.push(task);

            if (task.status === 'done') {
                workload.completedTasks++;
            } else if (task.status === 'doing') {
                workload.inProgressTasks++;
            } else if (task.status === 'pending') {
                workload.pendingTasks++;
            }
        });

        // 计算平均完成时间
        Object.values(employeeWorkload).forEach(workload => {
            const completedTasks = workload.tasks.filter(task => task.status === 'done' && task.endTime);
            if (completedTasks.length > 0) {
                const totalDuration = completedTasks.reduce((sum, task) => {
                    const startDate = new Date(task.startTime);
                    const endDate = new Date(task.endTime);
                    return sum + (endDate - startDate) / (1000 * 60 * 60 * 24);
                }, 0);
                workload.avgDuration = Math.round(totalDuration / completedTasks.length);
            }
        });

        // 按工作量排序（总任务数降序）
        const sortedWorkload = Object.values(employeeWorkload)
            .sort((a, b) => b.totalTasks - a.totalTasks);

        // 生成表格行
        sortedWorkload.forEach(workload => {
            const employee = workload.employee;
            const completionRate = workload.totalTasks > 0 ? 
                Math.round((workload.completedTasks / workload.totalTasks) * 100) : 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.department}</td>
                <td>${workload.totalTasks}</td>
                <td>${workload.completedTasks}</td>
                <td>${workload.inProgressTasks}</td>
                <td>${workload.pendingTasks}</td>
                <td>${completionRate}%</td>
                <td>${workload.totalPoints}</td>
                <td>${workload.avgDuration || '-'}天</td>
            `;

            tbody.appendChild(row);
        });

        if (sortedWorkload.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: #666;">暂无数据</td></tr>';
        }
    }
};

// 积分统计模块
const PointsStatistics = {
    currentPeriod: 'monthly',
    currentEmployee: '',
    currentDepartment: '',
    
    init() {
        this.bindEvents();
        this.updatePointsStatistics();
    },
    
    bindEvents() {
        document.getElementById('points-employee-filter')?.addEventListener('change', (e) => {
            this.currentEmployee = e.target.value;
            this.updatePointsStatistics();
        });
        
        document.getElementById('points-time-range')?.addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;
            this.updatePointsStatistics();
        });
        
        document.getElementById('points-department-filter')?.addEventListener('change', (e) => {
            this.currentDepartment = e.target.value;
            this.updatePointsStatistics();
        });
    },
    
    updatePointsStatistics() {
        const tasks = DataManager.getTasks();
        const employees = DataManager.getEmployees();
        
        this.updatePointsOverview(tasks, employees);
        this.drawPointsTrendChart(tasks, employees);
        this.drawEmployeePointsChart(tasks, employees);
        this.updateDetailedPointsTable(tasks, employees);
    },
    
    updatePointsOverview(tasks, employees) {
        const periodData = this.getPeriodPointsData(tasks, employees);
        
        // 安全地更新元素，检查元素是否存在
        const totalPointsEl = document.getElementById('total-period-points');
        const topEmployeeEl = document.getElementById('top-employee-points');
        const avgPointsEl = document.getElementById('avg-period-points');
        const activeEmployeesEl = document.getElementById('active-employees-count');
        
        if (totalPointsEl) totalPointsEl.textContent = periodData.totalPoints;
        if (topEmployeeEl) topEmployeeEl.textContent = periodData.topEmployee || '-';
        if (avgPointsEl) avgPointsEl.textContent = Math.round(periodData.avgPoints);
        if (activeEmployeesEl) activeEmployeesEl.textContent = periodData.activeEmployees;
    },
    
    getPeriodPointsData(tasks, employees) {
        let filteredTasks = tasks;
        
        // 应用筛选条件
        if (this.currentEmployee) {
            filteredTasks = filteredTasks.filter(task => task.assignee === this.currentEmployee);
        }
        
        if (this.currentDepartment) {
            const deptEmployees = employees.filter(emp => emp.department === this.currentDepartment);
            const deptEmployeeIds = deptEmployees.map(emp => emp.id);
            filteredTasks = filteredTasks.filter(task => deptEmployeeIds.includes(task.assignee));
        }
        
        // 按周期分组统计
        const periodStats = {};
        const employeeStats = {};
        
        filteredTasks.forEach(task => {
            if (task.status === 'done') {
                const period = this.getTaskPeriod(task.endTime);
                const points = parseInt(task.points) || 0;
                
                // 周期统计
                periodStats[period] = (periodStats[period] || 0) + points;
                
                // 员工统计
                if (!employeeStats[task.assignee]) {
                    const employee = employees.find(emp => emp.id === task.assignee);
                    employeeStats[task.assignee] = {
                        name: employee ? employee.name : '未知员工',
                        points: 0,
                        taskCount: 0
                    };
                }
                employeeStats[task.assignee].points += points;
                employeeStats[task.assignee].taskCount++;
            }
        });
        
        const totalPoints = Object.values(periodStats).reduce((sum, points) => sum + points, 0);
        const employeePoints = Object.values(employeeStats);
        const topEmployee = employeePoints.length > 0 ? 
            employeePoints.sort((a, b) => b.points - a.points)[0].name : '-';
        const avgPoints = employeePoints.length > 0 ? 
            Math.round(totalPoints / employeePoints.length) : 0;
        const activeEmployees = employeePoints.length;
        
        return {
            totalPoints,
            topEmployee,
            avgPoints,
            activeEmployees,
            periodStats,
            employeeStats
        };
    },
    
    getTaskPeriod(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const week = this.getWeekNumber(date);
        const quarter = Math.ceil(month / 3);
        
        switch (this.currentPeriod) {
            case 'daily':
                return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            case 'weekly':
                return `${year}-W${week.toString().padStart(2, '0')}`;
            case 'monthly':
                return `${year}-${month.toString().padStart(2, '0')}`;
            case 'quarterly':
                return `${year}-Q${quarter}`;
            case 'yearly':
                return `${year}`;
            default:
                return `${year}-${month.toString().padStart(2, '0')}`;
        }
    },
    
    getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    },
    
    drawPointsTrendChart(tasks, employees) {
        const canvas = document.getElementById('points-trend-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const periodData = this.getPeriodPointsData(tasks, employees);
        const periodStats = periodData.periodStats;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const periods = Object.keys(periodStats).sort();
        if (periods.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const maxValue = Math.max(...Object.values(periodStats));
        const padding = 50;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        // 绘制坐标轴
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // 绘制曲线
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        periods.forEach((period, index) => {
            const x = padding + (index / (periods.length - 1)) * chartWidth;
            const y = canvas.height - padding - (periodStats[period] / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // 绘制数据点
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // 绘制周期标签
            if (index % Math.ceil(periods.length / 6) === 0 || index === periods.length - 1) {
                ctx.font = '10px Arial';
                ctx.fillStyle = '#666';
                ctx.textAlign = 'center';
                ctx.fillText(period, x, canvas.height - padding + 20);
            }
        });
        
        ctx.stroke();
        
        // 绘制Y轴标签
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const y = canvas.height - padding - (i / 5) * chartHeight;
            ctx.fillText(value.toString(), padding - 10, y + 4);
        }
    },
    
    drawEmployeePointsChart(tasks, employees) {
        const canvas = document.getElementById('employee-points-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const periodData = this.getPeriodPointsData(tasks, employees);
        const employeeStats = periodData.employeeStats;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const employeeData = Object.values(employeeStats)
            .sort((a, b) => b.points - a.points)
            .slice(0, 8); // 显示前8名员工，确保更多员工能显示在图表中
            
        if (employeeData.length === 0) {
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText('暂无数据', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        const maxValue = Math.max(...employeeData.map(emp => emp.points));
        const barWidth = 35; // 减小柱子宽度
        const barSpacing = 15; // 减小柱子间距
        const startX = 40; // 调整起始位置
        const startY = canvas.height - 50;
        const maxHeight = canvas.height - 100;
        
        employeeData.forEach((emp, index) => {
            const barHeight = (emp.points / maxValue) * maxHeight;
            const x = startX + index * (barWidth + barSpacing);
            const y = startY - barHeight;
            
            // 绘制柱子 - 扩展颜色数组以支持更多员工
            const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // 绘制积分数值
            ctx.font = '14px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.fillText(emp.points.toString(), x + barWidth / 2, y - 10);
            
            // 绘制员工姓名 - 调整字体大小以适应更多员工
            ctx.font = '10px Arial';
            ctx.fillText(emp.name, x + barWidth / 2, startY + 15);
        });
    },
    
    updateDetailedPointsTable(tasks, employees) {
        const tbody = document.querySelector('#detailed-points-body');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const periodData = this.getPeriodPointsData(tasks, employees);
        const employeeStats = periodData.employeeStats;
        
        // 按积分排序并添加排名
        const sortedEmployees = Object.values(employeeStats)
            .sort((a, b) => b.points - a.points)
            .map((emp, index) => ({
                ...emp,
                rank: index + 1
            }));
        
        // 生成表格行
        sortedEmployees.forEach(emp => {
            const avgPointsPerTask = emp.taskCount > 0 ? Math.round(emp.points / emp.taskCount) : 0;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.name}</td>
                <td>${this.getEmployeeDepartment(emp.name, employees)}</td>
                <td><strong>${emp.points}</strong></td>
                <td>${emp.taskCount}</td>
                <td>${avgPointsPerTask}</td>
                <td><span class="rank-badge rank-${emp.rank}">${emp.rank}</span></td>
                <td><span class="change-indicator">+0%</span></td>
            `;
            
            tbody.appendChild(row);
        });
        
        if (sortedEmployees.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #666;">暂无数据</td></tr>';
        }
    },
    
    getEmployeeDepartment(employeeName, employees) {
        const employee = employees.find(emp => emp.name === employeeName);
        return employee ? employee.department : '未知部门';
    }
};

// 任务提交模块
const TaskSubmission = {
    init() {
        console.log('TaskSubmission: 开始初始化...');
        this.bindEvents();
        this.loadEmployees();
        console.log('TaskSubmission: 初始化完成');
    },
    
    bindEvents() {
        console.log('TaskSubmission: 开始绑定事件...');
        const employeeSelect = document.getElementById('submission-employee');
        const taskSelect = document.getElementById('submission-task');
        const form = document.getElementById('task-submission-form');
        const fileInput = document.getElementById('submission-attachment');
        
        console.log(`TaskSubmission: 元素状态 - employeeSelect: ${!!employeeSelect}, taskSelect: ${!!taskSelect}, form: ${!!form}, fileInput: ${!!fileInput}`);
        
        if (employeeSelect) {
            employeeSelect.addEventListener('change', () => {
                this.loadEmployeeTasks(employeeSelect.value);
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitTask();
            });
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
    },
    
    loadEmployees() {
        const employeeSelect = document.getElementById('submission-employee');
        console.log('TaskSubmission: loadEmployees 被调用');
        if (!employeeSelect) {
            console.log('TaskSubmission: submission-employee 元素未找到');
            return;
        }
        
        const employees = DataManager.getEmployees();
        console.log(`TaskSubmission: 找到 ${employees.length} 名员工`);
        employeeSelect.innerHTML = '<option value="">请选择员工</option>';
        
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.name} (${employee.department})`;
            employeeSelect.appendChild(option);
        });
        console.log('TaskSubmission: 员工列表已加载完成');
    },
    
    loadEmployeeTasks(employeeId) {
        const taskSelect = document.getElementById('submission-task');
        if (!taskSelect) return;
        
        if (!employeeId) {
            taskSelect.innerHTML = '<option value="">请先选择员工</option>';
            return;
        }
        
        const tasks = DataManager.getTasks().filter(task => 
            task.assignee === employeeId && (task.status === 'doing' || task.status === 'pending')
        );
        
        taskSelect.innerHTML = '<option value="">请选择任务</option>';
        
        if (tasks.length === 0) {
            taskSelect.innerHTML = '<option value="">暂无可提交任务</option>';
            return;
        }
        
        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = `${task.name} (${task.points}分)`;
            taskSelect.appendChild(option);
        });
    },
    
    handleFileUpload(files) {
        const uploadedFilesContainer = document.getElementById('submission-uploaded-files');
        if (!uploadedFilesContainer) return;
        
        uploadedFilesContainer.innerHTML = '';
        
        if (files.length === 0) return;
        
        const header = document.createElement('div');
        header.className = 'uploaded-files-header';
        header.textContent = `已上传文件 (${files.length}个)`;
        uploadedFilesContainer.appendChild(header);
        
        Array.from(files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'uploaded-file-item';
            fileItem.innerHTML = `
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
                <button class="file-remove-btn" data-index="${index}">删除</button>
            `;
            uploadedFilesContainer.appendChild(fileItem);
        });
        
        // 绑定删除按钮事件
        uploadedFilesContainer.querySelectorAll('.file-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeFile(index);
            });
        });
    },
    
    removeFile(index) {
        const fileInput = document.getElementById('submission-attachment');
        const dataTransfer = new DataTransfer();
        const files = Array.from(fileInput.files);
        
        files.forEach((file, i) => {
            if (i !== index) {
                dataTransfer.items.add(file);
            }
        });
        
        fileInput.files = dataTransfer.files;
        this.handleFileUpload(fileInput.files);
    },
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    async submitTask() {
        const employeeSelect = document.getElementById('submission-employee');
        const taskSelect = document.getElementById('submission-task');
        const noteTextarea = document.getElementById('submission-note');
        const fileInput = document.getElementById('submission-attachment');
        
        const employeeId = employeeSelect.value;
        const taskId = taskSelect.value;
        const note = noteTextarea.value.trim();
        const files = fileInput.files;
        
        if (!employeeId) {
            Renderer.showToast('请选择员工！', 'error');
            return;
        }
        
        if (!taskId) {
            Renderer.showToast('请选择任务！', 'error');
            return;
        }
        
        if (!note) {
            Renderer.showToast('请输入完成说明！', 'error');
            return;
        }
        
        try {
            // 模拟文件上传
            const fileUrls = await this.simulateFileUpload(files);
            
            // 更新任务状态
            const tasks = DataManager.getTasks();
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            
            if (taskIndex !== -1) {
                tasks[taskIndex].status = 'done';
                tasks[taskIndex].completionNote = note;
                tasks[taskIndex].attachments = fileUrls;
                tasks[taskIndex].completedAt = new Date().toISOString();
                
                DataManager.saveTasks(tasks);
                
                // 重置表单
                document.getElementById('task-submission-form').reset();
                document.getElementById('submission-uploaded-files').innerHTML = '';
                
                // 刷新任务列表
                this.loadEmployeeTasks(employeeId);
                
                Renderer.showToast('任务提交成功！', 'success');
                
                // 更新统计
                Statistics.updateCharts();
                PointsStatistics.updateCharts();
            }
        } catch (error) {
            Renderer.showToast('任务提交失败：' + error.message, 'error');
        }
    },
    
    async simulateFileUpload(files) {
        // 模拟文件上传过程
        const fileUrls = [];
        
        Array.from(files).forEach(file => {
            // 模拟上传后的文件URL
            const fileUrl = `uploads/${Date.now()}_${file.name}`;
            fileUrls.push({
                name: file.name,
                url: fileUrl,
                size: file.size,
                type: file.type
            });
        });
        
        // 模拟上传延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return fileUrls;
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    DataManager.init(); // 初始化数据
    Renderer.init(); // 渲染页面
    EventHandler.init(); // 绑定事件
    Statistics.init(); // 初始化统计模块
    PointsStatistics.init(); // 初始化积分统计模块
    TaskSubmission.init(); // 初始化任务提交模块
    CustomerDelivery.init(); // 初始化客户交付模块
});

// 客户交付模块
const CustomerDelivery = {
    customers: [],
    currentCustomerId: null,
    
    init() {
        console.log('CustomerDelivery: 初始化客户交付模块');
        this.loadCustomers();
        this.bindEvents();
        this.updateOverview();
        this.renderCustomerTable();
    },
    
    bindEvents() {
        // 新建客户按钮
        const addCustomerBtn = document.getElementById('add-customer-btn');
        if (addCustomerBtn) {
            addCustomerBtn.addEventListener('click', () => this.showCustomerModal());
        }
        
        // 客户表单提交
        const customerForm = document.getElementById('customer-form');
        if (customerForm) {
            customerForm.addEventListener('submit', (e) => this.handleCustomerSubmit(e));
        }
        
        // 取消按钮
        const cancelCustomerBtn = document.getElementById('cancel-customer-btn');
        if (cancelCustomerBtn) {
            cancelCustomerBtn.addEventListener('click', () => this.hideCustomerModal());
        }
        
        // 关闭客户模态框
        const closeCustomerModal = document.getElementById('close-customer-modal');
        if (closeCustomerModal) {
            closeCustomerModal.addEventListener('click', () => this.hideCustomerModal());
        }
        
        // 关闭附件模态框
        const closeAttachmentModal = document.getElementById('close-attachment-modal');
        if (closeAttachmentModal) {
            closeAttachmentModal.addEventListener('click', () => this.hideAttachmentModal());
        }
        
        // 附件上传按钮
        const uploadAttachmentBtn = document.getElementById('upload-attachment-btn');
        if (uploadAttachmentBtn) {
            uploadAttachmentBtn.addEventListener('click', () => this.handleAttachmentUpload());
        }
        
        // 关闭附件按钮
        const closeAttachmentBtn = document.getElementById('close-attachment-btn');
        if (closeAttachmentBtn) {
            closeAttachmentBtn.addEventListener('click', () => this.hideAttachmentModal());
        }
        
        // 筛选器事件
        const provinceFilter = document.getElementById('customer-province-filter');
        if (provinceFilter) {
            provinceFilter.addEventListener('change', () => this.filterCustomers());
        }
        
        const contractStatusFilter = document.getElementById('contract-status-filter');
        if (contractStatusFilter) {
            contractStatusFilter.addEventListener('change', () => this.filterCustomers());
        }
    },
    
    loadCustomers() {
        // 从本地存储加载客户数据
        const savedCustomers = localStorage.getItem('customers');
        if (savedCustomers) {
            this.customers = JSON.parse(savedCustomers);
        } else {
            // 初始化一些示例数据
            this.customers = [
                {
                    id: 'CUST001',
                    name: '北京科技有限公司',
                    province: '北京',
                    contractStartDate: '2024-01-01',
                    contractEndDate: '2024-12-31',
                    contact: '张经理',
                    phone: '13800138000',
                    address: '北京市朝阳区科技园区',
                    remarks: '重要客户，需要重点关注',
                    attachments: [
                        {
                            id: 'ATT001',
                            name: '合同文件.pdf',
                            size: 2048000,
                            uploadTime: '2024-01-15T10:30:00',
                            remark: '正式合同文件'
                        }
                    ]
                },
                {
                    id: 'CUST002',
                    name: '上海创新企业',
                    province: '上海',
                    contractStartDate: '2024-02-01',
                    contractEndDate: '2024-11-30',
                    contact: '李总监',
                    phone: '13900139000',
                    address: '上海市浦东新区金融中心',
                    remarks: '长期合作伙伴',
                    attachments: []
                }
            ];
            this.saveCustomers();
        }
    },
    
    saveCustomers() {
        localStorage.setItem('customers', JSON.stringify(this.customers));
    },
    
    updateOverview() {
        const totalCustomers = this.customers.length;
        const activeContracts = this.customers.filter(c => this.getContractStatus(c) === 'active').length;
        const completedContracts = this.customers.filter(c => this.getContractStatus(c) === 'completed').length;
        const totalAttachments = this.customers.reduce((sum, c) => sum + c.attachments.length, 0);
        
        document.getElementById('total-customers').textContent = totalCustomers;
        document.getElementById('active-contracts').textContent = activeContracts;
        document.getElementById('completed-contracts').textContent = completedContracts;
        document.getElementById('total-attachments').textContent = totalAttachments;
    },
    
    getContractStatus(customer) {
        const today = new Date();
        const startDate = new Date(customer.contractStartDate);
        const endDate = new Date(customer.contractEndDate);
        
        if (today < startDate) return 'pending';
        if (today > endDate) return 'expired';
        return 'active';
    },
    
    getContractStatusText(status) {
        const statusMap = {
            'active': '进行中',
            'completed': '已完成',
            'expired': '已过期',
            'pending': '待开始'
        };
        return statusMap[status] || '未知';
    },
    
    renderCustomerTable(customers = null) {
        const tbody = document.getElementById('customer-delivery-body');
        if (!tbody) return;
        
        const customersToRender = customers || this.customers;
        
        tbody.innerHTML = '';
        
        if (customersToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #6c757d;">暂无客户数据</td></tr>';
            return;
        }
        
        customersToRender.forEach(customer => {
            const status = this.getContractStatus(customer);
            const statusText = this.getContractStatusText(status);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.type || '-'}</td>
                <td>${customer.province}</td>
                <td>${customer.contractStartDate}</td>
                <td>${customer.contractEndDate}</td>
                <td><span class="contract-status ${status}">${statusText}</span></td>
                <td>${customer.attachments.length}个</td>
                <td>
                    <button class="btn-manage-attachments" onclick="CustomerDelivery.showAttachmentModal('${customer.id}')">管理附件</button>
                    <button class="btn-edit-customer" onclick="CustomerDelivery.editCustomer('${customer.id}')">编辑</button>
                    <button class="btn-delete-customer" onclick="CustomerDelivery.deleteCustomer('${customer.id}')">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },
    
    filterCustomers() {
        const typeFilter = document.getElementById('customer-type-filter').value;
        const provinceFilter = document.getElementById('customer-province-filter').value;
        const statusFilter = document.getElementById('contract-status-filter').value;
        
        let filteredCustomers = this.customers;
        
        if (typeFilter) {
            filteredCustomers = filteredCustomers.filter(c => c.type === typeFilter);
        }
        
        if (provinceFilter) {
            filteredCustomers = filteredCustomers.filter(c => c.province === provinceFilter);
        }
        
        if (statusFilter) {
            filteredCustomers = filteredCustomers.filter(c => this.getContractStatus(c) === statusFilter);
        }
        
        this.renderCustomerTable(filteredCustomers);
    },
    
    showCustomerModal(customerId = null) {
        const modal = document.getElementById('customer-modal');
        const title = document.getElementById('customer-modal-title');
        const form = document.getElementById('customer-form');
        
        if (customerId) {
            // 编辑模式
            const customer = this.customers.find(c => c.id === customerId);
            if (!customer) return;
            
            title.textContent = '编辑客户';
            document.getElementById('customer-name').value = customer.name;
                document.getElementById('customer-type').value = customer.type || '';
                document.getElementById('customer-province').value = customer.province;
                document.getElementById('contract-start-date').value = customer.contractStartDate;
                document.getElementById('contract-end-date').value = customer.contractEndDate;
                document.getElementById('customer-contact').value = customer.contact || '';
                document.getElementById('customer-phone').value = customer.phone || '';
                document.getElementById('customer-address').value = customer.address || '';
                document.getElementById('customer-remarks').value = customer.remarks || '';
            
            this.currentCustomerId = customerId;
        } else {
            // 新建模式
            title.textContent = '新建客户';
            form.reset();
            this.currentCustomerId = null;
        }
        
        modal.style.display = 'block';
    },
    
    hideCustomerModal() {
        const modal = document.getElementById('customer-modal');
        modal.style.display = 'none';
        this.currentCustomerId = null;
    },
    
    handleCustomerSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('customer-name').value,
            type: document.getElementById('customer-type').value,
            province: document.getElementById('customer-province').value,
            contractStartDate: document.getElementById('contract-start-date').value,
            contractEndDate: document.getElementById('contract-end-date').value,
            contact: document.getElementById('customer-contact').value,
            phone: document.getElementById('customer-phone').value,
            address: document.getElementById('customer-address').value,
            remarks: document.getElementById('customer-remarks').value
        };
        
        if (this.currentCustomerId) {
            // 编辑现有客户
            const customerIndex = this.customers.findIndex(c => c.id === this.currentCustomerId);
            if (customerIndex !== -1) {
                this.customers[customerIndex] = {
                    ...this.customers[customerIndex],
                    ...formData
                };
            }
        } else {
            // 新建客户
            const newCustomer = {
                id: 'CUST' + String(this.customers.length + 1).padStart(3, '0'),
                ...formData,
                attachments: []
            };
            this.customers.push(newCustomer);
        }
        
        this.saveCustomers();
        this.updateOverview();
        this.renderCustomerTable();
        this.hideCustomerModal();
        
        Renderer.showToast(this.currentCustomerId ? '客户信息更新成功！' : '客户创建成功！', 'success');
    },
    
    editCustomer(customerId) {
        this.showCustomerModal(customerId);
    },
    
    deleteCustomer(customerId) {
        if (confirm('确定要删除该客户吗？此操作不可恢复。')) {
            this.customers = this.customers.filter(c => c.id !== customerId);
            this.saveCustomers();
            this.updateOverview();
            this.renderCustomerTable();
            Renderer.showToast('客户删除成功！', 'success');
        }
    },
    
    deleteCustomer(customerId) {
        if (confirm('确定要删除该客户吗？此操作不可恢复。')) {
            this.customers = this.customers.filter(c => c.id !== customerId);
            this.saveCustomers();
            this.updateOverview();
            this.renderCustomerTable();
            Renderer.showToast('客户删除成功！', 'success');
        }
    },
    
    showAttachmentModal(customerId) {
        this.currentCustomerId = customerId;
        const modal = document.getElementById('attachment-modal');
        const title = document.getElementById('attachment-modal-title');
        const customer = this.customers.find(c => c.id === customerId);
        
        if (customer) {
            title.textContent = `附件管理 - ${customer.name}`;
            this.renderAttachmentList(customer);
            modal.style.display = 'block';
        }
    },
    
    editCustomer(customerId) {
        this.showCustomerModal(customerId);
    },
    
    hideAttachmentModal() {
        const modal = document.getElementById('attachment-modal');
        modal.style.display = 'none';
        this.currentCustomerId = null;
        
        // 清空附件上传表单
        document.getElementById('attachment-file').value = '';
        document.getElementById('attachment-remark').value = '';
        document.getElementById('attachment-upload-time-start').value = '';
        document.getElementById('attachment-upload-time-end').value = '';
    },
    
    renderAttachmentList(customer) {
        const container = document.getElementById('attachment-list-content');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (customer.attachments.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #6c757d;">暂无附件</div>';
            return;
        }
        
        customer.attachments.forEach(attachment => {
            const item = document.createElement('div');
            item.className = 'attachment-item';
            item.innerHTML = `
                <div class="attachment-info">
                    <div class="attachment-name">${attachment.name}</div>
                    <div class="attachment-meta">
                        大小: ${this.formatFileSize(attachment.size)} | 
                        上传时间: ${new Date(attachment.uploadTime).toLocaleString()} |
                        备注: ${attachment.remark || '无'}
                    </div>
                </div>
                <div class="attachment-actions">
                    <button class="btn-download-attachment" onclick="CustomerDelivery.downloadAttachment('${customer.id}', '${attachment.id}')">下载</button>
                    <button class="btn-delete-attachment" onclick="CustomerDelivery.deleteAttachment('${customer.id}', '${attachment.id}')">删除</button>
                </div>
            `;
            container.appendChild(item);
        });
    },
    
    handleAttachmentUpload() {
        const fileInput = document.getElementById('attachment-file');
        const remark = document.getElementById('attachment-remark').value;
        const uploadTimeStart = document.getElementById('attachment-upload-time-start').value;
        const uploadTimeEnd = document.getElementById('attachment-upload-time-end').value;
        
        if (fileInput.files.length === 0) {
            Renderer.showToast('请选择要上传的文件！', 'error');
            return;
        }
        
        const customer = this.customers.find(c => c.id === this.currentCustomerId);
        if (!customer) return;
        
        // 模拟文件上传
        Array.from(fileInput.files).forEach(file => {
            const attachment = {
                id: 'ATT' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                uploadTime: new Date().toISOString(),
                remark: remark || '无备注',
                uploadTimeStart: uploadTimeStart || null,
                uploadTimeEnd: uploadTimeEnd || null
            };
            
            customer.attachments.push(attachment);
        });
        
        this.saveCustomers();
        this.updateOverview();
        this.renderAttachmentList(customer);
        this.renderCustomerTable();
        
        // 清空上传表单
        fileInput.value = '';
        document.getElementById('attachment-remark').value = '';
        document.getElementById('attachment-upload-time-start').value = '';
        document.getElementById('attachment-upload-time-end').value = '';
        
        Renderer.showToast('附件上传成功！', 'success');
    },
    
    downloadAttachment(customerId, attachmentId) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) return;
        
        const attachment = customer.attachments.find(a => a.id === attachmentId);
        if (!attachment) return;
        
        // 模拟下载
        const link = document.createElement('a');
        link.href = '#';
        link.download = attachment.name;
        link.click();
        
        Renderer.showToast('开始下载附件...', 'info');
    },
    
    deleteAttachment(customerId, attachmentId) {
        if (confirm('确定要删除该附件吗？')) {
            const customer = this.customers.find(c => c.id === customerId);
            if (!customer) return;
            
            customer.attachments = customer.attachments.filter(a => a.id !== attachmentId);
            this.saveCustomers();
            this.updateOverview();
            this.renderAttachmentList(customer);
            this.renderCustomerTable();
            
            Renderer.showToast('附件删除成功！', 'success');
        }
    },
    
    editCustomer(customerId) {
        this.showCustomerModal(customerId);
    },
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};
