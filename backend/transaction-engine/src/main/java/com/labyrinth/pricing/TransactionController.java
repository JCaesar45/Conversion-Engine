package com.labyrinth.pricing;

import org.springframework.web.bind.annotation.*;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionEngine engine;

    public TransactionController(TransactionEngine engine) {
        this.engine = engine;
    }

    @PostMapping("/process")
    public CompletableFuture<PricingResponse> process(@RequestBody PricingRequest request) {
        return engine.executeTransaction(request);
    }
}
