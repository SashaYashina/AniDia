module ru.itmo.tess.stars {
    requires javafx.controls;
    requires javafx.fxml;

    requires org.controlsfx.controls;
    requires org.kordamp.bootstrapfx.core;
    requires java.desktop;

    opens ru.itmo.tess.stars to javafx.fxml;
    exports ru.itmo.tess.stars;
}