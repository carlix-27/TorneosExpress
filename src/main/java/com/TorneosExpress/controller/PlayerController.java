package com.TorneosExpress.controller;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @Autowired
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/players/{id}")
    public Optional<Player> getPlayerById(@PathVariable Long id) {
        return playerService.getPlayerById(id);
    }

    @GetMapping("/{userId}/premium")
    public ResponseEntity<Map<String, Boolean>> checkPremiumStatus(@PathVariable Long userId) {
        boolean isPremium = playerService.isPremiumUser(userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isPremium", isPremium);
        return ResponseEntity.ok().body(response);
    }


    @GetMapping("/{userId}/team-owner")
    public ResponseEntity<?> checkIfUserIsCaptain(@PathVariable Long userId){
        if(playerService.isCaptain(userId)){
            return ResponseEntity.ok().body("El usuario es capitan");
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario no es capitán");
    }


    @GetMapping("/players/findByName/{name}")
    public ResponseEntity<List<Player>> getPlayersByName(@PathVariable String name) {
        List<Player> response = playerService.getPlayerByName(name);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/upgrade/{userId}")
    public ResponseEntity<?> upgradeToPremium(@PathVariable Long userId) {
        boolean isUpgradeSuccessful = playerService.upgradeToPremium(userId);

        if (isUpgradeSuccessful) {
            return ResponseEntity.ok().body(true);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upgrade player to Premium"); // Return an error message if failed
        }
    }

    @GetMapping("/players")
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> response = playerService.getAllPlayers();
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{playerId}/teams")
    public List<Team> getTeamsByPlayerId(@PathVariable Long playerId) {
        return playerService.findTeamsByPlayerId(playerId);
    }

}
