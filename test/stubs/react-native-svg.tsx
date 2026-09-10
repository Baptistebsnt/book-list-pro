import { type ReactNode, createElement } from "react"

type SvgStubProps = { children?: ReactNode }

const SvgStub = ({ children }: SvgStubProps) =>
  createElement("svg-stub", null, children)

export const Svg = SvgStub
export const Circle = SvgStub
export const Ellipse = SvgStub
export const G = SvgStub
export const Text = SvgStub
export const TSpan = SvgStub
export const TextPath = SvgStub
export const Path = SvgStub
export const Polygon = SvgStub
export const Polyline = SvgStub
export const Line = SvgStub
export const Rect = SvgStub
export const Use = SvgStub
export const Image = SvgStub
export const Symbol = SvgStub
export const Defs = SvgStub
export const LinearGradient = SvgStub
export const RadialGradient = SvgStub
export const Stop = SvgStub
export const ClipPath = SvgStub
export const Pattern = SvgStub
export const Mask = SvgStub
export const Marker = SvgStub
export const ForeignObject = SvgStub

export default SvgStub
