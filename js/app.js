class App {
    constructor() {
        this.splashView = null;
        this.albumView = null;
        this.init();
    }

    init() {
        console.log('Приложение инициализировано');
        
        // Делаем функции глобальными для доступа из HTML
        window.showAlbum = () => {
            console.log('showAlbum вызван');
            this.showAlbum();
        };
        window.showSplash = () => {
            console.log('showSplash вызван');
            this.showSplash();
        };
        
        this.showSplash();
    }

    showSplash() {
        console.log('Показываем заставку');
        document.getElementById('albumScreen').classList.remove('active');
        document.getElementById('splashScreen').classList.add('active');
        
        if (!this.splashView) {
            console.log('Создаем SplashView');
            this.splashView = new SplashView();
        }
    }

    showAlbum() {
        console.log('Показываем альбом');
        document.getElementById('splashScreen').classList.remove('active');
        document.getElementById('albumScreen').classList.add('active');
        
        if (!this.albumView) {
            console.log('Создаем AlbumView');
            this.albumView = new AlbumView();
        } else {
            console.log('Обновляем AlbumView');
            this.albumView.show();
        }
    }
}
