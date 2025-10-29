class BirthdayApp {
    constructor() {
        this.currentSpread = 0;
        this.totalSpreads = 0;
        
        // ПУТИ К СТРАНИЦАМ АЛЬБОМА
        this.pageImages = [
            'images/album/cover.png',     // 0 - обложка
            'images/album/0.png',         // 1  
            'images/album/1.png',         // 2
            'images/album/2.png',         // 3
            'images/album/3.png',         // 4
            'images/album/4.png',         // 5
            'images/album/5.png',         // 6
            'images/album/6.png',         // 7
            'images/album/8.png',         // 8
            'images/album/9.png',         // 9
            'images/album/10.png'         // 10
        ];
        
        this.init();
    }

    init() {
        console.log('🚀 Инициализация приложения...');
        this.totalSpreads = Math.ceil(this.pageImages.length / 2);
        console.log(`Всего изображений: ${this.pageImages.length}`);
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
        console.log('🖼️ Начинаем предзагрузку изображений...');
        this.pageImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`✅ Загружено: ${src} (индекс: ${index})`);
            };
            img.onerror = () => {
                console.log(`❌ ОШИБКА загрузки: ${src} (индекс: ${index})`);
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
        console.log(`📄 Показываем spread ${this.currentSpread}`);
        
        const leftImg = document.getElementById('left-page-img');
        const rightImg = document.getElementById('right-page-img');
        const pageCounter = document.getElementById('page-counter');
        
        if (!leftImg || !rightImg) {
            console.log('❌ Элементы страниц не найдены!');
            return;
        }

        // Сбрасываем отображение
        leftImg.style.display = 'none';
        rightImg.style.display = 'none';
        leftImg.src = '';
        rightImg.src = '';

        if (this.currentSpread === 0) {
            // ПОКАЗЫВАЕМ ТОЛЬКО ОБЛОЖКУ (закрытый альбом)
            console.log(`🖼️ Загружаем обложку: ${this.pageImages[0]}`);
            rightImg.src = this.pageImages[0];
            rightImg.style.display = 'block';
            rightImg.onerror = () => {
                console.log(`❌ Ошибка отображения обложки: ${this.pageImages[0]}`);
            };
            if (pageCounter) pageCounter.textContent = 'Обложка';
        } else {
            // Показываем разворот (левая + правая страницы)
            const leftPageIndex = this.currentSpread * 2 - 1;
            const rightPageIndex = this.currentSpread * 2;

            console.log(`📖 Разворот ${this.currentSpread}: левая=${leftPageIndex}, правая=${rightPageIndex}`);

            if (leftPageIndex < this.pageImages.length) {
                console.log(`← Левая страница: ${this.pageImages[leftPageIndex]}`);
                leftImg.src = this.pageImages[leftPageIndex];
                leftImg.style.display = 'block';
                leftImg.onerror = () => {
                    console.log(`❌ Ошибка отображения левой страницы: ${this.pageImages[leftPageIndex]}`);
                };
            }

            if (rightPageIndex < this.pageImages.length) {
                console.log(`→ Правая страница: ${this.pageImages[rightPageIndex]}`);
                rightImg.src = this.pageImages[rightPageIndex];
                rightImg.style.display = 'block';
                rightImg.onerror = () => {
                    console.log(`❌ Ошибка отображения правой страницы: ${this.pageImages[rightPageIndex]}`);
                };
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
        } else {
            console.log('⏹️ Достигнут конец альбома');
        }
    }

    previousSpread() {
        if (this.currentSpread > 0) {
            this.currentSpread--;
            console.log(`⬅️ Возврат к ${this.currentSpread === 0 ? 'обложке' : 'развороту ' + this.currentSpread}`);
            this.showCurrentSpread();
        } else {
            console.log('⏹️ Достигнуто начало альбома');
        }
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentSpread === 0;
            console.log(`⬅️ Кнопка "Назад": ${prevBtn.disabled ? 'отключена' : 'активна'}`);
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSpread >= this.totalSpreads - 1;
            console.log(`➡️ Кнопка "Вперед": ${nextBtn.disabled ? 'отключена' : 'активна'}`);
        }
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, запускаем приложение...');
    window.birthdayApp = new BirthdayApp();
});
