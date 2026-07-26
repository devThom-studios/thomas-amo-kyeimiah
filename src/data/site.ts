import seaice from "@/assets/research/Fig4_ensemble_mean.jpg.asset.json";
import cmip6 from "@/assets/research/CMIP6_bias_assessment.png.asset.json";
import malaria from "@/assets/research/Ghana_monthly_vectorial_capacity.jpg.asset.json";

export const RESEARCH = [
  {
    slug: "sea-ice-nunatsiavut",
    title: "Projection of sea-ice conditions in Nunatsiavut (Labrador)",
    period: "2022 – 2024 · MSc thesis, McGill University",
    image: seaice.url,
    imageAlt:
      "Monthly maps (Dec–Jul) of sea-ice thickness along the Labrador coast comparing Canadian Ice Service observations with CESM-HR ensemble-mean output.",
    summary:
      "Projected changes in landfast and pack ice along the Nunatsiavut coast by combining high-resolution CESM output with Canadian Ice Service in-situ observations, and built a lightweight ERA5 degree-day model of sea-ice onset and melt validated against thickness records.",
    methods: [
      "CESM-HR climate-model diagnostics",
      "Model–observation bias analysis",
      "ERA5 degree-day sea-ice onset/melt model",
      "Statistical validation against ice-thickness data",
    ],
    datasets: ["CESM-HR", "ERA5", "Canadian Ice Service (CIS) observations"],
    results: [
      "Integrated CESM-HR output with CIS in-situ records to characterise regional bias in ice onset and duration.",
      "Built and validated a simple degree-day model reproducing observed sea-ice onset and melt seasons in Nunatsiavut.",
    ],
    links: [
      {
        label: "Thesis (McGill eScholarship)",
        href: "https://escholarship.mcgill.ca/concern/theses/kw52jf57r",
      },
      { label: "Code (GitHub)", href: "https://github.com/devThom-studios" },
    ],
  },
  {
    slug: "cmip6-sea-ice-assessment",
    title: "CMIP6 sea-ice concentration and thickness assessment",
    period: "2024 · Environment and Climate Change Canada",
    image: cmip6.url,
    imageAlt:
      "Maps of Arctic sea-ice concentration means and CMIP6 bias against HadISST and OSTIA for the 10th and 90th percentiles (1982–2014).",
    summary:
      "Evaluated CMIP6 sea-ice concentration and thickness against observational datasets using Python-based climate data workflows, supporting model diagnostics and inter-model comparison at ECCC.",
    methods: [
      "CMIP6 model evaluation",
      "Bias metrics and skill scores",
      "Large geospatial data processing with Xarray / Dask",
      "Cartographic visualisation with Cartopy",
    ],
    datasets: ["CMIP6", "NSIDC passive microwave", "Observational sea-ice thickness"],
    results: [
      "Quantified inter-model spread in Arctic sea-ice concentration and thickness against satellite records.",
      "Delivered reusable Python workflows for climate diagnostics adopted by the research team.",
    ],
    links: [{ label: "Code (GitHub)", href: "https://github.com/devThom-studios" }],
  },
  {
    slug: "malaria-vectorial-capacity",
    title: "Climate change and malaria vectorial capacity in Ghana",
    period: "2021 · BSc thesis, KNUST",
    image: malaria.url,
    imageAlt:
      "Monthly maps of malaria vectorial capacity across Ghana from January through December, showing the seasonal cycle across the country's agro-ecological zones.",
    summary:
      "Investigated how temperature change affects the vectorial capacity of Anopheles mosquitoes across the agro-ecological zones of Ghana, combining climate data analysis with statistical transmission modelling. Contributed to a peer-reviewed study on warming and mosquito lifespan.",
    methods: [
      "Climate–disease statistical modelling",
      "Zonal comparative analysis",
      "SIR-type disease-transmission modelling",
      "Geospatial visualisation",
    ],
    datasets: [
      "Ghana Meteorological Agency station data",
      "Reanalysis temperature fields",
      "Entomological survey data",
    ],
    results: [
      "Estimated malaria vectorial capacity across Ghana's agro-ecological zones under changing temperature regimes.",
      "Winner of the KNUST Final-Year Poster Presentation (2021).",
    ],
    links: [
      {
        label: "Published article (Infectious Disease Modelling)",
        href: "https://doi.org/10.1016/j.idm.2025.12.011",
      },
    ],
  },
] as const;

export const PUBLICATIONS = {
  journal: [
    {
      year: "2025",
      authors: "Yamba, E., Badu, K., Kyeimiah, T. A., et al.",
      title:
        "Warming temperatures reduce lifespan and vectorial capacity of Anopheles mosquitoes in Ghana",
      venue: "Infectious Disease Modelling",
      doi: "10.1016/j.idm.2025.12.011",
      links: [{ label: "DOI", href: "https://doi.org/10.1016/j.idm.2025.12.011" }],
    },
  ],
  conference: [
    {
      year: "2024",
      authors: "Kyeimiah, T. A.",
      title:
        "Projection of sea-ice condition in Nunatsiavut (Labrador) from CESM-HR and observations",
      venue:
        "School and Workshop on Polar Climates, International Centre for Theoretical Physics (ICTP), Trieste, Italy",
      details: "Poster presentation",
    },
  ],
  thesis: [
    {
      year: "2024",
      authors: "Kyeimiah, T. A.",
      title: "Projection of sea-ice condition in Nunatsiavut (Labrador)",
      venue: "M.Sc. Thesis, Atmospheric and Oceanic Sciences, McGill University",
      details: "Advisor: Prof. Bruno Tremblay",
      links: [
        {
          label: "eScholarship",
          href: "https://escholarship.mcgill.ca/concern/theses/kw52jf57r",
        },
      ],
    },
    {
      year: "2021",
      authors: "Kyeimiah, T. A.",
      title:
        "Impact of climate change on vectorial capacity of malaria vectors over the agro-ecological zones of Ghana",
      venue:
        "B.Sc. Thesis, Department of Physics (Meteorology and Climate Science), KNUST",
      details: "Advisor: Dr. Edmund Ilimoan Yamba",
    },
  ],
  poster: [
    {
      year: "2024",
      authors: "Kyeimiah, T. A.",
      title:
        "Sea-ice projection in Nunatsiavut: combining CESM-HR with in-situ observations",
      venue:
        "ICTP School and Workshop on Polar Climates, Trieste, Italy",
    },
    {
      year: "2021",
      authors: "Kyeimiah, T. A.",
      title:
        "Climate change and malaria vectorial capacity across Ghana's agro-ecological zones",
      venue: "KNUST Final-Year Poster Presentation (Winner)",
    },
  ],
} as const;

export const PROJECTS = [
  {
    name: "sea-ice-nunatsiavut",
    tagline: "Sea-ice projection in Nunatsiavut (MSc thesis)",
    description:
      "Climatology, anomaly mapping, and time-series analysis of sea-ice concentration and thickness along the Labrador coast, combining CESM-HR output with Canadian Ice Service observations.",
    stack: ["Python", "Xarray", "Cartopy", "CESM", "ERA5"],
    href: "https://github.com/devThom-studios/Sea-Ice-Projection-Nunatsiavut",
  },
  {
    name: "cmip6-sea-ice-assessment",
    tagline: "Bias metrics and model evaluation for CMIP6 sea ice",
    description:
      "Python workflow for computing bias metrics and skill scores of CMIP6 sea-ice concentration and thickness against observational datasets, developed at Environment and Climate Change Canada.",
    stack: ["Python", "Xarray", "Pandas", "CMIP6", "Cartopy"],
    href: "https://github.com/devThom-studios/Research-Summer-2024",
  },
  {
    name: "climate-diagnostics-toolkit",
    tagline: "NSIDC passive-microwave processing toolkit",
    description:
      "Reusable diagnostics for processing NSIDC passive-microwave sea-ice data: regridding, masking, and derived-quantity computation for downstream climate analysis.",
    stack: ["Python", "Xarray", "NumPy", "NSIDC"],
    href: "https://github.com/devThom-studios/CDR-NSIDC-Data-Processing",
  },
  {
    name: "southern-ocean-mitgcm",
    tagline: "Southern Ocean circulation with MITgcm",
    description:
      "Idealised MITgcm ocean simulations exploring thermocline structure and circulation response to wind forcing in the Southern Ocean.",
    stack: ["MITgcm", "Fortran", "Python", "ParaView"],
    href: "https://github.com/devThom-studios/Ocean-Physics-Modelling-Paper-Semester-Project",
  },
  {
    name: "sir-malaria-model",
    tagline: "SIR malaria disease-transmission model",
    description:
      "Undergraduate research project modelling malaria transmission dynamics with an SIR framework driven by climate variables across Ghana's agro-ecological zones.",
    stack: ["Python", "NumPy", "SciPy", "Matplotlib"],
    href: "https://github.com/devThom-studios/SIR-Disease-modelling",
  },
  {
    name: "arctic-pamip-miniproject",
    tagline: "Sea-ice loss & CO₂ doubling on Arctic precipitation",
    description:
      "Mini-project completed at ICTP (supervised by Prof. Paul Kushner) using CESM-WACCM4 PAMIP experiments to explore precipitation response to sea-ice loss and CO₂ doubling.",
    stack: ["CESM-WACCM4", "Python", "Xarray", "CDO"],
    href: undefined,
  },
] as const;

export const TEACHING = [
  {
    role: "Teaching Assistant",
    course: "ATOC 182 — Introduction to Oceanic Sciences & ATOC 184 — Science of Storms",
    where: "McGill University · Aug 2023 – May 2024",
    description:
      "Led math-intensive preparatory sessions, held office hours, graded coursework, and introduced AI-supported tools for critical reading and paper summaries.",
  },
  {
    role: "Teaching & Research Assistant",
    course:
      "Climate Change: Science, Policy & Management; Scientific Computing (Python/Fortran); Experimental Physics; Biometeorology and Human Health",
    where: "Department of Physics, KNUST · Oct 2021 – Sep 2022",
    description:
      "Supported lecturers with research and laboratory instruction, graded exams, and delivered workshops on Python, Linux, and Fortran for meteorology and climate science.",
  },
  {
    role: "Workshop Instructor",
    course: "Python for data analysis and visualisation",
    where: "KNUST · 2021 – 2022",
    description:
      "Tutored undergraduate students in Python with a focus on scientific data analysis, visualisation, and reproducible workflows for climate data.",
  },
  {
    role: "Intern",
    course: "Weather analysis and forecasting",
    where: "Ghana Meteorological Agency (GMet), Accra · Jun 2019 – Jul 2019",
    description:
      "Recorded and analysed rainfall and wind observations, produced trend analyses from weekly to decadal scales, and contributed to public forecasts using ArcGIS, R, radar/satellite data, and NWP models.",
  },
];

export const ARTICLES = [
  {
    date: "Coming soon",
    tag: "Science communication",
    title:
      "What sea ice in Nunatsiavut tells us about a warming Labrador coast",
    excerpt:
      "A plain-language walkthrough of what CESM-HR simulations and Canadian Ice Service observations imply for landfast ice, communities, and travel along the Labrador coast.",
    href: "#",
    read: "8 min read",
  },
  {
    date: "Coming soon",
    tag: "Technical",
    title:
      "A reproducible Xarray recipe for evaluating CMIP6 sea ice against observations",
    excerpt:
      "Opinionated defaults for regridding, masking, and bias-metric computation when comparing CMIP6 sea-ice fields to satellite records.",
    href: "#",
    read: "10 min read",
  },
  {
    date: "Coming soon",
    tag: "Science communication",
    title:
      "Warming and mosquitoes: what the numbers say about malaria in a hotter Ghana",
    excerpt:
      "How rising temperatures shorten Anopheles lifespan and reshape vectorial capacity across Ghana's agro-ecological zones — and what that does (and does not) mean for transmission.",
    href: "#",
    read: "6 min read",
  },
  {
    date: "Coming soon",
    tag: "Technical",
    title: "Coupling Python analysis to Fortran climate output without losing your mind",
    excerpt:
      "Notes on moving between Fortran model output and Python-based diagnostic workflows: file formats, memory layout, and pitfalls worth knowing before you start.",
    href: "#",
    read: "9 min read",
  },
];

export const RESEARCH_INTERESTS = [
  "Hydroclimatology and climate diagnostics",
  "Machine learning and Explainable AI for Earth system science",
  "Sea ice and polar climate",
  "Air quality",
  "Climate model evaluation and bias analysis",
  "Synoptic and mesoscale meteorology",
  "Climate–health interactions",
  "Geospatial and reproducible scientific computing",
];

export const SOCIALS = {
  cv: "/cv",
  github: "https://github.com/devThom-studios",
  linkedin: "https://www.linkedin.com/in/thomas-amo-kyeimiah-msc-87b602166/",
  scholar: "https://scholar.google.com/citations?user=Wh2jRRYAAAAJ&hl=en",
  orcid: "https://orcid.org/0009-0002-5080-0818",
  email: "mailto:kyeimiahthomasamo97@gmail.com",
  emailAddress: "kyeimiahthomasamo97@gmail.com",
  phone: "+1 438 465 1236",
  location: "Montreal, Quebec, Canada",
};