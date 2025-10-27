package ru.itmo.tess.stars.view;

import javafx.scene.Scene;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.image.Image;
import javafx.scene.input.MouseEvent;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.*;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import javafx.stage.Stage;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class SplashView {
    private final Stage stage;
    private final Canvas canvas;
    private final Scene scene;
    private final int width = 1000;
    private final int height = 700;

    private Runnable onCakeClicked;
    private final List<Star> stars;
    private boolean transitioning = false;

    public SplashView(Stage stage) {
        this.stage = stage;
        this.canvas = new Canvas(width, height);
        StackPane root = new StackPane(canvas);
        this.scene = new Scene(root, width, height);
        scene.setFill(Color.TRANSPARENT);
        this.stars = createStars();

        setupUI();
        setupEventHandlers();
    }

    private void setupUI() {
        stage.setTitle("С Днем Рождения!");
        stage.setScene(scene);

        drawBeautifulSplash();
    }

    private void setupEventHandlers() {
        canvas.addEventHandler(MouseEvent.MOUSE_CLICKED, this::handleClick);
        canvas.addEventHandler(MouseEvent.MOUSE_MOVED, this::handleHover);
    }

    private List<Star> createStars() {
        List<Star> stars = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            double x = Math.random() * width;
            double y = Math.random() * (height - 250);
            double size = 1 + Math.random() * 3;
            double baseBrightness = 0.3 + Math.random() * 0.5;
            double pulseSpeed = 0.5 + Math.random();
            stars.add(new Star(x, y, size, baseBrightness, pulseSpeed));
        }
        return stars;
    }

    private void drawBeautifulSplash() {
        GraphicsContext gc = canvas.getGraphicsContext2D();

        // Темный фон как на картинке
        drawBrightPartyBackground(gc);

        // Медленно мерцающие звезды
        drawTwinklingStars(gc);

        // Торт из картинки
        drawCakeImage(gc);

        // Текст как на картинке
        drawStyledText(gc);
    }

    private void drawBrightPartyBackground(GraphicsContext gc) {
        // Яркий веселый градиент
        Stop[] stops = new Stop[] {
                new Stop(0, Color.rgb(255, 240, 100)), // Ярко-желтый
                new Stop(0.5, Color.rgb(255, 150, 200)), // Розовый
                new Stop(1, Color.rgb(150, 200, 255)) // Голубой
        };
        RadialGradient gradient = new RadialGradient(
                0, 0, (double) width /2, (double) height /2, width * 0.8, false, CycleMethod.NO_CYCLE, stops
        );
        gc.setFill(gradient);
        gc.fillRect(0, 0, width, height);
    }

    private void drawTwinklingStars(GraphicsContext gc) {
        long currentTime = System.currentTimeMillis();

        for (Star star : stars) {
            double time = currentTime * 0.005 * star.pulseSpeed;
            double brightness = star.baseBrightness + Math.sin(time) * 0.75;
            brightness = Math.max(0.1, Math.min(1.0, brightness));

            gc.setFill(Color.WHITE.deriveColor(0, 1, 1, brightness));
            gc.fillOval(star.x - star.size/2, star.y - star.size/2, star.size, star.size);
        }
    }


    private void drawCakeImage(GraphicsContext gc) {
        double centerX = (double) width / 2;
        double centerY = (double) height / 2;

        try {
            // Загружаем картинку торта
            Image cakeImage = new Image(Objects.requireNonNull(getClass().getResourceAsStream("/images/cake.png")));

            // Фиксированные размеры для торта
            double cakeWidth = 400;
            double cakeHeight = 350;

            // Рисуем картинку по центру
            gc.drawImage(cakeImage,
                    centerX - cakeWidth / 2,
                    centerY - cakeHeight / 3,
                    cakeWidth,
                    cakeHeight);

        } catch (Exception e) {
            // Если картинка не загрузилась, можно добавить заглушку
            drawCakePlaceholder(gc, centerX, centerY);
        }
    }

    private void drawCakePlaceholder(GraphicsContext gc, double centerX, double centerY) {
        // Простая заглушка если картинка не найдена
        gc.setFill(Color.LIGHTGRAY);
        gc.setStroke(Color.DARKGRAY);
        gc.setLineWidth(2);

        // Прямоугольник-заглушка
        gc.fillRect(centerX - 100, centerY - 50, 200, 100);
        gc.strokeRect(centerX - 100, centerY - 50, 200, 100);

        // Текст заглушки
        gc.setFill(Color.WHITE);
        gc.setFont(Font.font("Comic Sans MS", FontWeight.NORMAL, 16));
        gc.fillText("Кликни тут!", centerX - 120, centerY);
    }

    private void drawStyledText(GraphicsContext gc) {
        double time = System.currentTimeMillis() * 0.001;

        // Основной заголовок - выровненный по центру
        gc.setFill(Color.WHITE);
        gc.setFont(Font.font("Comic Sans MS", FontWeight.BOLD, 48));
        String birthdayText = "Happy Birthday!";
        double textWidth = computeTextWidth(birthdayText, gc.getFont());
        gc.fillText(birthdayText, (double) width / 2 - textWidth / 2, 100);

        // Поздравление
        gc.setFill(Color.LIGHTCYAN);
        gc.setFont(Font.font("Comic Sans MS", FontWeight.NORMAL, 22));
        String wishText = "Today is the oldest you have been, and the youngest you will ever be. Make the most of it!";
        double wishWidth = computeTextWidth(wishText, gc.getFont());
        gc.fillText(wishText, (double) width / 2 - wishWidth / 2, 150);

        // Подсказка - мигающий текст
        double alpha = Math.sin(time * 3) * 0.3 + 0.7;
        gc.setFill(Color.WHITE.deriveColor(0, 1, 1, alpha));
        gc.setFont(Font.font("Segoe Script", FontWeight.NORMAL, 18));
        String hintText = "Click the cake!";
        double hintWidth = computeTextWidth(hintText, gc.getFont());
        gc.fillText(hintText, (double) width / 2 - hintWidth / 2, height - 50);
    }

    // Метод для вычисления точной ширины текста
    private double computeTextWidth(String text, Font font) {
        javafx.scene.text.Text textNode = new javafx.scene.text.Text(text);
        textNode.setFont(font);
        return textNode.getLayoutBounds().getWidth();
    }

    private void handleClick(MouseEvent event) {
        if (transitioning) return;

        double centerX = (double) width / 2;
        double centerY = (double) height / 2;
        double cakeRadius = 150; // Область клика вокруг торта

        double distance = Math.sqrt(Math.pow(event.getX() - centerX, 2) + Math.pow(event.getY() - centerY, 2));
        if (distance < cakeRadius) {
            startTransition();
        }
    }

    private void startTransition() {
        transitioning = true;

        // Запускаем анимацию перехода
        new javafx.animation.AnimationTimer() {
            private final long startTime = System.currentTimeMillis();
            private boolean transitionComplete = false;

            @Override
            public void handle(long now) {
                long elapsed = now - startTime;

                if (elapsed > 2000_000_000L && !transitionComplete) {
                    transitionComplete = true;
                    this.stop();

                    // Переход к следующей сцене
                    if (onCakeClicked != null) {
                        onCakeClicked.run();
                    }
                }
            }
        }.start();
    }

    private void handleHover(MouseEvent event) {
        if (transitioning) return;

        double centerX = (double) width / 2;
        double centerY = (double) height / 2;
        double cakeRadius = 300; // Область клика вокруг торта

        double distance = Math.sqrt(Math.pow(event.getX() - centerX, 2) + Math.pow(event.getY() - centerY, 2));
        if (distance < cakeRadius) {
            canvas.setCursor(javafx.scene.Cursor.HAND);
        } else {
            canvas.setCursor(javafx.scene.Cursor.DEFAULT);
        }
    }

    public void setOnCakeClicked(Runnable handler) {
        this.onCakeClicked = handler;
    }

    public void show() {
        stage.show();

        // Запускаем анимацию
        startAnimation();
    }

    private void startAnimation() {
        new javafx.animation.AnimationTimer() {
            @Override
            public void handle(long now) {
                GraphicsContext gc = canvas.getGraphicsContext2D();
                gc.clearRect(0, 0, width, height);
                drawBeautifulSplash();
            }
        }.start();
    }

    // Внутренний класс для звезд
    private static class Star {
        double x, y, size, baseBrightness, pulseSpeed;

        Star(double x, double y, double size, double baseBrightness, double pulseSpeed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.baseBrightness = baseBrightness;
            this.pulseSpeed = pulseSpeed;
        }
    }
}