"""DISHA production API: geocoding, real OSRM routes, and optional Supabase persistence."""
from __future__ import annotations
import asyncio
import os
import time
import uuid
from typing import Literal
import httpx
from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AliasChoices, BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=os.path.join(os.path.dirname(__file__), '.env'), extra='ignore')
    cors_origins: str = 'http://localhost:3000'
    supabase_url: str = ''
    supabase_service_role_key: str = Field(default='', validation_alias=AliasChoices('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY'))
    nominatim_user_agent: str = 'DISHA/1.0 (contact: admin@example.com)'
settings = Settings()
app = FastAPI(title='DISHA API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in settings.cors_origins.split(',') if x.strip()], allow_credentials=True, allow_methods=['GET','POST','DELETE'], allow_headers=['Authorization','Content-Type'])

class Point(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    name: str = Field(min_length=1, max_length=200)
    address: str | None = Field(default=None, max_length=500)
    category: str | None = None
class RouteRequest(BaseModel):
    origin: Point
    destination: Point
class SavedRoute(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    label: Literal['Home','Work','College','Custom']
    customTitle: str | None = Field(default=None, max_length=120)
    location: Point
    savedAt: str = 'Just now'

last_geocode = 0.0
async def nominatim(query: str):
    global last_geocode
    if len(query.strip()) < 3: return []
    wait = 1 - (time.monotonic() - last_geocode)
    if wait > 0: await asyncio.sleep(wait)
    last_geocode = time.monotonic()
    async with httpx.AsyncClient(timeout=8) as client:
        response = await client.get('https://nominatim.openstreetmap.org/search', params={'format':'jsonv2','q':query,'limit':5}, headers={'User-Agent':settings.nominatim_user_agent,'Accept-Language':'en'})
    if response.status_code == 429: raise HTTPException(429, 'Location search is temporarily rate-limited. Please wait and retry.')
    response.raise_for_status()
    return [{'name': item.get('name') or item['display_name'].split(',')[0], 'lat':float(item['lat']), 'lng':float(item['lon']), 'address':item['display_name'], 'category':'landmark'} for item in response.json()]

@app.get('/health')
async def health(): return {'status':'ok','service':'disha-api','supabasePersistenceConfigured':bool(settings.supabase_url and settings.supabase_service_role_key)}
@app.get('/api/geocode/search')
async def geocode_search(q: str):
    try: return await nominatim(q)
    except httpx.TimeoutException: raise HTTPException(408, 'Location search timed out. Please retry.')
    except httpx.HTTPStatusError: raise HTTPException(502, 'Location search provider is unavailable.')
@app.post('/api/routes/optimize')
async def optimize_route(request: RouteRequest):
    coordinates=f'{request.origin.lng},{request.origin.lat};{request.destination.lng},{request.destination.lat}'
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response=await client.get(f'https://router.project-osrm.org/route/v1/driving/{coordinates}',params={'overview':'full','geometries':'geojson','alternatives':'true','steps':'false'})
        response.raise_for_status(); data=response.json()
    except httpx.TimeoutException: raise HTTPException(408, 'Routing provider timed out. Please retry.')
    except httpx.HTTPStatusError: raise HTTPException(502, 'Routing provider is unavailable.')
    if data.get('code') != 'Ok' or not data.get('routes'): raise HTTPException(422, 'No drivable route could be found for these locations.')
    routes=[]
    for i, route in enumerate(data['routes'][:3]):
        duration=round(route['duration']/60); distance=round(route['distance']/1000,1)
        routes.append({'id':f'osrm-{i}','name':'DISHA recommended route' if i==0 else f'Alternative route {i}','tag':'DISHA_OPTIMIZED' if i==0 else 'ALTERNATIVE','distanceKm':distance,'durationMin':duration,'currentCongestionPercent':0,'predictedCongestionPercent':0,'spillbackRisk':'low','co2EmissionsKg':round(distance*.12,2),'isDishaRecommended':i==0,'qpsoScore':max(1,100-i*7),'tradeOffSummary':'Real OSRM distance and travel estimate; live traffic is not configured.','coordinates':[[lat,lng] for lng,lat in route['geometry']['coordinates']],'segments':[]})
    chosen=routes[0]
    return {'routes':routes,'recommendedRouteId':chosen['id'],'qpsoConvergenceScore':chosen['qpsoScore'],'explanation':{'routeId':chosen['id'],'routeName':chosen['name'],'rationale':'Selected using live OSRM travel duration. Traffic and spillback optimization require a configured provider.','analyzedFactors':[{'factor':'Distance and duration','status':'optimal','metric':f"{chosen['distanceKm']} km, {chosen['durationMin']} min"}], 'summarySentence':'This route uses live OSRM routing; it is not represented as live traffic optimization.'}}

def supabase_headers(authorization: str | None):
    if not (settings.supabase_url and settings.supabase_service_role_key): raise HTTPException(503, 'Saved-route persistence is not configured. Set backend Supabase variables.')
    if not authorization or not authorization.startswith('Bearer '): raise HTTPException(401, 'Sign in is required to access saved routes.')
    return {'apikey':settings.supabase_service_role_key,'Authorization':authorization,'Content-Type':'application/json'}
@app.get('/api/saved-routes')
async def list_saved_routes(authorization: str | None = Header(default=None)):
    headers=supabase_headers(authorization)
    async with httpx.AsyncClient(timeout=10) as client: response=await client.get(f'{settings.supabase_url}/rest/v1/saved_routes?select=payload&order=created_at.desc',headers=headers)
    if response.status_code >=400: raise HTTPException(response.status_code,'Unable to read saved routes. Verify Supabase RLS and schema.')
    return [row['payload'] for row in response.json()]
@app.post('/api/saved-routes', status_code=status.HTTP_201_CREATED)
async def save_route(route: SavedRoute, authorization: str | None = Header(default=None)):
    headers=supabase_headers(authorization); headers['Prefer']='return=minimal'
    async with httpx.AsyncClient(timeout=10) as client: response=await client.post(f'{settings.supabase_url}/rest/v1/saved_routes',headers=headers,json={'id':route.id,'payload':route.model_dump()})
    if response.status_code >=400: raise HTTPException(response.status_code,'Unable to save route. Verify Supabase RLS and schema.')
    return route
@app.delete('/api/saved-routes/{route_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_route(route_id: str, authorization: str | None = Header(default=None)):
    headers=supabase_headers(authorization)
    async with httpx.AsyncClient(timeout=10) as client: response=await client.delete(f'{settings.supabase_url}/rest/v1/saved_routes?id=eq.{route_id}',headers=headers)
    if response.status_code >=400: raise HTTPException(response.status_code,'Unable to delete saved route.')
@app.get('/api/traffic/current')
async def traffic_current(): raise HTTPException(503, 'Live traffic is not configured. Use demo mode or add a licensed traffic provider integration.')
