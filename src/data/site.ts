import sst from "@/assets/research-sst.jpg";
import abl from "@/assets/research-abl.jpg";
import monsoon from "@/assets/research-monsoon.jpg";

export const RESEARCH = [
  {
    slug: "west-african-monsoon",
    title: "Dynamics of the West African Monsoon under a warming climate",
    period: "2023 – present",
    image: monsoon,
    imageAlt: "Satellite view of the West African coast with monsoon cloud structures.",
    summary:
      "Quantifying how moisture transport, low-level jets, and Sahelian precipitation respond to greenhouse forcing using CMIP6 ensembles and high-resolution regional simulations.",
    methods: ["CMIP6 downscaling", "WRF regional modelling", "Bayesian emergent constraints"],
    datasets: ["CMIP6", "ERA5", "CHIRPS", "GPM IMERG"],
    results: [
      "Detected a robust northward shift of the monsoon rain belt by 1.4° under SSP5-8.5.",
      "Constrained end-of-century Sahel rainfall change to +7 ± 3 % using an emergent constraint on low-level moisture flux.",
    ],
    links: [
      { label: "Code (GitHub)", href: "https://github.com" },
      { label: "Preprint", href: "#" },
    ],
  },
  {
    slug: "sst-teleconnections",
    title: "Sea-surface temperature teleconnections and African rainfall",
    period: "2022 – present",
    image: sst,
    imageAlt: "Global sea surface temperature anomaly map.",
    summary:
      "Machine-learning attribution of tropical SST patterns to seasonal rainfall variability across sub-Saharan Africa, with a focus on forecast skill on the S2S timescale.",
    methods: ["Causal discovery (PCMCI)", "Gradient-boosted attribution", "Analog forecasting"],
    datasets: ["HadISST", "GPCP", "ERA5", "SEAS5 hindcasts"],
    results: [
      "Identified two independent SST modes explaining 61 % of JJAS Sahel rainfall variance since 1980.",
      "Improved 3-month operational forecast skill (ROC 0.68 → 0.74) in the Guinea Coast region.",
    ],
    links: [
      { label: "Code (GitHub)", href: "https://github.com" },
      { label: "Journal article", href: "#" },
    ],
  },
  {
    slug: "boundary-layer-ml",
    title: "Machine-learned parameterisations of the atmospheric boundary layer",
    period: "2024 – present",
    image: abl,
    imageAlt: "Idealised atmospheric boundary layer profile visualisation.",
    summary:
      "Neural-network emulators of turbulence closure schemes that preserve conservation laws and remain stable when coupled online to a global atmospheric model.",
    methods: ["Physics-constrained neural nets", "Online coupling to CAM6", "Adjoint stability analysis"],
    datasets: ["LES archive (SAM)", "ARM SGP observations", "ERA5"],
    results: [
      "Reduced systematic low-cloud bias over the southeast Pacific by 22 %.",
      "Maintained numerical stability across a 10-year AMIP integration.",
    ],
    links: [
      { label: "Code (GitHub)", href: "https://github.com" },
      { label: "Working paper", href: "#" },
    ],
  },
] as const;

export const PUBLICATIONS = {
  journal: [
    {
      year: "2025",
      authors: "Amo Kyeimiah, T., Delworth, T. L., & Boateng, A.",
      title:
        "Emergent constraints on future West African monsoon rainfall from moisture-flux convergence",
      venue: "Journal of Climate",
      details: "38(6), 1421–1440",
      doi: "10.1175/JCLI-D-24-0187.1",
      links: [{ label: "DOI", href: "#" }, { label: "PDF", href: "#" }],
    },
    {
      year: "2024",
      authors: "Amo Kyeimiah, T., & Mensah, K.",
      title:
        "Causal drivers of Sahel rainfall variability: a PCMCI analysis of tropical SST modes",
      venue: "Geophysical Research Letters",
      details: "51, e2024GL110221",
      doi: "10.1029/2024GL110221",
      links: [{ label: "DOI", href: "#" }, { label: "PDF", href: "#" }],
    },
    {
      year: "2023",
      authors: "Owusu, F., Amo Kyeimiah, T., et al.",
      title:
        "Bias correction of CMIP6 precipitation for hydrological impact assessment in the Volta Basin",
      venue: "Environmental Research Letters",
      details: "18, 084011",
      doi: "10.1088/1748-9326/ace1a2",
      links: [{ label: "DOI", href: "#" }],
    },
  ],
  conference: [
    {
      year: "2025",
      authors: "Amo Kyeimiah, T.",
      title: "Physics-constrained boundary-layer emulators for coupled climate models",
      venue: "AGU Fall Meeting, New Orleans (invited talk)",
    },
    {
      year: "2024",
      authors: "Amo Kyeimiah, T. & Delworth, T. L.",
      title: "Emergent constraints on the West African monsoon response",
      venue: "EGU General Assembly, Vienna",
    },
  ],
  thesis: [
    {
      year: "2023",
      authors: "Amo Kyeimiah, T.",
      title:
        "Data-driven attribution of African rainfall variability to tropical SST forcing",
      venue: "M.Sc. Thesis, Department of Meteorology and Climate Science",
      details: "Advisor: Prof. K. Mensah",
    },
  ],
  poster: [
    {
      year: "2024",
      authors: "Amo Kyeimiah, T., Boateng, A.",
      title:
        "Downscaling CMIP6 precipitation for West Africa with convection-permitting WRF",
      venue: "WCRP Open Science Conference, Kigali",
    },
  ],
} as const;

export const PROJECTS = [
  {
    name: "climdiag",
    tagline: "A Python toolkit for climate model diagnostics",
    description:
      "Xarray-native diagnostics for CMIP-class models: energy budgets, moisture transport, teleconnection indices, and probabilistic constraints. Used in three published studies.",
    stack: ["Python", "xarray", "dask", "cartopy"],
    href: "https://github.com",
  },
  {
    name: "sahel-forecast",
    tagline: "Seasonal rainfall forecast dashboard for the Sahel",
    description:
      "Operational S2S dashboard combining ECMWF SEAS5 hindcasts with a gradient-boosted correction trained on 40 years of station data.",
    stack: ["Python", "PyTorch", "FastAPI", "React"],
    href: "https://github.com",
  },
  {
    name: "geoviz-atlas",
    tagline: "Interactive climate atlas for West Africa",
    description:
      "Vector-tile climate atlas serving 12 downscaled climate indicators at 4-km resolution. Designed with adaptation planners in Accra and Ouagadougou.",
    stack: ["Python", "GDAL", "MapLibre", "TypeScript"],
    href: "https://github.com",
  },
  {
    name: "abl-emulator",
    tagline: "Neural emulator for atmospheric boundary-layer physics",
    description:
      "Physics-constrained neural network parameterisation of turbulent fluxes, coupled online to CAM6 via a Fortran/Python bridge.",
    stack: ["PyTorch", "Fortran", "CESM", "MPI"],
    href: "https://github.com",
  },
  {
    name: "chirps-lens",
    tagline: "Zonal-statistics pipeline over CHIRPS rainfall",
    description:
      "Cloud-native pipeline computing decadal rainfall statistics over admin-2 polygons for all of Africa in under an hour.",
    stack: ["Python", "DuckDB", "STAC", "AWS"],
    href: "https://github.com",
  },
  {
    name: "era5-notebooks",
    tagline: "Teaching notebooks for ERA5 reanalysis analysis",
    description:
      "Open-source Jupyter curriculum for graduate students on synoptic and climatological analysis of ERA5.",
    stack: ["Jupyter", "xarray", "metpy"],
    href: "https://github.com",
  },
] as const;

export const TEACHING = [
  {
    role: "Instructor",
    course: "Introduction to Climate Data Analysis with Python",
    where: "Graduate short course · Summer 2025",
    description:
      "Two-week intensive covering xarray, geospatial workflows, and reproducible climate analysis. 34 participants from 9 African universities.",
  },
  {
    role: "Teaching Assistant",
    course: "Atmospheric Dynamics",
    where: "Undergraduate · 2023 – 2024",
    description:
      "Led weekly problem sessions on quasi-geostrophic theory, waves, and instability for a cohort of 60 students.",
  },
  {
    role: "Guest Lecturer",
    course: "Machine Learning for Earth System Science",
    where: "Graduate seminar · 2024",
    description:
      "Lecture on causal inference and emergent constraints as complements to purely predictive ML in climate.",
  },
  {
    role: "Mentor",
    course: "Undergraduate research mentoring",
    where: "2022 – present",
    description:
      "Supervised 6 undergraduate research projects on rainfall variability, remote sensing, and Python tooling.",
  },
];

export const ARTICLES = [
  {
    date: "May 2025",
    tag: "Science communication",
    title: "What emergent constraints can and cannot tell us about future rainfall",
    excerpt:
      "A plain-language walkthrough of how climate scientists use observations of the present to sharpen projections of the future — and where the method quietly breaks down.",
    href: "#",
    read: "8 min read",
  },
  {
    date: "March 2025",
    tag: "Technical",
    title: "Coupling a PyTorch model to a Fortran climate model without losing your mind",
    excerpt:
      "Notes from building a stable online coupling between a neural boundary-layer emulator and CAM6. Interfaces, memory layout, and a checklist of things that will bite you.",
    href: "#",
    read: "12 min read",
  },
  {
    date: "January 2025",
    tag: "Science communication",
    title: "The Sahel is greening. That does not mean the climate problem is over.",
    excerpt:
      "On the difference between a wetter decade and a robust long-term trend, and why the story matters for adaptation planning in West Africa.",
    href: "#",
    read: "6 min read",
  },
  {
    date: "October 2024",
    tag: "Technical",
    title: "A minimal xarray recipe for reproducible climate diagnostics",
    excerpt:
      "Opinionated defaults for chunking, encoding, and metadata that will save you (and your reviewers) hours later.",
    href: "#",
    read: "9 min read",
  },
];

export const RESEARCH_INTERESTS = [
  "Physical climate dynamics",
  "Land–atmosphere interactions",
  "West African monsoon systems",
  "Machine learning for Earth system science",
  "Geospatial and remote-sensing analysis",
  "Reproducible scientific computing",
];

export const SOCIALS = {
  cv: "/cv",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  scholar: "https://scholar.google.com",
  orcid: "https://orcid.org",
  email: "mailto:thomas.amokyeimiah@example.edu",
};