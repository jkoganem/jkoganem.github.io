---
layout: page
title: King Gizzard Setlist Prediction
description: Predicting concert setlists using Graph Neural Networks and temporal patterns
img: assets/img/projects/king-gizzard/4b_pmi_matrix.png
importance: 1
category: machine learning
github: https://github.com/jkoganem/king-gizzard-setlist-prediction
---

## Overview

Can we predict which songs will be played at a future King Gizzard & The Lizard Wizard concert? This project applies modern machine learning and deep learning techniques to predict setlists for one of the most unpredictable live bands.

**Key Achievement**: Developed a Graph Neural Network with frequency and recency priors that achieves **52.66% Recall@15** on test data, significantly outperforming baseline models.

---

## The Challenge

King Gizzard's setlists are notoriously unpredictable. The median overlap between consecutive shows is **0%** due to their "no repeat" rule:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/king-gizzard/1_setlist_overlap.png" title="Setlist overlap analysis" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Jaccard similarity between consecutive shows reveals almost zero overlap, making prediction extremely challenging.
</div>

However, deeper analysis reveals hidden patterns in how songs co-occur and how the band structures their sets across genres and energy levels.

---

## Technical Approach

### Co-occurrence Patterns

Using Pointwise Mutual Information (PMI), we quantify which songs frequently appear together:

$$\text{PMI}(song_i, song_j) = \log \frac{\mathbb{P}(song_i, song_j)}{\mathbb{P}(song_i) \cdot \mathbb{P}(song_j)}$$

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/king-gizzard/4b_pmi_matrix.png" title="PMI co-occurrence matrix" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    PMI matrix for top 30 songs reveals strong block structure - certain songs almost always appear together (deep red), while others actively avoid each other (deep blue).
</div>

### Model Evolution

We progressed through 5 stages of increasing sophistication:

1. **Baseline Models** (26.46% Recall@15): Logistic Regression with hand-crafted features
2. **XGBoost** (28.22%): Gradient boosting with hyperparameter optimization
3. **Deep Learning** (21.41%): DeepFM with embeddings (underperformed, motivating graph-based approach)
4. **Temporal GNN** (44.08%): Graph Neural Network capturing song co-occurrence
5. **GNN + Priors** (52.66%): Final model with learned frequency and recency weights

### Feature Importance

XGBoost revealed that venue-related features dominate predictions:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/king-gizzard/stage2_feature_importance_gain.png" title="Feature importance by gain" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Venue-specific play rates and geographic features are most predictive - King Gizzard tailors setlists to each location.
</div>

---

## Final Model Architecture

The winning architecture combines graph neural networks with statistical priors:

**GNN Path**: Graph convolution spreads information across songs that co-occur
**Frequency Prior**: Boosts popular songs with learned weight α = 0.482
**Recency Prior**: Penalizes recently-played songs with learned weight β = 0.481

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/king-gizzard/stage5b_training_curves.png" title="Training curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Training dynamics over 30,000 epochs. L2 regularization prevents frequency weight from dominating, forcing the model to balance graph patterns with statistical priors.
</div>

---

## Key Results

**Performance Metrics:**
- Overall Recall@15: **52.66%** (vs. 35-40% baseline of always predicting top 15 songs)
- Regular shows: 50.51%
- Marathon shows (24+ songs): 63.93%
- Model parameters: 78,643

**Inference Speed:**
- Training time: 39.7 minutes (one-time)
- Inference: <1ms per prediction

**Real-World Application:**
Given a venue, date, and tour name, the model predicts the top 15 most likely songs with confidence scores. Example predictions achieve 46-62% accuracy on held-out test data.

---

## Technical Stack

- **Data**: setlist.fm API (220 concerts, 2022-2025)
- **Models**: PyTorch, XGBoost, scikit-learn
- **Optimization**: Optuna for hyperparameter tuning
- **Features**: 34 engineered features (frequency, recency, venue affinity, co-occurrence)

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        <a href="https://github.com/jkoganem/king-gizzard-setlist-prediction" class="btn btn-primary" target="_blank">
            <i class="fa-brands fa-github"></i> View on GitHub
        </a>
    </div>
</div>
