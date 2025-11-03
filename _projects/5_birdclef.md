---
layout: page
title: Bird Species Identification using Deep Learning
description: Passive acoustic monitoring with CNNs for biodiversity conservation (BirdCLEF 2024)
img: assets/img/projects/birdclef/output5.png
importance: 5
category: deep learning
github: https://github.com/AmziJeffs/Erdos_birdCLEF
---

## Overview

Climate change plays a devastating role in the destruction of natural habitats and the global decline of biodiversity. Monitoring bird populations is crucial as birds are highly migratory with diverse habitat needs, making them excellent indicators of environmental health.

This project explores using **passive acoustic monitoring (PAM)** combined with deep learning to identify bird species from audio samples in the Western Ghats of India. We developed convolutional neural networks to classify 182 bird species for the [BirdCLEF 2024 Kaggle competition](https://www.kaggle.com/competitions/birdclef-2024).

**Team Members:**

- [Amzi Jeffs](https://github.com/AmziJeffs)
- [Junichi Koganemaru](https://github.com/jkoganem)
- [Salil Singh](https://github.com/sllsnghlrns)
- [Ashwin Tarikere](https://github.com/ashwintan1)

**Completed as part of the Erdös Institute Data Science Bootcamp (June 2024)**

---

## Dataset Analysis

### Geographic Distribution

The training metadata reveals geographically diverse audio samples across the Western Ghats region:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/birdclef/newplot.png" title="Geographic distribution" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Geographic distribution of training audio samples showing diverse coverage across the Western Ghats of India.
</div>

### Class Imbalance Challenge

Early exploratory data analysis revealed significant class imbalance across the 182 species:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/birdclef/output1.png" title="Species distribution" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Number of audio clips per species reveals severe class imbalance, with some species having hundreds of samples while others have fewer than 10.
</div>

This imbalance posed a significant challenge, requiring careful consideration of:

- Weighted loss functions
- Data augmentation strategies
- Sampling techniques during training

---

## Mel Spectrogram Preprocessing

### Feature Extraction

We transformed audio clips to mel spectrograms using PyTorch's `torchaudio` package, converting waveforms into visual representations suitable for CNNs:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/birdclef/output5.png" title="Mel spectrogram" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Mel spectrogram representation of a bird call. Frequency is on the y-axis, time on the x-axis, and intensity shown by color. Different bird species exhibit distinct frequency patterns and temporal structures.
</div>

### Data Augmentation

To improve generalization and address class imbalance, we implemented several augmentation techniques:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/birdclef/output6.png" title="Augmented spectrograms" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Data augmentation techniques applied to mel spectrograms: time masking, frequency masking, and contrast adjustment via exponentiation. These transformations help models generalize to variations in recording conditions.
</div>

**Augmentation Strategies:**

- **Time masking**: Random temporal segments zeroed out
- **Frequency masking**: Random frequency bands suppressed
- **Contrast adjustment**: Spectrogram exponentiation to vary intensity
- **Mixup**: Combining spectrograms from different samples

---

## Model Architecture Evolution

### Baseline: 2-Layer CNN

Our initial baseline was a simple two-layer convolutional neural network:

**Architecture:**

- Conv2D (32 filters, 3×3 kernel) + ReLU + MaxPool
- Conv2D (64 filters, 3×3 kernel) + ReLU + MaxPool
- Fully connected layer → 182-class output
- Sigmoid activation for multi-label classification

**Challenge:** Early models exhibited severe overfitting, learning to memorize training samples rather than generalizing to new bird calls.

### Improved Architecture: 6-Layer CNN

We progressively deepened the network and added regularization:

**Enhancements:**

- 6 convolutional layers with batch normalization
- Dropout layers (p=0.3-0.5) for regularization
- Residual connections to prevent gradient degradation
- Improved preprocessing pipeline with augmentation

### Transfer Learning: ResNet & ConvNeXT

We experimented with pre-trained models fine-tuned for audio classification:

- **ResNet**: Adapted from ImageNet pre-training
- **ConvNeXT**: Modern CNN architecture with improved efficiency

---

## Training Results

### Overfitting Reduction

Improved data preprocessing and model architecture significantly reduced overfitting:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/birdclef/60epochs.png" title="Training curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Training dynamics over 60 epochs showing improved generalization. The gap between training and validation loss is significantly reduced compared to baseline models, indicating successful regularization.
</div>

**Key Improvements:**

- Training loss stabilized without catastrophic overfitting
- Validation loss tracked training loss more closely
- Improved data augmentation prevented memorization
- Batch normalization and dropout enhanced generalization

---

## Evaluation Metric

Models are evaluated using **macro-averaged ROC-AUC** on a hidden test set of ~1,100 audio clips provided by Kaggle organizers. Each test clip may contain multiple bird calls, requiring multi-label classification.

**Why ROC-AUC?**

- Robust to class imbalance (treats all species equally)
- Measures model's ability to distinguish between species
- Evaluates probability calibration, not just hard classifications

---

## Technical Implementation

### Data Pipeline

**Memory-Optimized Loading:**

- Scripts designed for remote cluster execution
- Training data loaded into RAM for speed (requires significant memory)
- Can be modified for local execution with reduced batch sizes

**Preprocessing Steps:**

1. Load audio clips (5-second segments)
2. Convert to mel spectrograms (128 mel bins, 32kHz sampling)
3. Apply augmentation transformations
4. Normalize and batch for GPU training

### Model Training

**Configuration:**

- Optimizer: Adam with learning rate scheduling
- Loss: Binary cross-entropy (multi-label)
- Batch size: 32-64 (depending on model size)
- Training epochs: 60+
- Hardware: GPU cluster (NVIDIA A100/V100)

---

## Key Challenges and Solutions

| Challenge                      | Solution                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------- |
| **Class imbalance**            | Weighted loss functions, data augmentation, oversampling rare species           |
| **Overfitting**                | Dropout, batch normalization, augmentation, early stopping                      |
| **Computational cost**         | Transfer learning, efficient architectures (ConvNeXT), mixed precision training |
| **Multi-label classification** | Sigmoid activation, BCEWithLogitsLoss, independent probability thresholds       |
| **Noisy recordings**           | Frequency/time masking augmentation, robust feature extraction                  |

---

## Project Outcomes

**Competition Results:**

- Successfully submitted to BirdCLEF 2024 Kaggle competition (deadline: June 10, 2024)
- Completed Erdös Institute Data Science Bootcamp capstone (deadline: June 1, 2024)

**Technical Achievements:**

- Built end-to-end audio classification pipeline in PyTorch
- Achieved significant overfitting reduction through architectural improvements
- Implemented state-of-the-art data augmentation for audio spectrograms
- Gained hands-on experience with transfer learning and modern CNN architectures

**Broader Impact:**
This work contributes to the growing literature of deep learning approaches for biodiversity monitoring and climate change research. Automated bird species identification enables large-scale habitat monitoring that would be prohibitively expensive with traditional methods.

---

## Acknowledgments

We thank the organizers of BirdCLEF 2024 and associated organizations for hosting the competition. We also appreciate the Kaggle community for sharing insights on discussion forums.

Special thanks to:

- **Erdös Institute** for providing the opportunity to work on this project
- **Nuno Chagas and CMU Department of Mathematical Sciences** for computing support
- **Valerio Velardo** for the PyTorch audio tutorial series

---

## Technical Stack

- **Deep Learning**: PyTorch, torchaudio
- **Data Processing**: NumPy, pandas, librosa
- **Visualization**: Matplotlib, Seaborn, Plotly
- **Compute**: Remote GPU cluster (NVIDIA A100)

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        <a href="https://github.com/AmziJeffs/Erdos_birdCLEF" class="btn btn-primary" target="_blank">
            <i class="fa-brands fa-github"></i> View on GitHub
        </a>
    </div>
</div>
