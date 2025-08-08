import { Dimensions, Platform, PixelRatio, ScaledSize } from "react-native";
import { useEffect, useState } from "react";

// Types for better type safety
type Orientation = "portrait" | "landscape";
type BreakpointGroup = "xs" | "sm" | "md" | "lg" | "xl";
type PlatformOS = "ios" | "android" | "web" | "windows" | "macos";

interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

// Configuration
const CONFIG = {
  // Base dimensions
  baseWidth: 402,
  baseHeight: 895,

  // Breakpoints in pixels
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: Infinity,
  } as Breakpoints,
};

// Cache screen dimensions with type safety
let screenDimensions: ScaledSize = Dimensions.get("window");

// Hook to get and subscribe to dimensions
export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState(screenDimensions);

  useEffect(() => {
    const handleDimensionChange = ({ window }: { window: ScaledSize }) => {
      screenDimensions = window;
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleDimensionChange
    );
    return () => subscription.remove();
  }, []);

  return dimensions;
};

// Get the screen dimensions
export const getScreenDimensions = (): ScaledSize => screenDimensions;

// Calculate scale factor with minimum and maximum constraints
export const getScaleFactor = (minScale = 0.5, maxScale = 1.5): number => {
  const { width, height } = getScreenDimensions();
  const widthScale = width / CONFIG.baseWidth;
  const heightScale = height / CONFIG.baseHeight;
  const scale = Math.min(widthScale, heightScale);

  return Math.min(Math.max(scale, minScale), maxScale);
};

// Enhanced width percentage calculation with validation
export const wp = (widthPercent: number | string): number => {
  const { width } = getScreenDimensions();
  const elemWidth =
    typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);

  if (isNaN(elemWidth) || elemWidth < 0 || elemWidth > 100) {
    console.warn("wp(): Invalid width percentage value");
    return 0;
  }

  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
};

// Enhanced height percentage calculation with validation
export const hp = (heightPercent: number | string): number => {
  const { height } = getScreenDimensions();
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);

  if (isNaN(elemHeight) || elemHeight < 0 || elemHeight > 100) {
    console.warn("hp(): Invalid height percentage value");
    return 0;
  }

  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
};

// Viewport units with validation
export const vw = (size: number): number => {
  if (size < 0) {
    console.warn("vw(): Size cannot be negative");
    return 0;
  }
  const { width } = getScreenDimensions();
  return PixelRatio.roundToNearestPixel((width / CONFIG.baseWidth) * size);
};

export const vh = (size: number): number => {
  if (size < 0) {
    console.warn("vh(): Size cannot be negative");
    return 0;
  }
  const { height } = getScreenDimensions();
  return PixelRatio.roundToNearestPixel((height / CONFIG.baseHeight) * size);
};

// Enhanced REM calculation with minimum size
export const rem = (size: number, minSize = 8): number => {
  const scale = getScaleFactor();
  const scaledSize = size * scale;
  return PixelRatio.roundToNearestPixel(Math.max(scaledSize, minSize));
};

// Responsive font calculation with min and max constraints
export const rf = (size: number, minSize = 8, maxSize = 40): number => {
  const scale = getScaleFactor();
  const scaledSize = size * scale;
  const constrainedSize = Math.min(Math.max(scaledSize, minSize), maxSize);
  return Math.round(PixelRatio.roundToNearestPixel(constrainedSize));
};

// Get current orientation with type safety
export const getOrientation = (): Orientation => {
  const { width, height } = getScreenDimensions();
  return width > height ? "landscape" : "portrait";
};

// Hook to subscribe to orientation changes
export const useOrientation = (): Orientation => {
  const dimensions = useScreenDimensions();
  return dimensions.width > dimensions.height ? "landscape" : "portrait";
};

// Platform utilities
export const getPlatform = (): PlatformOS => Platform.OS;
export const isIOS: boolean = Platform.OS === "ios";
export const isAndroid: boolean = Platform.OS === "android";
export const isWeb: boolean = Platform.OS === "web";

// Get breakpoint group with type safety
export const getBreakpointGroup = (): BreakpointGroup => {
  const { width } = getScreenDimensions();
  if (width < CONFIG.breakpoints.xs) return "xs";
  if (width < CONFIG.breakpoints.sm) return "sm";
  if (width < CONFIG.breakpoints.md) return "md";
  if (width < CONFIG.breakpoints.lg) return "lg";
  return "xl";
};

// Hook to subscribe to breakpoint changes
export const useBreakpointGroup = (): BreakpointGroup => {
  const dimensions = useScreenDimensions();
  return getBreakpointGroup();
};

// Utility to check if current width is within a breakpoint range
export const isWithinBreakpoint = (breakpoint: BreakpointGroup): boolean => {
  return getBreakpointGroup() === breakpoint;
};
