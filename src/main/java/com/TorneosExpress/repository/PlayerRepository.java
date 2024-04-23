
package com.TorneosExpress.repository;

import com.TorneosExpress.model.player.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface PlayerRepository extends JpaRepository<Player, Long>{
    Player findByemail(String player_email);
    Player findById(long id);
    List<Player> findByName(String name);
}

