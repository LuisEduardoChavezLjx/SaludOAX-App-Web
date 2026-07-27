package com.saludoax.backend.repository;

import com.saludoax.backend.model.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {
    boolean existsByTokenJti(String tokenJti);
}
