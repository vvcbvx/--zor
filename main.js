const servicesContainer = document.getElementById('services-container');
const categoriesContainer = document.getElementById('categories-container');
const categoryServicesContainer = document.getElementById('category-services-container');
const categoryServicesList = document.getElementById('category-services-list');
const categoryServicesTitle = document.getElementById('category-services-title');
const serviceCategorySelect = document.getElementById('serviceCategory');
const navLinks = document.querySelectorAll('[data-section]');

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const uploadImagesBtn = document.getElementById('uploadImagesBtn');
const uploadFilesBtn = document.getElementById('uploadFilesBtn');
const serviceImages = document.getElementById('serviceImages');
const serviceFiles = document.getElementById('serviceFiles');
const filePreview = document.getElementById('filePreview');
const filesPreview = document.getElementById('filesPreview');
const alertMessage = document.getElementById('alertMessage');

// متغيرات لإدارة الملفات
let uploadedImages = [];
let uploadedFiles = [];

// عرض الخدمات
// عرض الخدمات مع دعم متعدد للصور
function renderServices(servicesToRender, container) {
    container.innerHTML = '';
    
    servicesToRender.forEach(service => {
        const category = categories.find(cat => cat.id === service.category);
        
        // تحويل الصور إلى مصفوفة إذا كانت غير ذلك
        const serviceImages = Array.isArray(service.images) ? service.images : [service.image];
        
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <div class="service-img">
                <img src="${serviceImages[0]}" alt="${service.name}" data-service-id="${service.id}">
            </div>
            
            ${serviceImages.length > 1 ? `
            <div class="image-thumbnails">
                ${serviceImages.slice(0, 4).map((img, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                         data-img="${img}" 
                         data-service-id="${service.id}">
                        <img src="${img}" alt="صورة ${index + 1} لـ ${service.name}">
                    </div>
                `).join('')}
                
                ${serviceImages.length > 4 ? `
                    <div class="thumbnail more-images" data-service-id="${service.id}">
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f1f1f1; color: #333; font-weight: bold;">
                            +${serviceImages.length - 4}
                        </div>
                    </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p><small>المالك: ${service.owner}</small></p>
                ${service.location ? `<div class="location"><i class="fas fa-map-marker-alt"></i> ${service.location}</div>` : ''}
                ${service.map ? `<a href="${service.map}" target="_blank" class="map-link"><i class="fas fa-map-marked-alt"></i> عرض على الخريطة</a>` : ''}
                <div class="service-meta">
                    <span class="price">${service.price}</span>
                </div>
            </div>
            
            <!-- نافذة التكبير للصور -->
            <div class="image-modal" id="modal-${service.id}">
                <span class="close-modal">&times;</span>
                <div class="image-modal-content">
                    <div class="nav-arrows">
                        <div class="nav-arrow prev-arrow">&#10094;</div>
                        <div class="nav-arrow next-arrow">&#10095;</div>
                    </div>
                    <img class="modal-main-image" src="${serviceImages[0]}" alt="${service.name}">
                    <div class="image-counter">1 / ${serviceImages.length}</div>
                </div>
            </div>
        `;
        
        container.appendChild(serviceCard);
        
        // إضافة أحداث النقر للصور المصغرة
        if (serviceImages.length > 1) {
            const thumbnails = serviceCard.querySelectorAll('.thumbnail:not(.more-images)');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const serviceId = this.dataset.serviceId;
                    const imgSrc = this.dataset.img;
                    const modal = document.getElementById(`modal-${serviceId}`);
                    const modalImg = modal.querySelector('.modal-main-image');
                    const counter = modal.querySelector('.image-counter');
                    
                    // تحديث الصورة الرئيسية في النافذة المنبثقة
                    modalImg.src = imgSrc;
                    
                    // تحديث العداد
                    const imgIndex = serviceImages.indexOf(imgSrc) + 1;
                    counter.textContent = `${imgIndex} / ${serviceImages.length}`;
                    
                    // تحديث الصورة الرئيسية في البطاقة
                    serviceCard.querySelector('.service-img img').src = imgSrc;
                    
                    // تحديث حالة الصور المصغرة النشطة
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // حدث النقر على "المزيد من الصور"
            if (serviceImages.length > 4) {
                const moreImagesBtn = serviceCard.querySelector('.more-images');
                moreImagesBtn.addEventListener('click', function() {
                    const serviceId = this.dataset.serviceId;
                    const modal = document.getElementById(`modal-${serviceId}`);
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                });
            }
        }
        
        // أحداث النافذة المنبثقة
        const modal = serviceCard.querySelector('.image-modal');
        const modalImg = modal.querySelector('.modal-main-image');
        const closeBtn = modal.querySelector('.close-modal');
        const prevArrow = modal.querySelector('.prev-arrow');
        const nextArrow = modal.querySelector('.next-arrow');
        const counter = modal.querySelector('.image-counter');
        
        // فتح النافذة المنبثقة عند النقر على الصورة الرئيسية
        serviceCard.querySelector('.service-img img').addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        // إغلاق النافذة المنبثقة
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // التنقل بين الصور
        if (serviceImages.length > 1) {
            let currentIndex = 0;
            
            function updateModalImage(index) {
                currentIndex = index;
                modalImg.src = serviceImages[currentIndex];
                counter.textContent = `${currentIndex + 1} / ${serviceImages.length}`;
                
                // تحديث الصورة الرئيسية في البطاقة
                serviceCard.querySelector('.service-img img').src = serviceImages[currentIndex];
                
                // تحديث الصور المصغرة النشطة
                const thumbnails = serviceCard.querySelectorAll('.thumbnail:not(.more-images)');
                thumbnails.forEach((thumb, i) => {
                    thumb.classList.toggle('active', i === currentIndex);
                });
            }
            
            prevArrow.addEventListener('click', function(e) {
                e.stopPropagation();
                let newIndex = currentIndex - 1;
                if (newIndex < 0) newIndex = serviceImages.length - 1;
                updateModalImage(newIndex);
            });
            
            nextArrow.addEventListener('click', function(e) {
                e.stopPropagation();
                let newIndex = currentIndex + 1;
                if (newIndex >= serviceImages.length) newIndex = 0;
                updateModalImage(newIndex);
            });
            
            // التنقل باستخدام لوحة المفاتيح
            document.addEventListener('keydown', function(e) {
                if (modal.style.display === 'block') {
                    if (e.key === 'ArrowLeft') {
                        let newIndex = currentIndex - 1;
                        if (newIndex < 0) newIndex = serviceImages.length - 1;
                        updateModalImage(newIndex);
                    } else if (e.key === 'ArrowRight') {
                        let newIndex = currentIndex + 1;
                        if (newIndex >= serviceImages.length) newIndex = 0;
                        updateModalImage(newIndex);
                    } else if (e.key === 'Escape') {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }
                }
            });
        }
        
        // إغلاق النافذة عند النقر خارج الصورة
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// عرض نجوم التقييم

// عرض التصنيفات
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.categoryId = category.id;
        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="fas ${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
        `;
        
        categoryCard.addEventListener('click', () => {
            showCategoryServices(category.id, category.name);
        });
        
        categoriesContainer.appendChild(categoryCard);
    });
}

// عرض خدمات التصنيف
function showCategoryServices(categoryId, categoryName) {
    const categoryServices = services.filter(service => service.category === categoryId);
    
    categoryServicesTitle.textContent = `خدمات ${categoryName}`;
    renderServices(categoryServices, categoryServicesList);
    
    categoryServicesContainer.style.display = 'block';
    window.scrollTo({
        top: categoryServicesContainer.offsetTop - 100,
        behavior: 'smooth'
    });
}

// تعبئة اختيار التصنيف في النموذج
function populateCategorySelect() {
    serviceCategorySelect.innerHTML = '<option value="">اختر التصنيف</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        serviceCategorySelect.appendChild(option);
    });
}

// عرض معاينة الصور
function displayImagePreview(files, container, array) {
    container.innerHTML = '';
    array.length = 0;
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'file-preview-item';
            
            if (file.type.startsWith('image/')) {
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}">
                    <button class="remove-file" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            } else {
                previewItem.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                        <i class="fas fa-file" style="font-size: 2rem;"></i>
                        <span style="font-size: 0.7rem; margin-top: 0.5rem; text-align: center; word-break: break-all; padding: 0 5px;">${file.name}</span>
                    </div>
                    <button class="remove-file" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            }
            
            container.appendChild(previewItem);
            
            // إضافة حدث إزالة الملف
            previewItem.querySelector('.remove-file').addEventListener('click', () => {
                array.splice(index, 1);
                displayImagePreview(array, container, array);
            });
        };
        reader.readAsDataURL(file);
        array.push(file);
    });
}

// إظهار رسالة تنبيه
function showAlert(message, isError = false) {
    alertMessage.textContent = message;
    alertMessage.className = isError ? 'alert error' : 'alert';
    alertMessage.style.display = 'block';
    
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 5000);
}


// تعديل كائن الأقسام
const sections = {
home: document.getElementById('home-section'),
categories: document.getElementById('categories-section'),
about: document.getElementById('about-section'),
addservice: document.getElementById('add-service-section'),
developer: document.getElementById('developer-section')

// تأكد من تطابق الاسم هنا
};

// تحسين وظيفة showSection

function showSection(sectionId) {
// إخفاء جميع الأقسام
Object.values(sections).forEach(section => {
if (section) section.style.display = 'none';
});

// إظهار القسم المحدد
if (sections[sectionId]) {
sections[sectionId].style.display = 'block';

// إذا كان قسم التصنيفات، قم بعرضها
if (sectionId === 'categories') {
    renderCategories();
    categoryServicesContainer.style.display = 'none';
}

// إذا كان قسم إضافة خدمة، قم بتعبئة التصنيفات
if (sectionId === 'add-service') {
    populateCategorySelect();
}
}

// تحديث الروابط النشطة
updateActiveNavLinks(sectionId);

// التمرير إلى الأعلى
window.scrollTo({ top: 0, behavior: 'smooth' });
}




const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', function(e) {
const query = e.target.value.toLowerCase();
const filtered = services.filter(service => 
service.name.toLowerCase().includes(query) ||
service.description.toLowerCase().includes(query) ||
service.owner.toLowerCase().includes(query)
);
renderServices(filtered.slice(0,4), servicesContainer);
});






// وظيفة مساعدة لتحديث روابط التنقل النشطة
function updateActiveNavLinks(activeSection) {
document.querySelectorAll('[data-section]').forEach(link => {
link.classList.toggle('active', link.dataset.section === activeSection);
});
}

// وظيفة إغلاق القائمة الجانبية
function closeSidebar() {
document.body.classList.remove('sidebar-open');
sidebar.classList.remove('open');
}

// إضافة خدمة جديدة


// إدارة اختيار الصور
uploadImagesBtn.addEventListener('click', () => {
    serviceImages.click();
});

serviceImages.addEventListener('change', (e) => {
    displayImagePreview(e.target.files, filePreview, uploadedImages);
});

// إدارة اختيار الملفات
uploadFilesBtn.addEventListener('click', () => {
    serviceFiles.click();
});

serviceFiles.addEventListener('change', (e) => {
    displayImagePreview(e.target.files, filesPreview, uploadedFiles);
});

// التنقل بين الصفحات
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(this.dataset.section);
    });
});

// روابط التذييل
document.querySelectorAll('.footer-col a[data-section]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(this.dataset.section);
    });
});

// القائمة الجانبية
menuToggle.addEventListener('click', () => {
    document.body.classList.add('sidebar-open');
    sidebar.classList.add('open');
});

sidebarClose.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
    sidebar.classList.remove('open');
});

// زر العودة للأعلى
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// تهيئة الصفحة
function init() {
    renderServices(services.slice(0, 4), servicesContainer);
    renderCategories();
    populateCategorySelect();
    
    // عرض القسم الرئيسي أولاً
    showSection('home');
}
function populateCategorySelect() {
serviceCategorySelect.innerHTML = '<option value="">اختر التصنيف</option>';
categories.forEach(cat => {
const option = document.createElement('option');
option.value = cat.id;
option.textContent = cat.name;
serviceCategorySelect.appendChild(option);
});
}
function setupNavigationListeners() {
// الروابط في القائمة الرئيسية والجانبية والتذييل
document.querySelectorAll('[data-section]').forEach(link => {
link.addEventListener('click', function(e) {
    e.preventDefault();
    const sectionId = this.dataset.section;
    showSection(sectionId);
});
});

// إغلاق القائمة الجانبية عند النقر على أي قسم (للموبايل)
document.querySelectorAll('.sidebar-menu a').forEach(link => {
link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
});
});
}

function init() {
renderServices(services.slice(0, 4), servicesContainer);
renderCategories();
populateCategorySelect();
showSection('home');

// إضافة مستمعات الأحداث للروابط
setupNavigationListeners();
}


// إدارة عرض/إخفاء الملاحظات
const notesToggle = document.querySelector('.notes-toggle');
const notesContent = document.querySelector('.notes-content');
const toggleIcon = document.querySelector('.toggle-icon');
const understandBtn = document.getElementById('understandBtn');
const submitBtn = document.querySelector('#serviceForm button[type="submit"]');

// عند الدخول للقسم، تكون الملاحظات مفتوحة
function showNotesInitially() {
notesContent.classList.add('active');
toggleIcon.style.transform = 'rotate(180deg)';
}

// تبديل عرض/إخفاء الملاحظات
notesToggle.addEventListener('click', () => {
notesContent.classList.toggle('active');
toggleIcon.style.transform = notesContent.classList.contains('active') ? 
'rotate(180deg)' : 'rotate(0deg)';
});

// إدارة عملية النشر
let userUnderstood = false;

understandBtn.addEventListener('click', () => {
userUnderstood = true;
notesContent.classList.remove('active');
toggleIcon.style.transform = 'rotate(0deg)';
showAlert('يمكنك الآن متابعة نشر الخدمة', false);
});

document.getElementById('serviceForm').addEventListener('submit', async function(e) {
if (!userUnderstood) {
e.preventDefault();
notesContent.classList.add('active');
toggleIcon.style.transform = 'rotate(180deg)';

// التمرير إلى قسم الملاحظات
window.scrollTo({
    top: notesContainer.offsetTop - 20,
    behavior: 'smooth'
});

showAlert('الرجاء قراءة الملاحظات والتأكيد على فهمك لها قبل المتابعة', true);
return;
}

// متابعة عملية النشر العادية...
// ... الكود الحالي لإرسال النموذج ...
});

// عند عرض قسم إضافة الخدمة، افتح الملاحظات تلقائياً
function showSection(sectionId) {
// ... الكود الحالي ...

if (sectionId === 'addservice') {
setTimeout(() => {
    showNotesInitially();
    userUnderstood = false; // إعادة تعيين حالة الفهم
}, 300);
}
}

function showSection(sectionId) {
// إخفاء جميع الأقسام
Object.values(sections).forEach(section => {
if (section) section.style.display = 'none';
});

// إظهار القسم المحدد
if (sections[sectionId]) {
sections[sectionId].style.display = 'block';

// إذا كان قسم التصنيفات
if (sectionId === 'categories') {
    renderCategories();
    categoryServicesContainer.style.display = 'none';
}

// إذا كان قسم إضافة خدمة
if (sectionId === 'addservice') {
    populateCategorySelect();
    
    // افتح الملاحظات تلقائياً عند الدخول للقسم
    setTimeout(() => {
        notesContent.classList.add('active');
        toggleIcon.style.transform = 'rotate(180deg)';
        userUnderstood = false;
        
        // التمرير إلى الأعلى إذا كانت الشاشة كبيرة
        if (window.innerWidth > 768) {
            window.scrollTo({
                top: notesContainer.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    }, 300);
}
}

// تحديث الروابط النشطة
updateActiveNavLinks(sectionId);
}


document.getElementById('serviceForm').addEventListener('submit', async function(e) {
if (!userUnderstood) {
e.preventDefault();
notesContent.classList.add('active');
toggleIcon.style.transform = 'rotate(180deg)';

// إنشاء رسالة تأكيد
const confirmation = document.createElement('div');
confirmation.className = 'confirmation-message';
confirmation.innerHTML = `
    <p>يجب عليك قراءة الملاحظات والتأكيد على فهمك لها قبل المتابعة</p>
`;
notesContent.prepend(confirmation);

// التمرير إلى قسم الملاحظات
window.scrollTo({
    top: notesContainer.offsetTop - 20,
    behavior: 'smooth'
});

// إزالة الرسالة بعد 5 ثواني
setTimeout(() => {
    confirmation.remove();
}, 5000);

return;
}

// متابعة عملية النشر العادية...


// ... باقي كود الإرسال ...
});

// تأثيرات التمرير لصفحة المطور
function setupDeveloperAnimations() {
const developerSection = document.getElementById('developer-section');
if (!developerSection) return;

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        developerSection.querySelector('.developer-avatar').classList.add('animate');
        developerSection.querySelector('.developer-info').classList.add('animate');
    }
});
}, { threshold: 0.1 });

observer.observe(developerSection);
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', setupDeveloperAnimations);





document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const form = document.getElementById('serviceForm');
    const contactOverlay = document.getElementById('contactOverlay');
    const closeContactModal = document.getElementById('closeContactModal');
    const confirmContactBtn = document.getElementById('confirmContactBtn');
    const contactOptions = document.querySelectorAll('input[name="extraContact"]');
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    const closeConfirmation = document.getElementById('closeConfirmation');
    const confirmBtn = document.getElementById('confirmBtn');
    const homeFloatBtn = document.getElementById('homeFloatBtn');

    // تأكيد طرق التواصل
    let formData = {};
    let submitButton;

    // تفعيل حقول الإدخال عند اختيار طريقة تواصل
    contactOptions.forEach(option => {
        option.addEventListener('change', function() {
            const inputField = this.closest('.contact-option').querySelector('input[type="email"], input[type="tel"], input[type="text"]');
            inputField.disabled = !this.checked;
            if (!this.checked) inputField.value = '';
            
            // إضافة تأثير مرئي عند التفعيل
            if (this.checked) {
                this.closest('.contact-option').style.borderColor = '#2ecc71';
                this.closest('.contact-option').style.backgroundColor = '#f8fff8';
            } else {
                this.closest('.contact-option').style.borderColor = '#eee';
                this.closest('.contact-option').style.backgroundColor = 'white';
            }
        });
    });

    // إغلاق نافذة التواصل
    closeContactModal.addEventListener('click', () => {
        contactOverlay.style.display = 'none';
    });

    // زر العودة للرئيسية
    if (homeFloatBtn) {
        homeFloatBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // إغلاق رسالة التأكيد
    function hideConfirmation() {
        confirmationOverlay.style.opacity = '0';
        confirmationOverlay.style.visibility = 'hidden';
    }

    if (closeConfirmation && confirmBtn) {
        closeConfirmation.addEventListener('click', hideConfirmation);
        confirmBtn.addEventListener('click', hideConfirmation);
    }

    // عند تقديم النموذج
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            submitButton = this.querySelector('button[type="submit"]');
            
            // جمع البيانات الأساسية
            formData = {
                name: document.getElementById('serviceName').value,
                category: document.getElementById('serviceCategory').value,
                description: document.getElementById('serviceDescription').value,
                owner: document.getElementById('serviceOwner').value,
                price: document.getElementById('servicePrice').value,
                location: document.getElementById('serviceLocation').value,
                phone: document.getElementById('servicePhone').value,
                map: document.getElementById('serviceMap').value,
                contactMethods: Array.from(document.querySelectorAll('input[name="contactMethods"]:checked')).map(el => el.value),
                images: Array.from(document.getElementById('serviceImages').files),
                files: Array.from(document.getElementById('serviceFiles').files),
                extraContacts: {}
            };

            // عرض نافذة طرق التواصل الإضافية
            contactOverlay.style.display = 'flex';
        });
    }

    // تأكيد طرق التواصل ومتابعة الإرسال
    confirmContactBtn.addEventListener('click', async function() {
        const selectedContacts = Array.from(document.querySelectorAll('input[name="extraContact"]:checked'));
        
        if (selectedContacts.length === 0) {
            alert('الرجاء اختيار طريقة تواصل واحدة على الأقل');
            return;
        }
        
        // التحقق من صحة البيانات وجمعها
        let isValid = true;
        selectedContacts.forEach(contact => {
            const value = contact.value;
            const inputField = contact.closest('.contact-option').querySelector('input[type="email"], input[type="tel"], input[type="text"]');
            
            if (value === 'email') {
                if (!validateEmail(inputField.value)) {
                    alert('الرجاء إدخال بريد إلكتروني صحيح');
                    isValid = false;
                    return;
                }
                formData.extraContacts.email = inputField.value;
            }
            else if (value === 'whatsapp') {
                if (!inputField.value.trim()) {
                    alert('الرجاء إدخال رقم واتساب صحيح');
                    isValid = false;
                    return;
                }
                formData.extraContacts.whatsapp = inputField.value;
            }
            else if (value === 'telegram') {
                if (!inputField.value.startsWith('@')) {
                    alert('اسم المستخدم في تلغرام يجب أن يبدأ ب @');
                    isValid = false;
                    return;
                }
                formData.extraContacts.telegram = inputField.value;
            }
        });
        
        if (!isValid) return;
        
        // إغلاق نافذة التواصل والمتابعة
        contactOverlay.style.display = 'none';
        
        // عرض مؤشر التحميل
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري الإرسال...';
        submitButton.disabled = true;
        
        try {
            // إرسال البيانات إلى تلغرام
            await sendToTelegram(formData);
            
            // عرض رسالة النجاح
            confirmationOverlay.style.opacity = '1';
            confirmationOverlay.style.visibility = 'visible';
            
            // إعادة تعيين النموذج
            form.reset();
            
            // إعادة تعيين حقول التواصل الإضافية
            document.querySelectorAll('input[name="extraContact"]').forEach(checkbox => {
                checkbox.checked = false;
                const inputField = checkbox.closest('.contact-option').querySelector('input[type="email"], input[type="tel"], input[type="text"]');
                inputField.value = '';
                inputField.disabled = true;
                checkbox.closest('.contact-option').style.borderColor = '#eee';
                checkbox.closest('.contact-option').style.backgroundColor = 'white';
            });
            
        } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى');
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });

    // دالة التحقق من البريد الإلكتروني
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // دالة إرسال البيانات إلى تلغرام (كما هي)
    async function sendToTelegram(data) {
        const botToken = '8119987442:AAEY-0a1zp6mtDtWPg0J8njLiovoXyXoZKo';
        const chatId = '6068899411';
        
        try {
            // 1. رسالة بداية الخدمة
            await sendMessage(botToken, chatId, `📢 *بدأت خدمة جديدة* 📢\n——————————————`);
            
            // 2. إرسال تفاصيل الخدمة
            const categoryName = document.querySelector(`#serviceCategory option[value="${data.category}"]`).textContent;
            
            const messages = [
                { title: "📌 اسم الخدمة", content: data.name },
                { title: "🏷️ التصنيف", content: categoryName },
                { title: "📝 الوصف", content: data.description },
                { title: "👤 مالك الخدمة", content: data.owner },
                { title: "💰 السعر", content: data.price },
                { title: "📍 الموقع", content: data.location || "غير محدد" },
                { title: "📞 الهاتف", content: `+963${data.phone}` },
                { title: "🗺️ الخريطة", content: data.map || "غير متوفر" },
                { title: "📱 طرق التواصل", content: data.contactMethods.join('، ') }
            ];
            
            // إضافة طرق التواصل الإضافية إذا وجدت
            if (Object.keys(data.extraContacts).length > 0) {
                let extraContactsText = "📩 طرق التواصل الإضافية:\n";
                if (data.extraContacts.email) extraContactsText += `✉️ البريد: ${data.extraContacts.email}\n`;
                if (data.extraContacts.whatsapp) extraContactsText += `📱 واتساب: ${data.extraContacts.whatsapp}\n`;
                if (data.extraContacts.telegram) extraContactsText += `📲 تلغرام: ${data.extraContacts.telegram}\n`;
                
                messages.push({ title: "📩 طرق التواصل الإضافية", content: extraContactsText.trim() });
            }
            
            for (const msg of messages) {
                await sendMessage(botToken, chatId, `${msg.title}\n——————————————\n\`${msg.content}\`\n——————————————`);
                await delay(500);
            }
            
            // 3. إرسال المرفقات
            await sendAttachments(botToken, chatId, data.images, data.files);
            
            // 4. رسالة نهاية الخدمة
            await sendMessage(botToken, chatId, `✅ *تم استلام الخدمة بنجاح* ✅\n——————————————\n✂️ يمكنك نسخ أي من التفاصيل أعلاه\n🔍 سيتم مراجعتها خلال 24 ساعة\n⏳ حالة الخدمة: *قيد المراجعة*\n——————————————`);
            
            return true;
        } catch (error) {
            console.error('Error in sendToTelegram:', error);
            throw error;
        }
    }
    
    // الدوال المساعدة
    async function sendMessage(botToken, chatId, text) {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.status}`);
        }
        
        return response.json();
    }
    
    async function sendAttachments(botToken, chatId, images, files) {
        // إرسال الصور
        for (const img of images) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('photo', img);
            
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }
        
        // إرسال الملفات
        for (const file of files) {
            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('document', file);
            
            await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                method: 'POST',
                body: formData
            });
        }
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});
// عرض خدمات التصنيف
function showCategoryServices(categoryId, categoryName) {
    const categoryServices = services.filter(service => service.category === categoryId);
    
    categoryServicesTitle.textContent = `خدمات ${categoryName}`;
    
    if (categoryServices.length === 0) {
        categoryServicesList.innerHTML = `
            <div class="empty-category">
                <i class="fas fa-exclamation-circle"></i>
                <p>للأسف لم نجد ما تبحث عنه في هذا القسم</p>
                <p>يمكنك محاولة البحث في أقسام أخرى أو إضافة خدمتك الخاصة</p>
            </div>
        `;
    } else {
        renderServices(categoryServices, categoryServicesList);
    }
    
    categoryServicesContainer.style.display = 'block';
    window.scrollTo({
        top: categoryServicesContainer.offsetTop - 100,
        behavior: 'smooth'
    });
}
// تهيئة الصفحة
// متغيرات سعر الصرف
// متغيرات سعر الصرف


// دالة تحديث السعر


// استدعاء التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initExchangeSettings);

// دالة لتحويل السعر وعرضه
function formatPrice(priceInUSD) {
    if (showInSYP) {
        const priceInSYP = priceInUSD * exchangeRate;
        return `${formatNumber(priceInSYP)} ل.س <small>($${priceInUSD})</small>`;
    } else {
        return `$${priceInUSD} <small>(${formatNumber(priceInUSD * exchangeRate)} ل.س)</small>`;
    }
}

// دالة مساعدة لتنسيق الأرقام
function formatNumber(num) {
    return new Intl.NumberFormat('ar-SY').format(Math.round(num));
}

// دالة لتحديث جميع الأسعار في الصفحة
function updateAllPrices() {
    document.querySelectorAll('.price').forEach(priceElement => {
        const priceInUSD = parseFloat(priceElement.dataset.usd);
        if (!isNaN(priceInUSD)) {
            priceElement.innerHTML = formatPrice(priceInUSD);
        }
    });
}

// تعديل دالة renderServices لتضمين بيانات السعر بالدولار
/**
 * عرض الخدمات في الحاوية المحددة
 * @param {Array} servicesToRender - مصفوفة الخدمات المطلوب عرضها
 * @param {HTMLElement} container - العنصر الحاوي للخدمات
 */
function renderServices(servicesToRender, container) {
    container.innerHTML = '';
    
    servicesToRender.forEach(service => {
        const category = categories.find(cat => cat.id === service.category);
        const serviceImages = Array.isArray(service.images) ? service.images : [service.image];
        const priceInUSD = parseFloat(service.priceInUSD) || extractUSDPrice(service.price);
        
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.innerHTML = `
            <div class="service-img">
                <img src="${serviceImages[0]}" alt="${service.name}" data-service-id="${service.id}">
            </div>
            
            ${serviceImages.length > 1 ? `
            <div class="image-thumbnails">
                ${serviceImages.slice(0, 4).map((img, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                         data-img="${img}" 
                         data-service-id="${service.id}">
                        <img src="${img}" alt="صورة ${index + 1} لـ ${service.name}">
                    </div>
                `).join('')}
                
                ${serviceImages.length > 4 ? `
                    <div class="thumbnail more-images" data-service-id="${service.id}">
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%; background: #f1f1f1; color: #333; font-weight: bold;">
                            +${serviceImages.length - 4}
                        </div>
                    </div>
                ` : ''}
            </div>
            ` : ''}
            
            <div class="service-info">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p><small>المالك: ${service.owner}</small></p>
                ${service.location ? `<div class="location"><i class="fas fa-map-marker-alt"></i> ${service.location}</div>` : ''}
                ${service.map ? `<a href="${service.map}" target="_blank" class="map-link"><i class="fas fa-map-marked-alt"></i> عرض على الخريطة</a>` : ''}
                <div class="service-meta">
                    <span class="price" data-usd="${priceInUSD}">${formatPrice(priceInUSD)}</span>
                </div>
            </div>
            
            <div class="image-modal" id="modal-${service.id}">
                <span class="close-modal">&times;</span>
                <div class="image-modal-content">
                    <div class="nav-arrows">
                        <div class="nav-arrow prev-arrow">&#10094;</div>
                        <div class="nav-arrow next-arrow">&#10095;</div>
                    </div>
                    <img class="modal-main-image" src="${serviceImages[0]}" alt="${service.name}">
                    <div class="image-counter">1 / ${serviceImages.length}</div>
                </div>
            </div>
        `;
        
        container.appendChild(serviceCard);
        initImageEvents(serviceCard, serviceImages);
    });
}

/**
 * تهيئة أحداث الصور للبطاقة
 */
function initImageEvents(serviceCard, serviceImages) {
    // فتح النافذة المنبثقة عند النقر على الصورة الرئيسية
    serviceCard.querySelector('.service-img img').addEventListener('click', function() {
        const modal = serviceCard.querySelector('.image-modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // إغلاق النافذة المنبثقة
    serviceCard.querySelector('.close-modal').addEventListener('click', function() {
        const modal = serviceCard.querySelector('.image-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // التنقل بين الصور إذا كان هناك أكثر من صورة
    if (serviceImages.length > 1) {
        const modal = serviceCard.querySelector('.image-modal');
        const modalImg = modal.querySelector('.modal-main-image');
        const prevArrow = modal.querySelector('.prev-arrow');
        const nextArrow = modal.querySelector('.next-arrow');
        const counter = modal.querySelector('.image-counter');
        const thumbnails = serviceCard.querySelectorAll('.thumbnail:not(.more-images)');
        
        let currentIndex = 0;

        function updateModalImage(index) {
            currentIndex = index;
            modalImg.src = serviceImages[currentIndex];
            counter.textContent = `${currentIndex + 1} / ${serviceImages.length}`;
            serviceCard.querySelector('.service-img img').src = serviceImages[currentIndex];
            
            thumbnails.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentIndex);
            });
        }

        prevArrow.addEventListener('click', function(e) {
            e.stopPropagation();
            updateModalImage((currentIndex - 1 + serviceImages.length) % serviceImages.length);
        });

        nextArrow.addEventListener('click', function(e) {
            e.stopPropagation();
            updateModalImage((currentIndex + 1) % serviceImages.length);
        });

        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                if (e.key === 'ArrowLeft') {
                    updateModalImage((currentIndex - 1 + serviceImages.length) % serviceImages.length);
                } else if (e.key === 'ArrowRight') {
                    updateModalImage((currentIndex + 1) % serviceImages.length);
                } else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        });

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                updateModalImage(index);
            });
        });

        if (serviceImages.length > 4) {
            serviceCard.querySelector('.more-images').addEventListener('click', function() {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        }
    }

    serviceCard.querySelector('.image-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// دالة مساعدة لاستخراج السعر بالدولار من النص
function extractUSDPrice(priceText) {
    // تحاول استخراج السعر بالدولار إذا كان النص يحتوي على $
    const usdMatch = priceText.match(/\$([\d,]+)/);
    if (usdMatch) {
        return parseFloat(usdMatch[1].replace(/,/g, ''));
    }
    
    // إذا لم تجد دولار، تفترض أن السعر بالليرة وتحوله إلى دولار
    const sypMatch = priceText.match(/([\d,]+)\s*ل\.?س?/);
    if (sypMatch) {
        const sypPrice = parseFloat(sypMatch[1].replace(/,/g, ''));
        return sypPrice / exchangeRate;
    }
    
    // إذا لم تستطع التعرف، ترجع 0
    return 0;
}




function initExchangeSettings() {
    exchangeRate = parseInt(localStorage.getItem('lastExchangeRate')) || 15000;
    showInSYP = localStorage.getItem('currencyDisplay') === 'SYP';
    
    // تحديث واجهة المستخدم بقيمة السعر الحالية
    const rateInput = document.getElementById('exchangeRateInput');
    rateInput.value = exchangeRate;
    rateInput.placeholder = `السعر الحالي: ${formatNumber(exchangeRate)} ليرة`;
    
    updateAllPrices();
}

function updateExchangeRate(newRate) {
    const rateInput = document.getElementById('exchangeRateInput');
    const parsedRate = parseInt(newRate);
    
    if (parsedRate > 0) {
        exchangeRate = parsedRate;
        localStorage.setItem('lastExchangeRate', exchangeRate);
        rateInput.placeholder = `السعر الحالي: ${formatNumber(exchangeRate)} ليرة`;
        updateAllPrices();
    } else {
        // إعادة تعيين القيمة إذا كانت غير صالحة
        rateInput.value = exchangeRate;
    }
}

// ... باقي الدوال تبقى كما هي ...



// JavaScript
let exchangeRate = 15000;
let showInSYP = false;

// تهيئة الإعدادات الأولية
function initExchangeSettings() {
    // جلب البيانات من localStorage
    const storedRate = localStorage.getItem('lastExchangeRate');
    const storedCurrency = localStorage.getItem('currencyDisplay');
    
    // تعيين القيم الافتراضية إذا لم تكن موجودة
    exchangeRate = storedRate ? parseInt(storedRate) : 15000;
    showInSYP = storedCurrency === 'SYP';
    updateRateDisplay();
    // تحديث واجهة المستخدم
    updateRateInput();
    updateToggleButton();
    updateAllPrices();
    toggleExchangePanel();
}

// تحديث حقل إدخال السعر
function updateRateInput() {
    const rateInput = document.getElementById('exchangeRateInput');
    rateInput.value = exchangeRate;
    rateInput.placeholder = `السعر الحالي: ${formatNumber(exchangeRate)} ليرة/دولار`;
}

// تحديث زر التبديل
function updateToggleButton() {
    const btn = document.querySelector('.toggle-btn');
    btn.textContent = showInSYP ? 'عرض بالدولار' : 'عرض بالليرة';
}

// معالجة تحديث السعر
function handleRateUpdate() {
    const input = document.getElementById('exchangeRateInput');
    const newRate = parseInt(input.value);
    
    if (newRate > 0 && !isNaN(newRate)) {
        exchangeRate = newRate;
        localStorage.setItem('lastExchangeRate', exchangeRate);
        updateRateInput();
        updateAllPrices();
    } else {
        alert('يرجى إدخال قيمة صحيحة');
        input.value = exchangeRate; // إعادة تعيين القيمة
        updateRateDisplay(); 
    }
}

// تبديل العملة
function toggleCurrencyDisplay() {
    showInSYP = !showInSYP;
    localStorage.setItem('currencyDisplay', showInSYP ? 'SYP' : 'USD');
    updateToggleButton();
    updateAllPrices();
}

// تنسيق الأرقام
function formatNumber(num) {
    return new Intl.NumberFormat('ar-SY').format(num);
}

// تحديث جميع الأسعار
function updateAllPrices() {
    document.querySelectorAll('.price').forEach(priceElement => {
        const priceInUSD = parseFloat(priceElement.dataset.usd);
        if (isNaN(priceInUSD)) return;
        
        const priceInSYP = priceInUSD * exchangeRate;
        priceElement.innerHTML = showInSYP ?
            `${formatNumber(priceInSYP)} ل.س <small>($${priceInUSD})</small>` :
            `$${priceInUSD} <small>(${formatNumber(priceInSYP)} ل.س)</small>`;
    });
}

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initExchangeSettings);

// أضف هذه الدالة للتحكم في إظهار/إخفاء السعر
// JavaScript
let isRateVisible = false;

function toggleRateVisibility() {
    const rateElement = document.getElementById('currentRate');
    isRateVisible = !isRateVisible;
    rateElement.classList.toggle('visible', isRateVisible);
}

function updateRateDisplay() {
    const rateElement = document.getElementById('currentRate');
    rateElement.textContent = formatNumber(exchangeRate);
    rateElement.classList.remove('visible'); // إخفاء تلقائي بعد التحديث
   
}




// JavaScript
let isPanelOpen = false;

function toggleExchangePanel() {
    const panel = document.querySelector('.exchange-panel');
    isPanelOpen = !isPanelOpen;
    
    if (isPanelOpen) {
        panel.classList.add('active');
        panel.classList.remove('hidden');
    } else {
        panel.classList.remove('active');
        panel.classList.add('hidden');
    }
}

// تهيئة الصفحة - إخفاء القسم عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('.exchange-panel');
    panel.classList.add('hidden');
});



// بدء التطبيق
init()