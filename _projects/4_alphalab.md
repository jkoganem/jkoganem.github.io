---
layout: page
title: AlphaLab - LLM-Powered Trading Strategy Generation
description: Exploring the frontier of AI-driven quantitative finance with iterative refinement
img: assets/img/projects/alphalab/equity_curves.png
importance: 4
category: work
github: https://github.com/jkoganem/alphalab
---

## Overview

Can large language models generate production-quality trading strategies? This research project explores the capabilities and limitations of foundation models (GPT-4o, GPT-5) for automated quantitative strategy development through iterative refinement and physics-based validation.

**Key Finding**: Despite sophisticated prompt engineering and iterative refinement, current LLMs struggle to achieve production-quality performance (target Sharpe ≥ 0.70), revealing fundamental challenges in applying foundation models to quantitative finance without domain-specific alignment.

---

## System Architecture

AlphaLab implements an end-to-end pipeline combining AI generation with rigorous backtesting:

### Iterative Refinement Loop

```
┌─────────────────────────────────────────┐
│  Strategy Database (SQLite)             │
│  - Top 3 successful strategies          │
│  - 2 instructive failures                │
│  - LOFO analysis results                │
└─────────────┬───────────────────────────┘
              │
              v
┌─────────────────────────────────────────┐
│  Dynamic Prompt Construction            │
│  - Available features (80+ columns)     │
│  - Performance feedback                 │
│  - LOFO directives                      │
│  - Prescriptive guidance                │
└─────────────┬───────────────────────────┘
              │
              v
┌─────────────────────────────────────────┐
│  LLM Generation                         │
│  Models: GPT-4o-mini, GPT-5-nano/mini   │
│  Output: 3 strategy specs (JSON)        │
└─────────────┬───────────────────────────┘
              │
              v
┌─────────────────────────────────────────┐
│  Backtesting Engine                     │
│  - 31 equities, 2019-2025               │
│  - Transaction costs (2+5+30 bps)       │
│  - Purged K-fold CV                     │
└─────────────┬───────────────────────────┘
              │
              v
┌─────────────────────────────────────────┐
│  LOFO Analysis                          │
│  (Leave-One-Factor-Out ablation)        │
└─────────────┬───────────────────────────┘
              │
              v
         Refinement (repeat)
```

---

## Backtesting Engine

### Rigorous Validation Framework

The engine implements classical strategies to verify methodology:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/alphalab/equity_curves.png" title="Equity curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Cumulative returns comparison showing baseline strategy performance across market regimes (2019-2025).
</div>

**Baseline Strategies Tested:**

- Time-Series Momentum: Sharpe 0.220
- Cross-Sectional Momentum: Sharpe -0.006
- Mean Reversion (1-5 day): Sharpe 0.216

### Transaction Cost Model

Following Frazzini et al. (2012), total execution costs:

$$\text{Total Cost} = c + s + b \cdot h$$

where:

- $c = 0.0002$ (commission, 2 bps)
- $s = 0.0005$ (slippage, 5 bps)
- $b = 0.003$ (holding cost, 30 bps annually)

---

## Evaluation Framework

### Three-Tier Filtering System

**Tier 1: Hard Filters** (Pass/Fail)

- Total return > 0%
- Sharpe ratio > 0.30
- Maximum drawdown < 40%
- Trade count > 100

**Tier 2: Composite Score** (0-100)

$$\text{Score} = \sum_{i=1}^{7} w_i \cdot \min\left(1, \frac{M_i}{T_i}\right) \times 100$$

| Metric        | Weight | Target |
| ------------- | ------ | ------ |
| Sharpe Ratio  | 35%    | 1.5    |
| Max Drawdown  | 20%    | 10%    |
| Sortino Ratio | 15%    | 1.8    |
| Calmar Ratio  | 10%    | 2.0    |
| Win Rate      | 5%     | 55%    |
| Consistency   | 10%    | 0.8    |
| Tail Risk     | 5%     | -2%    |

**Tier 3: Robustness Checks**

- Purged K-fold cross-validation (prevents temporal leakage)
- Walk-forward analysis
- Regime sensitivity testing

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/alphalab/rolling_sharpe.png" title="Rolling Sharpe" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Time-varying risk-adjusted returns demonstrating regime sensitivity across bull/bear/volatile periods.
</div>

---

## LLM Strategy Generation

### Few-Shot Learning

The system queries a persistent SQLite database to provide contextual examples:

**Positive Examples** (Top 3):

- High-performing strategies (Sharpe > 0.50)
- Realistic factor combinations
- Proper weight distributions

**Negative Examples** (Top 2):

- Instructive failure modes
- Common mistakes to avoid

### LOFO Analysis

Leave-One-Factor-Out ablation identifies factor importance:

```
For each factor f in best_strategy:
    1. Remove factor f from specification
    2. Re-backtest modified strategy
    3. Measure ΔSharpe, ΔDrawdown
    4. Classify: HELPS vs HURTS
```

Results injected into next iteration with enforcement: "If LOFO identifies harmful columns, DO NOT use those columns."

---

## Experimental Results

### Latest Experiments (November 2025)

**Test Configuration:**

- Universe: 31 equities across sectors
- Period: 2019-2025 (~7 years)
- Models: GPT-4o-mini, GPT-5-nano, GPT-5-mini
- Target: Score ≥ 50/100, Sharpe ≥ 0.70

| Model      | Iterations | Best Score | Best Sharpe | Outcome                  |
| ---------- | ---------- | ---------- | ----------- | ------------------------ |
| GPT-5-nano | 58/150     | 32.3/100   | 0.27        | Crashed (malformed JSON) |
| GPT-5-mini | 56/100     | 35.3/100   | 0.42        | Stopped (plateau)        |

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/alphalab/drawdowns.png" title="Maximum drawdown analysis" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Drawdown analysis revealing tail risk characteristics across tested strategies.
</div>

### Key Observations

1. **Performance Ceiling**: Best score 35.3/100 (70.6% of target)
2. **Local Optimum Convergence**: GPT-5-mini plateaued after 25 iterations despite 100-iteration budget
3. **Pattern Repetition**: LLMs cycled through naming variations rather than exploring new factor combinations
4. **Feedback Incorporation Failure**: Explicit LOFO directives didn't prevent repeated mistakes

**After 168+ strategy evaluations:**

- Pass rate: **0%** (zero strategies met production thresholds)
- Best Sharpe: **0.42** (60% of target 0.70)
- Improvement stopped after ~25 iterations

---

## Limitations and Proposed Solutions

### Root Causes

**Hypothesis 1: Lack of Domain Alignment**

- Foundation models not trained on quantitative finance tasks
- Pre-training data includes general finance but limited professional alpha research

**Hypothesis 2: Insufficient Seed Database**

- Small database (~20-30 passing strategies)
- Limited factor space exploration
- Lack of regime-specific strategies

**Hypothesis 3: Prompt Engineering Ceiling**

- Despite dynamic prompting with LOFO, feedback, and guidance
- LLMs generate similar patterns across iterations

### Proposed Solutions

**1. Post-Alignment with Expert Feedback**

- RLHF (Reinforcement Learning from Human Feedback)
- DPO (Direct Preference Optimization)
- Expert demonstrations (100-500 curated strategy specs)

**2. Expand Seed Database**

- Grid search over factor combinations
- Bayesian optimization for weight allocation
- Regime clustering (bull/bear/volatile)
- Academic baseline implementations

**3. LoRA Fine-Tuning**

Train lightweight adapters specialized for quantitative finance:

$$W_0 + \Delta W = W_0 + BA$$

where $B \in \mathbb{R}^{d \times r}$, $A \in \mathbb{R}^{r \times k}$ with rank $r \ll \min(d,k)$

- Train only 1-2% of parameters
- Preserve general reasoning
- Specialize to domain

---

## Feature Engineering

The system generates 80+ features from OHLCV data:

**1. Multi-Horizon Returns** (8 lookbacks: 1d, 5d, 10d, 20d, 21d, 60d, 126d, 252d)

**2. Volatility Measures**

- Close-to-Close, Parkinson, HL Volatility
- Multiple windows (10d, 20d, 60d)

**3. Technical Indicators**

- RSI (14d, 28d), Volume Z-Score, Average Dollar Volume

**4. Statistical Moments**

- Z-Scores, Skewness, Kurtosis (cross-sectional)

**5. Market Beta** (60d, 252d to SPY)

**6. Macro Indicators** (optional from FRED)

- GDP, CPI, unemployment, Fed funds, VIX, credit spreads

---

## Conclusions

This research demonstrates fundamental limitations of current foundation models for quantitative strategy generation:

1. **Schema adherence degrades** over long runs (malformed JSON after 57 iterations)
2. **Iterative refinement hits ceiling** (31 iterations without improvement)
3. **Pattern repetition over innovation** (naming variations, not new factors)
4. **Feedback incorporation failure** (explicit directives don't prevent mistakes)

**Implication**: Without domain-specific alignment (fine-tuning, RLHF, expert demos), LLMs struggle to generate production-quality trading strategies even with sophisticated prompt engineering.

Future work will explore LoRA fine-tuning, expanded seed databases, and human expert feedback loops.

---

## Technical Stack

- **Backtesting**: Pandas, NumPy for vectorized operations
- **Feature Engineering**: TA-Lib, scikit-learn
- **LLM Integration**: OpenAI API (GPT-4o, GPT-5)
- **Database**: SQLite for strategy persistence
- **Validation**: Purged K-fold CV (López de Prado, 2018)

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        <a href="https://github.com/jkoganem/alphalab" class="btn btn-primary" target="_blank">
            <i class="fa-brands fa-github"></i> View on GitHub
        </a>
    </div>
</div>
