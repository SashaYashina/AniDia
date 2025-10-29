class SplashScreen {
    constructor() {
        this.canvas = document.getElementById('splash-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cake = document.getElementById('cake-image');
        this.stars = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createStars();
        this.animate();
        
        this.cake.addEventListener('click', () => {
            this.startTransition();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 250),
                size: 1 + Math.random() * 3,
                brightness: 0.3 + Math.random() * 0.5,
                speed: 0.5 + Math.random(),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            0,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width * 0.8
        );
        
        gradient.addColorStop(0, '#fff064');
        gradient.addColorStop(0.5, '#ff96c8');
        gradient.addColorStop(1, '#96c8ff');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStars() {
        const time = Date.now() * 0.005;
        
        this.stars.forEach(star => {
            const brightness = star.brightness + Math.sin(time * star.speed + star.phase) * 0.5;
            const alpha = Math.max(0.1, Math.min(1, brightness));
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        this.drawStars();
        
        requestAnimationFrame(() => this.animate());
    }

    startTransition() {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('album-screen').classList.add('active');
    }
}
