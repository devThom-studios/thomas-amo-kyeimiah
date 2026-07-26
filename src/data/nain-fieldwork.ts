import img4737 from "@/assets/nain/IMG_4737.jpg.asset.json";
import img4738 from "@/assets/nain/IMG_4738.jpg.asset.json";
import img4746 from "@/assets/nain/IMG_4746_2.jpg.asset.json";
import img4759 from "@/assets/nain/IMG_4759.jpg.asset.json";
import img4762 from "@/assets/nain/IMG_4762.jpg.asset.json";
import img4776 from "@/assets/nain/IMG_4776.jpg.asset.json";
import img4777 from "@/assets/nain/IMG_4777.jpg.asset.json";
import img4779 from "@/assets/nain/IMG_4779_2.jpg.asset.json";

export type NainPhoto = {
  src: string;
  alt: string;
  caption: string;
  orientation: "landscape" | "portrait" | "panorama";
};

export const NAIN_HERO = {
  src: img4738.url,
  alt: "Snow-covered sea ice at dawn with mountains and a coastal community on the horizon near Nain, Nunatsiavut.",
};

export const NAIN_FEATURE_IMAGE = {
  src: img4762.url,
  alt: "Frozen coastline near Nain, Nunatsiavut, with snow-covered hills under overcast winter sky.",
};

export const NAIN_GALLERY: NainPhoto[] = [
  {
    src: img4737.url,
    alt: "Snowmobile tracks crossing sea ice in front of a wooden wharf near Nain at dusk.",
    caption: "Snowmobile tracks running out from the town wharf across the sea ice.",
    orientation: "landscape",
  },
  {
    src: img4738.url,
    alt: "Snow-covered sea ice at dawn with mountains and a coastal community on the horizon.",
    caption: "Dawn light over the frozen bay outside Nain.",
    orientation: "landscape",
  },
  {
    src: img4746.url,
    alt: "Coastal mountain and partially frozen water near a small Arctic community under overcast skies.",
    caption: "Coastal ice and open water beneath the mountains bordering the community.",
    orientation: "landscape",
  },
  {
    src: img4759.url,
    alt: "Wide panorama of a snow-covered field with an instrument tripod, a researcher, and snowmobiles under low cloud.",
    caption: "Instrument site on the sea ice, with snowmobiles staged for the return.",
    orientation: "panorama",
  },
  {
    src: img4762.url,
    alt: "Researcher in winter gear crouching beside a tripod-mounted instrument on the sea ice, photographing the setup.",
    caption: "Documenting an instrument deployment on the sea ice.",
    orientation: "portrait",
  },
  {
    src: img4776.url,
    alt: "Three people in heavy winter parkas standing beside a snowmobile and yellow sled loaded with field equipment on the ice.",
    caption: "Field team preparing to move equipment across the ice.",
    orientation: "landscape",
  },
  {
    src: img4777.url,
    alt: "Group of researchers in parkas and ski goggles gathered close together on a snowy plain under grey skies.",
    caption: "Team check-in during a long day in the cold.",
    orientation: "landscape",
  },
  {
    src: img4779.url,
    alt: "Person in a parka standing among low, snow-covered shrubs on a windswept slope, with snowmobiles parked in the distance.",
    caption: "A short traverse through low shrub tundra between instrument sites.",
    orientation: "landscape",
  },
];