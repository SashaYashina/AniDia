class AlbumView {
    constructor() {
        this.canvas = document.getElementById('albumCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.albumPages = [];
        this.currentSpread = 0;
        this.isTurning = false;
        this.pageTurnProgress = 0;
        this.backgroundImage = null;
        
        this.init();
    }

    async init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        await this.loadImages();
        this.setupEventHandlers();
        this.startAnimation();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawAlbum();
    }

    async loadImages() {
        try {
            // Загружаем фон
            this.backgroundImage = await this.loadImage('images/background.jpg');
        } catch (e) {
            console.log('Фон не загружен, используем градиент');
        }

        // Загружаем страницы альбома
        const pageFiles = [
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

        for (let pageFile of pageFiles) {
            try {
                const image = await this.loadImage(pageFile);
                this.albumPages.push(image);
                console.log('Загружена:', pageFile);
            } catch (e) {
                console.log('Ошибка загрузки', pageFile);
                this.albumPages.push(this.createPageImage(this.albumPages.length));
            }
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Не удалось загрузить: ${src}`));
            img.src = src;
        });
    }

    createPageImage(pageNum) {
        // Создаем виртуальный canvas для заглушки
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 500;
        tempCanvas.height = 600;
        const ctx = tempCanvas.getContext('2d');

        // Фон страницы
        if (pageNum % 2 === 0) {
            ctx.fillStyle = 'rgb(250, 250, 240)'; // Левая страница
        } else {
            ctx.fillStyle = 'rgb(255, 255, 255)'; // Правая страница
        }
        ctx.fillRect(0, 0, 400, 500);

        // Рамка
        ctx.strokeStyle = 'rgb(200, 200, 200)';
        ctx.lineWidth = 1;
        ctx.strokeRect(5, 5, 390, 490);

        // Текст
        ctx.fillStyle = 'rgb(100, 100, 100)';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Фото не найдено', 150, 250);

        // Фото-заглушка
        ctx.fillStyle = 'rgb(230, 230, 230)';
        ctx.fillRect(100, 100, 200, 150);
        ctx.strokeStyle = 'rgb(180, 180, 180)';
        ctx.lineWidth = 2;
        ctx.strokeRect(100, 100, 200, 150);

        ctx.font = '14px Arial';
        ctx.fillText('Фото воспоминания', 130, 270);

        return tempCanvas;
    }

    setupEventHandlers() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        document.getElementById('prevBtn').addEventListener('click', () => this.turnPageBackward());
        document.getElementById('nextBtn').addEventListener('click', () => this.turnPageForward());
        document.getElementById('closeAlbum').addEventListener('click', () => this.closeAlbum());
        
        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            if (!document.getElementById('albumScreen').classList.contains('active')) return;
            
            switch(e.key) {
                case 'ArrowLeft': this.turnPageBackward(); break;
                case 'ArrowRight': this.turnPageForward(); break;
                case 'Escape': this.closeAlbum(); break;
            }
        });
    }

    handleClick(event) {
        if (this.isTurning) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        
        // Клик на правой части - вперед
        if (x > this.canvas.width / 2 && this.currentSpread < this.getMaxSpread()) {
            this.turnPageForward();
        }
        // Клик на левой части - назад
        else if (x < this.canvas.width / 2 && this.currentSpread > 0) {
            this.turnPageBackward();
        }
    }

    getMaxSpread() {
        return Math.floor((this.albumPages.length - 1) / 2);
    }

    turnPageForward() {
        if (this.isTurning || this.currentSpread >= this.getMaxSpread()) return;
        this.startPageTurnAnimation(true);
    }

    turnPageBackward() {
        if (this.isTurning || this.currentSpread <= 0) return;
        this.startPageTurnAnimation(false);
    }

    async startPageTurnAnimation(forward) {
        this.isTurning = true;
        
        const duration = 800; // ms
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            this.pageTurnProgress = Math.min(elapsed / duration, 1);
            
            this.drawAlbum();
            
            if (this.pageTurnProgress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentSpread += forward ? 1 : -1;
                this.isTurning = false;
                this.pageTurnProgress = 0;
                this.drawAlbum();
                this.updateNavigation();
            }
        };
        
        animate();
    }

    drawAlbum() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        
        if (this.isTurning) {
            this.drawPageTurnAnimation();
        } else {
            this.drawCurrentSpread();
        }
    }

    drawBackground() {
        if (this.backgroundImage && this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Градиентный фон
            const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            gradient.addColorStop(0, '#00008B');
            gradient.addColorStop(0.5, '#9400D3');
            gradient.addColorStop(1, '#000000');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawCurrentSpread() {
        const bookWidth = 800;
        const bookHeight = 500;
        const bookX = this.canvas.width / 2 - bookWidth / 2;
        const bookY = this.canvas.height / 2 - bookHeight / 2;

        if (this.currentSpread === 0) {
            // Обложка
            const coverWidth = 600;
            const coverHeight = 600;
            
            if (this.albumPages[0]) {
                this.ctx.drawImage(
                    this.albumPages[0],
                    this.canvas.width / 2 - coverWidth / 2,
                    this.canvas.height / 2 - coverHeight / 2,
                    coverWidth,
                    coverHeight
                );
            }
        } else {
            // Разворот
            const leftPageIndex = this.currentSpread * 2 - 1;
            const rightPageIndex = this.currentSpread * 2;

            // Левая страница
            if (leftPageIndex < this.albumPages.length && this.albumPages[leftPageIndex]) {
                this.ctx.drawImage(
                    this.albumPages[leftPageIndex],
                    bookX,
                    bookY,
                    bookWidth / 2,
                    bookHeight
                );
            }

            // Правая страница
            if (rightPageIndex < this.albumPages.length && this.albumPages[rightPageIndex]) {
                this.ctx.drawImage(
                    this.albumPages[rightPageIndex],
                    bookX + bookWidth / 2,
                    bookY,
                    bookWidth / 2,
                    bookHeight
                );
            }

            // Корешок книги
            this.ctx.fillStyle = 'rgb(0, 0, 0)';
            this.ctx.fillRect(bookX + bookWidth / 2 - 8, bookY, 16, bookHeight);
        }
    }

    drawPageTurnAnimation() {
        // Упрощенная анимация перелистывания
        const bookWidth = 800;
        const bookHeight = 500;
        const bookX = this.canvas.width / 2 - bookWidth / 2;
        const bookY = this.canvas.height / 2 - bookHeight / 2;

        // Тень перелистывания
        this.ctx.fillStyle = `rgba(0, 0, 0, ${0.3 * (1 - Math.abs(this.pageTurnProgress - 0.5) * 2)})`;
        
        if (this.pageTurnProgress < 0.5) {
            this.ctx.fillRect(bookX + bookWidth / 2, bookY, bookWidth / 2, bookHeight);
        } else {
            this.ctx.fillRect(bookX, bookY, bookWidth / 2, bookHeight);
        }
    }

    updateNavigation() {
        document.getElementById('prevBtn').disabled = this.currentSpread === 0;
        document.getElementById('nextBtn').disabled = this.currentSpread === this.getMaxSpread();
        document.getElementById('pageCounter').textContent = `Страница ${this.currentSpread + 1} из ${this.getMaxSpread() + 1}`;
    }

    closeAlbum() {
        if (typeof window.showSplash === 'function') {
            window.showSplash();
        }
    }

    startAnimation() {
        const animate = () => {
            this.drawAlbum();
            requestAnimationFrame(animate);
        };
        animate();
    }

    show() {
        this.updateNavigation();
        this.drawAlbum();
    }
}
