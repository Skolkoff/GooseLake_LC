import { TimeSettings, MaintenanceSettings } from '../../shared/api/adminTypes';

export let timeSettings: TimeSettings = {
  orderWindowFrom: "06:00",
  orderWindowTo: "22:00",
  dayShiftFrom: "09:00",
  dayShiftTo: "17:00",
  nightShiftFrom: "17:00",
  nightShiftTo: "02:00"
};

export let maintenanceSettings: MaintenanceSettings = {
  isEnabled: false,
  message: null,
  untilIso: null
};

// Functions to update settings (simulating database updates)
export const updateTimeSettings = (newSettings: TimeSettings) => {
  timeSettings = { ...newSettings };
  return timeSettings;
};

export const updateMaintenanceSettings = (newSettings: MaintenanceSettings) => {
  maintenanceSettings = { ...newSettings };
  return maintenanceSettings;
};
