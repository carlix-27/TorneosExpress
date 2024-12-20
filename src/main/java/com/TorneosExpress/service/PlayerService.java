package com.TorneosExpress.service;

import com.TorneosExpress.model.Player;
import com.TorneosExpress.model.Team;
import com.TorneosExpress.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getPlayerByName(String name) {
        return playerRepository.findByName(name);
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public Long getUserIdByEmail(String email) {
        Player player = playerRepository.findByemail(email);
        if (player != null) {
            return player.getId();
        }
        return null;
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    @Transactional
    public ResponseEntity<Player> updatePlayerLocation(Long id, String location) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Player not found with id " + id));

        player.setLocation(location);

        playerRepository.save(player);

        return ResponseEntity.ok(player);
    }

    public Player createPlayer(String player_name, String player_location, String player_email, String password) {
        Player newPlayer = new Player(player_name, player_location, player_email, password);
        return savePlayer(newPlayer);
    }

    public Player login(String email, String password) {
        Player player = playerRepository.findByemail(email);

        if (player == null) {
            return null;
        }

        String playerPassword = player.getPassword();

        boolean correctPassword = playerPassword.equals(password);

        if (!correctPassword) {
            return null;
        }

        return player;
    }

    public boolean isPremiumUser(Long userId) {
        Player user = playerRepository.findById(userId).orElse(null);
        if (user != null) {
            return user.getIs_Premium();
        }
        return false;
    }

    public boolean isCaptain(Long userId){
        Player user = playerRepository.findById(userId).orElse(null);
        if(user != null){
            return user.is_Captain();
        }
        return false;
    }


    public void upgradeToCaptain(Long userId){
        Optional<Player> optionalPlayer = playerRepository.findById(userId);
        if(optionalPlayer.isPresent()){
            Player player = optionalPlayer.get();
            player.set_Captain(true);
            playerRepository.save(player);
        }
    }

    public boolean upgradeToPremium(Long playerId) {
        Optional<Player> optionalPlayer = playerRepository.findById(playerId);
        if (optionalPlayer.isPresent()) {
            Player player = optionalPlayer.get();
            player.setIs_Premium(true);
            playerRepository.save(player);
            return true;
        } else {
            return false;
        }
    }

    public Boolean doesPlayerExist(String email) {
        return playerRepository.existsByEmail(email);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Team> findTeamsByPlayerId(Long playerId) {
        Player player = playerRepository.findById(playerId).orElseThrow(() -> new RuntimeException("Player not found"));
        return player.getTeams();
    }
}
