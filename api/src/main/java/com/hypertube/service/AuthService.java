package com.hypertube.service;

import com.hypertube.model.Response;
import com.hypertube.model.User;
import com.hypertube.model.Verify;
import com.hypertube.repository.UserRepository;
import com.hypertube.repository.VerifyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    VerifyRepository verifyRepository;

    @Autowired
    TokenService tokenService;

    @Autowired
    JavaMailSender emailSender;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    public Response signUp(User user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return new Response(200);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response signIn(User user) {
        try {
            User valid = userRepository.findByUserName(user.getUserName());
            if (valid == null) return new Response(411);
            else
                return passwordEncoder.matches(user.getPassword(), valid.getPassword()) ?
                        new Response(200, tokenService.createToken(valid)) : new Response(412);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response oAuth(User user) {
        try {
            User valid = userRepository.findByEmail(user.getEmail());
            if (valid == null) userRepository.save(user);
            else if (!valid.getSocialType().equals(user.getSocialType())) return new Response(411);
            return new Response(200, tokenService.createToken(userRepository.findByEmail(user.getEmail())));
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response getUserName(String userName) {
        try {
            User valid = userRepository.findByUserName(userName);
            return valid == null ? new Response(200) : new Response(400);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response getEmail(String email) {
        try {
            User valid = userRepository.findByEmail(email);
            return valid == null ? new Response(200) : new Response(400);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response recovery(String email) {
        try {
            if (userRepository.findByEmail(email) == null) return new Response(400);
            Verify verify = new Verify();
            UUID uuid = UUID.randomUUID();
            verify.setUser(userRepository.findByEmail(email));
            verify.setUuid(uuid.toString());
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("HyperTube Recovery Service");
            helper.setText( "    <body>\n" +
                    "        <div style=\"width: 100%; height: auto; position: relative; float: left; background: #202020; font-family: sans-serif;\">\n" +
                    "            <div style=\"width: 100%; height: 75px; position: relative; float: left; color: #AAAAAA; font-size: 30px; font-weight: 900; text-indent: 20px; line-height: 75px;\">HyperTube Password Recovery</div>\n" +
                    "            <div style=\"width: 100%; height: auto; padding: 0 20px; position: relative; float: left; color: #808080; font-size: 15px; font-weight: 300; text-align: left; line-height: 2; box-sizing: border-box;\">\n" +
                    "                For those writers who have writers' block, this can be an excellent way to take a\n" +
                    "                step to crumbling those walls. By taking the writer away from the subject matter\n" +
                    "                that is causing the block, a random sentence may allow them to see the project\n" +
                    "                they're working on in a different light and perspective. Sometimes all it takes is\n" +
                    "                to get that first sentence down to help break the block.\n" +
                    "            </div>\n" +
                    "            <div style=\"width: 100%; height: 100px; position: relative; float: left;\">\n" +
                    "                <a href=\"https://localhost:3000/auth/recovery/" + uuid + "\" target=\"_blank\">\n" +
                    "                    <button style=\"width: 200px; height: 50px; margin-left: 20px; margin-top: 25px; color: #404040; font-size: 15px; font-weight: 700; background-color: #AAAAAA; border: none; border-radius: 5px; outline: none; cursor: pointer\">Reset Your Password</button>\n" +
                    "                </a>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </body>", true);
            emailSender.send(message);
            verifyRepository.save(verify);
            return new Response(200, uuid);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

    public Response recoveryPassword(String password, String uuid) {
        try {
            Verify verify = verifyRepository.findByUuid(uuid);
            if (verify == null) return new Response(400);
            verifyRepository.delete(verify);
            User user = userRepository.findById(verify.getUser().getId()).orElse(null);
            if (user == null) return new Response(400);
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            return new Response(200);
        } catch (Exception e) {
            e.printStackTrace();
            return new Response(400);
        }
    }

}