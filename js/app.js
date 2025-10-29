class BirthdayApp {
    constructor() {
        this.currentSpread = 0;
        this.totalSpreads = 0;
        
        this.pageImages = [
            'images/album/cover.png',
            'images/album/0.png',
            'images/album/1.png',
            'images/album/2.png',
            'images/album/3.png',
            'images/album/4.png',
            'images/album/5.png',
            'images/album/6.png',
            'images/album/8.png',
            'images/album/9.png',
            'images/album/10.png'
        ];
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация приложения...');
        this.totalSpreads = Math.ceil(this.pageImages.length / 2);
        console.log(`Всего изображений: ${this.pageImages.length}`);
        
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
        const cake = document.getElementById('cake-image');
        if (cake) {
            cake.addEventListener('click', () => {
                this.showAlbum();
            });
        }

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
        console.log('🖼️ Начинаем предзагрузку изображений...');
        this.pageImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`✅ Загружено: ${src}`);
            };
            img.onerror = () => {
                console.log(`❌ ОШИБКА загрузки: ${src}`);
            };
            img.src = src;
        });
    }

    showAlbum() {
        const splash = document.getElementById('splash-screen');
        const album = document.getElementById('album-screen');
        
        if (splash && album) {
            splash.classList.remove('active');
            album.classList.add('active');
            
            this.currentSpread = 0;
            this.showCurrentSpread();
        }
    }

    showSplash() {
        const splash = document.getElementById('splash-screen');
        const album = document.getElementById('album-screen');
        
        if (splash && album) {
            album.classList.remove('active');
            splash.classList.add('active');
        }
    }

    showCurrentSpread() {
        const leftImg = document.getElementById('left-page-img');
        const rightImg = document.getElementById('right-page-img');
        const pageCounter = document.getElementById('page-counter');
        const albumBook = document.querySelector('.album-book');
        
        if (!leftImg || !rightImg) return;

        // Сбрасываем отображение
        leftImg.style.display = 'none';
        rightImg.style.display = 'none';

        if (this.currentSpread === 0) {
            // ПОКАЗЫВАЕМ ТОЛЬКО ОБЛОЖКУ
            rightImg.src = this.pageImages[0];
            rightImg.style.display = 'block';
            if (albumBook) albumBook.classList.remove('show-spread');
            if (pageCounter) pageCounter.textContent = 'Обложка';
        } else {
            // Показываем разворот
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
            
            if (albumBook) albumBook.classList.add('show-spread');
            if (pageCounter) {
                pageCounter.textContent = `Страница ${this.currentSpread} из ${this.totalSpreads - 1}`;
            }
        }

        this.updateNavigation();
    }

    nextSpread() {
        if (this.currentSpread < this.totalSpreads - 1) {
            this.currentSpread++;
            this.showCurrentSpread();
        }
    }

    previousSpread() {
        if (this.currentSpread > 0) {
            this.currentSpread--;
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

document.addEventListener('DOMContentLoaded', () => {
    window.birthdayApp = new BirthdayApp();
});
