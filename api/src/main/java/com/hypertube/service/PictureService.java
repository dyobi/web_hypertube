package com.hypertube.service;

import com.hypertube.config.Const;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@Service
public class PictureService {

    public byte[] get(String uuid) {
        try {
            return FileUtils.readFileToByteArray(new File(Const.PATH_PICTURE + uuid));
        } catch (Exception e) {
            return null;
        }
    }

    public String uploadWithFile(MultipartFile file) {
        try {
            String name = System.currentTimeMillis() + "-" + UUID.randomUUID().toString();
            byte bytes[] = file.getBytes();

            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(bytes));

            int size = Math.min(bufferedImage.getWidth(), bufferedImage.getHeight());
            BufferedImage combined = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);

            Graphics graphics = combined.getGraphics();

            graphics.drawImage(bufferedImage, (bufferedImage.getWidth() - size) / -2, (bufferedImage.getHeight() - size) / -2, null);

            BufferedImage resizedImage = new BufferedImage(480, 480, Image.SCALE_SMOOTH);
            graphics = resizedImage.createGraphics();
            graphics.drawImage(combined, 0, 0, 480, 480, null);
            graphics.dispose();

            ByteArrayOutputStream result = new ByteArrayOutputStream();
            ImageIO.write(resizedImage, "png", result);

            FileOutputStream fos = new FileOutputStream(new File(Const.PATH_PICTURE + name));
            fos.write(result.toByteArray());
            fos.close();

            return name;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
