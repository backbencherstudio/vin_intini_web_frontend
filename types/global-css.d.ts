// This file tells TypeScript how to handle CSS imports (including global CSS)
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
