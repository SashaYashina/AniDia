class SplashView {
    constructor() {
        this.canvas = document.getElementById('splashCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.cakeImage = null;
        this.transitioning = false;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.loadImages();
        this.createStars();
        this.startAnimation();
        
        // Обработчики событий
        document.getElementById('cakeContainer').addEventListener('click', () => this.handleCakeClick());
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    loadImages() {
        this.cakeImage = new Image();
        this.cakeImage.src = 'images/cake.png';
        this.cakeImage.onerror = () => {
            console.log('Торт не загружен, используем заглушку');
            this.cakeImage = null;
        };
    }

    createStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 250),
                size: 1 + Math.random() * 3,
                baseBrightness: 0.3 + Math.random() * 0.5,
                pulseSpeed: 0.5 + Math.random()
            });
        }
    }

    draw() {
        // Очистка
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Фон
        this.drawBackground();
        
        // Звезды
        this.drawStars();
        
        // Торт
        this.drawCake();
        
        // Текст
        this.drawText();
    }

    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.8
        );
        
        gradient.addColorStop(0, '#ffff64');
        gradient.addColorStop(0.5, '#ff96c8');
        gradient.addColorStop(1, '#96c8ff');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStars() {
        const currentTime = Date.now() * 0.005;
        
        this.stars.forEach(star => {
            const time = currentTime * star.pulseSpeed;
            let brightness = star.baseBrightness + Math.sin(time) * 0.75;
            brightness = Math.max(0.1, Math.min(1.0, brightness));
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawCake() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const cakeWidth = 400;
        const cakeHeight = 350;

        if (this.cakeImage && this.cakeImage.complete) {
            this.ctx.drawImage(
                this.cakeImage,
                centerX - cakeWidth / 2,
                centerY - cakeHeight / 3,
                cakeWidth,
                cakeHeight
            );
        } else {
            // Заглушка для торта
            this.ctx.fillStyle = 'rgba(255, 204, 153, 0.9)';
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            
            this.ctx.beginPath();
            this.ctx.roundRect(
                centerX - cakeWidth / 2,
                centerY - cakeHeight / 3,
                cakeWidth,
                cakeHeight,
                20
            );
            this.ctx.fill();
            this.ctx.stroke();
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Comic Sans MS';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎂 Кликни на торт!', centerX, centerY + 50);
        }
    }

    drawText() {
        const time = Date.now() * 0.001;
        
        // Основной заголовок
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        const title = "Happy Birthday!";
        this.ctx.fillText(title, this.canvas.width / 2, 100);
        
        // Добавляем тень тексту
        this.ctx.strokeStyle = '#ff69b4';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(title, this.canvas.width / 2, 100);
        
        // Подсказка с миганием
        const alpha = Math.sin(time * 3) * 0.3 + 0.7;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.font = 'italic 18px Segoe Script';
        
        const hint = "Click the cake!";
        this.ctx.fillText(hint, this.canvas.width / 2, this.canvas.height - 80);
    }

    handleCakeClick() {
        if (this.transitioning) return;
        this.startTransition();
    }

    handleHover(event) {
        if (this.transitioning) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const cakeRadius = 200;
        
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        this.canvas.style.cursor = distance < cakeRadius ? 'pointer' : 'default';
    }

    startTransition() {
        this.transitioning = true;
        
        // Анимация перехода
        setTimeout(() => {
            if (typeof window.showAlbum === 'function') {
                window.showAlbum();
            }
        }, 1000);
    }

    startAnimation() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }
}
