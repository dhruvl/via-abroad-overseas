"use client";

import * as React from "react";

export class GlobeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // The 3D hero is purely decorative — swallow the error rather than
    // surfacing a global error boundary, and rely on the static fallback.
    if (process.env.NODE_ENV !== "production") {
      console.warn("Globe hero failed to render, using static fallback.", error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
