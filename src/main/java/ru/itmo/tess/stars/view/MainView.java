package ru.itmo.tess.stars.view;

import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;

public class MainView {
    private final Canvas canvas;
    private final Scene scene;
    private final StackPane root;

    public MainView(Stage stage, int width, int height) {
        this.canvas = new Canvas(width, height);
        this.root = new StackPane(canvas);
        this.scene = new Scene(root, width, height);

        // Красивый CSS стиль
        root.setStyle("-fx-background: #1a1a2e; -fx-border-color: #16213e; -fx-border-width: 2;");

        stage.setTitle("Созвездие тепла - Мир воспоминаний");
        stage.setScene(scene);
        stage.show();
    }

    public Canvas getCanvas() { return canvas; }
    public Scene getScene() { return scene; }
    public StackPane getRoot() { return root; }
}