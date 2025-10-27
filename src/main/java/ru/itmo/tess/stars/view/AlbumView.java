package ru.itmo.tess.stars.view;

import javafx.animation.*;
import javafx.beans.property.DoubleProperty;
import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;
import javafx.scene.input.MouseButton;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.*;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;
import javafx.util.Duration;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class AlbumView {
    private final Canvas canvas;
    private final Scene scene;
    private final StackPane root;
    private final int width = 1000;
    private final int height = 700;

    private List<Image> albumPages;
    private Image backgroundImage;
    private int currentSpread = 0; // Текущий разворот (0, 1, 2...)
    private boolean isTurning = false;
    private double pageTurnProgress = 0.0;

    public AlbumView(Stage stage) {
        this.canvas = new Canvas(width, height);
        this.root = new StackPane(canvas);
        this.scene = new Scene(root, width, height);

        stage.setTitle("Фотоальбом воспоминаний");
        stage.setScene(scene);
        stage.show();

        loadBackgroundImage();
        loadAlbumPages();
        setupEventHandlers();
        drawAlbum();
    }

    private void loadBackgroundImage() {
        try {
            // Загружаем фоновую картинку
            backgroundImage = new Image(Objects.requireNonNull(getClass().getResourceAsStream("/images/background.jpg")));
        } catch (Exception e) {
            // Если картинка не загрузилась, создаем градиентный фон
            backgroundImage = null;
        }
    }

    private void loadAlbumPages() {
        albumPages = new ArrayList<>();

        // Загружаем все страницы
        String[] pageFiles = {
                "/images/album/cover.png",
                "/images/album/0.png",
                "/images/album/1.png",
                "/images/album/2.png",
                "/images/album/3.png",
                "/images/album/4.png",
                "/images/album/5.png",
                "/images/album/6.png",
                "/images/album/8.png",
                "/images/album/9.png",
                "/images/album/10.png"
        };

        for (String pageFile : pageFiles) {
            try {
                Image page = new Image(Objects.requireNonNull(getClass().getResourceAsStream(pageFile)));
                albumPages.add(page);
                System.out.println("Загружена: " + pageFile);
            } catch (Exception e) {
                System.out.println("Ошибка загрузки " + pageFile + ": " + e.getMessage());
                // Создаем заглушку если фото не найдено
                albumPages.add(createPageImage(albumPages.size()));
            }
        }
    }


    private Image createPageImage(int pageNum) {
        Canvas tempCanvas = new Canvas(500, 600);
        GraphicsContext gc = tempCanvas.getGraphicsContext2D();

        // Фон страницы
        if (pageNum % 2 == 0) {
            gc.setFill(Color.rgb(250, 250, 240)); // Левая страница
        } else {
            gc.setFill(Color.rgb(255, 255, 255)); // Правая страница
        }
        gc.fillRect(0, 0, 400, 500);

        // Рамка
        gc.setStroke(Color.rgb(200, 200, 200));
        gc.setLineWidth(1);
        gc.strokeRect(5, 5, 390, 490);

        // Текст
        gc.setFill(Color.rgb(100, 100, 100));
        gc.setFont(Font.font("Arial", FontWeight.BOLD, 20));
        gc.fillText("Фото не найдено", 150, 250);

        // Фото-заглушка
        gc.setFill(Color.rgb(230, 230, 230));
        gc.fillRect(100, 100, 200, 150);
        gc.setStroke(Color.rgb(180, 180, 180));
        gc.setLineWidth(2);
        gc.strokeRect(100, 100, 200, 150);

        gc.setFont(Font.font("Arial", FontWeight.NORMAL, 14));
        gc.fillText("Фото воспоминания", 130, 270);

        return tempCanvas.snapshot(null, null);
    }

    private void setupEventHandlers() {
        canvas.setOnMouseClicked(event -> {
            if (isTurning) return;

            if (event.getButton() == MouseButton.PRIMARY) {
                // Клик на правой части - вперед
                if (event.getX() > (double) width / 2 && currentSpread < getMaxSpread()) {
                    turnPageForward();
                }
                // Клик на левой части - назад
                else if (event.getX() < (double) width / 2 && currentSpread > 0) {
                    turnPageBackward();
                }
            }
        });
    }

    private int getMaxSpread() {
        return (albumPages.size() - 1) / 2; // -1 потому что 0-й элемент это обложка
    }

    private void turnPageForward() {
        if (isTurning || currentSpread >= getMaxSpread()) return;

        isTurning = true;
        startPageTurnAnimation(true, () -> {
            currentSpread++;
            isTurning = false;
            pageTurnProgress = 0.0;
            drawAlbum();
        });
    }

    private void turnPageBackward() {
        if (isTurning || currentSpread <= 0) return;

        isTurning = true;
        startPageTurnAnimation(false, () -> {
            currentSpread--;
            isTurning = false;
            pageTurnProgress = 0.0;
            drawAlbum();
        });
    }

    private void startPageTurnAnimation(boolean forward,
                                        Runnable onFinished) {
        Timeline timeline = new Timeline(
                new KeyFrame(Duration.millis(0), new KeyValue(pageTurnProgressProperty(), 0.0)),
                new KeyFrame(Duration.millis(800), new KeyValue(pageTurnProgressProperty(), 1.0))
        );

        timeline.setOnFinished(e -> onFinished.run());
        timeline.play();
    }

    private DoubleProperty pageTurnProgressProperty() {
        return new javafx.beans.property.SimpleDoubleProperty() {
            @Override
            public void set(double value) {
                super.set(value);
                pageTurnProgress = value;
                drawAlbum();
            }
        };
    }

    private void drawAlbum() {
        GraphicsContext gc = canvas.getGraphicsContext2D();
        gc.clearRect(0, 0, width, height);

        drawBackground(gc);

        if (isTurning) {
            drawPageTurnAnimation(gc);
        } else {
            drawCurrentSpread(gc);
        }
    }

    private void drawBackground(GraphicsContext gc) {
        if (backgroundImage != null) {
            // Рисуем фоновую картинку на весь экран
            gc.drawImage(backgroundImage, 0, 0, width, height);
        } else {
            // Запасной вариант - градиентный фон
            LinearGradient gradient = new LinearGradient(0, 0, 0, 1, true, CycleMethod.NO_CYCLE,
                    new Stop(0, Color.DARKBLUE),
                    new Stop(0.5, Color.DARKVIOLET),
                    new Stop(1, Color.BLACK)
            );
            gc.setFill(gradient);
            gc.fillRect(0, 0, width, height);
        }
    }

    private void drawCurrentSpread(GraphicsContext gc) {
        double bookWidth = 800;
        double bookHeight = 500;
        double bookX = (double) width / 2 - bookWidth / 2;
        double bookY = (double) height / 2 - bookHeight / 2;

        if (currentSpread == 0) {
            // УВЕЛИЧИВАЕМ ОБЛОЖКУ - меняем эти параметры:
            double coverWidth = 600;  // Было bookWidth / 2 = 400
            double coverHeight = 600; // Было bookHeight = 500

            Image cover = albumPages.get(0);
            gc.drawImage(cover,
                    (double) width / 2 - coverWidth / 2,  // Центрируем по горизонтали
                    (double) height / 2 - coverHeight / 2, // Центрируем по вертикали
                    coverWidth,
                    coverHeight);
        } else {
            // Показываем разворот: левая и правая страницы
            int leftPageIndex = currentSpread * 2 - 1;
            int rightPageIndex = currentSpread * 2;

            if (leftPageIndex < albumPages.size()) {
                Image leftPage = albumPages.get(leftPageIndex);
                gc.drawImage(leftPage, bookX, bookY, bookWidth / 2, bookHeight);
            }

            if (rightPageIndex < albumPages.size()) {
                Image rightPage = albumPages.get(rightPageIndex);
                gc.drawImage(rightPage, bookX + bookWidth / 2, bookY, bookWidth / 2, bookHeight);
            }

            // Корешок книги
            gc.setFill(Color.rgb(0, 0, 0));
            gc.fillRect(bookX + bookWidth / 2 - 8, bookY, 16, bookHeight);
        }
    }

    private void drawPageTurnAnimation(GraphicsContext gc) {
        double bookWidth = 800;
        double bookHeight = 500;
        double bookX = (double) width / 2 - bookWidth / 2;
        double bookY = (double) height / 2 - bookHeight / 2;

        // Статичная страница (оставшаяся)
        if (pageTurnProgress < 0.5) {
            // Показываем текущий разворот
            drawCurrentSpread(gc);
        } else {
            // Показываем следующий разворот
            if (currentSpread + 1 <= getMaxSpread()) {
                if (currentSpread + 1 == 1) {
                    // Переход к первому развороту
                    Image leftPage = albumPages.get(1);
                    Image rightPage = albumPages.get(2);
                    gc.drawImage(leftPage, bookX, bookY, bookWidth / 2, bookHeight);
                    gc.drawImage(rightPage, bookX + bookWidth / 2, bookY, bookWidth / 2, bookHeight);
                } else {
                    // Обычный разворот
                    int leftPageIndex = (currentSpread + 1) * 2 - 1;
                    int rightPageIndex = (currentSpread + 1) * 2;

                    if (leftPageIndex < albumPages.size()) {
                        Image leftPage = albumPages.get(leftPageIndex);
                        gc.drawImage(leftPage, bookX, bookY, bookWidth / 2, bookHeight);
                    }

                    if (rightPageIndex < albumPages.size()) {
                        Image rightPage = albumPages.get(rightPageIndex);
                        gc.drawImage(rightPage, bookX + bookWidth / 2, bookY, bookWidth / 2, bookHeight);
                    }
                }

                // Корешок
                gc.setFill(Color.rgb(0, 0, 0));
                gc.fillRect(bookX + bookWidth / 2 - 8, bookY, 16, bookHeight);
            }
        }

        // Анимированная тень перелистывания
        gc.setFill(Color.rgb(0, 0, 0, 0.3 * (1 - Math.abs(pageTurnProgress - 0.5) * 2)));
        if (pageTurnProgress < 0.5) {
            gc.fillRect(bookX + bookWidth / 2, bookY, bookWidth / 2, bookHeight);
        } else {
            gc.fillRect(bookX, bookY, bookWidth / 2, bookHeight);
        }
    }

    public Canvas getCanvas() { return canvas; }
    public Scene getScene() { return scene; }
    public StackPane getRoot() { return root; }
}