class SplashView {
    constructor() {
        this.canvas = document.getElementById('splashCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Прямой обработчик на контейнер торта
        const cakeContainer = document.getElementById('cakeContainer');
        cakeContainer.addEventListener('click', () => {
            console.log('Клик по торту!');
            if (typeof window.showAlbum === 'function') {
                window.showAlbum();
            }
        });
        
        this.startAnimation();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw();
    }

    draw() {
        // Простой фон
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

    startAnimation() {
        const animate = () => {
            this.draw();
            requestAnimationFrame(animate);
        };
        animate();
    }
}
