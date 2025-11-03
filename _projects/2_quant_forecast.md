---
layout: page
title: Time-Series Forecasting & Risk-Managed Trading
description: Combining classical statistics with machine learning for volatility-targeted strategies
img: assets/img/projects/quant-forecast/equity_curves.png
importance: 2
category: quantitative finance
github: https://github.com/jkoganem/quant-forecast-strategies
---

## Overview

This project implements a comprehensive framework for forecasting daily asset returns and managing portfolio risk through volatility targeting. By combining classical statistical models (GARCH, SARIMA) with modern machine learning approaches (Ridge, Lasso, XGBoost), the system generates risk-managed trading strategies with realistic transaction costs.

**Key Achievement**: Volatility-managed strategy achieved **Sharpe ratio of 1.98** with 17.0% annualized returns and only 8.6% volatility, significantly outperforming buy-and-hold.

---

## System Architecture

The pipeline transforms historical price data into actionable trading signals:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/quant-forecast/forecasts.png" title="Variance forecasts" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <strong>Top panel:</strong> Return forecasts from 8 models vs actual returns. <strong>Bottom panel:</strong> GARCH variance forecasts (pink) track realized volatility (black), enabling effective risk management.
</div>

### Model Ensemble

Eight forecasting models spanning statistical and machine learning approaches:

1. **GARCH(1,1)**: Volatility clustering for position sizing
2. **SARIMA**: Seasonal autoregressive integrated moving average
3. **Ridge/Lasso Regression**: Regularized linear models with engineered features
4. **XGBoost**: Gradient boosting for non-linear patterns
5. **Dynamic Harmonic Regression**: Fourier-based seasonal decomposition
6. **Naive Mean/Seasonal**: Baseline benchmarks
7. **Ensemble**: Inverse-MSE weighted combination

---

## Volatility Targeting

The core innovation is adaptive position sizing based on volatility forecasts:

$$w_t = \frac{\sigma_{\text{target}}}{\hat{\sigma}_{t|t-1}} \cdot \text{sign}(\hat{r}_{t+1|t})$$

- **Larger positions** when volatility is low (stable markets)
- **Smaller positions** when volatility is high (turbulent markets)
- **Constant risk exposure** over time

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/quant-forecast/equity_curves.png" title="Strategy performance" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Cumulative returns (top) and drawdowns (bottom) for all strategies. Volatility-managed strategy (orange) achieves superior risk-adjusted returns with controlled drawdowns. Maximum drawdown limited to -7.7% during evaluation period (2020-2024, including COVID-19 crash).
</div>

---

## Key Results

### Model Performance

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/quant-forecast/model_compare.png" title="Model comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Forecast accuracy across models using MSE, MAE, and directional accuracy. Simple models (Ridge, Lasso, XGBoost) achieve nearly identical performance (MSE ~0.000065), while SARIMA underperforms.
</div>

**Forecast Accuracy:**
- Best directional accuracy: **57.2%** (modestly above random 50%)
- Simple models outperformed complex SARIMA
- Diebold-Mariano tests confirm significant accuracy differences between model classes

### Strategy Performance

**Volatility-Managed Strategy:**
- Sharpe Ratio: **1.98**
- Annual Return: **17.0%**
- Annual Volatility: **8.6%**
- Maximum Drawdown: **-7.7%**

**vs. Buy-and-Hold SPY:**
- Sharpe Ratio: 0.89
- Annual Return: 14.2%
- Annual Volatility: 16.0%
- Maximum Drawdown: -34.0%

---

## Rolling Performance Analysis

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/quant-forecast/rolling_performance.png" title="Rolling metrics" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    63-day rolling metrics showing evolution of annualized returns, volatility, and Sharpe ratios. Strategy successfully adapts to changing market conditions including COVID-19 crash and recovery.
</div>

The rolling analysis demonstrates:
- Consistent Sharpe ratio above 1.0 across most periods
- Successful volatility targeting (stable 8-10% annualized volatility)
- Resilience through multiple market regimes

---

## Technical Implementation

### Mathematical Foundation

**Log Returns:**
$$r_t = \log(P_t) - \log(P_{t-1})$$

**GARCH(1,1) Volatility:**
$$\sigma_t^2 = \omega + \alpha \varepsilon_{t-1}^2 + \beta \sigma_{t-1}^2$$

**Transaction Costs:**
$$\text{Cost}_t = -\text{tc}_{\text{bps}} \cdot |w_t - w_{t-1}| \cdot \frac{1}{10000}$$

Default: 1 basis point (0.01%) per unit turnover

### Evaluation Framework

- **Expanding window cross-validation** (no look-ahead bias)
- **Statistical diagnostics**: ADF tests, Ljung-Box, Diebold-Mariano
- **Comprehensive metrics**: Sharpe, Sortino, Calmar, max drawdown
- **Realistic costs**: 1 bps commission + slippage model

---

## Key Findings

1. **Superior Risk-Adjusted Returns**: Volatility targeting achieves 2.2× Sharpe improvement over buy-and-hold
2. **Effective Volatility Control**: GARCH successfully tracks realized volatility, enabling dynamic position sizing
3. **Model Performance Hierarchy**: Simple ML models (Ridge, Lasso, XGBoost) outperform complex SARIMA
4. **Volatility Forecasting Success**: Strong variance predictions despite weak return predictability
5. **Statistical Validation**: Diebold-Mariano tests confirm significant forecast accuracy differences

---

## Technical Stack

- **Data**: Stooq API (5,200+ days of SPY data, 2005-present)
- **Models**: statsmodels (GARCH, SARIMA), scikit-learn, XGBoost
- **Optimization**: Optuna for hyperparameter tuning
- **Features**: 34 engineered features (lagged returns, volatility proxies, calendar effects)

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        <a href="https://github.com/jkoganem/quant-forecast-strategies" class="btn btn-primary" target="_blank">
            <i class="fa-brands fa-github"></i> View on GitHub
        </a>
    </div>
</div>
