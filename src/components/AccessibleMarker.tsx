import { useEffect, useRef, type ReactNode } from 'react';
import { Marker } from 'react-leaflet';
import type { MarkerProps } from 'react-leaflet';
import type { LatLngExpression, Marker as LeafletMarker } from 'leaflet';

interface AccessibleMarkerProps extends Omit<MarkerProps, 'position' | 'ref'> {
  position: LatLngExpression;
  ariaLabel: string;
  markerRef?: (marker: LeafletMarker | null) => void;
  children?: ReactNode;
}

export function AccessibleMarker({
  ariaLabel,
  eventHandlers,
  markerRef,
  children,
  ...markerProps
}: AccessibleMarkerProps) {
  const innerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    const marker = innerRef.current;
    if (!marker) return;

    const el = marker.getElement();
    if (!el) return;

    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', ariaLabel);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        marker.togglePopup();
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    return () => {
      el.removeEventListener('keydown', handleKeyDown);
    };
  }, [ariaLabel]);

  return (
    <Marker
      {...markerProps}
      ref={(instance) => {
        innerRef.current = instance;
        markerRef?.(instance);
      }}
      eventHandlers={eventHandlers}
    >
      {children}
    </Marker>
  );
}
