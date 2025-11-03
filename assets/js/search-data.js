// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "Blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "Repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-research",
          title: "Research",
          description: "Summary of my research",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "projects-king-gizzard-setlist-prediction",
          title: 'King Gizzard Setlist Prediction',
          description: "Predicting concert setlists using Graph Neural Networks and temporal patterns",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_king_gizzard/";
            },},{id: "projects-time-series-forecasting-amp-risk-managed-trading",
          title: 'Time-Series Forecasting &amp;amp; Risk-Managed Trading',
          description: "Combining classical statistics with machine learning for volatility-targeted strategies",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_quant_forecast/";
            },},{id: "projects-physics-informed-neural-networks-for-options-pricing",
          title: 'Physics-Informed Neural Networks for Options Pricing',
          description: "Achieving finite difference accuracy with neural network speed",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_pinns_options/";
            },},{id: "projects-alphalab-llm-powered-trading-strategy-generation",
          title: 'AlphaLab - LLM-Powered Trading Strategy Generation',
          description: "Exploring the frontier of AI-driven quantitative finance with iterative refinement",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_alphalab/";
            },},{id: "projects-bird-species-identification-using-deep-learning",
          title: 'Bird Species Identification using Deep Learning',
          description: "Passive acoustic monitoring with CNNs for biodiversity conservation (BirdCLEF 2024)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_birdclef/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%6B%6F%67%61%6E%65%6D@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/jkoganem", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/junichi-koganemaru", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
