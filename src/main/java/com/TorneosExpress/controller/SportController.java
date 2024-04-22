package com.TorneosExpress.controller;


import com.TorneosExpress.dto.CreateSportRequest;
import com.TorneosExpress.dto.DeleteSportRequest;
import com.TorneosExpress.dto.SportDto;
import com.TorneosExpress.dto.UpdateSportRequest;
import com.TorneosExpress.model.Sport;
import com.TorneosExpress.model.Tournament;
import com.TorneosExpress.service.SportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sports")
public class SportController {

    @Autowired
    private SportService sportService;

    @GetMapping("")
    public List<Sport> getAllSports(){
        return sportService.getAllSports();
    }

    @GetMapping("/{id}")
    public Sport getSportById(@PathVariable Long id) {
        return sportService.getSportById(id);
    }

    @PostMapping("/create")
    public ResponseEntity<SportDto> createSport(@RequestBody CreateSportRequest request){
        Sport createdSport =  sportService.createSport(request.getName(), request.getNum_players());
        SportDto sportDto = new SportDto(
                createdSport.getSportId(),
                createdSport.getSportName(),
                createdSport.getNum_players()
        );
        return ResponseEntity.ok(sportDto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Sport> updateSport(@PathVariable Long id, @RequestBody Sport updatedSport) {
        Sport existingSport = sportService.getSportById(id);
        if (existingSport == null) {
            return ResponseEntity.notFound().build();
        }

        existingSport.setSport(updatedSport.getSportName());
        existingSport.setNumPlayers(updatedSport.getNum_players());

        Sport updatedSportEntity = sportService.updateSport(existingSport);
        if (updatedSportEntity == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedSportEntity);
    }



    @DeleteMapping("/delete/{id}")
    public void deleteSport(@RequestBody DeleteSportRequest request) {
        sportService.deleteSport(request.getId());
    }
}