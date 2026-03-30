import { vehicles } from '../data';

export class VehicleService {
  static getAllVehicles() {
    return Object.entries(vehicles).map(([id, vehicle]) => ({ ...vehicle, id }));
  }

  static getLocationVehicles() {
    return Object.entries(vehicles)
      .filter(([key]) => key.startsWith("loc-"))
      .map(([id, vehicle]) => ({ ...vehicle, id }));
  }

  static getSaleVehicles() {
    return Object.entries(vehicles)
      .filter(([key]) => key.startsWith("vnt-"))
      .map(([id, vehicle]) => ({ ...vehicle, id }));
  }

  static getVehicleById(id) {
    const vehicle = vehicles[id];
    return vehicle ? { ...vehicle, id } : null;
  }

  static filterVehicles(vehicles, filters) {
    // Implémenter la logique de filtrage
    return vehicles;
  }
}