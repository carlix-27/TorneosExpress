package com.TorneosExpress.controller;

import com.TorneosExpress.dto.AccessRequest;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.PlayerService;
import com.TorneosExpress.service.TeamService;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

/*También ver si es posible chequear otras cosas
* Si los capitanes o jugadores, cumplen los requisitos necesarios, etc. ¿Cómo veo esto?*/
@RestController
public class RequestController {
    @Autowired
    TournamentService tournamentService;

    @Autowired
    TeamService teamService;

    @Autowired
    PlayerService playerService;


    //ToDo
    @PostMapping("/api/tournaments/{tournamentId}/access-request")
    public ResponseEntity<?> requestTournamentAccess(@PathVariable Long tournamentId, @RequestBody AccessRequest request){
        try{
            tournamentService.processAccessRequest(tournamentId, request.getUserId(), request.getTeamId());
            return ResponseEntity.ok().body("Solicitud enviada exitosamente !");
        } catch (NullPointerException e){ // Casos de exception que tire los métodos.
            return ResponseEntity.badRequest().body(request.getUserId() + " no encontrado");
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body("Tu equipo ya está en este torneo"); // no me lo tira en la página web
        } catch (Exception e){
            return ResponseEntity.status(500).body("Error interno del servidor: " + e.getMessage());
        }

    }


    @PostMapping("/api/tournaments/{tournamentId}/enroll")
    public ResponseEntity<?> accessToPublicTournament(@PathVariable Long tournamentId, @RequestBody AccessRequest request){ // mira como usar acá el tournamentId.
        tournamentService.accessToPublicTournament(tournamentId, request.getUserId(), request.getTeamId());
        return ResponseEntity.ok().body("Te has inscripto exitosamente al torneo");
    }

    @PostMapping("/api/teams/{teamId}/access-request")
    public ResponseEntity<?> requestTeamAccess(@PathVariable Long teamId, @PathVariable Long userId){
        teamService.processAccessRequest(teamId, userId);
        return ResponseEntity.ok().build();
    }

}



