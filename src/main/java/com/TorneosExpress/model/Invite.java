package com.TorneosExpress.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_id", nullable = false)
    private Player inviter;

    @ManyToOne
    @JoinColumn(name = "to_id", nullable = false)
    private Player invitee;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean accepted;

    public Invite() {
    }

    public Invite(Player inviter, Player invitee) {
        this.inviter = inviter;
        this.invitee = invitee;
        this.createdAt = LocalDateTime.now();
        this.accepted = false;
    }

    // Getters and setters...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Player getInviter() {
        return inviter;
    }

    public void setInviter(Player inviter) {
        this.inviter = inviter;
    }

    public Player getInvitee() {
        return invitee;
    }

    public void setInvitee(Player invitee) {
        this.invitee = invitee;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }
}