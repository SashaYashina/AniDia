class BirthdayApp {
    constructor() {
        this.currentSpread = 0; // текущий разворот (0 = обложка, 1 = стр 1-2, 2 = стр 3-4...)
        this.totalSpreads = 0;
        
        // Имена ваших PNG файлов - ПРОВЕРЬТЕ ЭТИ ИМЕНА!
        this.pageImages = [
            'images/cover.png',    // 0 - обложка
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
        
        // Показываем первую страницу сразу
        this.showCurrentSpread();
    }

    createStars() {
        const starsBg = document.getElementById('stars-bg');
        if (!starsBg) {
            console.log('❌ Элемент stars-bg не найден');
            return;
        }

        const starCount = 100;
        starsBg.innerHTML = ''; // Очищаем старые звезды

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
        console.log('⭐ Создано звезд: ' + starCount);
    }

    setupEventListeners() {
        // Клик по торту
        const cake = document.getElementById('cake-image');
        if (cake) {
            cake.addEventListener('click', () => {
                console.log('🎂 Клик по торту!');
                this.showAlbum();
            });
        } else {
            console.log('❌ Торт не найден');
        }

        // Навигация по альбому
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('⬅️ Назад');
                this.previousSpread();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('➡️ Вперед');
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

        console.log('✅ Обработчики событий установлены');
    }

    preloadImages() {
        console.log('🖼️ Предзагрузка изображений...');
        let loaded = 0;
        
        this.pageImages.forEach((src, index) => {
            const img = new Image();
            img.onload = () => {
                loaded++;
                console.log(`✅ Загружено: ${src}`);
            };
            img.onerror = () => {
                console.log(`❌ Ошибка загрузки: ${src}`);
            };
            img.src = src;
        });
    }

    showAlbum() {
        console.log('📖 Переход к альбому');
        const splash = document.getElementById('splash-screen');
        const album = document.getElementById('album-screen');
        
        if (splash && album) {
            splash.classList.remove('active');
            album.classList.add('active');
            this.showCurrentSpread();
        } else {
            console.log('❌ Элементы экранов не найдены');
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
        console.log(`📄 Показываем разворот ${this.currentSpread}`);
        
        const leftImg = document.getElementById('left-page-img');
        const rightImg = document.getElementById('right-page-img');
        const pageCounter = document.getElementById('page-counter');
        
        if (!leftImg || !rightImg) {
            console.log('❌ Элементы страниц не найдены');
            return;
        }

        // Сбрасываем отображение
        leftImg.style.display = 'none';
        rightImg.style.display = 'none';
        leftImg.src = '';
        rightImg.src = '';

        if (this.currentSpread === 0) {
            // Показываем только обложку
            console.log('📕 Показываем обложку');
            rightImg.src = this.pageImages[0];
            rightImg.style.display = 'block';
            if (pageCounter) pageCounter.textContent = 'Обложка';
        } else {
            // Показываем разворот
            const leftPageIndex = this.currentSpread * 2 - 1;
            const rightPageIndex = this.currentSpread * 2;
            
            console.log(`📖 Левый индекс: ${leftPageIndex}, Правый индекс: ${rightPageIndex}`);

            if (leftPageIndex < this.pageImages.length) {
                leftImg.src = this.pageImages[leftPageIndex];
                leftImg.style.display = 'block';
                console.log(`← Левая страница: ${this.pageImages[leftPageIndex]}`);
            }

            if (rightPageIndex < this.pageImages.length) {
                rightImg.src = this.pageImages[rightPageIndex];
                rightImg.style.display = 'block';
                console.log(`→ Правая страница: ${this.pageImages[rightPageIndex]}`);
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
            console.log(`⬅️ Возврат к развороту ${this.currentSpread}`);
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
    
    // Для отладки - автоматический переход через 2 секунды
    setTimeout(() => {
        console.log('🔧 Автопереход для тестирования');
        // birthdayApp.showAlbum();
    }, 2000);
});
