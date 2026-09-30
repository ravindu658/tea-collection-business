import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CustomerManager from './components/CustomerManager';
import DailyCollection from './components/DailyCollection';
import SuppliesManager from './components/SuppliesManager';
import BillingEngine from './components/BillingEngine';
import SmsNotificationGateway from './components/SmsNotificationGateway';
import SettingsManager from './components/SettingsManager';

import {
  INITIAL_CUSTOMERS,
  INITIAL_COLLECTIONS,
  INITIAL_SUPPLIES,
  INITIAL_ROUTES,
  INITIAL_SETTINGS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGlobalRainy, setIsGlobalRainy] = useState(false);

  // Persistent State
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('tea_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('tea_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [supplies, setSupplies] = useState(() => {
    const saved = localStorage.getItem('tea_supplies');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIES;
  });

  const [routes, setRoutes] = useState(() => {
    const saved = localStorage.getItem('tea_routes');
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('tea_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // LocalStorage Synchronization
  useEffect(() => {
    localStorage.setItem('tea_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('tea_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('tea_supplies', JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem('tea_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('tea_settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Glass Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        isGlobalRainy={isGlobalRainy}
        setIsGlobalRainy={setIsGlobalRainy}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            customers={customers}
            collections={collections}
            supplies={supplies}
            settings={settings}
            routes={routes}
            setActiveTab={setActiveTab}
            isGlobalRainy={isGlobalRainy}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            setCustomers={setCustomers}
            routes={routes}
            collections={collections}
            supplies={supplies}
            settings={settings}
          />
        )}

        {activeTab === 'collection' && (
          <DailyCollection
            collections={collections}
            setCollections={setCollections}
            customers={customers}
            settings={settings}
            isGlobalRainy={isGlobalRainy}
          />
        )}

        {activeTab === 'supplies' && (
          <SuppliesManager
            supplies={supplies}
            setSupplies={setSupplies}
            customers={customers}
          />
        )}

        {activeTab === 'billing' && (
          <BillingEngine
            customers={customers}
            collections={collections}
            supplies={supplies}
            settings={settings}
            routes={routes}
            setSettings={setSettings}
          />
        )}

        {activeTab === 'sms' && (
          <SmsNotificationGateway
            customers={customers}
            collections={collections}
            supplies={supplies}
            settings={settings}
            routes={routes}
            setSettings={setSettings}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsManager
            settings={settings}
            setSettings={setSettings}
            routes={routes}
            setRoutes={setRoutes}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-300 py-6 border-t border-emerald-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="font-bold text-white">
            {settings.factoryName} — Industry Tea Collection & Payout System
          </p>
          <p className="text-emerald-400/70 font-mono">
            Version 2.4.0 • Enterprise Edition • Sri Lanka Tea Board Compliant
          </p>
        </div>
      </footer>

    </div>
  );
}
