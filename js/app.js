class BirthdayApp {
    constructor() {
        this.currentSpread = 0; // 0 = обложка (закрытый альбом)
        this.totalSpreads = 0;
        
        // Имена ваших PNG файлов
        this.pageImages = [
            'images/cover.png',    // 0 - обложка (закрытый альбом)
            'images/page0.png',    // 1
            'images/page1.png',    // 2  
            'images/page2.png',    // 3
            'images/page3.png',    // 4
            'images/page4.png',    // 5
            'images/page5.png',    // 6
            'images/page6.png',    // 7
            'images/page7.png',    // 8
            'images/page8.png',    // 9
            'images/page9.png',    // 10
            'images/page10.png'    // 11
        ];
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация приложения...');
        this.totalSpreads = Math.ceil(this.pageImages.length / 2);
        console.log(`Всего разворотов: ${this.totalSpreads}`);
        
        this.createStars();
        this.setupEventListeners();
        this.preloadImages();
    }

    createStars() {
        const starsBg = document.getElementById('stars-bg');
        if (!starsBg) return;

        const starCount = 100;
        starsBg.innerHTML = '';

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            const size = 1 + Math.random() * 3;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            star.style.animationDelay = Math.random() * 3 + 's';
            
            starsBg.appendChild(star);
        }
    }

    setupEventListeners() {
        // Клик по торту - переход к ОБЛОЖКЕ альбома
        const cake = document.getElementById('cake-image');
        if (cake) {
            cake.addEventListener('click', () => {
                console.log('🎂 Клик по торту! Переход к обложке альбома');
                this.showAlbum();
            });
        }

        // Навигация по альбому
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousSpread();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSpread();
            });
        }

        // Клавиши клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSpread();
            } else if (e.key === 'ArrowRight') {
                this.nextSpread();
            } else if (e.key === 'Escape') {
                this.showSplash();
            }
        });
    }

    preloadImages() {
        this.pageImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`✅ Загружено: ${src}`);
            };
            img.onerror = () => {
                console.log(`❌ Ошибка загрузки: ${src}`);
            };
            img.src = src;
        });
    }

    showAlbum() {
        console.log('📖 Переход к альбому (обложка)');
        const splash = document.getElementById('splash-screen');
        const album = document.getElementById('album-screen');
        
        if (splash && album) {
            splash.classList.remove('active');
            album.classList.add('active');
            
            // Показываем ОБЛОЖКУ (закрытый альбом)
            this.currentSpread = 0;
            this.showCurrentSpread();
        }
    }

    showSplash() {
        console.log('🏠 Возврат к заставке');
        const splash = document.getElementById('splash-screen');
        const album = document.getElementById('album-screen');
        
        if (splash && album) {
            album.classList.remove('active');
            splash.classList.add('active');
        }
    }

    showCurrentSpread() {
        console.log(`📄 Показываем: ${this.currentSpread === 0 ? 'ОБЛОЖКА' : 'Разворот ' + this.currentSpread}`);
        
        const leftImg = document.getElementById('left-page-img');
        const rightImg = document.getElementById('right-page-img');
        const pageCounter = document.getElementById('page-counter');
        
        if (!leftImg || !rightImg) return;

        // Сбрасываем отображение
        leftImg.style.display = 'none';
        rightImg.style.display = 'none';

        if (this.currentSpread === 0) {
            // ПОКАЗЫВАЕМ ТОЛЬКО ОБЛОЖКУ (закрытый альбом)
            rightImg.src = this.pageImages[0];
            rightImg.style.display = 'block';
            if (pageCounter) pageCounter.textContent = 'Обложка';
        } else {
            // Показываем разворот (левая + правая страницы)
            const leftPageIndex = this.currentSpread * 2 - 1;
            const rightPageIndex = this.currentSpread * 2;

            if (leftPageIndex < this.pageImages.length) {
                leftImg.src = this.pageImages[leftPageIndex];
                leftImg.style.display = 'block';
            }

            if (rightPageIndex < this.pageImages.length) {
                rightImg.src = this.pageImages[rightPageIndex];
                rightImg.style.display = 'block';
            }
            
            if (pageCounter) {
                pageCounter.textContent = `Страница ${this.currentSpread} из ${this.totalSpreads - 1}`;
            }
        }

        this.updateNavigation();
    }

    nextSpread() {
        if (this.currentSpread < this.totalSpreads - 1) {
            this.currentSpread++;
            console.log(`➡️ Переход к развороту ${this.currentSpread}`);
            this.showCurrentSpread();
        }
    }

    previousSpread() {
        if (this.currentSpread > 0) {
            this.currentSpread--;
            console.log(`⬅️ Возврат к ${this.currentSpread === 0 ? 'обложке' : 'развороту ' + this.currentSpread}`);
            this.showCurrentSpread();
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentSpread === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSpread >= this.totalSpreads - 1;
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, запускаем приложение...');
    window.birthdayApp = new BirthdayApp();
});
