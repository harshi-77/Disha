import React, { useState, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { InteractiveMap } from './components/map/InteractiveMap';
import { MapControls } from './components/map/MapControls';
import { TrafficLegend } from './components/map/TrafficLegend';
import { GoogleMapsSearchBar } from './components/navigation/GoogleMapsSearchBar';
import { DirectionsPanel } from './components/navigation/DirectionsPanel';
import { DishaSidebar, SidebarTab } from './components/sidebar/DishaSidebar';
import { SmartRouteWorkflow } from './components/routes/SmartRouteWorkflow';
import { TrafficPanel } from './components/traffic/TrafficPanel';
import { PredictionPanel } from './components/prediction/PredictionPanel';
import { SpillbackAnalysisPanel } from './components/spillback/SpillbackAnalysisPanel';
import { RouteComparison } from './components/routes/RouteComparison';
import { WhyDishaModal } from './components/routes/WhyDishaModal';
import { SavedRoutesPanel } from './components/routes/SavedRoutesPanel';
import { HistoryPanel } from './components/routes/HistoryPanel';
import { SettingsModal } from './components/settings/SettingsModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';

import {
  LocationPoint,
  RouteOption,
  TrafficSegment,
  TrafficIncident,
  TrafficPrediction,
  SpillbackSimulationData,
  SavedPlace,
  JourneyHistoryItem,
  AppUser,
  AppSettings,
  DishaExplanation,
} from './types';

import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM, POPULAR_LOCATIONS, TILE_PROVIDERS } from './config/constants';
import { ENV } from './config/env';
import { routeService } from './services/api/routeService';
import { trafficService } from './services/api/trafficService';
import { predictionService } from './services/api/predictionService';
import { spillbackService } from './services/api/spillbackService';
import { authService } from './services/api/authService';
import { savedRoutesService } from './services/api/savedRoutesService';
import { INITIAL_SAVED_PLACES, INITIAL_JOURNEY_HISTORY } from './mock/mockPlaces';
import { MOCK_SPILLBACK_SIMULATION } from './mock/mockSpillback';
import { MOCK_TRAFFIC_PREDICTION } from './mock/mockPredictions';
import { getCurrentUserLocation } from './services/maps/geocoding';

export default function App() {
  // Open the local showcase directly; live builds retain the landing and sign-in flow.
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'app'>(ENV.dishaMode === 'demo' ? 'app' : 'landing');

  // Navigation & View state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab | 'search'>('plan');
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(true);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);
  const [tileLayerKey, setTileLayerKey] = useState<keyof typeof TILE_PROVIDERS>('cartoVoyager');
  const [showTrafficOverlay, setShowTrafficOverlay] = useState(true);
  const [showSpillbackZones, setShowSpillbackZones] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  // Routing state (Default: Bangalore MG Road -> Electronic City)
  const [origin, setOrigin] = useState<LocationPoint | null>(POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationPoint | null>(POPULAR_LOCATIONS[3]);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-c');
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [routeExplanation, setRouteExplanation] = useState<DishaExplanation | null>(null);

  // Telemetry & Mock Data
  const [trafficSegments, setTrafficSegments] = useState<TrafficSegment[]>([]);
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [prediction, setPrediction] = useState<TrafficPrediction>(MOCK_TRAFFIC_PREDICTION);
  const [spillbackData, setSpillbackData] = useState<SpillbackSimulationData>(MOCK_SPILLBACK_SIMULATION);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(INITIAL_SAVED_PLACES);
  const [historyItems, setHistoryItems] = useState<JourneyHistoryItem[]>(INITIAL_JOURNEY_HISTORY);

  // User & Settings
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authService.getCurrentUser());
  const [settings, setSettings] = useState<AppSettings>(() => {
    let persisted: Partial<AppSettings> = {};
    try { persisted = JSON.parse(localStorage.getItem('disha_settings') || '{}'); } catch { /* use environment defaults */ }
    return {
    mode: ENV.dishaMode,
    apiBaseUrl: ENV.apiBaseUrl,
    mapProvider: ENV.mapProvider,
    mapboxToken: ENV.mapboxToken,
    googleMapsKey: ENV.googleMapsKey,
    enableSimulatedSpillback: true,
    simulationVehicleStress: 500,
    ...persisted,
  };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWhyDishaOpen, setIsWhyDishaOpen] = useState(false);

  // 1. Initial Load: Fetch traffic, predictions, and calculate initial route
  useEffect(() => {
    authService.restoreSession().then(setCurrentUser).catch(() => setCurrentUser(null));
    savedRoutesService.list().then((items) => { if (items.length) setSavedPlaces(items); }).catch(console.error);
    trafficService.getCurrentTraffic().then((res) => {
      setTrafficSegments(res.segments);
      setIncidents(res.incidents);
    });

    predictionService.getPrediction().then((res) => {
      setPrediction(res);
    });

    if (origin && destination) {
      calculateRoutes(origin, destination);
    }
  }, []);

  const calculateRoutes = async (start: LocationPoint, end: LocationPoint) => {
    setIsLoadingRoutes(true);
    setRouteError(null);
    try {
      const res = await routeService.getOptimizedRoutes({
        origin: start,
        destination: end,
      });
      setRoutes(res.routes);
      setSelectedRouteId(res.recommendedRouteId);
      setRouteExplanation(res.explanation);
    } catch (err: any) {
      console.error('Failed to calculate routes:', err);
      setRouteError(err instanceof Error ? err.message : 'Unable to calculate a route.');
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handlePlanRoute = () => {
    if (origin && destination) {
      calculateRoutes(origin, destination);
      setIsDirectionsOpen(true);
      setActiveTab('plan');
    } else setRouteError('Choose both an origin and a destination before planning a journey.');
  };

  const handleSwapPoints = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    if (destination && temp) {
      calculateRoutes(destination, temp);
    }
  };

  const handleMapClickLocation = (point: LocationPoint, action: 'origin' | 'destination') => {
    setIsDirectionsOpen(true);
    setActiveTab('plan');
    setMapCenter([point.lat, point.lng]);
    setMapZoom(14);
    if (action === 'origin') {
      setOrigin(point);
      if (destination) calculateRoutes(point, destination);
    } else {
      setDestination(point);
      if (origin) calculateRoutes(origin, point);
    }
  };

  const handleLocateUser = async () => {
    try {
      setIsLocating(true);
      const loc = await getCurrentUserLocation();
      setOrigin(loc);
      setMapCenter([loc.lat, loc.lng]);
      if (destination) {
        calculateRoutes(loc, destination);
      }
    } catch (err: any) {
      alert(err.message || 'Unable to access geolocation.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleResetView = () => {
    setMapCenter(DEFAULT_MAP_CENTER);
    setMapZoom(DEFAULT_ZOOM);
    if (origin && destination) {
      calculateRoutes(origin, destination);
    }
  };

  const handleOpenCategory = (cat: string) => {
    if (cat === 'directions') {
      setIsDirectionsOpen(true);
      setActiveTab('plan');
    } else {
      setIsDirectionsOpen(false);
      setActiveTab(cat as SidebarTab);
    }
  };

  // 1. Landing Page View (with 'Get Started Now' CTA at bottom and hero)
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentView('login')}
        onDirectLogin={() => setCurrentView('login')}
        onExploreDemoDirectly={() => setCurrentView('login')}
        hasActiveSession={!!(origin && destination)}
        onResumeSession={() => setCurrentView('app')}
      />
    );
  }

  // 2. Login Page View (with Google, Email/Password, or Instant Guest Access)
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(usr) => {
          setCurrentUser(usr);
          setCurrentView('app');
        }}
        onBackToLanding={() => setCurrentView('landing')}
      />
    );
  }

  // 3. Main Website View: Interactive Google Maps Replica with DISHA Intelligence
  return (
    <div className="h-screen w-screen relative overflow-hidden bg-gray-100 font-sans select-none">
      {/* 1. Fullscreen Google Maps Interactive Map Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <InteractiveMap
          center={mapCenter}
          zoom={mapZoom}
          origin={origin}
          destination={destination}
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={(id) => setSelectedRouteId(id)}
          onMapClickLocation={handleMapClickLocation}
          trafficSegments={trafficSegments}
          incidents={incidents}
          showTrafficOverlay={showTrafficOverlay}
          showSpillbackZones={showSpillbackZones}
          tileLayerKey={tileLayerKey}
        />
      </div>

      {/* Top-Right Floating Controls (Home and user profile) */}
      <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
        {/* Product identity indicator */}
        <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.18)] border border-gray-200/90 text-xs text-gray-700">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-semibold text-gray-900">DISHA Maps</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500 font-normal">Plan a journey</span>
        </div>

        {/* User Account / Profile Button */}
        <button
          onClick={() => setIsAuthOpen(true)}
          className="bg-white/95 hover:bg-white text-gray-800 px-2.5 py-1.5 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.18)] border border-gray-200/90 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          title="User Account"
        >
          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="hidden sm:inline max-w-[110px] truncate">{currentUser?.name || 'Account'}</span>
        </button>
      </div>

      {/* 2. Google Maps Authentic Map Controls */}
      <TrafficLegend />
      {routeError && <div role="alert" className="absolute top-16 right-4 z-40 max-w-sm rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 shadow">{routeError}</div>}

      <MapControls
        onZoomIn={() => setMapZoom((z) => Math.min(18, z + 1))}
        onZoomOut={() => setMapZoom((z) => Math.max(8, z - 1))}
        onLocateUser={handleLocateUser}
        onResetView={handleResetView}
        showTrafficOverlay={showTrafficOverlay}
        onToggleTraffic={() => setShowTrafficOverlay((p) => !p)}
        showSpillbackZones={showSpillbackZones}
        onToggleSpillback={() => setShowSpillbackZones((p) => !p)}
        tileLayerKey={tileLayerKey}
        onChangeTileLayer={(k) => setTileLayerKey(k)}
        isLocating={isLocating}
      />

      {/* 3. Top-Left Floating Google Maps Experience */}
      {/* Keep place search available above directions and intelligence panels. */}
      <GoogleMapsSearchBar
        onOpenMenu={() => setIsSidebarOpen(true)}
        onOpenDirections={() => {
          setIsDirectionsOpen(true);
          setActiveTab('plan');
        }}
        onSelectLocation={(point) => {
          setDestination(point);
          setIsDirectionsOpen(true);
          setActiveTab('plan');
          if (origin) calculateRoutes(origin, point);
        }}
        savedPlaces={savedPlaces}
        onOpenCategory={handleOpenCategory}
        activeCategory={activeTab}
      />

      {/* Directions panel sits below the persistent map search bar. */}
      {isDirectionsOpen && (
        <div className="absolute top-[76px] left-4 z-30">
          <DirectionsPanel
            origin={origin}
            destination={destination}
            onSetOrigin={(p) => {
              setOrigin(p);
              if (p && destination) calculateRoutes(p, destination);
            }}
            onSetDestination={(p) => {
              setDestination(p);
              if (origin && p) calculateRoutes(origin, p);
            }}
            onSwapPoints={handleSwapPoints}
            onPlanRoute={handlePlanRoute}
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            isLoadingRoutes={isLoadingRoutes}
            savedPlaces={savedPlaces}
            onOpenWhyDisha={() => setIsWhyDishaOpen(true)}
            onOpenQpso={() => {
              setIsDirectionsOpen(false);
              setActiveTab('smart_route');
            }}
            onOpenSpillback={() => {
              setIsDirectionsOpen(false);
              setActiveTab('spillback');
            }}
            onCloseDirections={() => {
              setIsDirectionsOpen(false);
              setActiveTab('search');
            }}
          />
        </div>
      )}

      {/* If specific DISHA feature panel is open (docked as Google Maps floating card) */}
      {!isDirectionsOpen && activeTab !== 'search' && (
        <div className="absolute top-3 left-4 z-30">
          {activeTab === 'smart_route' && (
            <SmartRouteWorkflow
              onApplyRoute={() => {
                setSelectedRouteId('route-c');
                setIsDirectionsOpen(true);
                setActiveTab('plan');
              }}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}

          {activeTab === 'spillback' && (
            <SpillbackAnalysisPanel
              initialData={spillbackData}
              onSelectAlternative={() => {
                setSelectedRouteId('route-c');
                setIsDirectionsOpen(true);
                setActiveTab('plan');
              }}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionPanel
              prediction={prediction}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}

          {activeTab === 'traffic' && (
            <TrafficPanel
              segments={trafficSegments}
              incidents={incidents}
              onRefresh={() => {
                trafficService.getCurrentTraffic().then((res) => {
                  setTrafficSegments(res.segments);
                  setIncidents(res.incidents);
                });
              }}
              isLoading={false}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}

          {activeTab === 'comparison' && (
            <RouteComparison
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelectRoute={(id) => {
                setSelectedRouteId(id);
                setIsDirectionsOpen(true);
                setActiveTab('plan');
              }}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}

          {activeTab === 'saved' && (
            <SavedRoutesPanel
              savedPlaces={savedPlaces}
              onSelectPlace={(place) => {
                setDestination(place.location);
                setIsDirectionsOpen(true);
                setActiveTab('plan');
                if (origin) calculateRoutes(origin, place.location);
              }}
              onAddCustomPlace={async (label, name) => {
                const newPlace: SavedPlace = {
                  id: 'place-' + Date.now(),
                  label: label as any,
                  customTitle: name,
                  location: destination || {
                    name,
                    lat: 12.9352,
                    lng: 77.6245,
                    category: 'landmark',
                  },
                  savedAt: 'Just now',
                };
                try { await savedRoutesService.save(newPlace); setSavedPlaces((prev) => [newPlace, ...prev]); }
                catch (error) { setRouteError(error instanceof Error ? error.message : 'Unable to save this place.'); }
              }}
              onDeletePlace={async (id) => {
                try { await savedRoutesService.remove(id); setSavedPlaces((prev) => prev.filter((p) => p.id !== id)); }
                catch (error) { setRouteError(error instanceof Error ? error.message : 'Unable to delete this place.'); }
              }}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPanel
              historyItems={historyItems}
              onRerunJourney={(item) => {
                setOrigin(item.origin);
                setDestination(item.destination);
                calculateRoutes(item.origin, item.destination);
                setIsDirectionsOpen(true);
                setActiveTab('plan');
              }}
              onClose={() => {
                setIsDirectionsOpen(false);
                setActiveTab('search');
              }}
            />
          )}
        </div>
      )}

      {/* 4. Google Maps Authentic Left Slide-over Drawer */}
      <DishaSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab as SidebarTab}
        onSelectTab={(tab) => {
          if (tab === 'plan' || tab === 'routes') {
            setIsDirectionsOpen(true);
            setActiveTab('plan');
          } else if (tab === 'why_disha') {
            setIsWhyDishaOpen(true);
          } else {
            setIsDirectionsOpen(false);
            setActiveTab(tab);
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onReturnToLanding={() => setCurrentView('landing')}
      />

      {/* 5. Modals */}
      <WhyDishaModal
        isOpen={isWhyDishaOpen}
        onClose={() => setIsWhyDishaOpen(false)}
        explanation={routeExplanation}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          localStorage.setItem('disha_settings', JSON.stringify(newSettings));
          if (newSettings.mapProvider === 'osm') setTileLayerKey('osm');
          else if (newSettings.mapProvider === 'carto') setTileLayerKey('cartoVoyager');
          else if (newSettings.mapProvider === 'mapbox') setTileLayerKey('cartoDark');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onUserChange={(usr) => setCurrentUser(usr)}
      />
    </div>
  );
}
