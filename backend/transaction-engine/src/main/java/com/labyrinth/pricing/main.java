package com.labyrinth.pricing;

import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Service;
import java.util.concurrent.CompletableFuture;
import java.util.stream.DoubleStream;

record PricingRequest(double capital, int horizon, int riskProfile) {}
record PricingResponse(double probability, double yield, double finalAllocation) {}

@Service
public class TransactionEngine {

    public CompletableFuture<PricingResponse> executeTransaction(PricingRequest request) {
        return CompletableFuture.supplyAsync(() -> {
            double[] yieldFactors = DoubleStream.iterate(1.0, i -> i * 1.005)
                    .limit(request.horizon)
                    .toArray();
            
            double cumulativeYield = yieldFactors[yieldFactors.length - 1];
            double riskAdjustment = 1.0 + (request.riskProfile * 0.05);
            double adjustedYield = cumulativeYield * riskAdjustment;
            
            double probability = Math.min(0.99, 0.6 + (request.horizon * 0.005) + (request.riskProfile * 0.05));
            double finalAllocation = request.capital * adjustedYield;

            return new PricingResponse(
                Math.round(probability * 1000.0) / 1000.0,
                Math.round((adjustedYield - 1.0) * 10000.0) / 10000.0,
                Math.round(finalAllocation)
            );
        });
    }
}

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
