package com.TorneosExpress.controller;

import com.TorneosExpress.dto.*;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @PostMapping("/create")
    public ResponseEntity<?> createTournament(@RequestBody TournamentDto request) {
        // Check if tournament name is unique
        String requestName = request.getName();
        boolean tournamentNameUnique = tournamentService.isTournamentNameUnique(requestName);
        if (tournamentNameUnique) {
            Tournament tournament = new Tournament(request);
            Tournament createdTournament = tournamentService.createTournament(tournament);
            createdTournament.setActive(true);
            return ResponseEntity.ok(createdTournament);
        } else{
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tournament name must be unique.");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AllDataTournamentDto>> getTournamentsByUser(@PathVariable Long userId) {
        List<AllDataTournamentDto> tournaments = tournamentService.getTournamentsByUser(userId).stream().map(Tournament::allDataTeamToDto).toList();
        return ResponseEntity.ok().body(tournaments);
    }

    @DeleteMapping("/{tournamentId}")
    public ResponseEntity<String> deleteTournament(@PathVariable Long tournamentId) {
        tournamentService.deleteTournament(tournamentId);
        return ResponseEntity.ok("Tournament deleted successfully");
    }

    @GetMapping("/{tournamentId}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentService.getTournamentById(tournamentId);
        if (tournament == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tournament);
    }

    @PutMapping("/{tournamentId}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long tournamentId,
                                                       @RequestBody Tournament updatedTournament) {
        Tournament existingTournament = tournamentService.getTournamentById(tournamentId);
        if (existingTournament == null) {
            return ResponseEntity.notFound().build();
        }

        existingTournament.setName(updatedTournament.getName());
        existingTournament.setSport(updatedTournament.getSport());
        existingTournament.setLocation(updatedTournament.getLocation());
        existingTournament.setPrivate(updatedTournament.isPrivate());
        existingTournament.setDifficulty(updatedTournament.getDifficulty());

        Tournament updatedTournamentEntity = tournamentService.updateTournament(existingTournament);
        return ResponseEntity.ok(updatedTournamentEntity);
    }


    @GetMapping("/active")
    public ResponseEntity<List<ActiveTournamentsDto>> getActiveTournaments() {
        // Manejarlos con la información que me interesa utilizando Dtos
        // Debería tener en cuenta los siguientes datos que me interesan de los torneos activos
        /*id
        * name
        * deporte
        * Si es público o no
        * Básicamente debo informar lo que debería verse*/
        List<Tournament> activeTournaments = tournamentService.getActiveTournaments();
        List<ActiveTournamentsDto> activeTournamentsDtoList = activeTournaments.stream()
                .map(tournament -> {
                    SportDto sportDto = new SportDto(
                            tournament.getSport().getSportId(),
                            tournament.getSport().getSportName(),
                            tournament.getSport().getNum_players()
                    );

                    TournamentDto tournamentDto = new TournamentDto(
                            tournament.getId(),
                            tournament.getCreatorId(),
                            tournament.getName(),
                            tournament.getLocation(),
                            tournament.getSport(),
                            tournament.isPrivate(),
                            tournament.getDifficulty(),
                            tournament.isActive()
                    );
                    return new ActiveTournamentsDto(tournamentDto, sportDto);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(activeTournamentsDtoList);
    }

    /*Que el metodo devuelva un response entity
    * la data que viaje en dtos y a la vez que tengan tipos primarios y dtos, int string boolean.
    * Un dto, puede tener otros dtos. Solo puede tener o datos primarios, o dtos. No puede llamar a otras entidades.
    * Team dto puede llamar al player dto*/

}
