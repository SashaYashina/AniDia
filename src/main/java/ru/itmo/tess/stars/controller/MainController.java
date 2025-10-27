package ru.itmo.tess.stars.controller;

import javafx.stage.Stage;
import ru.itmo.tess.stars.view.AlbumView;
import ru.itmo.tess.stars.view.SplashView;

public class MainController {
    private Stage stage;
    private SplashView splashView;
    private AlbumView albumView;

    private boolean inAlbumScene = false;

    public MainController(Stage stage) {
        this.stage = stage;

        // Сначала показываем заставку с тортом
        showSplash();
    }

    public void init() {
        // Логика инициализации
    }

    private void showSplash() {
        splashView = new SplashView(stage);
        splashView.setOnCakeClicked(this::showAlbumScene);
        splashView.show();
    }

    private void showAlbumScene() {
        inAlbumScene = true;

        // Создаем сцену с альбомом
        this.albumView = new AlbumView(stage);

        // Здесь можно добавить обработчики событий для альбома, если нужно
        setupAlbumEventHandlers();
    }

    private void setupAlbumEventHandlers() {
        // Можно добавить обработку кликов по альбому, если нужно
        // Например, для перелистывания страниц или показа фотографий
    }
}