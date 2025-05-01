const categories = [
    { id: 'maintenance', name: 'صيانة', icon: 'fa-tools' },
    { id: 'transport', name: 'نقل', icon: 'fa-truck' },
    { id: 'education', name: 'تعليم', icon: 'fa-graduation-cap' },
    { id: 'agriculture', name: 'زراعة', icon: 'fa-tractor' },
    { id: 'construction', name: 'بناء', icon: 'fa-hammer' },
    { id: 'food', name: 'طعام', icon: 'fa-utensils' },
    { id: 'health', name: 'صحة', icon: 'fa-heartbeat' },
    { id: 'technology', name: 'تقنية', icon: 'fa-laptop' }
];

// بيانات الخدمات (يمكن استبدالها بقاعدة بيانات حقيقية)
let services = [
    {
        id: 1,
        name: "صيانة ثلاجات",
        category: "maintenance",
        description: "صيانة جميع أنواع الثلاجات المنزلية بأسعار مناسبة وضمان على العمل",
        owner: "محمد أحمد",
        priceInUSD: 20,
        location: "غرانيج",
        phone: "0935123456",
        map: "https://goo.gl/maps/...",
        images: [
            "phote/1.jpg",
            "phote/1-2.jpg",
          
        ]
    },
    {
        id: 2,
        name: "نقل أثاث",
        category: "transport",
        description: "خدمة نقل أثاث محترفة مع الفك والتركيب والتغليف لجميع أنحاء المحافظة",
        owner: "علي حسن",
        priceInUSD: 33,
        location: "غرانيج",
        phone: "0945123456",
        map: "https://goo.gl/maps/...",
        images: [
            "phote/2.jpg",
           
        ]
    },
    {
        id: 3,
        name: "دروس خصوصية",
        category: "education",
        description: "دروس خصوصية في جميع المواد للمراحل الدراسية المختلفة",
        owner: "أحمد خالد",
        priceInUSD: 43,
        location: "غرانيج",
        phone: "0955123456",
        images: ["phote/3.jpg",


        ]
    },
    {
        id: 4,
        name: "حراثة أراضي",
        category: "agriculture",
        description: "خدمة حراثة الأراضي الزراعية بأحدث المعدات وخبرة طويلة",
        owner: "محمود علي",
        priceInUSD: 12,
        location: "غرانيج",
        phone: "0965123456",
        images: [
            "phote/4.jpg",
             "phote/4-2.jpg"
            
        ]
    }
];