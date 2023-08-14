export type CameraParameters = {
  aspect: number;
  far: number;
  filmGuage: number;
  filmOffset: number;
  fov: number;
  frustumCulled: boolean;
  near: number;
  zoom: number;
};

export const DefaultCameraParameters: CameraParameters = {
  aspect: 1,
  far: 1000,
  filmGuage: 35,
  filmOffset: 0,
  fov: 60,
  frustumCulled: true,
  near: 0.1,
  zoom: 1,
};
