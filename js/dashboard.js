// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../index.html';
        return;
    }

    // Set user info
    setUserInfo(currentUser);

    // Initialize mobile menu
    initMobileMenu();

    // Initialize modals
    initModals();

    // Initialize charts if needed
    if (typeof initCharts === 'function') {
        initCharts();
    }
});

function setUserInfo(user) {
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    const userEmailElement = document.querySelector('.user-email');

    if (userNameElement) {
        userNameElement.textContent = getUserDisplayName(user.email);
    }
    if (userRoleElement) {
        userRoleElement.textContent = capitalizeFirstLetter(user.role);
    }
    if (userEmailElement) {
        userEmailElement.textContent = user.email;
    }
}

function getUserDisplayName(email) {
    return email.split('@')[0]
        .split('.')
        .map(capitalizeFirstLetter)
        .join(' ');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

function initModals() {
    // Open modal
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
            
            // Initialize schedule if it's the schedule modal
            if (modal && modal.id === 'scheduleModal') {
                updateWeekDisplay();
                loadWeekSchedule();
            }
        });
    });

    // Close modal
    document.querySelectorAll('[data-close-modal]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateTime(date) {
    return `${formatDate(date)} ${formatTime(date)}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Table sorting
function sortTable(table, column, type = 'string') {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = table.dataset.sortOrder === 'asc';

    rows.sort((a, b) => {
        let aValue = a.cells[column].textContent;
        let bValue = b.cells[column].textContent;

        if (type === 'number') {
            aValue = parseFloat(aValue);
            bValue = parseFloat(bValue);
        } else if (type === 'date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (aValue < bValue) return isAscending ? -1 : 1;
        if (aValue > bValue) return isAscending ? 1 : -1;
        return 0;
    });

    // Update sort order for next click
    table.dataset.sortOrder = isAscending ? 'desc' : 'asc';

    // Clear table
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Add sorted rows
    tbody.append(...rows);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'Trường này là bắt buộc');
            isValid = false;
        } else if (input.type === 'email' && input.value) {
            if (!input.value.endsWith('@vlu.edu.vn')) {
                markInvalid(input, 'Email phải thuộc domain @vlu.edu.vn');
                isValid = false;
            }
        }
    });

    return isValid;
}

function markInvalid(input, message) {
    input.classList.add('invalid');
    
    // Create or update error message
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    errorDiv.textContent = message;

    // Remove error on input change
    input.addEventListener('input', function() {
        this.classList.remove('invalid');
        errorDiv.remove();
    }, { once: true });
}

// Notification Function
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Tutor Registration Functions
function addCertificate() {
    const certificatesList = document.getElementById('certificatesList');
    const newCertificate = document.createElement('div');
    newCertificate.className = 'certificate-item';
    newCertificate.innerHTML = `
        <input type="text" class="form-control" placeholder="Tên chứng chỉ">
        <input type="date" class="form-control" placeholder="Ngày cấp">
        <button type="button" class="btn btn-danger btn-sm" onclick="removeCertificate(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    certificatesList.appendChild(newCertificate);
}

function removeCertificate(button) {
    button.closest('.certificate-item').remove();
}

function submitTutorRegistration() {
    const form = document.getElementById('tutorRegistrationForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const formData = {
        gpa: form.querySelector('input[type="number"]').value,
        subjects: Array.from(form.querySelector('select[multiple]').selectedOptions).map(opt => opt.value),
        experience: form.querySelector('textarea[placeholder*="kinh nghiệm"]').value,
        certificates: Array.from(form.querySelectorAll('.certificate-item')).map(item => ({
            name: item.querySelector('input[type="text"]').value,
            date: item.querySelector('input[type="date"]').value
        })),
        awards: form.querySelector('textarea[placeholder*="giải thưởng"]').value,
        schedule: Array.from(form.querySelectorAll('input[name="schedule"]:checked')).map(input => input.value),
        introduction: form.querySelector('textarea[placeholder*="Giới thiệu"]').value,
        hourlyRate: form.querySelector('input[type="number"][min="50000"]').value
    };

    // TODO: Add API call to submit tutor registration
    console.log('Submitting tutor registration:', formData);
    
    // Show success message
    showNotification('success', 'Đăng ký làm Tutor thành công! Chúng tôi sẽ xem xét hồ sơ của bạn.');
    
    // Close modal
    const modal = document.getElementById('tutorRegistrationModal');
    closeModal(modal);
}

// Class Search Functions
function searchClasses() {
    // Show search results
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'block';
    }
    
    // Show notification
    showNotification('success', 'Đã tìm thấy 8 lớp học phù hợp!');
}

function registerClass(classId) {
    // Show confirmation dialog
    if (confirm('Bạn có chắc chắn muốn đăng ký lớp học này?')) {
        // Simulate registration process
        showNotification('success', 'Đăng ký lớp học thành công! Vui lòng kiểm tra email để xác nhận.');
        
        // Update button state
        const button = event.target.closest('button');
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> Đã đăng ký';
            button.className = 'btn btn-success btn-sm';
            button.disabled = true;
        }
    }
}

function bookClass(classId) {
    if (confirm('Bạn có chắc chắn muốn đăng ký lớp học này?')) {
        // TODO: Add API call to book class
        showNotification('success', 'Đăng ký lớp học thành công!');
        
        // Close modal after booking
        const modal = document.getElementById('findClassModal');
        modal.classList.remove('active');
    }
}

// Rating Functions
function openRatingForm(classId) {
    const modal = document.getElementById('ratingFormModal');
    document.getElementById('classId').value = classId;
    
    // Reset form
    const form = document.getElementById('ratingForm');
    form.reset();
    resetStars();
    
    // Open modal
    openModal(modal);
}

function resetStars() {
    // Reset main rating
    document.querySelectorAll('.rating-input .fa-star').forEach(star => {
        star.className = 'far fa-star';
    });
    
    // Reset category ratings
    document.querySelectorAll('.rating-categories .fa-star').forEach(star => {
        star.className = 'far fa-star';
    });
}

function initRatingStars() {
    // Initialize main rating stars
    const ratingStars = document.querySelectorAll('.rating-input .fa-star');
    ratingStars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = this.dataset.rating;
            highlightStars(ratingStars, rating);
        });
        
        star.addEventListener('click', function() {
            const rating = this.dataset.rating;
            setRating(ratingStars, rating);
        });
    });

    // Initialize category rating stars
    document.querySelectorAll('.rating-categories .rating-category').forEach(category => {
        const stars = category.querySelectorAll('.fa-star');
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                highlightStars(stars, rating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                setRating(stars, rating);
            });
        });

        // Reset on mouse leave
        category.addEventListener('mouseleave', () => {
            const selectedRating = Array.from(stars).find(s => s.classList.contains('fas'))?.dataset.rating || 0;
            highlightStars(stars, selectedRating);
        });
    });

    // Reset main rating on mouse leave
    document.querySelector('.rating-input').addEventListener('mouseleave', () => {
        const selectedRating = Array.from(ratingStars).find(s => s.classList.contains('fas'))?.dataset.rating || 0;
        highlightStars(ratingStars, selectedRating);
    });
}

function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.className = starRating <= rating ? 'fas fa-star' : 'far fa-star';
    });
}

function setRating(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.dataset.rating);
        star.className = starRating <= rating ? 'fas fa-star' : 'far fa-star';
    });
}

function submitRating() {
    const form = document.getElementById('ratingForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const classId = document.getElementById('classId').value;
    const overallRating = document.querySelectorAll('.rating-input .fas').length;
    const comment = form.querySelector('textarea').value;
    
    // Get category ratings
    const categoryRatings = {
        knowledge: document.querySelectorAll('[data-category="knowledge"].fas').length,
        teaching: document.querySelectorAll('[data-category="teaching"].fas').length,
        attitude: document.querySelectorAll('[data-category="attitude"].fas').length
    };

    // Validate ratings
    if (overallRating === 0) {
        showNotification('error', 'Vui lòng chọn số sao đánh giá');
        return;
    }

    if (Object.values(categoryRatings).some(rating => rating === 0)) {
        showNotification('error', 'Vui lòng đánh giá đầy đủ các tiêu chí');
        return;
    }

    // TODO: Add API call to submit rating
    console.log('Submitting rating:', {
        classId,
        overallRating,
        categoryRatings,
        comment
    });

    // Show success message
    showNotification('success', 'Cảm ơn bạn đã đánh giá!');

    // Close modal
    closeModal(document.getElementById('ratingFormModal'));

    // Refresh ratings list
    // TODO: Add API call to refresh ratings
}

// Initialize rating stars when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    initRatingStars();
    initProgressChart();
});

function initProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            datasets: [{
                label: 'GPA',
                data: [3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 3.7, 3.8, 3.9, 3.8, 3.9, 4.0],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 2.0,
                    max: 4.0,
                    ticks: {
                        stepSize: 0.5,
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Export functions for use in HTML
window.dashboard = {
    logout,
    validateForm,
    openModal,
    closeModal,
    showNotification,
    searchClasses,
    bookClass,
    addCertificate,
    removeCertificate,
    submitTutorRegistration,
    openRatingForm,
    submitRating
};

// Profile Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize modal triggers
document.addEventListener('DOMContentLoaded', function() {
    // Modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal-target').replace('#', '');
            openModal(modalId);
        });
    });

    // Modal close buttons
    const closeButtons = document.querySelectorAll('[data-close-modal]');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});

// Profile Functions
function updateProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // TODO: Add API call to update profile
    showNotification('success', 'Cập nhật hồ sơ thành công!');
    closeModal('profileModal');
}

// Avatar Preview
document.addEventListener('DOMContentLoaded', function() {
    const avatarInput = document.querySelector('.avatar-upload input[type="file"]');
    const avatarPreview = document.querySelector('.avatar-preview');

    if (avatarInput && avatarPreview) {
        avatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Schedule Detail Functions
const scheduleDetail = {
    init() {
        this.weekFilter = document.getElementById('weekFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.scheduleTableBody = document.getElementById('scheduleTableBody');
        
        if (this.weekFilter) {
            this.weekFilter.addEventListener('change', () => this.loadSchedule());
        }
        if (this.statusFilter) {
            this.statusFilter.addEventListener('change', () => this.loadSchedule());
        }

        // Set default week to current week
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
        if (this.weekFilter) {
            this.weekFilter.value = `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
            this.loadSchedule();
        }
    },

    loadSchedule() {
        // Mô phỏng dữ liệu lịch dạy (sẽ được thay thế bằng API call)
        const mockSchedule = [
            {
                id: 1,
                subject: 'Lập trình Web',
                dayOfWeek: 2, // Thứ 2
                startTime: '14:00',
                endTime: '16:00',
                room: 'A.11.01',
                status: 'upcoming',
                studentCount: 15,
                students: [
                    { name: 'Nguyễn Văn A', studentId: '2021001', email: 'a@vlu.edu.vn', phone: '0123456789' },
                    { name: 'Trần Thị B', studentId: '2021002', email: 'b@vlu.edu.vn', phone: '0123456790' }
                ]
            },
            {
                id: 2,
                subject: 'Cơ sở dữ liệu',
                dayOfWeek: 4, // Thứ 4
                startTime: '19:00',
                endTime: '21:00',
                room: 'A.11.02',
                status: 'upcoming',
                studentCount: 12,
                students: [
                    { name: 'Lê Văn C', studentId: '2021003', email: 'c@vlu.edu.vn', phone: '0123456791' },
                    { name: 'Phạm Thị D', studentId: '2021004', email: 'd@vlu.edu.vn', phone: '0123456792' }
                ]
            }
        ];

        // Xóa dữ liệu cũ
        this.scheduleTableBody.innerHTML = '';

        // Tạo các hàng thời gian
        const timeSlots = ['07:00-09:00', '09:00-11:00', '13:00-15:00', '15:00-17:00', '17:00-19:00', '19:00-21:00'];
        timeSlots.forEach(timeSlot => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${timeSlot}</td>`;
            
            // Thêm ô cho mỗi ngày trong tuần
            for (let day = 1; day <= 7; day++) {
                const cell = document.createElement('td');
                const classForThisSlot = mockSchedule.find(c => 
                    c.dayOfWeek === day && 
                    this.isTimeSlotMatch(timeSlot, c.startTime, c.endTime)
                );

                if (classForThisSlot) {
                    cell.classList.add('has-class');
                    cell.innerHTML = `
                        <div>${classForThisSlot.subject}</div>
                        <div>${classForThisSlot.startTime}-${classForThisSlot.endTime}</div>
                    `;
                    cell.addEventListener('click', () => this.showClassDetails(classForThisSlot));
                }
                row.appendChild(cell);
            }
            this.scheduleTableBody.appendChild(row);
        });
    },

    isTimeSlotMatch(timeSlot, startTime, endTime) {
        const [slotStart] = timeSlot.split('-');
        return slotStart === startTime;
    },

    showClassDetails(classData) {
        const detailsDiv = document.getElementById('selectedClassDetails');
        detailsDiv.style.display = 'block';

        // Cập nhật thông tin chi tiết
        document.getElementById('classSubject').textContent = classData.subject;
        document.getElementById('classTime').textContent = `${classData.startTime}-${classData.endTime}`;
        document.getElementById('studentCount').textContent = classData.studentCount;
        document.getElementById('classRoom').textContent = classData.room;
        document.getElementById('classStatus').textContent = this.getStatusText(classData.status);

        // Cập nhật danh sách học viên
        const studentListBody = document.getElementById('studentListBody');
        studentListBody.innerHTML = classData.students.map(student => `
            <tr>
                <td>${student.name}</td>
                <td>${student.studentId}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>
                    <input type="checkbox" ${Math.random() > 0.5 ? 'checked' : ''}>
                </td>
            </tr>
        `).join('');
    },

    getStatusText(status) {
        const statusMap = {
            'upcoming': 'Sắp diễn ra',
            'completed': 'Đã hoàn thành',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }
};

// Initialize schedule detail functionality
document.addEventListener('DOMContentLoaded', () => {
    scheduleDetail.init();
});

// Revenue Detail Functions
const revenueDetail = {
    init() {
        this.timeFilter = document.getElementById('revenueTimeFilter');
        this.subjectFilter = document.getElementById('revenueSubjectFilter');
        
        if (this.timeFilter) {
            this.timeFilter.addEventListener('change', () => this.loadRevenueData());
        }
        if (this.subjectFilter) {
            this.subjectFilter.addEventListener('change', () => this.loadRevenueData());
        }

        // Initialize revenue chart
        this.initRevenueChart();
        
        // Load initial data
        this.loadRevenueData();
    },

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
                datasets: [{
                    label: 'Doanh thu (VNĐ)',
                    data: [1.2, 1.5, 1.8, 2.1, 2.4, 2.0, 1.8, 2.2, 2.4, 2.6, 2.3, 2.4].map(x => x * 1000000),
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000000) + 'M';
                            }
                        }
                    }
                }
            }
        });
    },

    loadRevenueData() {
        // Mô phỏng dữ liệu doanh thu (sẽ được thay thế bằng API call)
        const mockRevenueData = {
            totalHours: 48,
            totalStudents: 25,
            totalRevenue: 2400000,
            classes: [
                {
                    date: '2024-03-15',
                    subject: 'Lập trình Web',
                    time: '14:00-16:00',
                    students: 15,
                    ratePerHour: 200000,
                    total: 400000,
                    status: 'completed'
                },
                {
                    date: '2024-03-14',
                    subject: 'Cơ sở dữ liệu',
                    time: '19:00-21:00',
                    students: 12,
                    ratePerHour: 200000,
                    total: 400000,
                    status: 'completed'
                }
            ],
            payments: [
                {
                    date: '2024-03-01',
                    period: 'Tháng 2/2024',
                    amount: 2000000,
                    method: 'Chuyển khoản',
                    status: 'completed',
                    note: 'Đã thanh toán đầy đủ'
                },
                {
                    date: '2024-02-01',
                    period: 'Tháng 1/2024',
                    amount: 1800000,
                    method: 'Chuyển khoản',
                    status: 'completed',
                    note: 'Đã thanh toán đầy đủ'
                }
            ]
        };

        // Cập nhật thông tin tổng quan
        document.getElementById('totalHours').textContent = `${mockRevenueData.totalHours} giờ`;
        document.getElementById('totalStudents').textContent = `${mockRevenueData.totalStudents} học viên`;
        document.getElementById('totalRevenue').textContent = `${this.formatCurrency(mockRevenueData.totalRevenue)} VNĐ`;

        // Cập nhật bảng chi tiết các buổi dạy
        const revenueTableBody = document.getElementById('revenueTableBody');
        if (revenueTableBody) {
            revenueTableBody.innerHTML = mockRevenueData.classes.map(cls => `
                <tr>
                    <td>${this.formatDate(cls.date)}</td>
                    <td>${cls.subject}</td>
                    <td>${cls.time}</td>
                    <td>${cls.students}</td>
                    <td>${this.formatCurrency(cls.ratePerHour)} VNĐ</td>
                    <td>${this.formatCurrency(cls.total)} VNĐ</td>
                    <td><span class="payment-status ${cls.status}">${this.getStatusText(cls.status)}</span></td>
                </tr>
            `).join('');
        }

        // Cập nhật lịch sử thanh toán
        const paymentHistoryBody = document.getElementById('paymentHistoryBody');
        if (paymentHistoryBody) {
            paymentHistoryBody.innerHTML = mockRevenueData.payments.map(payment => `
                <tr>
                    <td>${this.formatDate(payment.date)}</td>
                    <td>${payment.period}</td>
                    <td>${this.formatCurrency(payment.amount)} VNĐ</td>
                    <td>${payment.method}</td>
                    <td><span class="payment-status ${payment.status}">${this.getStatusText(payment.status)}</span></td>
                    <td>${payment.note}</td>
                </tr>
            `).join('');
        }
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount);
    },

    getStatusText(status) {
        const statusMap = {
            'completed': 'Đã hoàn thành',
            'pending': 'Chờ thanh toán',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status;
    }
};

// Initialize revenue detail functionality
document.addEventListener('DOMContentLoaded', () => {
    revenueDetail.init();
});

// Ratings Functions
const ratings = {
    init() {
        this.timeFilter = document.getElementById('ratingTimeFilter');
        this.subjectFilter = document.getElementById('ratingSubjectFilter');
        this.scoreFilter = document.getElementById('ratingScoreFilter');
        this.loadMoreBtn = document.getElementById('loadMoreRatings');
        
        if (this.timeFilter) {
            this.timeFilter.addEventListener('change', () => this.filterRatings());
        }
        if (this.subjectFilter) {
            this.subjectFilter.addEventListener('change', () => this.filterRatings());
        }
        if (this.scoreFilter) {
            this.scoreFilter.addEventListener('change', () => this.filterRatings());
        }
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreRatings());
        }

        // Load initial data
        this.currentPage = 1;
        this.filterRatings();
    },

    filterRatings() {
        // Reset to first page when filters change
        this.currentPage = 1;
        this.loadRatings();
    },

    loadRatings() {
        // Mô phỏng API call để lấy dữ liệu đánh giá
        const mockRatings = [
            {
                studentName: 'Nguyễn Văn A',
                studentAvatar: '../images/avatar-placeholder.jpg',
                subject: 'Lập trình Web',
                date: '2024-03-15',
                overallScore: 5.0,
                knowledge: 5,
                teaching: 5,
                attitude: 5,
                comment: 'Giảng viên có kiến thức chuyên môn rất tốt, giảng dạy dễ hiểu và nhiệt tình. Tôi đã học được rất nhiều từ khóa học này.',
                tutorReply: {
                    content: 'Cảm ơn bạn đã có những đánh giá tích cực. Rất vui khi được góp phần vào hành trình học tập của bạn!',
                    date: '2024-03-17'
                }
            },
            {
                studentName: 'Trần Thị B',
                studentAvatar: '../images/avatar-placeholder.jpg',
                subject: 'Cơ sở dữ liệu',
                date: '2024-03-10',
                overallScore: 4.5,
                knowledge: 5,
                teaching: 4,
                attitude: 4.5,
                comment: 'Giảng viên có kiến thức sâu rộng về cơ sở dữ liệu. Tuy nhiên, đôi khi giảng hơi nhanh.',
                tutorReply: {
                    content: 'Cảm ơn góp ý của bạn. Mình sẽ cố gắng điều chỉnh tốc độ giảng phù hợp hơn trong các buổi học tới.',
                    date: '2024-03-12'
                }
            }
        ];

        // Áp dụng bộ lọc
        let filteredRatings = mockRatings;
        const timeFilter = this.timeFilter?.value;
        const subjectFilter = this.subjectFilter?.value;
        const scoreFilter = this.scoreFilter?.value;

        if (timeFilter && timeFilter !== 'all') {
            // Thêm logic lọc theo thời gian
        }

        if (subjectFilter && subjectFilter !== 'all') {
            filteredRatings = filteredRatings.filter(r => r.subject.toLowerCase().includes(subjectFilter));
        }

        if (scoreFilter && scoreFilter !== 'all') {
            filteredRatings = filteredRatings.filter(r => Math.floor(r.overallScore) === parseInt(scoreFilter));
        }

        // Cập nhật UI
        this.updateRatingsList(filteredRatings);
        this.updateLoadMoreButton(filteredRatings.length);
    },

    loadMoreRatings() {
        this.currentPage++;
        this.loadRatings();
    },

    updateRatingsList(ratings) {
        const ratingList = document.querySelector('.rating-list');
        if (!ratingList) return;

        if (this.currentPage === 1) {
            ratingList.innerHTML = '';
        }

        ratings.forEach(rating => {
            const ratingItem = this.createRatingItem(rating);
            ratingList.appendChild(ratingItem);
        });
    },

    createRatingItem(rating) {
        const div = document.createElement('div');
        div.className = 'rating-item';
        div.innerHTML = `
            <div class="rating-header">
                <div class="student-info">
                    <img src="${rating.studentAvatar}" alt="Student Avatar" class="student-avatar">
                    <div>
                        <h4>${rating.studentName}</h4>
                        <div class="rating-meta">
                            <span>${rating.subject}</span>
                            <span>•</span>
                            <span>${this.formatDate(rating.date)}</span>
                        </div>
                    </div>
                </div>
                <div class="rating-stars">
                    ${this.generateStars(rating.overallScore)}
                    <span class="rating-score">${rating.overallScore.toFixed(1)}</span>
                </div>
            </div>
            <div class="rating-details">
                <div class="rating-category">
                    <span>Kiến thức chuyên môn:</span>
                    <div class="stars">${this.generateStars(rating.knowledge)}</div>
                </div>
                <div class="rating-category">
                    <span>Kỹ năng giảng dạy:</span>
                    <div class="stars">${this.generateStars(rating.teaching)}</div>
                </div>
                <div class="rating-category">
                    <span>Thái độ giảng dạy:</span>
                    <div class="stars">${this.generateStars(rating.attitude)}</div>
                </div>
            </div>
            <div class="rating-comment">
                "${rating.comment}"
            </div>
            ${rating.tutorReply ? `
                <div class="tutor-reply">
                    <strong>Phản hồi của giảng viên:</strong>
                    <p>"${rating.tutorReply.content}"</p>
                    <div class="reply-meta">${this.formatDate(rating.tutorReply.date)}</div>
                </div>
            ` : ''}
        `;
        return div;
    },

    generateStars(score) {
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${`<i class="fas fa-star"></i>`.repeat(fullStars)}
            ${hasHalfStar ? `<i class="fas fa-star-half-alt"></i>` : ''}
            ${`<i class="far fa-star"></i>`.repeat(emptyStars)}
        `;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },

    updateLoadMoreButton(totalItems) {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = totalItems > this.currentPage * 10 ? 'block' : 'none';
        }
    }
};

// Initialize ratings functionality
document.addEventListener('DOMContentLoaded', () => {
    ratings.init();
});

// Student List Functions
const studentList = {
    init() {
        this.searchInput = document.getElementById('studentSearch');
        this.classFilter = document.getElementById('classFilter');
        this.statusFilter = document.getElementById('statusFilter');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterStudents());
        }
        if (this.classFilter) {
            this.classFilter.addEventListener('change', () => this.filterStudents());
        }
        if (this.statusFilter) {
            this.statusFilter.addEventListener('change', () => this.filterStudents());
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.changePage(1));
        }

        // Load initial data
        this.currentPage = 1;
        this.loadStudents();
    },

    filterStudents() {
        // Reset to first page when filters change
        this.currentPage = 1;
        this.loadStudents();
    },

    loadStudents() {
        // Mô phỏng API call để lấy dữ liệu sinh viên
        const mockStudents = [
            {
                id: 'SV001',
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@vlu.edu.vn',
                class: 'Lập trình Web',
                registrationDate: '2024-03-01',
                status: 'active'
            },
            {
                id: 'SV002',
                name: 'Trần Thị B',
                email: 'tranthib@vlu.edu.vn',
                class: 'Cơ sở dữ liệu',
                registrationDate: '2024-03-05',
                status: 'active'
            }
        ];

        // Áp dụng bộ lọc
        let filteredStudents = mockStudents;
        const searchTerm = this.searchInput?.value.toLowerCase();
        const classFilter = this.classFilter?.value;
        const statusFilter = this.statusFilter?.value;

        if (searchTerm) {
            filteredStudents = filteredStudents.filter(student => 
                student.name.toLowerCase().includes(searchTerm) ||
                student.email.toLowerCase().includes(searchTerm) ||
                student.id.toLowerCase().includes(searchTerm)
            );
        }

        if (classFilter) {
            filteredStudents = filteredStudents.filter(student => 
                student.class.toLowerCase().includes(classFilter)
            );
        }

        if (statusFilter) {
            filteredStudents = filteredStudents.filter(student => 
                student.status === statusFilter
            );
        }

        // Cập nhật UI
        this.updateStudentList(filteredStudents);
        this.updatePagination(filteredStudents.length);
    },

    updateStudentList(students) {
        const tableBody = document.getElementById('studentTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = students.map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.class}</td>
                <td>${this.formatDate(student.registrationDate)}</td>
                <td><span class="status-badge ${student.status}">${this.getStatusText(student.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="studentList.viewDetails('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="studentList.edit('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 10);
        const pageInfo = document.querySelector('.page-info');
        if (pageInfo) {
            pageInfo.textContent = `Trang ${this.currentPage} / ${totalPages}`;
        }

        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === totalPages;
        }
    },

    changePage(delta) {
        this.currentPage += delta;
        this.loadStudents();
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },

    getStatusText(status) {
        const statusMap = {
            'active': 'Đang học',
            'inactive': 'Đã nghỉ'
        };
        return statusMap[status] || status;
    },

    viewDetails(studentId) {
        // TODO: Implement view student details
        console.log('View details for student:', studentId);
    },

    edit(studentId) {
        // TODO: Implement edit student
        console.log('Edit student:', studentId);
    }
};

// Initialize student list functionality
document.addEventListener('DOMContentLoaded', () => {
    studentList.init();
});

// Tutor List Functions
const tutorList = {
    init() {
        this.searchInput = document.getElementById('tutorSearch');
        this.subjectFilter = document.getElementById('subjectFilter');
        this.statusFilter = document.getElementById('tutorStatusFilter');
        this.prevPageBtn = document.getElementById('tutorPrevPage');
        this.nextPageBtn = document.getElementById('tutorNextPage');

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterTutors());
        }
        if (this.subjectFilter) {
            this.subjectFilter.addEventListener('change', () => this.filterTutors());
        }
        if (this.statusFilter) {
            this.statusFilter.addEventListener('change', () => this.filterTutors());
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.changePage(1));
        }

        this.currentPage = 1;
        this.loadTutors();
    },

    filterTutors() {
        this.currentPage = 1;
        this.loadTutors();
    },

    loadTutors() {
        // Mock data
        const mockTutors = [
            {
                id: 'T001',
                name: 'Lê Minh Tuấn',
                email: 'tuanlm@vlu.edu.vn',
                subject: 'Lập trình Web',
                experience: '2 năm',
                status: 'active'
            },
            {
                id: 'T002',
                name: 'Phạm Thị Hoa',
                email: 'hoapt@vlu.edu.vn',
                subject: 'Cơ sở dữ liệu',
                experience: '3 năm',
                status: 'active'
            },
            {
                id: 'T003',
                name: 'Ngô Văn B',
                email: 'ngovanb@vlu.edu.vn',
                subject: 'Lập trình Web',
                experience: '1 năm',
                status: 'inactive'
            }
        ];

        let filteredTutors = mockTutors;
        const searchTerm = this.searchInput?.value.toLowerCase();
        const subjectFilter = this.subjectFilter?.value;
        const statusFilter = this.statusFilter?.value;

        if (searchTerm) {
            filteredTutors = filteredTutors.filter(tutor =>
                tutor.name.toLowerCase().includes(searchTerm) ||
                tutor.email.toLowerCase().includes(searchTerm) ||
                tutor.id.toLowerCase().includes(searchTerm)
            );
        }
        if (subjectFilter) {
            filteredTutors = filteredTutors.filter(tutor =>
                tutor.subject === subjectFilter
            );
        }
        if (statusFilter) {
            filteredTutors = filteredTutors.filter(tutor =>
                tutor.status === statusFilter
            );
        }

        this.updateTutorList(filteredTutors);
        this.updatePagination(filteredTutors.length);
    },

    updateTutorList(tutors) {
        const tableBody = document.getElementById('tutorTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = tutors.map(tutor => `
            <tr>
                <td>${tutor.id}</td>
                <td>${tutor.name}</td>
                <td>${tutor.email}</td>
                <td>${tutor.subject}</td>
                <td>${tutor.experience}</td>
                <td><span class="status-badge ${tutor.status}">${this.getStatusText(tutor.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="tutorList.viewDetails('${tutor.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="tutorList.edit('${tutor.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 10) || 1;
        const pageInfo = document.querySelector('#tutorListModal .page-info');
        if (pageInfo) {
            pageInfo.textContent = `Trang ${this.currentPage} / ${totalPages}`;
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === totalPages;
        }
    },

    changePage(delta) {
        this.currentPage += delta;
        this.loadTutors();
    },

    getStatusText(status) {
        const statusMap = {
            'active': 'Đang dạy',
            'inactive': 'Ngưng dạy'
        };
        return statusMap[status] || status;
    },

    viewDetails(tutorId) {
        // TODO: Xem chi tiết tutor
        console.log('View details for tutor:', tutorId);
    },

    edit(tutorId) {
        // TODO: Sửa thông tin tutor
        console.log('Edit tutor:', tutorId);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tutorListModal')) {
        tutorList.init();
    }
});

// Class List Functions
const classList = {
    init() {
        this.searchInput = document.getElementById('classSearch');
        this.subjectFilter = document.getElementById('classSubjectFilter');
        this.statusFilter = document.getElementById('classStatusFilter');
        this.prevPageBtn = document.getElementById('classPrevPage');
        this.nextPageBtn = document.getElementById('classNextPage');

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterClasses());
        }
        if (this.subjectFilter) {
            this.subjectFilter.addEventListener('change', () => this.filterClasses());
        }
        if (this.statusFilter) {
            this.statusFilter.addEventListener('change', () => this.filterClasses());
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.changePage(1));
        }

        this.currentPage = 1;
        this.loadClasses();
    },

    filterClasses() {
        this.currentPage = 1;
        this.loadClasses();
    },

    loadClasses() {
        // Mock data cho danh sách lớp học
        const mockClasses = [
            {
                id: 'LH001',
                name: 'Lớp Web 1',
                subject: 'Lập trình Web',
                studentCount: 25,
                status: 'active',
                tutor: 'Lê Minh Tuấn',
                schedule: 'Thứ 2, 4 (7:30 - 9:30)'
            },
            {
                id: 'LH002',
                name: 'Lớp CSDL 2',
                subject: 'Cơ sở dữ liệu',
                studentCount: 30,
                status: 'active',
                tutor: 'Phạm Thị Hoa',
                schedule: 'Thứ 3, 5 (13:30 - 15:30)'
            },
            {
                id: 'LH003',
                name: 'Lớp Web 2',
                subject: 'Lập trình Web',
                studentCount: 28,
                status: 'closed',
                tutor: 'Ngô Văn B',
                schedule: 'Thứ 6, 7 (9:30 - 11:30)'
            },
            {
                id: 'LH004',
                name: 'Lớp CSDL 1',
                subject: 'Cơ sở dữ liệu',
                studentCount: 22,
                status: 'active',
                tutor: 'Phạm Thị Hoa',
                schedule: 'Thứ 2, 4 (15:30 - 17:30)'
            },
            {
                id: 'LH005',
                name: 'Lớp Web 3',
                subject: 'Lập trình Web',
                studentCount: 20,
                status: 'closed',
                tutor: 'Lê Minh Tuấn',
                schedule: 'Thứ 3, 5 (7:30 - 9:30)'
            }
        ];

        let filteredClasses = mockClasses;
        const searchTerm = this.searchInput?.value.toLowerCase();
        const subjectFilter = this.subjectFilter?.value;
        const statusFilter = this.statusFilter?.value;

        if (searchTerm) {
            filteredClasses = filteredClasses.filter(cls =>
                cls.name.toLowerCase().includes(searchTerm) ||
                cls.id.toLowerCase().includes(searchTerm) ||
                cls.subject.toLowerCase().includes(searchTerm)
            );
        }

        if (subjectFilter) {
            filteredClasses = filteredClasses.filter(cls =>
                cls.subject === subjectFilter
            );
        }

        if (statusFilter) {
            filteredClasses = filteredClasses.filter(cls =>
                cls.status === statusFilter
            );
        }

        this.updateClassList(filteredClasses);
        this.updatePagination(filteredClasses.length);
    },

    updateClassList(classes) {
        const tableBody = document.getElementById('classTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = classes.map(cls => `
            <tr>
                <td>${cls.id}</td>
                <td>
                    ${cls.name}
                    <div class="small text-muted">
                        ${cls.tutor}<br>
                        ${cls.schedule}
                    </div>
                </td>
                <td>${cls.subject}</td>
                <td>${cls.studentCount}</td>
                <td><span class="status-badge ${cls.status}">${this.getStatusText(cls.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="classList.viewDetails('${cls.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="classList.edit('${cls.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 10) || 1;
        const pageInfo = document.querySelector('#classListModal .page-info');
        if (pageInfo) {
            pageInfo.textContent = `Trang ${this.currentPage} / ${totalPages}`;
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === totalPages;
        }
    },

    changePage(delta) {
        this.currentPage += delta;
        this.loadClasses();
    },

    getStatusText(status) {
        const statusMap = {
            'active': 'Đang mở',
            'closed': 'Đã kết thúc'
        };
        return statusMap[status] || status;
    },

    viewDetails(classId) {
        // TODO: Implement view class details
        console.log('View details for class:', classId);
    },

    edit(classId) {
        // TODO: Implement edit class
        console.log('Edit class:', classId);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('classListModal')) {
        classList.init();
    }
});

// Complaint List Functions
const complaintList = {
    init() {
        this.searchInput = document.getElementById('complaintSearch');
        this.typeFilter = document.getElementById('complaintTypeFilter');
        this.statusFilter = document.getElementById('complaintStatusFilter');
        this.prevPageBtn = document.getElementById('complaintPrevPage');
        this.nextPageBtn = document.getElementById('complaintNextPage');

        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => this.filterComplaints());
        }
        if (this.typeFilter) {
            this.typeFilter.addEventListener('change', () => this.filterComplaints());
        }
        if (this.statusFilter) {
            this.statusFilter.addEventListener('change', () => this.filterComplaints());
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => this.changePage(-1));
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => this.changePage(1));
        }

        this.currentPage = 1;
        this.loadComplaints();
    },

    filterComplaints() {
        this.currentPage = 1;
        this.loadComplaints();
    },

    loadComplaints() {
        // Mock data cho danh sách khiếu nại
        const mockComplaints = [
            {
                id: 'KN001',
                sender: 'Nguyễn Văn A',
                type: 'tutor',
                content: 'Giảng viên thường xuyên vào lớp trễ',
                date: '2024-03-15',
                status: 'pending',
                details: {
                    tutorName: 'Lê Minh Tuấn',
                    className: 'Lớp Web 1',
                    frequency: '3 lần trong tuần này'
                }
            },
            {
                id: 'KN002',
                sender: 'Trần Thị B',
                type: 'class',
                content: 'Lớp học quá đông, khó tương tác',
                date: '2024-03-14',
                status: 'processing',
                details: {
                    className: 'Lớp CSDL 2',
                    currentSize: '30 sinh viên'
                }
            },
            {
                id: 'KN003',
                sender: 'Phạm Văn C',
                type: 'system',
                content: 'Không thể đăng ký lớp học mới',
                date: '2024-03-13',
                status: 'resolved',
                details: {
                    error: 'Lỗi hệ thống đăng ký',
                    resolution: 'Đã khắc phục lỗi server'
                }
            },
            {
                id: 'KN004',
                sender: 'Lê Thị D',
                type: 'tutor',
                content: 'Giảng viên không giải đáp thắc mắc kịp thời',
                date: '2024-03-12',
                status: 'processing',
                details: {
                    tutorName: 'Ngô Văn B',
                    className: 'Lớp Web 2',
                    responseTime: 'Trung bình 3 ngày'
                }
            },
            {
                id: 'KN005',
                sender: 'Hoàng Văn E',
                type: 'class',
                content: 'Tài liệu học tập không đầy đủ',
                date: '2024-03-11',
                status: 'pending',
                details: {
                    className: 'Lớp CSDL 1',
                    missingMaterials: 'Bài tập thực hành tuần 3, 4'
                }
            }
        ];

        let filteredComplaints = mockComplaints;
        const searchTerm = this.searchInput?.value.toLowerCase();
        const typeFilter = this.typeFilter?.value;
        const statusFilter = this.statusFilter?.value;

        if (searchTerm) {
            filteredComplaints = filteredComplaints.filter(complaint =>
                complaint.sender.toLowerCase().includes(searchTerm) ||
                complaint.content.toLowerCase().includes(searchTerm) ||
                complaint.id.toLowerCase().includes(searchTerm)
            );
        }

        if (typeFilter) {
            filteredComplaints = filteredComplaints.filter(complaint =>
                complaint.type === typeFilter
            );
        }

        if (statusFilter) {
            filteredComplaints = filteredComplaints.filter(complaint =>
                complaint.status === statusFilter
            );
        }

        this.updateComplaintList(filteredComplaints);
        this.updatePagination(filteredComplaints.length);
    },

    updateComplaintList(complaints) {
        const tableBody = document.getElementById('complaintTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = complaints.map(complaint => `
            <tr>
                <td>${complaint.id}</td>
                <td>${complaint.sender}</td>
                <td>${this.getTypeText(complaint.type)}</td>
                <td>
                    ${complaint.content}
                    <div class="small text-muted">
                        ${this.getDetailsSummary(complaint)}
                    </div>
                </td>
                <td>${this.formatDate(complaint.date)}</td>
                <td><span class="status-badge ${complaint.status}">${this.getStatusText(complaint.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="complaintList.viewDetails('${complaint.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="complaintList.process('${complaint.id}')">
                        <i class="fas fa-tasks"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    getDetailsSummary(complaint) {
        switch (complaint.type) {
            case 'tutor':
                return `Giảng viên: ${complaint.details.tutorName}, Lớp: ${complaint.details.className}`;
            case 'class':
                return `Lớp: ${complaint.details.className}`;
            case 'system':
                return `Lỗi: ${complaint.details.error}`;
            default:
                return '';
        }
    },

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / 10) || 1;
        const pageInfo = document.querySelector('#complaintModal .page-info');
        if (pageInfo) {
            pageInfo.textContent = `Trang ${this.currentPage} / ${totalPages}`;
        }
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === totalPages;
        }
    },

    changePage(delta) {
        this.currentPage += delta;
        this.loadComplaints();
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    },

    getTypeText(type) {
        const typeMap = {
            'tutor': 'Về giảng viên',
            'class': 'Về lớp học',
            'system': 'Về hệ thống'
        };
        return typeMap[type] || type;
    },

    getStatusText(status) {
        const statusMap = {
            'pending': 'Chờ xử lý',
            'processing': 'Đang xử lý',
            'resolved': 'Đã giải quyết'
        };
        return statusMap[status] || status;
    },

    viewDetails(complaintId) {
        // TODO: Implement view complaint details
        console.log('View details for complaint:', complaintId);
    },

    process(complaintId) {
        // TODO: Implement complaint processing
        console.log('Processing complaint:', complaintId);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('complaintModal')) {
        complaintList.init();
    }
});

// Schedule Management Functions
let currentWeek = new Date();

function filterSchedule() {
    const subjectFilter = document.getElementById('subjectFilter').value;
    const weekFilter = document.getElementById('weekFilter').value;
    
    // TODO: Implement actual filtering logic
    console.log('Filtering schedule:', { subjectFilter, weekFilter });
    
    // For now, just show a notification
    showNotification('success', 'Đã lọc lịch học theo tiêu chí đã chọn');
}

function previousWeek() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateWeekDisplay();
    loadWeekSchedule();
}

function nextWeek() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateWeekDisplay();
    loadWeekSchedule();
}

function updateWeekDisplay() {
    const weekElement = document.getElementById('currentWeek');
    if (weekElement) {
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startDate = formatDate(startOfWeek);
        const endDate = formatDate(endOfWeek);
        
        weekElement.textContent = `Tuần ${startDate} - ${endDate}`;
    }
}

function loadWeekSchedule() {
    // TODO: Load actual schedule data from API
    console.log('Loading schedule for week:', currentWeek);
    
    // Simulate loading
    showNotification('success', 'Đã tải lịch học cho tuần mới');
}

function openRatingForm(classId) {
    // Close schedule modal if open
    const scheduleModal = document.getElementById('scheduleModal');
    if (scheduleModal && scheduleModal.classList.contains('active')) {
        closeModal(scheduleModal);
    }
    
    // Open rating form modal
    const ratingModal = document.getElementById('ratingFormModal');
    if (ratingModal) {
        document.getElementById('classId').value = classId;
        openModal(ratingModal);
        initRatingStars();
    }
}

// Initialize schedule when modal opens
document.addEventListener('DOMContentLoaded', () => {
    // Set current week filter to current week
    const weekFilter = document.getElementById('weekFilter');
    if (weekFilter) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        
        const year = startOfWeek.getFullYear();
        const week = getWeekNumber(startOfWeek);
        weekFilter.value = `${year}-W${week.toString().padStart(2, '0')}`;
    }
});

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Enhanced formatDate function for schedule display
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
} 