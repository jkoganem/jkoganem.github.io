---
layout: page
title: Physics-Informed Neural Networks for Options Pricing
description: Achieving finite difference accuracy with neural network speed
img: assets/img/projects/pinns/method_comparison_bars.png
importance: 3
category: computational finance
github: https://github.com/jkoganem/pinns-options-pricing
---

## Overview

Can modern machine learning match classical numerical methods for financial derivatives pricing? This project implements and compares Physics-Informed Neural Networks (PINNs) with traditional finite difference and Monte Carlo approaches for pricing European options under the Black-Scholes framework.

**Key Achievement**: Optimized PINN achieves **0.064% relative error** for at-the-money options, placing it between Crank-Nicolson (0.007%) and Monte Carlo (0.694%) while offering instantaneous inference after one-time training.

---

## The Black-Scholes PDE

Option prices satisfy the Black-Scholes partial differential equation:

$$\frac{\partial V}{\partial \tau} = \frac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + (r-q)S\frac{\partial V}{\partial S} - rV$$

**Traditional Approaches:**

- **Analytical formulas**: Exact but limited to simple contracts
- **Finite Difference**: High accuracy but computationally expensive
- **Monte Carlo**: Versatile but slow convergence

**PINNs offer a potential middle ground:** encode the PDE directly into the neural network loss function for both accuracy and computational efficiency.

---

## Method Comparison

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pinns/method_comparison_atm.png" title="Method comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <strong>Left:</strong> Option prices from different methods. <strong>Right:</strong> Relative errors vs Black-Scholes analytical solution. PINN achieves 0.064% error, competitive with Crank-Nicolson (0.007%) and far superior to Monte Carlo (0.694%).
</div>

### Performance Summary

| Method               | Price ($) | Error (%) | Inference Time | Notes                  |
| -------------------- | --------- | --------- | -------------- | ---------------------- |
| **Black-Scholes**    | 9.227006  | 0.0000    | <0.001s        | Analytical (reference) |
| **Crank-Nicolson**   | 9.227661  | 0.0071    | 0.051s         | 501×500 grid           |
| **Monte Carlo**      | 9.162932  | 0.6944    | 0.533s         | 100k paths, antithetic |
| **PINN (Optimized)** | 9.221150  | 0.0635    | <0.001s        | 30k epochs training    |

---

## PINN Architecture

### Loss Function Design

The PINN minimizes violations of physics laws:

$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{PDE}} + \mathcal{L}_{\text{boundary}} + \mathcal{L}_{\text{initial}}$$

- **PDE Loss**: Residual of Black-Scholes equation at interior points
- **Boundary Loss**: Matching known boundary conditions
- **Initial Loss**: Terminal payoff at maturity

All derivatives computed via automatic differentiation.

### Architectural Enhancements

Three key techniques proved essential for achieving <0.1% error:

1. **Fourier Feature Embeddings** (σ=3.0): Reduced error from 5-10% to 1-2%
2. **Learning Rate Warmup** (1000 epochs): Reduced error from 1-2% to 0.5%
3. **Exponential Moving Average** (β=0.999): Reduced error from 0.5% to <0.1%

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pinns/training_convergence.png" title="Training dynamics" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    PINN training over 30,000 epochs. <strong>Left:</strong> Raw loss showing convergence. <strong>Right:</strong> Smoothed loss demonstrating consistent descent without catastrophic divergence.
</div>

---

## Price Surface Analysis

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pinns/price_surface_analysis.png" title="Price surface" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <strong>Left:</strong> Option price evolution with time to maturity. <strong>Center:</strong> PINN vs Black-Scholes at T=1yr. <strong>Right:</strong> Relative errors across spot price range.
</div>

**Generalization Performance:**

- Mean error: **0.044%** across spot range $S \in [\$50, \$150]$
- ATM region ($S \in [\$90, \$110]$): **<0.05%** error for all maturities
- Max error: 0.152% (deep out-of-the-money)

The PINN maintains competitive accuracy throughout the at-the-money corridor where options are most actively traded.

---

## Computational Efficiency

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/pinns/method_comparison_bars.png" title="Accuracy vs speed" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <strong>Left:</strong> Pricing accuracy (lower is better). <strong>Right:</strong> Computational speed for inference (log scale, lower is better). PINN achieves optimal trade-off: near-Crank-Nicolson accuracy with near-Black-Scholes speed.
</div>

### Speed Comparison

**One-time Training:**

- PINN: 16 minutes (30,000 epochs, one-time cost)
- Crank-Nicolson/Monte Carlo: N/A (solve each time)

**Inference (per price):**

- Black-Scholes: <0.001s (analytical)
- **PINN: <0.001s** (forward pass)
- Crank-Nicolson: 0.051s (solve PDE)
- Monte Carlo: 0.533s (simulate paths)

**Batch Pricing (1000 contracts):**

- Black-Scholes: <0.1s
- **PINN: <0.1s** (parallel GPU)
- Crank-Nicolson: ~51s
- Monte Carlo: ~533s (~9 minutes)

---

## Key Results

### Main Findings

1. **Competitive Accuracy**: 0.064% error places PINN between finite difference (0.007%) and Monte Carlo (0.694%)
2. **Computational Efficiency**: After training, PINN matches analytical formula speed (<1ms) while maintaining numerical accuracy
3. **Systematic Improvements**: Three architectural techniques combined to reduce error from 5-10% to <0.1%
4. **Hyperparameter Validation**: Bayesian optimization confirmed baseline configuration as optimal
5. **Physics-Informed Learning**: PDE residual analysis confirms true physics-based learning, not just data fitting

### Practical Implications

- **Real-time Pricing**: Ideal for high-frequency trading after one-time training
- **Greek Computation**: Automatic differentiation provides smooth, continuous Greeks
- **Scalability**: Extends naturally to high-dimensional problems where traditional PDE methods face curse of dimensionality

---

## Hyperparameter Optimization

**Validated Configuration** (30,000 epochs):

| Parameter     | Value | Description                |
| ------------- | ----- | -------------------------- |
| learning_rate | 0.001 | Conservative for stability |
| hidden_dim    | 128   | Network capacity           |
| num_layers    | 5     | Depth for expressiveness   |
| fourier_scale | 3.0   | Frequency bandwidth        |
| warmup_epochs | 1000  | Warmup duration            |
| ema_decay     | 0.999 | Weight averaging           |

Bayesian optimization over 40 trials confirmed lower learning rates provide better final accuracy despite slower initial convergence.

---

## Technical Stack

- **Deep Learning**: PyTorch 2.0+ with automatic differentiation
- **Optimization**: Optuna for hyperparameter search
- **Classical Methods**: NumPy/SciPy for finite difference and Monte Carlo baselines
- **Visualization**: Matplotlib, Seaborn for comprehensive result analysis

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        <a href="https://github.com/jkoganem/pinns-options-pricing" class="btn btn-primary" target="_blank">
            <i class="fa-brands fa-github"></i> View on GitHub
        </a>
    </div>
</div>
