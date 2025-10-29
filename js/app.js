document.addEventListener('DOMContentLoaded', function() {
    // Инициализация приложения
    const splashScreen = new SplashScreen();
    const album = new PhotoAlbum();
class BirthdayApp {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 11; // cover + 10 pages
        
        // Имена ваших PNG файлов
        this.pageImages = [
            'images/cover.png',
            'images/page0.png',
            'images/page1.png', 
            'images/page2.png',
            'images/page3.png',
            'images/page4.png',
            'images/page5.png',
            'images/page6.png',
            'images/page7.png',
            'images/page8.png',
            'images/page9.png',
            'images/page10.png'
        ];
        
        this.init();
    }

    init() {
        this.createStars();
        this.setupEventListeners();
        this.preloadImages();
    }

    createStars() {
        const starsBg = document.getElementById('stars-bg');
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Случайная позиция
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Случайный размер
            const size = 1 + Math.random() * 3;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            // Случайная задержка анимации
            star.style.animationDelay = Math.random() * 3 + 's';
            
            starsBg.appendChild(star);
        }
    }

    setupEventListeners() {
        // Клик по торту
        document.getElementById('cake-image').addEventListener('click', () => {
            this.showAlbum();
        });

        // Навигация по альбому
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextPage();
        });

        // Клавиши клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousPage();
            } else if (e.key === 'ArrowRight') {
                this.nextPage();
            } else if (e.key === 'Escape') {
                this.showSplash();
            }
        });
    }

    preloadImages() {
        this.pageImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    showAlbum() {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('album-screen').classList.add('active');
        this.showPage(0);
    }

    showSplash() {
        document.getElementById('album-screen').classList.remove('active');
        document.getElementById('splash-screen').classList.add('active');
    }

    showPage(pageIndex) {
        this.currentPage = pageIndex;
        
        const leftImg = document.getElementById('left-page-img');
        const rightImg = document.getElementById('right-page-img');
        const pageCounter = document.getElementById('page-counter');
        
        // Сбрасываем отображение
        leftImg.style.display = 'none';
        rightImg.style.display = 'none';

        if (pageIndex === 0) {
            // Показываем только обложку на правой странице
            rightImg.src = this.pageImages[0];
            rightImg.style.display = 'block';
            pageCounter.textContent = 'Обложка';
        } else {
            // Показываем разворот
            const leftPageIndex = pageIndex * 2 - 1;
            const rightPageIndex = pageIndex * 2;

            if (leftPageIndex < this.pageImages.length) {
                leftImg.src = this.pageImages[leftPageIndex];
                leftImg.style.display = 'block';
            }

            if (rightPageIndex < this.pageImages.length) {
                rightImg.src = this.pageImages[rightPageIndex];
                rightImg.style.display = 'block';
            }
            
            pageCounter.textContent = `Страница ${pageIndex} из ${Math.floor(this.totalPages / 2)}`;
        }

        this.updateNavigation();
    }

    nextPage() {
        const maxSpread = Math.floor(this.totalPages / 2);
        if (this.currentPage < maxSpread) {
            this.showPage(this.currentPage + 1);
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.showPage(this.currentPage - 1);
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const maxSpread = Math.floor(this.totalPages / 2);

        prevBtn.disabled = this.currentPage === 0;
        nextBtn.disabled = this.currentPage >= maxSpread;
    }
}

// Запуск приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    window.birthdayApp = new BirthdayApp();
    console.log('🎉 Приложение "С Днем Рождения!" запущено!');
    
    // Автоматический переход к альбому для тестирования
    // setTimeout(() => birthdayApp.showAlbum(), 1000);
});
    console.log('🎉 Приложение "С Днем Рождения!" запущено!');
});
