package lv.sda.cinemaapi.controller;

import lv.sda.cinemaapi.dto.SessionDTO;
import lv.sda.cinemaapi.entity.Film;
import lv.sda.cinemaapi.mapper.SessionMapper;
import lv.sda.cinemaapi.service.SessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/session.svc")
@CrossOrigin(origins="http://localhost:4200")
public class SessionController {

    private final SessionService sessionService;
    private final SessionMapper sessionMapper;

    public SessionController(SessionService sessionService, SessionMapper sessionMapper) {
        this.sessionService = sessionService;
        this.sessionMapper = sessionMapper;
    }

    @GetMapping("/Sessions({film_id})")
    public List<SessionDTO> findSessionsByFilm(@PathVariable("film_id") Film film,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {
        return sessionService.findAllSessionsByFilm(film, offset)
                .stream()
                .map(sessionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
