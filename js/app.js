class App {
    constructor() {
        this.splashView = null;
        this.albumView = null;
        this.init();
    }

    init() {
        // Делаем функции глобальными для доступа из HTML
        window.showAlbum = () => this.showAlbum();
        window.showSplash = () => this.showSplash();
        
        this.showSplash();
    }

    showSplash() {
        document.getElementById('albumScreen').classList.remove('active');
        document.getElementById('splashScreen').classList.add('active');
        
        if (!this.splashView) {
            this.splashView = new SplashView();
        }
    }

    showAlbum() {
        document.getElementById('splashScreen').classList.remove('active');
        document.getElementById('albumScreen').classList.add('active');
        
        if (!this.albumView) {
            this.albumView = new AlbumView();
        } else {
            this.albumView.show();
        }
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Попап для фото
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('photoPopup');
    const closePopup = document.querySelector('.close-popup');
    
    closePopup.addEventListener('click', function() {
        popup.classList.remove('active');
    });
    
    // Закрытие попапа по клику вне контента
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            popup.classList.remove('active');
        }
    });
});

// Функция для показа фото в попапе
function showPhoto(imageSrc, caption) {
    const popup = document.getElementById('photoPopup');
    const popupImage = document.getElementById('popupImage');
    const popupCaption = document.getElementById('popupCaption');
    
    popupImage.src = imageSrc;
    popupImage.alt = caption;
    popupCaption.textContent = caption;
    
    popup.classList.add('active');
}
