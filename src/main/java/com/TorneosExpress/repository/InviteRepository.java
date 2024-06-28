package com.TorneosExpress.repository;

import com.TorneosExpress.model.Invite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InviteRepository extends JpaRepository<Invite, Long> {
    List<Invite> findByInviteTo(Long id);
}
