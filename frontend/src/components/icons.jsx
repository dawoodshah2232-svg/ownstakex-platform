// Inline SVG icon set — no emojis in the UI.
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

function I({ children, size = 20, ...rest }) {
  return (
    <svg width={size} height={size} {...base} {...rest} aria-hidden="true">
      {children}
    </svg>
  );
}

export const IconMenu = (p) => (
  <I {...p}><path d="M4 7h16M4 12h16M4 17h16" /></I>
);
export const IconClose = (p) => (
  <I {...p}><path d="M6 6l12 12M18 6L6 18" /></I>
);
export const IconArrow = (p) => (
  <I {...p}><path d="M5 12h14m-6-6 6 6-6 6" /></I>
);
export const IconCheck = (p) => (
  <I {...p}><path d="m5 13 4 4L19 7" /></I>
);
export const IconShield = (p) => (
  <I {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="m9.5 12 2 2 3.5-4" /></I>
);
export const IconChart = (p) => (
  <I {...p}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></I>
);
export const IconBuilding = (p) => (
  <I {...p}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" /></I>
);
export const IconAnchor = (p) => (
  <I {...p}><circle cx="12" cy="5" r="2.5" /><path d="M12 7.5V21M5 12a7 7 0 0 0 14 0M12 21l-3-3m3 3 3-3" /></I>
);
export const IconBed = (p) => (
  <I {...p}><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6" /><path d="M3 18h18M5 10V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /></I>
);
export const IconBriefcase = (p) => (
  <I {...p}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></I>
);
export const IconDoc = (p) => (
  <I {...p}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h5M10 17h5" /></I>
);
export const IconWallet = (p) => (
  <I {...p}><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M16 15h2" /></I>
);
export const IconUsers = (p) => (
  <I {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" /><circle cx="17" cy="9" r="2.6" /><path d="M16 14.6c2.9.1 5 1.7 5.7 4.4" /></I>
);
export const IconMail = (p) => (
  <I {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></I>
);
export const IconPin = (p) => (
  <I {...p}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></I>
);
export const IconLogout = (p) => (
  <I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></I>
);
export const IconUpload = (p) => (
  <I {...p}><path d="M12 16V4m-4 4 4-4 4 4" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></I>
);
export const IconPlay = (p) => (
  <I {...p}><circle cx="12" cy="12" r="9" /><path d="m10 8.5 5 3.5-5 3.5z" /></I>
);
export const IconAlert = (p) => (
  <I {...p}><path d="M12 3 2.5 20h19L12 3z" /><path d="M12 10v4m0 3v.5" /></I>
);

export const categoryIcon = (key, props) => {
  switch (key) {
    case "building": return <IconBuilding {...props} />;
    case "anchor": return <IconAnchor {...props} />;
    case "bed": return <IconBed {...props} />;
    case "briefcase": return <IconBriefcase {...props} />;
    default: return <IconChart {...props} />;
  }
};
