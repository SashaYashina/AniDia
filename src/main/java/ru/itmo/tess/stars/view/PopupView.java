package ru.itmo.tess.stars.view;

import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Modality;
import javafx.stage.Stage;

public class PopupView {
    public static void show(String imagePath, String caption) {
        Stage popupStage = new Stage();
        popupStage.initModality(Modality.APPLICATION_MODAL);

        ImageView imageView = new ImageView();
        Label label = new Label(caption);

        try {
            // Пробуем загрузить изображение
            Image image = new Image(PopupView.class.getResourceAsStream(imagePath));
            if (!image.isError()) {
                imageView.setImage(image);
            } else {
                throw new Exception("Image loading error");
            }
        } catch (Exception e) {
            // Если изображение не загрузилось, создаем красивую заглушку
            imageView.setImage(createMemoryPlaceholder(caption));
        }

        imageView.setFitWidth(300);
        imageView.setPreserveRatio(true);

        label.setStyle("-fx-text-fill: white; -fx-font-size: 14px; -fx-font-weight: bold;");

        VBox vbox = new VBox(imageView, label);
        vbox.setSpacing(15);
        vbox.setStyle("-fx-background-color: #2c3e50; -fx-padding: 20; -fx-alignment: center;");

        Scene scene = new Scene(vbox, 320, 400);
        scene.setFill(Color.web("#2c3e50"));

        popupStage.setScene(scene);
        popupStage.setTitle("Воспоминание");
        popupStage.showAndWait();
    }

    private static Image createMemoryPlaceholder(String caption) {
        javafx.scene.canvas.Canvas canvas = new javafx.scene.canvas.Canvas(300, 250);
        javafx.scene.canvas.GraphicsContext gc = canvas.getGraphicsContext2D();

        // Фон
        gc.setFill(Color.LIGHTSKYBLUE);
        gc.fillRect(0, 0, 300, 250);

        // Рамка
        gc.setStroke(Color.DARKBLUE);
        gc.setLineWidth(3);
        gc.strokeRect(5, 5, 290, 240);

        // Иконка фотоаппарата
        gc.setFill(Color.GRAY);
        gc.fillRect(120, 80, 60, 40);
        gc.fillRect(135, 70, 30, 15);
        gc.setFill(Color.DARKGRAY);
        gc.fillOval(145, 90, 10, 10);

        // Текст
        gc.setFill(Color.DARKBLUE);
        gc.setFont(javafx.scene.text.Font.font("Arial", 16));
        gc.fillText("Фото воспоминания", 80, 150);

        gc.setFont(javafx.scene.text.Font.font("Arial", 12));
        gc.fillText(caption, 50, 180);

        gc.setFill(Color.GRAY);
        gc.fillText("(добавьте фото в папку /images/memories/)", 30, 200);

        return canvas.snapshot(null, null);
    }
}