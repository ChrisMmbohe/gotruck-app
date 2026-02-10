import { SOCKET_EVENTS } from '@/lib/socket/events';
import { GeofenceEvent } from './detector';

/**
 * Alert severity levels
 */
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Alert types
 */
export enum AlertType {
  GEOFENCE_ENTERED = 'geofence_entered',
  GEOFENCE_EXITED = 'geofence_exited',
  GEOFENCE_VIOLATION = 'geofence_violation',
  SPEED_VIOLATION = 'speed_violation',
  IDLE_TIMEOUT = 'idle_timeout',
  OFFLINE = 'offline',
}

/**
 * Geofence alert object
 */
export interface GeofenceAlert {
  id?: string;
  type: AlertType;
  severity: AlertSeverity;
  geofenceId?: string;
  geofenceName?: string;
  truckId: string;
  shipmentId?: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  data?: Record<string, any>;
  createdAt: Date;
  isRead?: boolean;
  acknowledgedAt?: Date;
}

/**
 * Handles geofence events and creates appropriate alerts
 */
export function createGeofenceAlert(event: GeofenceEvent): GeofenceAlert {
  let severity = AlertSeverity.LOW;
  let alertType = AlertType.GEOFENCE_ENTERED;

  if (event.eventType === 'entered') {
    severity = AlertSeverity.MEDIUM;
    alertType = AlertType.GEOFENCE_ENTERED;
  } else if (event.eventType === 'exited') {
    severity = AlertSeverity.LOW;
    alertType = AlertType.GEOFENCE_EXITED;
  }

  return {
    type: alertType,
    severity,
    geofenceId: event.geofenceId,
    geofenceName: event.geofenceName,
    truckId: event.truckId,
    shipmentId: event.shipmentId,
    message: `Truck ${event.truckId} ${event.eventType} geofence "${event.geofenceName}"`,
    location: event.location,
    data: {
      eventType: event.eventType,
      timestamp: event.timestamp,
    },
    createdAt: new Date(),
    isRead: false,
  };
}

/**
 * Determines recipients for an alert (users who should be notified)
 */
export function getAlertRecipients(alert: GeofenceAlert): {
  userIds: string[];
  roles: string[];
} {
  // Notify fleet managers, dispatchers, and the shipment owner
  return {
    userIds: [], // Add specific user IDs based on business logic
    roles: ['fleet_manager', 'dispatcher', 'admin'], // TODO: Implement role-based access
  };
}

/**
 * Formats alert message
 */
export function formatAlertMessage(alert: GeofenceAlert): string {
  switch (alert.type) {
    case AlertType.GEOFENCE_ENTERED:
      return `🚚 Truck ${alert.truckId} entered geofence "${alert.geofenceName}"`;
    case AlertType.GEOFENCE_EXITED:
      return `🚚 Truck ${alert.truckId} exited geofence "${alert.geofenceName}"`;
    case AlertType.SPEED_VIOLATION:
      return `⚠️ Truck ${alert.truckId} exceeds speed limit`;
    case AlertType.OFFLINE:
      return `⛔ Truck ${alert.truckId} is offline`;
    default:
      return alert.message;
  }
}

/**
 * Determines sound/visual notification for alert
 */
export function getAlertNotification(
  alert: GeofenceAlert
): {
  sound: string;
  icon: string;
  color: string;
} {
  switch (alert.severity) {
    case AlertSeverity.CRITICAL:
      return {
        sound: 'critical-alert.mp3',
        icon: '🚨',
        color: '#dc2626',
      };
    case AlertSeverity.HIGH:
      return {
        sound: 'high-alert.mp3',
        icon: '⚠️',
        color: '#f97316',
      };
    case AlertSeverity.MEDIUM:
      return {
        sound: 'medium-alert.mp3',
        icon: 'ℹ️',
        color: '#eab308',
      };
    default:
      return {
        sound: 'low-alert.mp3',
        icon: 'ℹ️',
        color: '#3b82f6',
      };
  }
}

/**
 * Prepares alert data for Socket.io broadcast
 */
export function prepareAlertForBroadcast(alert: GeofenceAlert): Record<string, any> {
  return {
    id: alert.id,
    type: alert.type,
    severity: alert.severity,
    geofenceId: alert.geofenceId,
    geofenceName: alert.geofenceName,
    truckId: alert.truckId,
    shipmentId: alert.shipmentId,
    message: alert.message,
    location: alert.location,
    formattedMessage: formatAlertMessage(alert),
    notification: getAlertNotification(alert),
    createdAt: alert.createdAt.toISOString(),
    timestamp: Date.now(),
  };
}

/**
 * Determines which Socket.io rooms should receive the alert
 */
export function getAlertRooms(alert: GeofenceAlert): string[] {
  const rooms: string[] = [];

  // Broadcast to shipment room if shipment ID exists
  if (alert.shipmentId) {
    rooms.push(`shipment:${alert.shipmentId}`);
  }

  // Broadcast to truck room if truck ID exists
  if (alert.truckId) {
    rooms.push(`truck:${alert.truckId}`);
  }

  // Broadcast to fleet room if available
  // This would require additional context to determine fleet ID
  // rooms.push(`fleet:${fleetId}`);

  // Broadcast to all admin users
  // rooms.push('role:admin');
  // rooms.push('role:dispatcher');

  return rooms;
}

/**
 * Filters alerts based on user preferences/permissions
 */
export function filterAlertsForUser(
  alerts: GeofenceAlert[],
  userRoles: string[],
  userPermissions: Record<string, boolean> = {}
): GeofenceAlert[] {
  return alerts.filter((alert) => {
    // Admins see all alerts
    if (userRoles.includes('admin')) {
      return true;
    }

    // Dispatchers see high and critical alerts
    if (userRoles.includes('dispatcher') && alert.severity !== AlertSeverity.LOW) {
      return true;
    }

    // Drivers see alerts for their own trucks
    if (
      userRoles.includes('driver') &&
      userPermissions[`truck:${alert.truckId}`]
    ) {
      return true;
    }

    return false;
  });
}

/**
 * Groups alerts by severity
 */
export function groupAlertsBySeverity(alerts: GeofenceAlert[]): Record<AlertSeverity, GeofenceAlert[]> {
  const grouped: Record<AlertSeverity, GeofenceAlert[]> = {
    [AlertSeverity.CRITICAL]: [],
    [AlertSeverity.HIGH]: [],
    [AlertSeverity.MEDIUM]: [],
    [AlertSeverity.LOW]: [],
  };

  alerts.forEach((alert) => {
    grouped[alert.severity].push(alert);
  });

  return grouped;
}

/**
 * Gets alert statistics
 */
export function getAlertStats(alerts: GeofenceAlert[]): {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unread: number;
} {
  return {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === AlertSeverity.CRITICAL).length,
    high: alerts.filter((a) => a.severity === AlertSeverity.HIGH).length,
    medium: alerts.filter((a) => a.severity === AlertSeverity.MEDIUM).length,
    low: alerts.filter((a) => a.severity === AlertSeverity.LOW).length,
    unread: alerts.filter((a) => !a.isRead).length,
  };
}
