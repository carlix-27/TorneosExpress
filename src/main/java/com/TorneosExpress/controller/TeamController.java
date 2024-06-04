package com.TorneosExpress.controller;
import com.TorneosExpress.dto.TeamDto;
import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.PlayerService;
import com.TorneosExpress.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

  @Autowired
  TeamService teamService;

  @Autowired
  PlayerService playerService;

  @PostMapping(value = "/create", consumes = MediaType.APPLICATION_JSON_VALUE)

  public ResponseEntity<Team> createTeam(@RequestBody TeamDto teamRequest) {
    Team createdTeam = teamService.createTeam(new Team(teamRequest));
    playerService.upgradeToCaptain(teamRequest.getCaptainId());
    return new ResponseEntity<>(createdTeam, HttpStatus.CREATED);
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<Team>> getTeamsByUser(@PathVariable Long userId) {
    List<Team> teams = teamService.findByCaptainId(userId);
    return ResponseEntity.ok().body(teams);
  }


  @GetMapping("/all")
  public List<Team> getAllTeams() {
    return teamService.getAllTeams();
  }

  @GetMapping("/allTeams")
  public List<Team> getTeams() {
    return teamService.getAllTeams();
  }

  @GetMapping("/findByName/{name}")
  public ResponseEntity<List<Team>> getTeamsByName(@PathVariable String name) {
    List<Team> teams = teamService.findByName(name);
    return ResponseEntity.ok().body(teams);
  }

  @DeleteMapping("/{teamId}")
  public ResponseEntity<String> deleteTournament(@PathVariable Long teamId) {
    teamService.deleteTeamById(teamId);
    return ResponseEntity.ok("Team deleted successfully");
  }

  @GetMapping("/{teamId}")
  public ResponseEntity<Team> getTeamById(@PathVariable Long teamId) {
    Team team = teamService.findById(teamId);
    if (team == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(team);
  }

  @PostMapping("/{teamId}/join")
  public ResponseEntity<String> joinTeam(@PathVariable Long teamId, Long playerId) {
    Player p = playerService.getPlayerById(playerId).orElse(null);
    if (p != null) {
      return ResponseEntity.ok(teamService.addPlayer(teamId, p));
    }
    return ResponseEntity.ok("Error while joining team.");
  }

  @PutMapping("/{teamId}")
  public ResponseEntity<Team> updateTeam(@PathVariable Long teamId,
                                                     @RequestBody Tournament updatedTournament) {
    Team existingTeam = teamService.findById(teamId);
    if (existingTeam == null) {
      return ResponseEntity.notFound().build();
    }

    existingTeam.setName(updatedTournament.getName());
    existingTeam.setLocation(updatedTournament.getLocation());
    existingTeam.setIsPrivate(updatedTournament.isPrivate());

    Team updatedTeam = teamService.updateTeam(existingTeam);
    return ResponseEntity.ok(updatedTeam);
  }
}
