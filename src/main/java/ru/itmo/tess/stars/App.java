package ru.itmo.tess.stars;

import javafx.application.Application;
import javafx.stage.Stage;
import javafx.scene.image.Image;
import ru.itmo.tess.stars.controller.MainController;

public class App extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        // Устанавливаем иконку приложения
        try {
            Image icon = new Image(getClass().getResourceAsStream("/images/icon.jpg"));
            primaryStage.getIcons().add(icon);
            System.out.println("✅ Иконка приложения установлена");
        } catch (Exception e) {
            System.out.println("❌ Не удалось загрузить иконку: " + e.getMessage());
        }

        MainController mainController = new MainController(primaryStage);
        mainController.init();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

