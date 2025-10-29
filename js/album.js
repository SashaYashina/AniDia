class PhotoAlbum {
    constructor() {
        this.currentSpread = 0;
        this.pages = [
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
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.leftPage = document.getElementById('left-page-img');
        this.rightPage = document.getElementById('right-page-img');

        this.prevBtn.addEventListener('click', () => this.turnPageBackward());
        this.nextBtn.addEventListener('click', () => this.turnPageForward());

        this.updatePages();
        this.updateNavigation();
    }

    getMaxSpread() {
        return Math.floor((this.pages.length - 1) / 2);
    }

    updatePages() {
        if (this.currentSpread === 0) {
            // Показываем обложку
            this.leftPage.style.display = 'none';
            this.rightPage.src = this.pages[0];
            this.rightPage.style.display = 'block';
        } else {
            // Показываем разворот
            const leftPageIndex = this.currentSpread * 2 - 1;
            const rightPageIndex = this.currentSpread * 2;

            this.leftPage.style.display = 'block';
            this.rightPage.style.display = 'block';

            if (leftPageIndex < this.pages.length) {
                this.leftPage.src = this.pages[leftPageIndex];
            }

            if (rightPageIndex < this.pages.length) {
                this.rightPage.src = this.pages[rightPageIndex];
            }
        }
    }

    updateNavigation() {
        this.prevBtn.disabled = this.currentSpread === 0;
        this.nextBtn.disabled = this.currentSpread >= this.getMaxSpread();
    }

    turnPageForward() {
        if (this.currentSpread < this.getMaxSpread()) {
            this.currentSpread++;
            this.updatePages();
            this.updateNavigation();
        }
    }

    turnPageBackward() {
        if (this.currentSpread > 0) {
            this.currentSpread--;
            this.updatePages();
            this.updateNavigation();
        }
    }
}
